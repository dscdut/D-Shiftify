import { UserRole } from "../type/user.types"

export interface User {
  id: string
  email: string
  full_name: string
  avatar?: string
  role: UserRole
  created_at: string
  updated_at: string
}

export interface UserProfile extends User {
  phone?: string
  address?: string
  bio?: string
}

export interface UserResponseType {
  id: string
  name: string
  email: string
  role: string
}
