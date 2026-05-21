export type SenderRole = 'candidate' | 'recruiter' | 'admin' | 'training_facility'

export type ConversationRole = SenderRole

export type MockConversation = {
  id: string
  contactName: string
  title: string
  participantRole: ConversationRole
  messages: ChatMessage[]
}

export type ChatMessage = {
  id: string
  sender: SenderRole
  text: string
  timestamp: string
  hasAudio?: boolean
}

export type AudioDirection = 'previous' | 'next'

export type SpeechRecognitionConstructor = new () => SpeechRecognitionInstance

export type SpeechRecognitionInstance = {
  continuous: boolean
  interimResults: boolean
  lang: string
  onresult: ((event: SpeechRecognitionResultEvent) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
  start: () => void
  stop: () => void
}

export type SpeechRecognitionResultEvent = {
  results: {
    length: number
    [index: number]: {
      isFinal: boolean
      [index: number]: {
        transcript: string
      }
    }
  }
}
