import { type ConversationRole, type SenderRole } from './types'

const roleLabels: Record<SenderRole, string> = {
  candidate: 'Candidate',
  recruiter: 'Recruiter',
  admin: 'Admin',
  training_facility: 'Training Facility'
}

export const getRoleLabel = (role: ConversationRole | SenderRole) => roleLabels[role]
