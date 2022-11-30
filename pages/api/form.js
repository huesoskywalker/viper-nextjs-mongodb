// import { MongoClient } from "mongodb"
import clientPromise from "../../lib/mongodb"

export default async function handler(req, res) {
    // Get data submitted in request's body.
    const body = req.body
    // Optional logging to see the responses
    // in the command line where next.js app is running.

    // Guard clause checks for first and last name,
    // and returns early if they are not found
    if (!body.name || !body.location || !body.date || !body.category) {
        // Sends a HTTP bad request error code
        return res.status(400).json({ data: "Name or last name not found" })
    }

    // Found the name.
    // Sends a HTTP success code
    // res.status(200).json({ data: `${body.name} ${body.password} ${body.email}` })

    // const uri = process.env.MONGODB_URI
    // const client = new MongoClient(uri)
    async function run() {
        // try {
        const client = await clientPromise
        const database = client.db("viperDb")
        const viper = database.collection("organized_events")
        // console.log(viper)

        // create a document to insert
        const event = {
            organizer: body.organizer,
            // event_id: body.event_id,
            event_name: body.name,
            location: body.location,
            date: body.date,
            category: body.category.toLowerCase(),
            comment: [],
            likes: [],
        }

        const response = await viper.insertOne(event)
        res.json(response)

        // return res.status(200).json({ result: "May the force be with you" })
        // console.log(`A document was inserted with the _id: ${result.insertedId}`)
        // } finally {
        //     await client.close()
        // }
    }
    run().catch(console.dir)
}
