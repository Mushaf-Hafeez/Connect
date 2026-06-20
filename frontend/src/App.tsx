import { Route, Routes } from "react-router-dom"

// importing components
import Homepage from "./pages/Homepage"
import Signup from "./pages/Signup"
import Login from "./pages/Login"
import Errorpage from "./pages/Errorpage"
import VerifyEmailpage from "./pages/VerifyEmailpage"

const App = () => {
  return (
    <main>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmailpage />} />
        <Route path="*" element={<Errorpage />} />
      </Routes>
    </main>
  )
}

export default App
