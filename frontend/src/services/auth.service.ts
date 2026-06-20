import { api } from "./axios"

interface LoginData {
  email: string
  password: string
}

interface SignupData {
  displayName: string
  username: string
  email: string
  password: string
  confirmPassword: string
}

interface emailVerificationData {
  email: string
  emailVerificationToken: string
}

// login function
export const login = (data: LoginData) => {
  const response = api.post("/auth/login", data)
  return response
}

// signup function
export const signup = (data: SignupData) => {
  const response = api.post("/auth/signup", data)
  return response
}

// signup function
export const verifyEmail = (data: emailVerificationData) => {
  const response = api.put("/auth/verify-email", data)
  return response
}
