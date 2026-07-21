import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { BrowserRouter } from "react-router-dom"
import ToastProvider from "./components/custom/ToastProvider.tsx"

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <ThemeProvider>
      <App />
      <ToastProvider />
    </ThemeProvider>
  </BrowserRouter>
)
