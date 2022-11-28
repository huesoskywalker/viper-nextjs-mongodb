import clientPromise from "../../lib/mongodb"

export async function getServerSideProps(context) {
    const { params, query } = context
    console.log(query)
    // console.log(req.headers.cookie)
    // res.setHeader("Set-Cookie", ["name=viper"])

    const { category } = params

    const client = await clientPromise
    const database = client.db("viperDb")
    const collection = await database.collection("organized_events").find(query).toArray()
    const viper = JSON.parse(JSON.stringify(collection))

    const filtered = viper.map((property) => {
        return {
            _id: property._id,
            event_id: property.event_id,
            event_name: property.event_name,
            location: property.location,
            date: property.date,
            category: property.category,
        }
    })

    return {
        props: {
            category,
            events: filtered,
        },
    }
}

const EventsListByCategory = ({ events, category }) => {
    const participate = async (event) => {
        const data = {
            event_id: event.event_id,
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
        console.log(result)
    }

    return (
        <>
            <div>
                <h1>
                    Showing events for <i>{category}</i>
                </h1>
                {events.map((event) => {
                    return (
                        <div key={event._id}>
                            <h2>{event.event_name}</h2>
                            <h3>{event.location}</h3>
                            <p>
                                {event.date} {event.category}
                            </p>
                            <button onClick={() => participate(event)}>Participate</button>
                        </div>
                    )
                })}
            </div>
        </>
    )
}

export default EventsListByCategory
