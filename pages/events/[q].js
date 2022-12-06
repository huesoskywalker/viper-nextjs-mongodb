import clientPromise from "../../lib/mongodb"
import { useState } from "react"

export async function getServerSideProps(context) {
    const { params, query } = context
    // console.log(req.headers.cookie)
    // res.setHeader("Set-Cookie", ["name=viper"])
    console.log(query)

    const { q } = params
    console.log(q)

    const client = await clientPromise
    const database = client.db("viperDb")
    const collection = await database
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
                    _id: 1,
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

    // .find(query).toArray()
    // const viper = JSON.parse(JSON.stringify(collection))
    // const filtered = viper.map((property) => {
    //     return {
    //         _id: property._id,
    //         organizer: property.organizer,
    //         // event_id: property.event_id,
    //         event_name: property.event_name,
    //         location: property.location,
    //         date: property.date,
    //         category: property.category,
    //         comment: property.comment,
    //         likes: property.likes,
    //         participants: property.participants,
    //     }
    // })
    // console.log(filtered)

    return {
        props: {
            q,
            events: viper,
        },
    }
}

const EventsListByCategory = ({ events, q }) => {
    const [postComment, setPostComment] = useState([])
    const [changeText, setChangeText] = useState(false)

    const participate = async (event) => {
        const data = {
            _id: event._id,
            organizer: event.organizer,
            // event_id: event.event_id,
            event_name: event.event_name,
            location: event.location,
            date: event.date,
            category: event.category,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = `/api/participate`
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        // console.log(result)
    }

    const like = async (event) => {
        const data = {
            _id: event._id,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = `/api/like`
        const options = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
    }

    const submitComment = async (event) => {
        const data = {
            _id: event._id,
            organizer: event.organizer,
            // event_name: property.event_name,
            // location: property.location,
            // date: property.date,
            // category: property.category,
            comment: postComment,
            // likes: property.likes,
        }

        const JSONdata = JSON.stringify(data)
        const endpoint = "/api/comment"
        const options = {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()
        // console.log(result)
    }
    const handleChange = () => {
        return setChangeText(!changeText)
    }

    return (
        <div>
            <div>
                <h1>
                    Showing events for <i>{q}</i>
                </h1>
                <div>
                    <label htmlFor="comment">Add a comment:</label>
                    <input
                        type="text"
                        id="comment"
                        onChange={(e) => setPostComment(e.target.value)}
                        required
                    />
                </div>
                {events ? (
                    events.map((event) => (
                        <div key={event._id}>
                            <h2>{event.event_name}</h2>
                            <h3>{event.location}</h3>
                            <h4>
                                {event.date} {event.category}
                            </h4>
                            <p>Likes: {event.likes.length}</p>
                            <p>Participants: {event.participants.length}</p>
                            {changeText ? (
                                event.comment.map((singleComment) => (
                                    <div>
                                        <p>{singleComment[0]}</p>
                                        <h2>{singleComment[1]}</h2>
                                    </div>
                                ))
                            ) : (
                                <div> nuting</div>
                            )}

                            <button onClick={() => submitComment(event)}>Comment</button>
                            <button onClick={() => handleChange()}>Show Comments</button>
                            <button onClick={() => participate(event)}>Participate</button>
                            <button onClick={() => like(event)}>Like</button>
                        </div>
                    ))
                ) : (
                    <h1>hola</h1>
                )}
            </div>
        </div>
    )
}

export default EventsListByCategory
