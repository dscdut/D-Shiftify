import { type SpeechRecognitionConstructor } from './types'

export const getSpeechRecognition = () => {
  if (typeof window === 'undefined') {
    return null
  }

  const speechWindow = window as Window & {
    SpeechRecognition?: SpeechRecognitionConstructor
    webkitSpeechRecognition?: SpeechRecognitionConstructor
  }

  return speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition || null
}

export const canUseSpeechSynthesis = () => typeof window !== 'undefined' && 'speechSynthesis' in window
