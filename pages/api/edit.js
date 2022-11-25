import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {

    const body = req.body

    async function run() {
        const client = await clientPromise
        const database = client.db("viperDb")
        const collection = database.collection("participated_events")

        const response = await collection.findOneAndUpdate(
            {
                event_id: body.event_id,
                event_name: body.event_name,
                event_location: body.event_location,
            },
            { $push: { comment: body.comment } },
            { upsert: true }
        )
        console.log(response)
        res.json(response)
    }
    run().catch(console.dir)
}
