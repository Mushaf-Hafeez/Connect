import { api } from "./axios"

// login funtion
export const login = (data: { email: string; password: string }) => {
  const response = api.post("/auth/login", data)
  return response
}
