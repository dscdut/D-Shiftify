import { ArrowLeft, Volume2 } from 'lucide-react'

interface ChatHeaderProps {
  title: string
  participantLabel: string
  onBack: () => void
  onReadTitle: () => void
}

export default function ChatHeader({ title, participantLabel, onBack, onReadTitle }: ChatHeaderProps) {
  return (
    <header className='fixed left-1/2 top-0 z-40 w-full max-w-md -translate-x-1/2 border-b-2 border-black bg-white px-4 py-4'>
      <div className='flex items-center justify-between gap-3'>
        <button
          type='button'
          aria-label='Quay lại danh sách chat'
          onClick={onBack}
          className='flex min-h-11 min-w-11 items-center justify-center border-2 border-black bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <ArrowLeft aria-hidden='true' size={24} />
        </button>

        <div className='min-w-0 flex-1'>
          <p className='text-base font-black uppercase leading-none text-black'>D-SHIFTIFY</p>
          <h1 className='mt-2 truncate text-xl font-black uppercase leading-tight text-black'>{title}</h1>
          <p className='mt-1 text-base font-bold text-black'>{participantLabel}</p>
        </div>

        <button
          type='button'
          aria-label='Read chat title aloud'
          onClick={onReadTitle}
          className='flex min-h-11 min-w-11 items-center justify-center border-2 border-black bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <Volume2 aria-hidden='true' size={24} />
        </button>
      </div>
    </header>
  )
}
