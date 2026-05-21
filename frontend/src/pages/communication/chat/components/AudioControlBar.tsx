import { Pause, Play, Repeat, SkipBack, SkipForward } from 'lucide-react'

interface AudioControlBarProps {
  isPlaying: boolean
  onPrevious: () => void
  onTogglePlayback: () => void
  onNext: () => void
  onRepeat: () => void
}

export default function AudioControlBar({
  isPlaying,
  onPrevious,
  onTogglePlayback,
  onNext,
  onRepeat
}: AudioControlBarProps) {
  return (
    <section
      aria-label='Audio message controls'
      className='fixed bottom-28 left-1/2 z-30 w-full max-w-md -translate-x-1/2 border-t-2 border-black bg-white px-4 py-3'
    >
      <div className='flex items-center justify-between gap-2'>
        <button
          type='button'
          aria-label='Read previous message'
          onClick={onPrevious}
          className='flex min-h-11 min-w-11 items-center justify-center bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <SkipBack aria-hidden='true' size={24} />
        </button>

        <button
          type='button'
          aria-label={isPlaying ? 'Pause current message' : 'Play current message'}
          onClick={onTogglePlayback}
          className='flex min-h-12 min-w-12 items-center justify-center bg-black p-3 text-white focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          {isPlaying ? <Pause aria-hidden='true' size={26} /> : <Play aria-hidden='true' size={26} />}
        </button>

        <button
          type='button'
          aria-label='Read next message'
          onClick={onNext}
          className='flex min-h-11 min-w-11 items-center justify-center bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <SkipForward aria-hidden='true' size={24} />
        </button>

        <button
          type='button'
          aria-label='Repeat current message'
          onClick={onRepeat}
          className='flex min-h-11 min-w-11 items-center justify-center bg-white p-3 text-black focus:outline-none focus-visible:ring-4 focus-visible:ring-black'
        >
          <Repeat aria-hidden='true' size={24} />
        </button>
      </div>
    </section>
  )
}
