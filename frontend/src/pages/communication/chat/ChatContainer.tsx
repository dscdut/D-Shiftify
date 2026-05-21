import { useMemo, useRef, useState } from 'react'

import AudioControlBar from './components/AudioControlBar'
import ChatHeader from './components/ChatHeader'
import MessageInput from './components/MessageInput'
import MessageList from './components/MessageList'
import { getRoleLabel } from './role-labels'
import { canUseSpeechSynthesis, getSpeechRecognition } from './speech'
import { type AudioDirection, type ChatMessage, type MockConversation, type SpeechRecognitionInstance } from './types'

interface ChatContainerProps {
  conversation: MockConversation
  onBackToList: () => void
}

export default function ChatContainer({ conversation, onBackToList }: ChatContainerProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(conversation.messages)
  const [draft, setDraft] = useState('')
  const [activeMessageId, setActiveMessageId] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)

  const activeMessage = useMemo(
    () => messages.find((message) => message.id === activeMessageId) || null,
    [activeMessageId, messages]
  )

  const readText = (text: string, messageId?: string) => {
    const cleanText = text.trim()

    if (!cleanText || !canUseSpeechSynthesis()) {
      return
    }

    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.rate = 0.9
    utterance.pitch = 1

    utterance.onstart = () => {
      setIsPlaying(true)
      if (messageId) {
        setActiveMessageId(messageId)
      }
    }

    utterance.onend = () => setIsPlaying(false)
    utterance.onerror = () => setIsPlaying(false)

    window.speechSynthesis.speak(utterance)
  }

  const handleReadMessage = (message: ChatMessage) => {
    readText(message.text, message.id)
  }

  const togglePlayback = () => {
    if (!activeMessage || !canUseSpeechSynthesis()) {
      return
    }

    if (isPlaying) {
      window.speechSynthesis.pause()
      setIsPlaying(false)
      return
    }

    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume()
      setIsPlaying(true)
      return
    }

    readText(activeMessage.text, activeMessage.id)
  }

  const repeatActiveMessage = () => {
    if (activeMessage) {
      readText(activeMessage.text, activeMessage.id)
    }
  }

  const readAdjacentMessage = (direction: AudioDirection) => {
    if (!activeMessageId) {
      return
    }

    const currentIndex = messages.findIndex((message) => message.id === activeMessageId)
    const nextIndex = direction === 'previous' ? currentIndex - 1 : currentIndex + 1
    const nextMessage = messages[nextIndex]

    if (nextMessage) {
      readText(nextMessage.text, nextMessage.id)
    }
  }

  const handleSpeechInput = () => {
    const Recognition = getSpeechRecognition()

    if (!Recognition) {
      readText('Speech input is not available in this browser.')
      return
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
      return
    }

    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      const transcript = Array.from({ length: event.results.length })
        .map((_, index) => event.results[index][0].transcript)
        .join(' ')
        .trim()

      if (transcript) {
        setDraft((currentDraft) => (currentDraft ? `${currentDraft} ${transcript}` : transcript))
      }
    }

    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)

    recognitionRef.current = recognition
    setIsListening(true)
    recognition.start()
  }

  const sendMessage = () => {
    const cleanDraft = draft.trim()

    if (!cleanDraft) {
      return
    }

    const sentMessage: ChatMessage = {
      id: `message-${Date.now()}`,
      sender: 'candidate',
      text: cleanDraft,
      timestamp: new Intl.DateTimeFormat('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date()),
      hasAudio: true
    }

    setMessages((currentMessages) => [...currentMessages, sentMessage])
    setDraft('')
  }

  const participantLabel = getRoleLabel(conversation.participantRole)

  return (
    <main className='min-h-screen w-full bg-white text-black'>
      <section className='mx-auto flex min-h-screen w-full max-w-md flex-col bg-white'>
        <ChatHeader
          title={conversation.title}
          participantLabel={participantLabel}
          onBack={onBackToList}
          onReadTitle={() => readText(`D-SHIFTIFY chat. ${conversation.title}. ${participantLabel}.`)}
        />

        <MessageList messages={messages} hasAudioControls={Boolean(activeMessage)} onReadMessage={handleReadMessage} />

        {activeMessage && (
          <AudioControlBar
            isPlaying={isPlaying}
            onPrevious={() => readAdjacentMessage('previous')}
            onTogglePlayback={togglePlayback}
            onNext={() => readAdjacentMessage('next')}
            onRepeat={repeatActiveMessage}
          />
        )}

        <MessageInput
          value={draft}
          isListening={isListening}
          onChange={setDraft}
          onSubmit={sendMessage}
          onStartSpeechInput={handleSpeechInput}
          onReadDraft={() => readText(draft)}
        />
      </section>
    </main>
  )
}
