import clientPromise from "../../lib/mongodb"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user._id

    const _id = req.body.id

    const client = await clientPromise
    const db = client.db("viperDb")
    if (sessionId === _id) {
        const viper = await db.collection("users").findOneAndUpdate(
            {
                _id: ObjectId(sessionId),
            },

            {
                $set: {
                    role: "admin",
                },
            }
        )
        res.json(viper)
    }
}
