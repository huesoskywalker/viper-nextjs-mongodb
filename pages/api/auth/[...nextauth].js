import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"
import { MongoDBAdapter } from "@next-auth/mongodb-adapter"
import clientPromise from "../../../lib/mongodb.ts"

export const authOptions = {
    // Configure one or more authentication providers
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_ID,
            clientSecret: process.env.GITHUB_SECRET,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        }),
    ],

    adapter: MongoDBAdapter(clientPromise),
    session: {
        strategy: "database",
        maxAge: 30 * 24 * 60 * 60, // 30 days
        updateAge: 24 * 60 * 60, // 24 hours

        // The session token is usually either a random UUID or string, however if you
        // need a more customized session token string, you can define your own generate function.
        // generateSessionToken: () => {
        //     return randomUUID?.() ?? randomBytes(32).toString("hex")
    },
    // },
    secret: process.env.NEXTAUTH_SECRET,
    callbacks: {
        async session({ session, token, user }) {
            session.user.role = user.role
            session.user._id = user.id // Add role value to user object so it is passed along with session
            return session
        },
    },
}

export default NextAuth(authOptions)
