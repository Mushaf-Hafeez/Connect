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

interface EmailVerificationData {
  email: string
  emailVerificationToken: string
}

interface ForgotPasswordData {
  email: string
}

interface ResetPasswordData {
  email: string
  resetPasswordToken: string
  password: string
  confirmPassword: string
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

// verifyEmail function
export const verifyEmail = (data: EmailVerificationData) => {
  const response = api.put("/auth/verify-email", data)
  return response
}

// forgotPassword function
export const forgotPassword = (data: ForgotPasswordData) => {
  const response = api.put("/auth/forgot-password", data)
  return response
}

// resetPassword function
export const resetPassword = (data: ResetPasswordData) => {
  const response = api.put("/auth/reset-password", data)
  return response
}
