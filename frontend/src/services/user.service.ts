import { api } from "./axios"

// search user function
export const searchUser = async (username: string) => {
  const response = await api.get(`/users/search?username=${username}`)
  return response
}

// function to update the profile pic
export const updateProfilePic = async (data: FormData) => {
  const response = await api.put("/users/update-profile", data)
  return response
}
