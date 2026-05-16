export interface CvSelectOption {
  id: string
  label: string
  description?: string
}

export interface DisabilityOptionsResponse {
  statuses: CvSelectOption[]
  genders: CvSelectOption[]
  disabilityTypes: CvSelectOption[]
  disabilityLevels: CvSelectOption[]
  workTimes: CvSelectOption[]
  workModes: CvSelectOption[]
  softSkillOptions: CvSelectOption[]
  hardSkillOptions: CvSelectOption[]
  workConditions: CvSelectOption[]
  equipment: CvSelectOption[]
  certifications: CvSelectOption[]
}

export interface WorkExperienceItem {
  companyName: string
  jobTitle: string
  contributionStart: string
  contributionEnd: string
  workTime: string
  workMode: string
  experience: string
  isCurrent?: boolean
}

export interface CvPayload {
  avatarUrl: string
  fullName: string
  birthday: string
  address: string
  gender: string
  phone: string
  email: string
  disabilityStatus: string
  disabilityTypes: string[]
  disabilityLevel: string
  supportNeeds: string
  workExperiences: WorkExperienceItem[]
  experience?: string
  companyName?: string
  jobTitle?: string
  contributionStart?: string
  contributionEnd?: string
  workTime?: string
  workMode?: string
  education: string
  schoolName: string
  major: string
  achievement: string
  educationStart: string
  educationEnd: string
  certifications: string
  softSkills: string
  hardSkills: string
  careerGoals: string
  workConditions: string[]
  availableEquipment: string[]
  audioReviewUrl?: string
}

export interface CvRecord extends CvPayload {
  id: string
  status: 'draft' | 'submitted' | 'reviewed'
  updatedAt: string
  previewScore: number
}

export interface CvPreviewSection {
  label: string
  value: string
}

export interface CvPreviewResponse {
  completenessScore: number
  summary: string
  warnings: string[]
  sections: CvPreviewSection[]
}

export interface UploadAvatarResponse {
  avatarUrl: string
}
