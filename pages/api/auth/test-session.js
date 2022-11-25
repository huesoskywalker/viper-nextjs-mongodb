import { getSession } from "next-auth/react"

const handler = async (req, res) => {
    const session = await getSession({ req })

    if (!session) {
        res.status(401).json({ error: `Unauthenthicated user` })
    } else {
        res.status(200).json({ message: "Succes", session })
    }
}

export default handler
