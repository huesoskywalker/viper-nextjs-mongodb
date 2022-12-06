import clientPromise from "../../lib/mongodb"

export async function getServerSideProps(context) {
    const { params } = context
    const { q } = params

    const client = await clientPromise
    const db = client.db("viperDb")
    const collection = await db
        .collection("organized_events")
        .aggregate([
            {
                $match: {
                    $or: [
                        {
                            event_name: q,
                        },
                        {
                            location: q,
                        },
                        {
                            date: q,
                        },
                        {
                            category: q,
                        },
                    ],
                },
            },
            {
                $project: {
                    _id: 0,
                    organizer: 1,
                    event_name: 1,
                    location: 1,
                    date: 1,
                    category: 1,
                    comment: 1,
                    likes: 1,
                    participants: 1,
                },
            },
            {
                $limit: 10,
            },
        ])
        .toArray()

    const viper = JSON.parse(JSON.stringify(collection))

    return {
        props: {
            events: viper,
        },
    }
}

const q = ({ events }) => {
    console.log(events)
    return (
        <div>
            <div>
                {events ? (
                    events.map(
                        ({
                            organizer,
                            event_name,
                            location,
                            date,
                            category,
                            likes,
                            participants,
                        }) => (
                            <div>
                                <h1>{organizer}</h1>
                                <h1>{event_name}</h1>
                                <h2>{location}</h2>
                                <h4>{date}</h4>
                                <h4>{category}</h4>
                                <p>Likes: {likes.length}</p>
                                <p>Participants: {participants.length}</p>
                            </div>
                        )
                    )
                ) : (
                    <h1>naranja</h1>
                )}
            </div>
        </div>
    )
}

export default q
