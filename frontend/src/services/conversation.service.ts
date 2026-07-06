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

// getMessages function
export const getMessages = async (conversationId: string) => {
  const response = await api.get(`/conversations/${conversationId}/messages`)
  return response
}

// sendMessage function
export const sendMessage = async (
  conversationId: string,
  formData: FormData
) => {
  const response = await api.post(
    `/conversations/${conversationId}/messages`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  )
  return response
}
