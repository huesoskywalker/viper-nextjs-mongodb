import clientPromise from "../../lib/mongodb"

export default async function (req, res) {
    const client = await clientPromise

    const db = client.db("viperDb")
    const viper = await db
        .collection("organized_events")
        .aggregate([
            {
                $match: {
                    category: "food",
                },
            },
            {
                $project: {
                    _id: 0,
                    event_name: 1,
                    location: 1,
                    date: 1,
                },
            },
            {
                $limit: 10,
            },
        ])
        .toArray()

        // .collection("users")
        // .find({ participated: Object }, { _id: 0, event_name: 1 })
        // .toArray()

        // .collection("users")
        // .find({ participated: { $elemMatch: { event_name: "This is the first event" } } })
        // .toArray()

        .collection("users")
        .aggregate([
            // {
            //     $match: {
            //         participated: { $elemMatch: { event_name: "This is the first event" } },
            //     },
            // },
            {
                $unwind: "$participated",
            },
            {
                $project: {
                    event_id: 0,
                    organizer: 0,
                },
            },
            // {
            //     $limit: 10,
            // },
        ])
        .toArray()

    console.log(viper)
    res.json(viper)
}
