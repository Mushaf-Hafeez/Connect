import { Button } from "@/components/ui/button"
import { userStore } from "@/zustand/userStore"
import { Link } from "react-router-dom"
import { useStore } from "zustand"

const Homepage = () => {
  const { user } = useStore(userStore)

  return (
    <div className="flex-center min-h-screen w-full">
      {user ? (
        <div className="space-y-2">
          <h1>Welcome, {user.username}</h1>
          <div className="space-x-2">
            <Button asChild>
              <Link to={"/chat"}>Open chat</Link>
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <h1 className="text-4xl">This is the Homepage of the website.</h1>
          <Button asChild>
            <Link to={"/login"} className="cursor-pointer">
              Login
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default Homepage
