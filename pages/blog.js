import { getCsrfToken, getSession, useSession } from "next-auth/react"
import { useState } from "react"
import clientPromise from "../lib/mongodb"
import { ObjectId } from "mongodb"
import Link from "next/link"

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const sessionId = session.user?._id
    if (!session) {
        return {
            redirect: {
                destination: `api/auth/signin?callbackUrl=${process.env.LOCAL_URL}/blog`,
                permanent: false,
            },
        }
    }
    try {
        const client = await clientPromise
        const database = client.db("viperDb")
        const properties = await database
            .collection("users")
            .aggregate([
                {
                    $match: {
                        _id: ObjectId(sessionId),
                    },
                },
                {
                    $unwind: "$participated",
                },
                {
                    $project: {
                        _id: 0,
                        name: 0,
                        email: 0,
                        image: 0,
                        emailVerified: 0,
                        role: 0,
                        vipers: 0,
                    },
                },
                {
                    $limit: 20,
                },
            ])
            .toArray()

        const events = JSON.parse(JSON.stringify(properties))

        const filtered = events.map((property) => {
            // const price = JSON.parse(JSON.stringify(property.price))
            return {
                _id: property.participated.event_id,
                event_name: property.participated.event_name,
                location: property.participated.location,
                date: property.participated.date,
                category: property.participated.category,
            }
        })

        const vipers = await database
            .collection("users")
            .aggregate([
                {
                    $match: {
                        _id: ObjectId(sessionId),
                    },
                },
                {
                    $unwind: "$vipers",
                },
                {
                    $project: {
                        _id: 0,
                        name: 0,
                        email: 0,
                        image: 0,
                        emailVerified: 0,
                        role: 0,
                        participated: 0,
                    },
                },
            ])
            .toArray()

        const users = JSON.parse(JSON.stringify(vipers))

        const viper = users.map((property) => {
            return {
                _id: property.vipers._id,
                name: property.vipers.name,
                email: property.vipers.email,
            }
        })

        return {
            props: {
                session,
                data: session ? "Hey there G" : "Login please",
                properties: filtered,
                vipers: viper,
            },
        }
    } catch (error) {
        console.error(error)
    }
}

const blog = ({ data, properties, vipers }) => {
    const { data: session } = useSession()
    const [showEvents, setShowEvents] = useState(false)
    const [showUsers, setShowUsers] = useState(false)

    const handleEvents = () => {
        return setShowEvents(!showEvents)
    }

    const handleUsers = () => {
        return setShowUsers(!showUsers)
    }
    const grabUser = async (property) => {
        const user = {
            _id: property._id,
            name: property.name,
            email: property.email,
        }
        const JSONuser = JSON.stringify(user)

        const endpoint = `/api/chat`
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSONuser,
        }

        const response = await fetch(endpoint, options)
        const result = await response.json()
    }
    return (
        <div>
            {data}
            <div>
                <button onClick={handleEvents}>show/hide events</button>
                <button onClick={handleUsers}>show/hide users</button>
                {showEvents ? (
                    properties.map((property) => (
                        <div key={property._id}>
                            <h1 id="event_name">{property.event_name}</h1>
                            <div>
                                <h2>{property.location}</h2>
                            </div>
                            <div>
                                <h3>{property.date}</h3>
                            </div>
                            <div>
                                <p>{property.category}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <h1></h1>
                )}
            </div>
            {showUsers ? (
                vipers.map((property) => (
                    <div key={property._id}>
                        <Link
                            href={{
                                pathname: "/chats/[userid]",
                                query: { userid: property._id },
                            }}
                            legacyBehavior
                        >
                            <a onClick={() => grabUser(property)}>Chat with: {property.name}</a>
                        </Link>
                    </div>
                ))
            ) : (
                <h1></h1>
            )}
        </div>
    )
}

export default blog
