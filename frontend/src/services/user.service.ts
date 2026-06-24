import { api } from "./axios"

// search user function
export const searchUser = async (username: string) => {
  const response = await api.get(`/users/search?username=${username}`)
  return response
}
