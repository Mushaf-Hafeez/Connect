import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"

const Homepage = () => {
  const { user } = useStore(userStore)

  return (
    <div className="flex-center min-h-screen w-full">
      {user ? (
        <h1>Welcome, {user.username}</h1>
      ) : (
        <h1 className="text-4xl">This is the Homepage of the website.</h1>
      )}
    </div>
  )
}

export default Homepage
