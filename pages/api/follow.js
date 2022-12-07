import clientPromise from "../../lib/mongodb"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user?._id

    const body = req.body

    const vip = {
        _id: body._id,
        name: body.name,
        email: body.email,
    }

    const client = await clientPromise
    const db = client.db("viperDb")
    const viper = await db.collection("users").findOne({
        _id: ObjectId(sessionId),
        vipers: vip,
    })

    if (!viper) {

        const newViper = await db.collection("users").findOneAndUpdate(
            {
                _id: ObjectId(sessionId),
            },
            {
                $push: {
                    vipers: vip,
                },
            }
        )
        res.json(newViper)
    } else {
        const noViper = await db.collection("users").findOneAndUpdate(
            {
                _id: ObjectId(sessionId),
            },
            {
                $pull: {
                    vipers: vip,
                },
            }
        )
        res.json(noViper)
    }
}
