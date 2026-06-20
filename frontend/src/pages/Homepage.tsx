import Spinner from "@/components/custom/Spinner"
import { Button } from "@/components/ui/button"
import { logout } from "@/services/auth.service"
import { userStore } from "@/zustand/userStore"
import { useState } from "react"
import toast from "react-hot-toast"
import { useStore } from "zustand"

const Homepage = () => {
  const { user, clearUser } = useStore(userStore)

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await logout()

      if (response.status === 200) {
        clearUser()
      }
    } catch (error) {
      console.log("error while logging out in homepage: ", error)
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex-center min-h-screen w-full">
      {user ? (
        <div className="space-y-2">
          <h1>Welcome, {user.username}</h1>
          <Button
            disabled={isLoading}
            variant={"destructive"}
            onClick={handleLogout}
            className="cursor-pointer"
          >
            {isLoading && <Spinner />}
            Logout
          </Button>
        </div>
      ) : (
        <h1 className="text-4xl">This is the Homepage of the website.</h1>
      )}
    </div>
  )
}

export default Homepage
