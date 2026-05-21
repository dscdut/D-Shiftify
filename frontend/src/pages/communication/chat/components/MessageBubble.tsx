import { Volume2 } from 'lucide-react'

import { getRoleLabel } from '../role-labels'
import { type ChatMessage } from '../types'

interface MessageBubbleProps {
  message: ChatMessage
  onReadMessage: (message: ChatMessage) => void
}

export default function MessageBubble({ message, onReadMessage }: MessageBubbleProps) {
  const isCandidate = message.sender === 'candidate'
  const senderLabel = getRoleLabel(message.sender)

  return (
    <article className={`flex ${isCandidate ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`w-full max-w-[86%] rounded-md border-2 border-black p-4 ${
          isCandidate ? 'bg-black text-white' : 'bg-white text-black'
        }`}
      >
        <div className='flex items-start justify-between gap-3'>
          <div>
            <p className='text-base font-black uppercase leading-tight'>{senderLabel}</p>
            <p className='mt-3 text-lg leading-relaxed'>{message.text}</p>
          </div>

          {message.hasAudio && (
            <button
              type='button'
              aria-label={`Read ${senderLabel.toLowerCase()} message from ${message.timestamp} aloud`}
              onClick={() => onReadMessage(message)}
              className={`flex min-h-11 min-w-11 shrink-0 items-center justify-center border-2 p-3 focus:outline-none focus-visible:ring-4 ${
                isCandidate
                  ? 'border-white bg-black text-white focus-visible:ring-white'
                  : 'border-black bg-white text-black focus-visible:ring-black'
              }`}
            >
              <Volume2 aria-hidden='true' size={22} />
            </button>
          )}
        </div>

        <time className='mt-3 block text-base font-bold' dateTime={message.timestamp}>
          {message.timestamp}
        </time>
      </div>
    </article>
  )
}
