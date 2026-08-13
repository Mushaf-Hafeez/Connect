import { api } from "./axios"

export const getCallHistory = async () => {
  const response = await api.get("/calls")
  return response
}
