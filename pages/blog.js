import { getCsrfToken, getSession, useSession } from "next-auth/react"
import { useState } from "react"
import clientPromise from "../lib/mongodb"
// import { ObjectId } from "mongodb"

export async function getServerSideProps(context) {
    const session = await getSession(context)
    // const sessionId = session.user?._id
    if (!session) {
        return {
            redirect: {
                destination: `api/auth/signin?callbackUrl=${process.env.LOCAL_URL}/blog`,
                permanent: false,
            },
        }
    }

    const client = await clientPromise
    const database = client.db("viperDb")
    const properties = await database
        .collection("users")
        .aggregate([
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
                },
            },

            {
                $limit: 20,
            },
        ])
        .toArray()

    const viper = JSON.parse(JSON.stringify(properties))
    console.log(viper)

    const filtered = viper.map((property) => {
        // const price = JSON.parse(JSON.stringify(property.price))
        return {
            _id: property.participated.event_id,
            event_name: property.participated.event_name,
            location: property.participated.location,
            date: property.participated.date,
            category: property.participated.category,
            // comment: property.comment,
            // likes: property.likes,
            // // price: price.$numberDecimal,
        }
    })

    return {
        props: {
            session,
            data: session ? "Hey there G" : "Login please",
            properties: filtered,
        },
    }
}

const blog = ({ data, properties }) => {
    const { data: session } = useSession()
    const [showEvents, setShowEvents] = useState(false)

    const handleEvents = () => {
        return setShowEvents(!showEvents)
    }

    const handleUsers = () => {
        return
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
                    <h1>gudbuy</h1>
                )}
            </div>
        </div>
    )
}

export default blog
