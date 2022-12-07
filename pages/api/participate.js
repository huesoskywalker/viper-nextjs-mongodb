import clientPromise from "../../lib/mongodb"
import { authOptions } from "./auth/[...nextauth]"
import { unstable_getServerSession } from "next-auth/next"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user._id

    const body = req.body

    const event = {
        event_id: body._id,
        organizer: body.organizer,
        event_name: body.event_name,
        location: body.location,
        date: body.date,
        category: body.category.toLowerCase(),
    }

    const client = await clientPromise
    const db = client.db("viperDb")

    const finder = await db.collection("users").findOne({
        _id: ObjectId(sessionId),
        participated: event,
    })

    if (!finder) {
        const viper = await db.collection("users").findOneAndUpdate(
            {
                _id: ObjectId(sessionId),
            },
            {
                $push: {
                    participated: event,
                },
            }
        )

        const tracker = await db.collection("organized_events").findOneAndUpdate(
            {
                _id: ObjectId(body._id),
            },
            {
                $push: {
                    participants: sessionId,
                },
            },
            { upsert: true }
        )

        res.json(viper, tracker)
    } else {
        const noViper = await db.collection("users").findOneAndUpdate(
            {
                _id: ObjectId(sessionId),
            },
            {
                $pull: {
                    participated: event,
                },
            }
        )

        const noTracker = await db.collection("organized_events").findOneAndUpdate(
            {
                _id: ObjectId(body._id),
            },
            {
                $pull: {
                    participants: sessionId,
                },
            },
            { upsert: true }
        )

        res.json(noViper, noTracker)
    }
}
