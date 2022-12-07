import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"
import navStyles from "../styles/Nav.module.css"

const Nav = () => {
    const { data: session, status } = useSession()

    return (
        <nav className={navStyles.nav}>
            <ul>
                <li>
                    <Link href="/">Home</Link>
                </li>
                <li>
                    <Link href="/events">Events</Link>
                </li>
                <li>
                    <Link href="/vipers">Vipers</Link>
                </li>
                <li>
                    <Link href="/blog">Blog</Link>
                </li>
                <li>
                    <Link href="/dashboard">Dashboard</Link>
                </li>
                <li>
                    <Link href="/admin">Admin</Link>
                </li>

                {session ? (
                    <li>
                        <Link href="#" onClick={() => signOut()}>
                            Sign out
                        </Link>
                    </li>
                ) : (
                    <li>
                        <Link href="#" onClick={() => signIn()}>
                            Sign in
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}

export default Nav
