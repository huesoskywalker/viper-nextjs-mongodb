import { builtinModules } from "module"
import clientPromise from "../../lib/mongodb"
import { ObjectId } from "mongodb"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user?.name
    const body = req.body

    async function run() {
        const client = await clientPromise
        const database = client.db("viperDb")
        const collection = database.collection("organized_events")

        const response = await collection.findOneAndUpdate(
            {
                _id: ObjectId(body._id),
                organizer: body.organizer,
            },
            { $push: { comment: [sessionId, body.comment] } }
        )
        res.json(response)
    }
    run().catch(console.dir)
}
