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
export const getMessages = async (
  conversationId: string,
  page: number = 1,
  take: number = 20
) => {
  const response = await api.get(
    `/conversations/${conversationId}/messages?page=${page}&take=${take}`
  )
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

// editMessage function
export const editMessage = async (
  conversationId: string,
  messageId: string,
  text: string
) => {
  const response = await api.put(
    `/conversations/${conversationId}/messages/${messageId}`,
    { text }
  )
  return response
}

// deleteMessage function
export const deleteMessage = async (
  conversationId: string,
  messageId: string
) => {
  const response = await api.delete(
    `conversations/${conversationId}/messages/${messageId}`
  )
  return response
}
