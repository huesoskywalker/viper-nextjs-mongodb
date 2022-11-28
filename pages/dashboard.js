import clientPromise from "../lib/mongodb"
import { getSession, useSession, getCsrfToken } from "next-auth/react"
import { useState } from "react"

export async function getServerSideProps(context) {
    const session = await getSession(context)

    // console.log(session)
    // try {
    const query = await getCsrfToken(context)
    const client = await clientPromise
    const database = client.db("viperDb")
    const properties = await database
        .collection("organized_events")
        .find({ event_id: query })
        .toArray()
    const viper = JSON.parse(JSON.stringify(properties))

    const filtered = viper.map((property) => {
        // const price = JSON.parse(JSON.stringify(property.price))
        return {
            _id: property._id,
            event_id: property.event_id,
            event_name: property.event_name,
            location: property.location,
            date: property.date,
            category: property.category,
            // price: price.$numberDecimal,
        }
    })

    return {
        props: {
            csrfToken: await getCsrfToken(context),
            properties: filtered,
            data: session,
        },
    }
    // } catch (error) {
    //     console.error(error)
    // }
}

export default function AdminDashboard({ csrfToken, properties, data }) {
    // session is always non-null inside this page, all the way down the React tree.
    const [oldEvent, setOldEvent] = useState(false)

    const userId = data.user._id

    const handleSubmit = async (event) => {
        const data = {
            event_id: userId,
            name: event.target.name.value,
            location: event.target.location.value,
            date: event.target.date.value,
            category: event.target.category.value,
        }
        console.log(data)
        const JSONdata = JSON.stringify(data)
        const endpoint = "/api/form"
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
    const edit = async (property) => {
        const data = {
            event_id: property.event_id,
            event_name: property.event_name,
            location: property.location,
            date: property.date,
            category: property.category,
        }

        setOldEvent(data)
    }
    const handleEdit = async (event) => {
        const data = {
            editedEvent: {
                event_id: oldEvent.event_id,
                event_name: event.target.name.value,
                location: event.target.location.value,
                date: event.target.date.value,
                category: event.target.category.value,
            },
            oldEvent,
        }
        const JSONdata = JSON.stringify(data)

        const endpoint = `/api/editevent/[eventId]`
        const options = {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSONdata,
        }
        const response = await fetch(endpoint, options)
        const result = await response.json()(`Good? ${result}`)
    }

    return (
        <>
            <div>
                <form onSubmit={handleSubmit}>
                    <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                    <label htmlFor="name">Event</label>
                    <input type="text" id="name" name="name" required />

                    <label htmlFor="location">Location</label>
                    <input type="text" id="location" name="location" required />

                    <label htmlFor="date">Date</label>
                    <input type="date" id="date" name="date" required />

                    <select id="category">
                        <option value="Music">Music</option>
                        <option value="Food">Food</option>
                        <option value="Drinks">Drinks</option>
                    </select>

                    <button type="submit">Submit</button>
                </form>
            </div>

            <div>
                <h1>organized events</h1>
                {properties ? (
                    properties.map((property) => (
                        <div key={property._id}>
                            <h1>{property.event_name}</h1>
                            <div>
                                <h2>{property.location}</h2>
                            </div>
                            <div>
                                <h3>{property.date}</h3>
                            </div>
                            <div>
                                <p>{property.category}</p>
                            </div>
                            <button onClick={() => edit(property)}>Edit</button>
                        </div>
                    ))
                ) : (
                    <form>gudbuy</form>
                )}
                <div>
                    {oldEvent ? (
                        <div>
                            <form onSubmit={handleEdit}>
                                <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                                <label htmlFor="name">Event</label>
                                <input type="text" id="name" name="name" required />

                                <label htmlFor="location">Location</label>
                                <input type="text" id="location" name="location" required />

                                <label htmlFor="date">Date</label>
                                <input type="date" id="date" name="date" required />

                                <select id="category">
                                    <option value="Music">Music</option>
                                    <option value="Food">Food</option>
                                    <option value="Drinks">Drinks</option>
                                </select>

                                <button type="submit">Submit</button>
                            </form>
                        </div>
                    ) : (
                        <div>bike papa</div>
                    )}
                </div>
            </div>
        </>
    )
}

AdminDashboard.auth = {
    role: "admin",
    // loading: <AdminLoadingSkeleton />,
    unauthorized: "/login-with-different-user", // redirect to this url
}
