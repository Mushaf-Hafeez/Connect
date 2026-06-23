import { api } from "./axios"

// send friend request function
export const sendFriendRequest = async (userId: string) => {
  const response = await api.post(`/friends/request/${userId}`)
  return response
}
