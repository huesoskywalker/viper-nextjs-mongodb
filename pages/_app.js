import { SessionProvider, useSession } from "next-auth/react"
import { useEffect } from "react"
import Layout from "../components/Layout"
import "../styles/globals.css"

// function Auth({ children }) {
//     const { status } = useSession({ required: true })

//     if (status === "loading") return <div>Loading...</div>

//     return children
// }

function Auth({ children }) {
    const { data: session, status } = useSession()
    const isUser = session?.user.role
    console.log("is this what we are consoling \n" + isUser + "\n Seems it is true, bra")
    useEffect(() => {
        if (status === "loading") return // Do nothing while loading
        if (!isUser) signIn() // If not authenticated, force log in
    }, [isUser, status])

    if (isUser === "admin") {
        return children
    }

    // Session is being fetched, or no user.
    // If no user, useEffect() will redirect.
    return <div>Cargandola pa...</div>
}

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
    return (
        <SessionProvider session={session}>
            <Layout>
                {Component.auth ? (
                    <Auth>
                        <Component {...pageProps} />
                    </Auth>
                ) : (
                    // <h1>chupate dos huevo' pa</h1>
                    <Component {...pageProps} />
                )}
            </Layout>
        </SessionProvider>
    )
}

export default MyApp