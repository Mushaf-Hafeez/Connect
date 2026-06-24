import { api } from "./axios"

// send friend request function
export const sendFriendRequest = async (userId: string) => {
  const response = await api.post(`/friends/request/${userId}`)
  return response
}

// get pending requests
export const getPendingRequests = async () => {
  const response = await api.get("/friends/pending")
  return response
}

// acceptFriendRequest function
export const acceptFriendRequest = async (friendshipId: string) => {
  const response = await api.put(`/friends/accept/${friendshipId}`)
  return response
}

// rejectFriendRequest function
export const rejectFriendRequest = async (friendshipId: string) => {
  const response = await api.delete(`/friends/reject/${friendshipId}`)
  return response
}
