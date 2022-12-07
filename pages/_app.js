import { SessionProvider, useSession, signIn } from "next-auth/react"
import { useEffect } from "react"
import Layout from "../components/Layout"
import "../styles/globals.css"

function Auth({ children }) {
    const { data: session, status } = useSession()
    const isUser = session?.user.role

    useEffect(() => {
        if (status === "loading") return // Do nothing while loading
        if (!isUser) signIn()
        if (isUser) return
    }, [isUser, status])

    if (isUser === "admin") {
        return children
    }
    const addRole = async () => {
        const data = {
            id: session?.user?._id,
        }
        const JSONdata = JSON.stringify(data)
        const endpoint = `/api/role`
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
            <div>
                <h1>Admin Role needed for super powers</h1>
                <button onClick={addRole}>Add Role</button>
            </div>
        </div>
    )
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
                    <Component {...pageProps} />
                )}
            </Layout>
        </SessionProvider>
    )
}

export default MyApp
