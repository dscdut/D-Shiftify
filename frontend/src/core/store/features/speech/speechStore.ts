import { create } from 'zustand'

export interface SpeechState {
  isListening: boolean
  activeVoiceLabel: string
  cancelListening: (() => void) | null
  setIsListening: (isListening: boolean, label?: string, cancelFn?: (() => void) | null) => void
  abortListening: () => void
}

export const useSpeechStore = create<SpeechState>((set) => ({
  isListening: false,
  activeVoiceLabel: '',
  cancelListening: null,
  setIsListening: (isListening, label = '', cancelFn = null) => {
    set({ isListening, activeVoiceLabel: label, cancelListening: cancelFn })
  },
  abortListening: () => {
    set((state) => {
      if (state.cancelListening) {
        state.cancelListening()
      }
      return { isListening: false, activeVoiceLabel: '', cancelListening: null }
    })
  }
}))
