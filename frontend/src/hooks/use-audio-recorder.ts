import { useCallback, useEffect, useRef, useState } from 'react'

export const useAudioRecorder = () => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioUrlRef = useRef('')
  const chunksRef = useRef<Blob[]>([])
  const [audioUrl, setAudioUrl] = useState('')
  const [recorderError, setRecorderError] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => {
      track.stop()
    })
    streamRef.current = null
  }, [])

  const setNextAudioUrl = useCallback((url: string) => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current)
    }

    audioUrlRef.current = url
    setAudioUrl(url)
  }, [])

  const startRecording = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
      setRecorderError('Trình duyệt chưa hỗ trợ ghi âm')
      return
    }

    try {
      setRecorderError('')
      setNextAudioUrl('')
      chunksRef.current = []

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)
      streamRef.current = stream
      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data)
        }
      }

      recorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' })

        if (audioBlob.size > 0) {
          setNextAudioUrl(URL.createObjectURL(audioBlob))
        }

        stopStream()
        setIsRecording(false)
      }

      recorder.start()
      setIsRecording(true)
    } catch {
      stopStream()
      setIsRecording(false)
      setRecorderError('Cần cấp quyền microphone để ghi âm hồ sơ')
    }
  }, [setNextAudioUrl, stopStream])

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current

    if (recorder?.state === 'recording') {
      recorder.stop()
      return
    }

    setIsRecording(false)
  }, [])

  const resetRecording = useCallback(() => {
    setNextAudioUrl('')
    chunksRef.current = []
  }, [setNextAudioUrl])

  useEffect(() => {
    return () => {
      const recorder = mediaRecorderRef.current

      if (recorder?.state === 'recording') {
        recorder.stop()
      }

      stopStream()

      if (audioUrlRef.current) {
        URL.revokeObjectURL(audioUrlRef.current)
      }
    }
  }, [stopStream])

  return {
    audioUrl,
    isRecording,
    recorderError,
    resetRecording,
    startRecording,
    stopRecording
  }
}
