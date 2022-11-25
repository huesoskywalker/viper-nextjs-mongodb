import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
    const body = req.body

    const client = await clientPromise
    const database = client.db("viperDb")
    const collection = database.collection("participated_events")

    const event = {
        event_id: body.event_id,
        event_name: body.event_name,
        location: body.location,
        date: body.date,
        category: body.category.toLowerCase(),
    }

    const response = await collection.insertOne(event)
    res.json(response)
}
