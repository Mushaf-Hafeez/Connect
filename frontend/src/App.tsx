import { Route, Routes } from "react-router-dom"

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

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Homepage />} />
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
        />
        <Route path="*" element={<Errorpage />} />
      </Routes>
    </main>
  )
}

export default App
