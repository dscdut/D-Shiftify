import { type CvSelectOption } from '@/models/cv/types'

export const FALLBACK_STATUSES: CvSelectOption[] = [
  { id: 'complete_visual_impairment', label: 'Khiếm thị hoàn toàn' },
  { id: 'partial_visual_impairment', label: 'Khiếm thị không hoàn toàn' },
  { id: 'other', label: 'Khác...' }
]

export const FALLBACK_GENDERS: CvSelectOption[] = [
  { id: 'male', label: 'Nam' },
  { id: 'female', label: 'Nữ' }
]

export const FALLBACK_WORK_TIMES: CvSelectOption[] = [
  { id: 'full_time', label: 'Toàn thời gian' },
  { id: 'part_time', label: 'Bán thời gian' },
  { id: 'flexible', label: 'Linh hoạt' }
]

export const FALLBACK_WORK_MODES: CvSelectOption[] = [
  { id: 'online', label: 'Trực tuyến' },
  { id: 'onsite', label: 'Trực tiếp' },
  { id: 'hybrid', label: 'Kết hợp' }
]

export const FALLBACK_SOFT_SKILLS: CvSelectOption[] = [
  { id: 'communication', label: 'Giao tiếp' },
  { id: 'teamwork', label: 'Làm việc nhóm' },
  { id: 'problem_solving', label: 'Giải quyết vấn đề' }
]

export const FALLBACK_HARD_SKILLS: CvSelectOption[] = [
  { id: 'office', label: 'Tin học văn phòng' },
  { id: 'customer_service', label: 'Chăm sóc khách hàng' },
  { id: 'data_entry', label: 'Nhập liệu' }
]

export const FALLBACK_WORK_CONDITIONS: CvSelectOption[] = [
  { id: 'remote', label: 'Làm việc từ xa' },
  { id: 'flexible_hours', label: 'Thời gian linh hoạt' },
  { id: 'accessible_workplace', label: 'Không gian làm việc dễ tiếp cận' },
  { id: 'quiet_space', label: 'Không gian yên tĩnh' }
]

export const FALLBACK_EQUIPMENT: CvSelectOption[] = [
  { id: 'screen_reader', label: 'Trình đọc màn hình' },
  { id: 'captioning', label: 'Phụ đề trực tiếp' },
  { id: 'ergonomic_desk', label: 'Bàn ghế công thái học' },
  { id: 'assistive_keyboard', label: 'Bàn phím hỗ trợ' }
]

export const FALLBACK_CERTIFICATIONS: CvSelectOption[] = [
  { id: 'toeic', label: 'Chứng chỉ ngoại ngữ (TOEIC/IELTS)' },
  { id: 'mos', label: 'Chứng chỉ tin học (MOS/IC3)' },
  { id: 'vocational', label: 'Chứng chỉ nghề' }
]
