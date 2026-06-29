import { api } from "./axios"

// getConversations function
export const getConversations = async () => {
  const response = await api.get("/conversations")
  return response
}
