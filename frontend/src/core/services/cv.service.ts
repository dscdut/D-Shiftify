import { type AxiosInstance } from 'axios'

import config from '@/core/configs/env'
import axiosClient from '@/core/services/axios-client'
import {
  type CvPayload,
  type CvPreviewResponse,
  type CvRecord,
  type DisabilityOptionsResponse,
  type UploadAvatarResponse
} from '@/models/interface/cv.interfaces'
import { mockCvRecord, mockDisabilityOptions } from '@/_mocks/data-cv.mock'

const API_CV_URL = '/cv'
const API_DISABILITY_OPTIONS_URL = '/cv/disability-options'
const API_UPLOAD_AVATAR_URL = '/uploads'
const API_PREVIEW_CV_URL = '/cv/preview'
const MOCK_DELAY_IN_MS = 450

const withMockDelay = async <T>(data: T): Promise<T> => {
  await new Promise((resolve) => {
    window.setTimeout(resolve, MOCK_DELAY_IN_MS)
  })

  return data
}

const countCompletedFields = (payload: CvPayload) => {
  const importantFields = [
    payload.fullName,
    payload.disabilityStatus,
    payload.email || payload.phone,
    payload.experience,
    payload.education || payload.schoolName || payload.major,
    payload.hardSkills,
    payload.softSkills,
    payload.careerGoals,
    payload.supportNeeds
  ]

  return importantFields.filter((value) => (value || '').trim().length > 0).length
}

const createMockPreview = (payload: CvPayload): CvPreviewResponse => {
  const completedFields = countCompletedFields(payload)
  const completenessScore = Math.round((completedFields / 9) * 100)
  const warnings = [
    payload.email || payload.phone ? '' : 'Vui lòng bổ sung ít nhất một thông tin liên hệ.',
    payload.experience ? '' : 'Bổ sung kinh nghiệm để hồ sơ nổi bật hơn.',
    payload.hardSkills ? '' : 'Bổ sung kỹ năng cứng để tăng khả năng phù hợp.'
  ].filter(Boolean)

  return {
    completenessScore,
    summary: `${payload.fullName || 'Ứng viên'} đang xác nhận hồ sơ năng lực.`,
    warnings,
    sections: [
      { label: 'Mục tiêu nghề nghiệp', value: payload.careerGoals || '' },
      { label: 'Kinh nghiệm', value: payload.experience || '' },
      { label: 'Học vấn', value: payload.education || [payload.schoolName, payload.major].filter(Boolean).join(' - ') || '' },
      { label: 'Hỗ trợ cần thiết', value: payload.supportNeeds || '' }
    ].filter((section) => section.value.trim().length > 0)
  }
}

export type CvApi = {
  getDisabilityOptions: () => Promise<DisabilityOptionsResponse>
  getCvDetail: (cvId: string) => Promise<CvRecord>
  createCv: (payload: CvPayload) => Promise<CvRecord>
  updateCv: (cvId: string, payload: CvPayload) => Promise<CvRecord>
  uploadAvatar: (file: File) => Promise<UploadAvatarResponse>
  validatePreview: (payload: CvPayload) => Promise<CvPreviewResponse>
}

export const createCvApi = (client: AxiosInstance): CvApi => ({
  getDisabilityOptions() {
    if (config.useMockData) {
      return withMockDelay(mockDisabilityOptions)
    }

    return client.get(API_DISABILITY_OPTIONS_URL) as Promise<DisabilityOptionsResponse>
  },
  getCvDetail(cvId) {
    if (config.useMockData) {
      return withMockDelay({
        ...mockCvRecord,
        id: cvId
      })
    }

    return client.get(`${API_CV_URL}/${cvId}`) as Promise<CvRecord>
  },
  createCv(payload) {
    if (config.useMockData) {
      return withMockDelay({
        ...payload,
        id: 'mock-cv-new',
        status: 'submitted',
        updatedAt: new Date().toISOString(),
        previewScore: createMockPreview(payload).completenessScore
      })
    }

    return client.post(API_CV_URL, payload) as Promise<CvRecord>
  },
  updateCv(cvId, payload) {
    if (config.useMockData) {
      return withMockDelay({
        ...payload,
        id: cvId,
        status: 'submitted',
        updatedAt: new Date().toISOString(),
        previewScore: createMockPreview(payload).completenessScore
      })
    }

    return client.put(`${API_CV_URL}/${cvId}`, payload) as Promise<CvRecord>
  },
  async uploadAvatar(file) {
    if (config.useMockData) {
      return withMockDelay({
        avatarUrl: URL.createObjectURL(file)
      })
    }

    const formData = new FormData()
    formData.append('file', file)

    const res = (await client.post(API_UPLOAD_AVATAR_URL, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })) as { avatarUrl?: string; url?: string }

    return { avatarUrl: res.avatarUrl || res.url || '' }
  },
  validatePreview(payload) {
    if (config.useMockData) {
      return withMockDelay(createMockPreview(payload))
    }

    return client.post(API_PREVIEW_CV_URL, payload) as Promise<CvPreviewResponse>
  }
})

export const cvApi = createCvApi(axiosClient)
