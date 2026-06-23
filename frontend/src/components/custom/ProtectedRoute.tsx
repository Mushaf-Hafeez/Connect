import { userStore } from "@/zustand/userStore"
import type React from "react"
import { Navigate } from "react-router-dom"
import { useStore } from "zustand"

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useStore(userStore)

  if (!user) {
    return <Navigate to={"/login"} />
  } else {
    return children
  }
}

export default ProtectedRoute
