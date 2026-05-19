import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

import { type CvFormValues } from '@/core/zod/cv.zod'
import { type CvPreviewResponse } from '@/models/interface/cv.interfaces'

export type CvDraftMode = 'create' | 'edit'

export interface CvDraftState {
  mode: CvDraftMode | null
  cvId: string | null
  formValues: CvFormValues | null
  preview: CvPreviewResponse | null
  audioUrl: string
  setDraft: (payload: {
    mode: CvDraftMode
    cvId?: string | null
    formValues: CvFormValues
    preview?: CvPreviewResponse | null
    audioUrl?: string
  }) => void
  setFormValues: (formValues: CvFormValues) => void
  setPreview: (preview: CvPreviewResponse | null) => void
  setAudioUrl: (audioUrl: string) => void
  clearDraft: () => void
}

const initialState = {
  mode: null,
  cvId: null,
  formValues: null,
  preview: null,
  audioUrl: ''
}

export const useCvDraftStore = create<CvDraftState>()(
  persist(
    (set) => ({
      ...initialState,
      setDraft: ({ mode, cvId = null, formValues, preview = null, audioUrl = '' }) => {
        set({
          mode,
          cvId,
          formValues,
          preview,
          audioUrl
        })
      },
      setFormValues: (formValues) => {
        set({ formValues })
      },
      setPreview: (preview) => {
        set({ preview })
      },
      setAudioUrl: (audioUrl) => {
        set({ audioUrl })
      },
      clearDraft: () => {
        set(initialState)
      }
    }),
    {
      name: 'cv-draft-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        mode: state.mode,
        cvId: state.cvId,
        formValues: state.formValues,
        preview: state.preview
      })
    }
  )
)
