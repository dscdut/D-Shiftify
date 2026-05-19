import { z } from 'zod'

const PHONE_PATTERN = /^[+()\d\s.-]{7,24}$/

const optionalText = (maxLength: number, label: string) =>
  z.string().trim().max(maxLength, `${label} không được vượt quá ${maxLength} ký tự`).default('')

export const WorkExperienceSchema = z.object({
  companyName: z.string().trim().min(1, 'Vui lòng nhập tên công ty/doanh nghiệp').max(180, 'Tên công ty/doanh nghiệp không được vượt quá 180 ký tự'),
  jobTitle: z.string().trim().min(1, 'Vui lòng nhập chức vụ').max(140, 'Chức vụ không được vượt quá 140 ký tự'),
  contributionStart: z.string().trim().min(1, 'Vui lòng chọn thời gian bắt đầu làm việc'),
  contributionEnd: z.string().trim().default(''),
  workTime: z.string().trim().min(1, 'Vui lòng chọn thời gian làm việc'),
  workMode: z.string().trim().min(1, 'Vui lòng chọn hình thức làm việc'),
  experience: z.string().trim().min(1, 'Vui lòng nhập kinh nghiệm làm việc').max(2000, 'Kinh nghiệm làm việc không được vượt quá 2000 ký tự'),
  isCurrent: z.boolean().default(false)
}).refine((data) => data.isCurrent || data.contributionEnd.trim().length > 0, {
  message: 'Vui lòng chọn thời gian kết thúc hoặc đánh dấu Đang làm việc',
  path: ['contributionEnd']
})

export const CvSchema = z.object({
  avatarUrl: z.string().trim().default(''),
  fullName: z.string().trim().min(1, 'Vui lòng nhập họ và tên').max(120, 'Họ và tên không được vượt quá 120 ký tự'),
  birthday: z.string().trim().min(1, 'Vui lòng chọn ngày tháng năm sinh').max(20, 'Ngày sinh không được vượt quá 20 ký tự'),
  address: z.string().trim().min(1, 'Vui lòng nhập địa chỉ').max(240, 'Địa chỉ không được vượt quá 240 ký tự'),
  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Vui lòng chọn giới tính' })
  }),
  phone: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập số điện thoại')
    .max(20, 'Số điện thoại không được vượt quá 20 ký tự')
    .refine((val) => PHONE_PATTERN.test(val), 'Số điện thoại không hợp lệ'),
  email: z
    .string()
    .trim()
    .min(1, 'Vui lòng nhập địa chỉ email')
    .email('Vui lòng nhập địa chỉ email hợp lệ'),
  disabilityStatus: z.string().trim().min(1, 'Vui lòng chọn tình trạng khuyết tật'),
  disabilityTypes: z.array(z.string()).default([]),
  disabilityLevel: optionalText(80, 'Mức độ khuyết tật'),
  supportNeeds: optionalText(1000, 'Nhu cầu hỗ trợ'),
  workExperiences: z.array(WorkExperienceSchema).min(1, 'Vui lòng thêm ít nhất một kinh nghiệm làm việc'),
  experience: z.string().trim().max(2000).optional(),
  companyName: z.string().trim().max(180).optional(),
  jobTitle: z.string().trim().max(140).optional(),
  contributionStart: z.string().trim().optional(),
  contributionEnd: z.string().trim().optional(),
  workTime: z.string().trim().optional(),
  workMode: z.string().trim().optional(),
  education: optionalText(1500, 'Học vấn'),
  schoolName: z.string().trim().max(180, 'Tên trường không được vượt quá 180 ký tự').optional(),
  major: z.string().trim().max(140, 'Chuyên ngành không được vượt quá 140 ký tự').optional(),
  achievement: optionalText(1000, 'Thành tựu'),
  educationStart: z.string().trim().min(1, 'Vui lòng chọn thời gian bắt đầu học'),
  educationEnd: z.string().trim().min(1, 'Vui lòng chọn thời gian kết thúc học'),
  certifications: optionalText(1000, 'Chứng chỉ'),
  softSkills: optionalText(1000, 'Kỹ năng mềm'),
  hardSkills: optionalText(1000, 'Kỹ năng cứng'),
  careerGoals: z.string().trim().min(1, 'Vui lòng nhập mục tiêu nghề nghiệp').max(1000, 'Mục tiêu nghề nghiệp không được vượt quá 1000 ký tự'),
  workConditions: z.array(z.string()).default([]),
  availableEquipment: z.array(z.string()).default([]),
  audioReviewUrl: optionalText(1000, 'URL audio review').optional()
})

export type CvFormValues = z.infer<typeof CvSchema>

export const DEFAULT_CV_FORM_VALUES: CvFormValues = {
  avatarUrl: '',
  fullName: '',
  birthday: '',
  address: '',
  gender: 'male',
  phone: '',
  email: '',
  disabilityStatus: 'other',
  disabilityTypes: [],
  disabilityLevel: '',
  supportNeeds: '',
  workExperiences: [
    {
      companyName: '',
      jobTitle: '',
      contributionStart: '',
      contributionEnd: '',
      workTime: '',
      workMode: '',
      experience: '',
      isCurrent: false
    }
  ],
  experience: '',
  companyName: '',
  jobTitle: '',
  contributionStart: '',
  contributionEnd: '',
  workTime: '',
  workMode: '',
  education: '',
  schoolName: '',
  major: '',
  achievement: '',
  educationStart: '',
  educationEnd: '',
  certifications: '',
  softSkills: '',
  hardSkills: '',
  careerGoals: '',
  workConditions: [],
  availableEquipment: [],
  audioReviewUrl: ''
}
