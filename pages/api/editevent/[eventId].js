import clientPromise from "../../../lib/mongodb"

export default async function handler(req, res) {
    const body = req.body

    async function run() {
        const client = await clientPromise
        const database = client.db("viperDb")
        const collection = database.collection("organized_events")

        const response = await collection.findOneAndUpdate(
            {
                event_id: body.oldEvent.event_id,
                event_name: body.oldEvent.event_name,
            },

            {
                $set: {
                    event_name: body.editedEvent.event_name,
                    location: body.editedEvent.location,
                    date: body.editedEvent.date,
                    category: body.editedEvent.category.toLowerCase(),
                },
            }
        )
        res.json(response)
    }
    run().catch(console.dir)
}
