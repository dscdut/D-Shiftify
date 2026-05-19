import { User } from "./user.interfaces"

export interface TokenResponse {
  access_token: string
  refresh_token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  confirm_password: string
}

export interface AuthState {
  isAuthenticated: boolean
  user: User | null
  loading: boolean
}

export interface APIResponse<T> {
  data: T
  message: string
  status: number
  success?: boolean
}

export interface LoginApiResponse {
  data: LoginResponse
  message: string
}

export interface LoginResponse {
  user: { id: string; name: string; email: string; role: string }
  access_token: string
  refresh_token: string
}

export interface Account {
  email?: string
  password?: string
  confirmPassword?: string
  name?: string
  phone?: string
}

export interface RegisterReponse {
  name: string
  email: string
  password: string
  confirmPassword: string
  phone?: string
}

export interface VerifyEmailReq {
  email: string
  verificationCode: string
}

export interface VerifyEmailRes {
  message: string
}

export interface RememberMeData {
  email: string
  password: string
  isRemembered: boolean
}
