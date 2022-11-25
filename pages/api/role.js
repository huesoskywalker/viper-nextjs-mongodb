import clientPromise from "../../lib/mongodb"
import { unstable_getServerSession } from "next-auth"
import { authOptions } from "./auth/[...nextauth]"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user._id

    // console.log(sessionId + " \n hey yo \n")
    const _id = req.body.id
    // console.log(_id + " \n hey yo \n")

    const client = await clientPromise
    const db = client.db("viperDb")
    if (sessionId === _id) {
        const viper = await db.collection("users").findOneAndUpdate(
            {
                _id: ObjectId(sessionId),
            },

            {
                $set: {
                    role: "user",
                },
            }
        )
        res.json(viper)
    }

    // .findOne({ _id: ObjectId(sessionId) })
    // console.log(viper)

    // if (sessionId === _id) {
    //     const response = await viper.updateOne({
    //         $set: {
    //             role: "user",
    //         },
    //     })
    //     res.json(response)
    // }
    // if (typeof viper._id.toString() === _id) {
    //     console.log("ES LO MESMO CONCHATUMA")
    // }

    // res.send(JSON.stringify(session, null, 2))
}
