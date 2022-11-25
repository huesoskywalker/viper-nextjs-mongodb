import { useState, useEffect } from "react"
import { getSession, signIn } from "next-auth/react"
import Link from "next/link"

const events = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const securePage = async () => {
            const session = await getSession()
            if (!session) {
                return <h1>Yo motherfucker watch some stuff but not the whole shit</h1>
            } else {
                setLoading(false)
            }
        }

        securePage()
    }, [])

    if (loading)
        return <h2>Here we can place a preview of the events with less info, till login</h2>

    return (
        <>
            <div>hello motherfucker</div>
            <ul>
                <li>
                    <Link href="/events/music">
                        <h1>Music</h1>
                    </Link>
                </li>
                <li>
                    <Link href="/events/drinks">
                        <h1>Drinks</h1>
                    </Link>
                </li>
                <li>
                    <Link href="/events/food">
                        <h1>Food</h1>
                    </Link>
                </li>
            </ul>
        </>
    )
}

export default events
