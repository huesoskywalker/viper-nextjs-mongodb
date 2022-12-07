import { useState } from "react"
import clientPromise from "../../lib/mongodb"
import { getSession } from "next-auth/react"

export async function getServerSideProps(context) {
    const session = await getSession(context)
    const sessionId = session?.user?._id

    const { params, query } = context
    const { userid } = params

    try {
        const client = await clientPromise
        const db = client.db("viperDb")
        const chater = await db
            .collection("chats")
            .aggregate([
                {
                    $match: {
                        $or: [
                            {
                                members: [sessionId, userid],
                            },
                            {
                                members: [userid, sessionId],
                            },
                        ],
                    },
                },
                {
                    $unwind: "$messages",
                },
            ])
            .toArray()

        const vipers = JSON.parse(JSON.stringify(chater))

        const filtered = vipers.map((property) => {
            return {
                sender: property.messages.sender,
                message: property.messages.message,
                timestamp: property.messages.timestamp,
            }
        })

        return {
            props: {
                userid,
                chat: filtered,
            },
        }
    } catch (error) {
        console.error(error)
    }
}

const userid = ({ userid, chat }) => {
    // console.log(chat)

    const [message, setMessage] = useState("")

    const sendMessage = async () => {
        // console.log("que pasa pa")
        const chat = {
            _id: userid,
            message: message,
        }

        const JSONchat = JSON.stringify(chat)
        const endpoint = `/api/messenger`
        const options = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSONchat,
        }

        const response = await fetch(endpoint, options)
        const result = await response.json()
    }

    return (
        <div>
            {chat ? (
                chat.map((something) => (
                    <div key={something._id}>
                        <h1>{something.sender}</h1>
                        <h2>{something.message}</h2>
                        <p>{something.timestamp}</p>
                    </div>
                ))
            ) : (
                <div>nada padre</div>
            )}
            chat :
            <input type="text" onChange={(e) => setMessage(e.target.value)} />
            <button onClick={() => sendMessage()}>send</button>
        </div>
    )
}

export default userid
