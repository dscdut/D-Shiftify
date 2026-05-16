import { startTransition, useCallback, useEffect, useRef, useState } from 'react'

import { Loader2, Mic } from 'lucide-react'

import toastifyCommon from '@/core/lib/toastify-common'
import { cn } from '@/core/lib/utils'
import { useSpeechStore } from '@/core/store/features/speech/speechStore'

interface SpeechAlternativeLike {
  transcript: string
}

interface SpeechResultLike {
  readonly length: number
  readonly [index: number]: SpeechAlternativeLike | undefined
}

interface SpeechResultListLike {
  readonly length: number
  readonly [index: number]: SpeechResultLike | undefined
}

interface SpeechRecognitionEventLike extends Event {
  readonly results: SpeechResultListLike
}

interface SpeechRecognitionLike {
  continuous: boolean
  interimResults: boolean
  lang: string
  start: () => void
  abort: () => void
  onresult: ((event: SpeechRecognitionEventLike) => void) | null
  onerror: (() => void) | null
  onend: (() => void) | null
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike

const collectSpeechTranscript = (results: SpeechResultListLike) => {
  const chunks: string[] = []

  for (let index = 0; index < results.length; index += 1) {
    const transcript = results[index]?.[0]?.transcript

    if (transcript) {
      chunks.push(transcript.trim())
    }
  }

  return chunks.join(' ').trim()
}

const useSpeechInput = (onResult: (value: string) => void, label: string = '') => {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null)
  const [localIsListening, setLocalIsListening] = useState(false)
  const { setIsListening } = useSpeechStore()

  const startListening = useCallback(() => {
    const speechWindow = window as Window & {
      SpeechRecognition?: SpeechRecognitionConstructor
      webkitSpeechRecognition?: SpeechRecognitionConstructor
    }
    const Recognition = speechWindow.SpeechRecognition || speechWindow.webkitSpeechRecognition

    if (!Recognition) {
      toastifyCommon.info('Trình duyệt chưa hỗ trợ nhập bằng giọng nói')
      return
    }

    const recognition = new Recognition()
    recognition.continuous = false
    recognition.interimResults = false
    recognition.lang = 'vi-VN'

    const abortFn = () => {
      recognition.abort()
      setLocalIsListening(false)
      setIsListening(false, '', null)
    }

    recognition.onresult = (event) => {
      const transcript = collectSpeechTranscript(event.results)

      if (transcript) {
        startTransition(() => {
          onResult(transcript)
        })
      }
      setLocalIsListening(false)
      setIsListening(false, '', null)
    }
    recognition.onerror = () => {
      setLocalIsListening(false)
      setIsListening(false, '', null)
      toastifyCommon.error('Không thể hoàn tất nhập giọng nói')
    }
    recognition.onend = () => {
      setLocalIsListening(false)
      setIsListening(false, '', null)
    }

    recognitionRef.current = recognition
    setLocalIsListening(true)
    setIsListening(true, label, abortFn)

    try {
      recognition.start()
    } catch {
      setLocalIsListening(false)
      setIsListening(false, '', null)
      toastifyCommon.error('Không thể bắt đầu nhập giọng nói')
    }
  }, [onResult, label, setIsListening])

  useEffect(() => {
    return () => {
      recognitionRef.current?.abort()
    }
  }, [])

  return {
    isListening: localIsListening,
    startListening
  }
}

export const VoiceButton = ({ label, onResult, compact = false }: { label: string; onResult: (value: string) => void; compact?: boolean }) => {
  const { isListening, startListening } = useSpeechInput(onResult, label)

  return (
    <button
      type='button'
      className={cn(
        'absolute right-2 top-1/2 flex -translate-y-1/2 items-center justify-center text-[#4E4E4E] transition hover:text-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004080]',
        compact ? 'h-7 w-7' : 'h-9 w-9'
      )}
      aria-label={isListening ? `Đang nghe ${label}` : `Nhập ${label} bằng giọng nói`}
      onClick={startListening}
    >
      {isListening ? <Loader2 className='h-4 w-4 animate-spin' /> : <Mic className='h-4 w-4' />}
    </button>
  )
}

export const VoiceListeningPopup = () => {
  const { isListening, activeVoiceLabel, abortListening } = useSpeechStore()

  if (!isListening) {
    return null
  }

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300'>
      <div className='relative w-11/12 max-w-md overflow-hidden rounded-2xl border border-white/20 bg-white/95 p-8 shadow-[0_25px_50px_rgba(0,64,128,0.25)] backdrop-blur-xl text-center animate-in fade-in zoom-in-95 duration-300'>
        <div className='absolute -left-16 -top-16 h-32 w-32 rounded-full bg-blue-100/50 blur-2xl' aria-hidden='true' />
        <div className='absolute -right-16 -bottom-16 h-32 w-32 rounded-full bg-blue-50/50 blur-2xl' aria-hidden='true' />

        <div className='relative flex flex-col items-center'>
          <div className='relative flex h-24 w-24 items-center justify-center mb-6'>
            <div className='absolute inset-0 rounded-full bg-[#004080]/10 animate-ping' />
            <div className='absolute inset-2 rounded-full bg-[#004080]/20 animate-pulse' />
            <div className='relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-tr from-[#004080] to-[#1A5590] text-white shadow-lg'>
              <Mic className='size-8 ' />
            </div>
          </div>

          <h3 className='text-xl font-extrabold uppercase tracking-wide text-primary mb-2'>Đang lắng nghe...</h3>
          <p className='text-sm text-slate-600 mb-8 max-w-xs leading-relaxed'>
            Hãy đọc thông tin cho trường <span className='font-bold text-primary underline decoration-[#004080]/30 underline-offset-4'>"{activeVoiceLabel || 'Văn bản'}"</span>. Hệ thống sẽ tự động chuyển đổi thành văn bản.
          </p>

          <button
            type='button'
            onClick={abortListening}
            className='inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-6 py-3 text-sm font-bold text-rose-600 shadow-sm transition-all hover:bg-rose-100 hover:border-rose-300 active:scale-95 focus:outline-none focus:ring-2 focus:ring-rose-500/30'
          >
            Hủy ghi âm
          </button>
        </div>
      </div>
    </div>
  )
}
