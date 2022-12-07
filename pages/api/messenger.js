import { unstable_getServerSession } from "next-auth"
import clientPromise from "../../lib/mongodb"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user?._id

    const body = req.body

    const client = await clientPromise
    const db = client.db("viperDb")
    const collection = await db.collection("chats").findOneAndUpdate(
        {
            $or: [
                {
                    members: [sessionId, body._id],
                },
                {
                    members: [body._id, sessionId],
                },
            ],
        },
        {
            $push: {
                messages: {
                    sender: sessionId,
                    message: body.message,
                    timestamp: Date.now(),
                },
            },
        }
    )

    res.json(collection)
}
