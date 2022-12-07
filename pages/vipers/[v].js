import clientPromise from "../../lib/mongodb"

export async function getServerSideProps(context) {
    const { params } = context
    const { v } = params

    try {
        const client = await clientPromise
        const db = client.db("viperDb")
        const collection = await db
            .collection("users")
            .aggregate([
                {
                    $match: {
                        $or: [
                            {
                                _id: v,
                            },
                            {
                                name: v,
                            },
                            {
                                email: v,
                            },
                            {
                                role: v,
                            },
                        ],
                    },
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        email: 1,
                    },
                },
                {
                    $limit: 20,
                },
            ])
            .toArray()

        const vipers = JSON.parse(JSON.stringify(collection))

        return {
            props: {
                vipers: vipers,
            },
        }
    } catch (error) {
        console.error(error)
    }
}

const v = ({ vipers }) => {
    const addUser = async (viper) => {
        const data = {
            _id: viper._id,
            name: viper.name,
            email: viper.email,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = `/api/follow`
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

    return (
        <div>
            {vipers ? (
                vipers.map((viper) => (
                    <div key={viper._id}>
                        <h1>{viper.name}</h1>
                        <p>{viper.email}</p>
                        <button onClick={() => addUser(viper)}>Follow</button>
                    </div>
                ))
            ) : (
                <h1>nada</h1>
            )}
        </div>
    )
}

export default v
