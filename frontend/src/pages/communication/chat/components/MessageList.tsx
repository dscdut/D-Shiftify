import { type ChatMessage } from '../types'

import MessageBubble from './MessageBubble'

interface MessageListProps {
  messages: ChatMessage[]
  hasAudioControls: boolean
  onReadMessage: (message: ChatMessage) => void
}

export default function MessageList({ messages, hasAudioControls, onReadMessage }: MessageListProps) {
  return (
    <section
      aria-label='Chat history'
      aria-live='polite'
      className={`flex-1 space-y-5 overflow-y-auto px-4 pt-36 ${hasAudioControls ? 'pb-64' : 'pb-44'}`}
    >
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} onReadMessage={onReadMessage} />
      ))}
    </section>
  )
}
