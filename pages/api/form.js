// import { MongoClient } from "mongodb"
import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
    const body = req.body

    if (!body.name || !body.location || !body.date || !body.category) {
        return res.status(400).json({ data: "Name or last name not found" })
    }

    try {
        const client = await clientPromise
        const database = client.db("viperDb")
        const viper = database.collection("organized_events")

        const event = {
            organizer: body.organizer,
            event_name: body.name,
            location: body.location,
            date: body.date,
            category: body.category.toLowerCase(),
            comment: [],
            likes: [],
            participants: [],
        }

        const response = await viper.insertOne(event)
        res.json(response)
    } catch (error) {
        console.error(error)
    }
}
