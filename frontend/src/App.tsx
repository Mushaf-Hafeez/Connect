import { Navigate, Route, Routes, useNavigate } from "react-router-dom"

// importing pages
import Homepage from "./pages/Homepage"
import Signuppage from "./pages/Signuppage"
import Loginpage from "./pages/Loginpage"
import Errorpage from "./pages/Errorpage"
import VerifyEmailpage from "./pages/VerifyEmailpage"
import ForgotPasswordpage from "./pages/ForgotPasswordpage"
import ResetPasswordpage from "./pages/ResetPasswordpage"
import Chatpage from "./pages/Chatpage"

import ProtectedRoute from "./components/custom/ProtectedRoute"
import DefaultChatpage from "./pages/DefaultChatpage"
import ChatWindow from "./components/chat/ChatWindow"
import { useStore } from "zustand"
import { userStore } from "./zustand/userStore"
import { useEffect } from "react"
import { checkAuth } from "./services/auth.service"
import { socketStore } from "./zustand/socketStore"

const App = () => {
  const { user, isCheckingAuth, setIsCheckingAuth, setUser, clearUser } =
    useStore(userStore)
  const {
    socket,
    connectSocket,
    disconnectSocket,
    setOnlineUsers,
    removeOnlineUser,
  } = useStore(socketStore)

  const navigate = useNavigate()

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await checkAuth()

        if (response.status === 200) {
          setUser(response.data.user)
        }
      } catch (error) {
        console.log("Error in the app component: ", error)
        clearUser()
        navigate("/")
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuthentication()
  }, [setUser, clearUser])

  useEffect(() => {
    if (isCheckingAuth) return

    if (user) {
      connectSocket(user.id)
    } else {
      disconnectSocket()
    }
  }, [user, isCheckingAuth])

  useEffect(() => {
    if (!socket) return

    socket.on("add-online-user", (userIds) => setOnlineUsers(userIds))
    socket.on("remove-online-user", (userId) => removeOnlineUser(userId))

    return () => {
      socket.off("add-online-user")
      socket.off("remove-online-user")
    }
  }, [socket])

  return (
    <main>
      <Routes>
        <Route
          path="/"
          element={user ? <Navigate to={"/chat"} /> : <Homepage />}
        />
        <Route path="/signup" element={<Signuppage />} />
        <Route path="/login" element={<Loginpage />} />
        <Route path="/verify-email" element={<VerifyEmailpage />} />
        <Route path="/forgot-password" element={<ForgotPasswordpage />} />
        <Route path="/reset-password" element={<ResetPasswordpage />} />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chatpage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DefaultChatpage />} />
          <Route path=":id" element={<ChatWindow />} />
        </Route>
        <Route path="*" element={<Errorpage />} />
      </Routes>
    </main>
  )
}

export default App
