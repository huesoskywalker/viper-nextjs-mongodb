import { useState } from "react"
import Link from "next/link"

const vipers = () => {
    const [searchVipers, setSearchVipers] = useState("")

    return (
        <div>
            <label>Search</label>
            <input type="search" onChange={(e) => setSearchVipers(e.target.value)}></input>
            <Link
                href={{
                    pathname: "/vipers/[v]",
                    query: { v: searchVipers },
                }}
            >
                Go
            </Link>
        </div>
    )
}

export default vipers
