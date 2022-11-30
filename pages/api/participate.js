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
    // const viper = db.collection("participated_events").insertOne(event)

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

    // const viper = await db
    //     .collection("users")
    //     .aggregate([
    //         {
    //             $match: {
    //                 _id: ObjectId(sessionId),
    //             },
    //         },
    //         {
    //             $addFields: {
    //                 participate: { event },
    //             },
    //         },
    //     ])
    //     .toArray()

    // console.log(viper)

    res.json(viper)
}
