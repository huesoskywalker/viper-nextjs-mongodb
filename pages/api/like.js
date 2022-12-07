import clientPromise from "../../lib/mongodb"
import { authOptions } from "./auth/[...nextauth]"
import { ObjectId } from "mongodb"
import { unstable_getServerSession } from "next-auth"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user._id

    const _id = req.body._id


    const client = await clientPromise
    const db = client.db("viperDb")

    const isLiked = await db.collection("organized_events").findOne({
        _id: ObjectId(_id),
        likes: sessionId,
    })

    if (!isLiked) {

        const like = await db.collection("organized_events").findOneAndUpdate(
            {
                _id: ObjectId(_id),
            },
            {
                $push: {
                    likes: sessionId,
                },
            }
        )
        res.json(like)
    } else {
        const dislike = await db.collection("organized_events").findOneAndUpdate(
            {
                _id: ObjectId(_id),
            },
            {
                $pull: {
                    likes: sessionId,
                },
            }
        )
        res.json(dislike)
    }
}
