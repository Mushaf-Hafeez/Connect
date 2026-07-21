import { Toaster } from "react-hot-toast"
import { useTheme } from "@/components/theme-provider"

const toastTheme = {
  light: {
    background: "#fff",
    color: "#111",
  },
  dark: {
    background: "#363636",
    color: "#fff",
  },
}

const ToastProvider = () => {
  const { theme } = useTheme()

  return (
    <Toaster
      toastOptions={{
        style: toastTheme[theme === "light" ? "light" : "dark"],
      }}
    />
  )
}

export default ToastProvider
