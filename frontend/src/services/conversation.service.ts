import { api } from "./axios"

// getConversations function
export const getConversations = async () => {
  const response = await api.get("/conversations")
  return response
}

// createConversation function
export const createConversation = async (userId: string) => {
  const response = await api.post(`/conversations/${userId}`)
  return response
}
