import { unstable_getServerSession } from "next-auth"
import clientPromise from "../../lib/mongodb"
import { authOptions } from "./auth/[...nextauth]"
import { ObjectId } from "mongodb"

export default async function handler(req, res) {
    const session = await unstable_getServerSession(req, res, authOptions)
    const sessionId = session.user?._id

    const body = req.body

    //  const user = {
    //      _id: body._id,
    //      name: body.name,
    //      email: body.email,
    //  }
    //  const message = {
    //      message: body.message,
    //  }
    //  console.log(user)
    //  console.log(message)

    const client = await clientPromise
    const db = client.db("viperDb")
    const collection = await db.collection("chats").updateOne(
        {
            // $push: {
            // members: [sessionId, body._id],
            // messages: {
            //     sender: [],
            //     message: [],
            // },
            // },

            $or: [
                {
                    members: [sessionId, body._id],
                },
                {
                    members: [body._id, sessionId],
                },
            ],
        },
        {
            $setOnInsert: { members: [sessionId, body._id] },
        },
        { upsert: true }
        //  {
        //      members: [ObjectId(sessionId), ObjectId(body._id)] || [
        //          ObjectId(body._id),
        //          ObjectId(sessionId),
        //      ],
        //  },
        //   {
        //       $currentDate: {
        //           lastModified: true,
        //           timestamp: { $type: "timestamp" },
        //       },
        //   },
    )

    res.json(collection)
}

// _id: [ObjectId(body._id)[0], body.name[1]],
// {
//     // conversation_id: 12345,
//     time: time,
//     members: ['user1', 'user2'],
//     messages: [
//       {
//          sender: 'user1',
//          message: 'Hello World',
//          timestamp: time
//       },
//       {
//          sender: 'user1',
//          message: 'Hello World',
//          timestamp: time
//       }],
//    total_messages: 2
// }
