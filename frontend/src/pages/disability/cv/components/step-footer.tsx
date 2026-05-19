import { ArrowLeft, Eye, Volume2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import toastifyCommon from '@/core/lib/toastify-common'

import { type WizardStep } from './step-header'

export const StepFooter = ({
  onBack,
  onNext,
  onPreview,
  previewing,
  step
}: {
  onBack: () => void
  onNext: () => void
  onPreview: () => void
  previewing: boolean
  step: WizardStep
}) => (
  <footer className='fixed bottom-0 left-0 right-0 z-30 bg-white/95 px-5 py-4 shadow-[0_-8px_30px_rgba(0,64,128,0.08)]'>
    <div className='mx-auto flex max-w-md items-center gap-3'>
      {step === 'personal' ? (
        <>
          <button
            type='button'
            className='flex h-14 w-14 shrink-0 items-center justify-center rounded-md bg-[#F7F7F7] text-primary shadow-sm'
            aria-label='Hỗ trợ giọng nói'
            onClick={() => toastifyCommon.info('Nhấn biểu tượng micro ở từng trường để nhập bằng giọng nói')}
          >
            <Volume2 className='h-6 w-6' />
          </button>
          <Button
            type='button'
            className='h-12 flex-1 rounded-none bg-[#004080] text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_24px_rgba(0,64,128,0.22)] hover:bg-[#003466]'
            onClick={onNext}
          >
            Tiếp tục
          </Button>
        </>
      ) : (
        <>
          <Button
            type='button'
            variant='outline'
            className='h-12 flex-1 rounded-none border-[#004080] bg-white text-sm font-bold uppercase tracking-[0.18em] text-primary'
            onClick={onBack}
          >
            <ArrowLeft className='h-4 w-4' />
            Quay lại
          </Button>
          <Button
            type='button'
            className='h-12 flex-[1.4] rounded-none bg-[#004080] text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_12px_24px_rgba(0,64,128,0.22)] hover:bg-[#003466]'
            loading={previewing}
            disabled={previewing}
            onClick={onPreview}
          >
            <Eye className='h-4 w-4' />
            Xem trước
          </Button>
        </>
      )}
    </div>
  </footer>
)
