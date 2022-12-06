import React from "react"
// import { useState } from "react"
import clientPromise from "../lib/mongodb"
import { getSession } from "next-auth/react"
import Link from "next/link"

export async function getServerSideProps(context) {
    const session = await getSession(context)

    const client = await clientPromise
    const db = client.db("viperDb")
    const users = await db.collection("users").find({}).toArray()
    

    const vipers = JSON.parse(JSON.stringify(users))

    const filtered = vipers.map((property) => {
        return {
            _id: property._id,
            name: property.name,
            email: property.email,
        }
    })

    // const chat = await db.collection("chats").aggregate([
    //     {
    //         $match:
    //     }
    // ])

    return {
        props: {
            properties: filtered,
        },
    }
}

const chats = ({ properties }) => {
    // const [message, setMessage] = useState("")

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

    // const sendMessage = async (property) => {
    //     const chat = {
    //         _id: property._id,
    //         message: message,
    //     }

    //     const JSONchat = JSON.stringify(chat)

    //     const endpoint = `/api/messenger`
    //     const options = {
    //         method: "PUT",
    //         headers: {
    //             "Content-type": "application/json",
    //         },
    //         body: JSONchat,
    //     }

    //     const response = await fetch(endpoint, options)
    //     const result = await response.json()
    // }

    return (
        <div>
            Hey yo motherfucker
            <div>
                {properties ? (
                    properties.map((property) => (
                        <div key={property._id}>
                            {/* <button onClick={() => grabUser(property)}>
                                <p>Chat with: {property.name}</p>
                            </button>
                            <input type="text" onChange={(e) => setMessage(e.target.value)} />
                            <button onClick={() => sendMessage(property)}>send</button> */}
                            <Link
                                href={{
                                    pathname: "/chats/[userid]",
                                    query: { userid: property._id },
                                }}
                                legacyBehavior
                            >
                                <a onClick={() => grabUser(property)}>
                                    Chat with: {property.name}
                                </a>
                            </Link>
                        </div>
                    ))
                ) : (
                    <h1></h1>
                )}
                <h1></h1>
                <p></p>
            </div>
            <div></div>
        </div>
    )
}

export default chats
