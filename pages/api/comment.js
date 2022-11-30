import { builtinModules } from "module"
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
// import { comments } from "../blog"

export default async function handler(req, res) {
    // res.status(200).json(comments)

    const body = req.body

    async function run() {
        const client = await clientPromise
        const database = client.db("viperDb")
        const collection = database.collection("organized_events")

        const response = await collection.findOneAndUpdate(
            {
                _id: ObjectId(body._id),
                organizer: body.organizer,
                // event_id: body.event_id,
                // event_name: body.event_name,
                // event_location: body.event_location,
            },
            { $push: { comment: body.comment } }
            // { upsert: true }
        )
        console.log(response)
        res.json(response)
    }
    run().catch(console.dir)
}
