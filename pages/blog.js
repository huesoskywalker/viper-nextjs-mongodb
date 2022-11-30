import { getCsrfToken, getSession, useSession } from "next-auth/react"
// import { useState } from "react"
import clientPromise from "../lib/mongodb"
// import { ObjectId } from "mongodb"

export async function getServerSideProps(context) {
    const session = await getSession(context)
    // const sessionId = session.user?._id
    if (!session) {
        return {
            redirect: {
                destination: `api/auth/signin?callbackUrl=${process.env.LOCAL_URL}/blog`,
                permanent: false,
            },
        }
    }

    const client = await clientPromise
    const database = client.db("viperDb")
    const properties = await database
        .collection("users")
        .aggregate([
            {
                $unwind: "$participated",
            },
            {
                $project: {
                    _id: 0,
                    name: 0,
                    email: 0,
                    image: 0,
                    emailVerified: 0,
                    role: 0,
                },
            },

            {
                $limit: 20,
            },
        ])
        .toArray()

    const viper = JSON.parse(JSON.stringify(properties))

    const filtered = viper.map((property) => {
        // const price = JSON.parse(JSON.stringify(property.price))
        return {
            _id: property.participated.event_id,
            event_name: property.participated.event_name,
            location: property.participated.location,
            date: property.participated.date,
            category: property.participated.category,
            // comment: property.comment,
            // likes: property.likes,
            // // price: price.$numberDecimal,
        }
    })
    // console.log(filtered)

    return {
        props: {
            session,
            data: session ? "Hey there G" : "Login please",
            properties: filtered,
        },
    }
}

const blog = ({ data, properties }) => {
    const { data: session } = useSession()
    // const [postComment, setPostComment] = useState([])
    // const [changeText, setChangeText] = useState(false)

    // const handleChange = (property) => {
    //     return setChangeText(!changeText)
    // }

    // const submitComment = async (property) => {
    //     const data = {
    //         _id: property._id,
    //         organizer: property.organizer,
    //         // event_name: property.event_name,
    //         // location: property.location,
    //         // date: property.date,
    //         // category: property.category,
    //         comment: postComment,
    //         // likes: property.likes,
    //     }

    //     const JSONdata = JSON.stringify(data)
    //     const endpoint = "/api/comment"
    //     const options = {
    //         method: "POST",
    //         headers: {
    //             "Content-type": "application/json",
    //         },
    //         body: JSONdata,
    //     }
    //     const response = await fetch(endpoint, options)
    //     const result = await response.json()
    //     // console.log(result)
    // }

    return (
        <div>
            {data}
            <div>
                {/* <input
                    type="text"
                    id="comment"
                    onChange={(e) => setPostComment(e.target.value)}
                    required
                /> */}
                {properties ? (
                    properties.map((property) => (
                        <div key={property._id}>
                            <h1 id="event_name">{property.event_name}</h1>
                            <div>
                                <h2>{property.location}</h2>
                            </div>
                            <div>
                                <h3>{property.date}</h3>
                            </div>
                            <div>
                                <p>{property.category}</p>
                            </div>
                            <div>{/* <p>likes: {property.likes.length}</p> */}</div>
                            {/* {changeText ? (
                                property.comment.map((singleComment) => (
                                    <div>
                                        <h1>{singleComment}</h1>
                                    </div>
                                ))
                            ) : (
                                <div> nuting</div>
                            )}

                            <button onClick={() => submitComment(property)}>Comment</button>
                            <button onClick={() => handleChange(property)}>Show Comments</button> */}
                        </div>
                    ))
                ) : (
                    <h1>gudbuy</h1>
                )}
            </div>
        </div>
    )
}

export default blog
