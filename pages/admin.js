import { useSession, getSession } from "next-auth/react"
import Image from "next/image"

export async function getServerSideProps(context) {
    const session = await getSession(context)

    return {
        props: {
            session: session,
        },
    }
}

export default function Admin() {
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            return "Authenticate motherfucker..."
        },
    })
    // console.log(session)

    if (status === "loading") {
        return "Loading or not authenticated..."
    }

    return (
        <>
            <div>
                <h1>Hello {session.user.name}</h1>
                <p>{session.user.email}</p>
                <img src={session.user.image} />
            </div>
        </>
    )
}
