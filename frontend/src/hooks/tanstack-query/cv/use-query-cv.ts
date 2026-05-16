import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

import { handleApiError } from '@/core/helpers/error-handler'
import toastifyCommon from '@/core/lib/toastify-common'
import { cvApi } from '@/core/services/cv.service'
import { type CvPayload, type CvRecord } from '@/models/cv/types'

const CV_QUERY_KEYS = {
  all: ['cv'] as const,
  options: () => [...CV_QUERY_KEYS.all, 'options'] as const,
  detail: (cvId: string) => [...CV_QUERY_KEYS.all, 'detail', cvId] as const
}

export const useDisabilityOptions = () => {
  return useQuery({
    queryKey: CV_QUERY_KEYS.options(),
    queryFn: cvApi.getDisabilityOptions,
    staleTime: 15 * 60 * 1000
  })
}

export const useCvDetail = (cvId?: string) => {
  return useQuery({
    queryKey: CV_QUERY_KEYS.detail(cvId || 'missing'),
    queryFn: () => cvApi.getCvDetail(cvId || ''),
    enabled: Boolean(cvId)
  })
}

export const useCreateCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (payload: CvPayload) => cvApi.createCv(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: CV_QUERY_KEYS.all })
      toastifyCommon.success('CV submitted successfully')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toastifyCommon.error(message || 'Failed to submit CV')
    }
  })
}

export const useUpdateCv = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ cvId, payload }: { cvId: string; payload: CvPayload }) => cvApi.updateCv(cvId, payload),
    onSuccess: async (record: CvRecord) => {
      await queryClient.invalidateQueries({ queryKey: CV_QUERY_KEYS.detail(record.id) })
      await queryClient.invalidateQueries({ queryKey: CV_QUERY_KEYS.all })
      toastifyCommon.success('CV updated successfully')
    },
    onError: (error) => {
      const { message } = handleApiError(error)
      toastifyCommon.error(message || 'Failed to update CV')
    }
  })
}

export const useUploadCvAvatar = () => {
  return useMutation({
    mutationFn: (file: File) => cvApi.uploadAvatar(file),
    onError: (error) => {
      const { message } = handleApiError(error)
      toastifyCommon.error(message || 'Failed to upload avatar')
    }
  })
}

export const useValidateCvPreview = () => {
  return useMutation({
    mutationFn: (payload: CvPayload) => cvApi.validatePreview(payload),
    onError: (error) => {
      const { message } = handleApiError(error)
      toastifyCommon.error(message || 'Failed to preview CV')
    }
  })
}
