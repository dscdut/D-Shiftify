import { type FormEvent } from 'react'

import { Mic, Volume2 } from 'lucide-react'

interface MessageInputProps {
  value: string
  isListening: boolean
  onChange: (value: string) => void
  onSubmit: () => void
  onStartSpeechInput: () => void
  onReadDraft: () => void
}

export default function MessageInput({
  value,
  isListening,
  onChange,
  onSubmit,
  onStartSpeechInput,
  onReadDraft
}: MessageInputProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit()
  }

  return (
    <form
      aria-label='Send chat message'
      onSubmit={handleSubmit}
      className='fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t-2 border-black bg-gray-100 px-4 py-4'
    >
      <label htmlFor='chat-message' className='sr-only'>
        Type your message
      </label>

      <div className='flex items-center gap-2'>
        <input
          id='chat-message'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          aria-label='Message input'
          placeholder='Type message'
          className='min-h-12 min-w-0 flex-1 border-2 border-black bg-white px-4 text-lg font-bold text-black placeholder:text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        />

        <button
          type='button'
          aria-label={isListening ? 'Stop speech to text input' : 'Start speech to text input'}
          onClick={onStartSpeechInput}
          className='flex min-h-12 min-w-12 items-center justify-center border-2 border-black bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <Mic aria-hidden='true' size={22} />
        </button>

        <button
          type='button'
          aria-label='Read typed message aloud'
          onClick={onReadDraft}
          className='flex min-h-12 min-w-12 items-center justify-center border-2 border-black bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <Volume2 aria-hidden='true' size={22} />
        </button>
      </div>

      <button
        type='submit'
        aria-label='Send message'
        className='mt-3 min-h-12 w-full bg-black px-4 py-3 text-lg font-black uppercase text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
      >
        Send
      </button>
    </form>
  )
}
