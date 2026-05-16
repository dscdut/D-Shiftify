import { Volume2 } from "lucide-react"

export type WizardStep = 'personal' | 'profile'

export const StepHeader = ({ activeStep }: { activeStep: WizardStep }) => (
  <div className='mb-7 mt-8 sm:mt-10 lg:mt-12'>
    <p className='mb-3 text-sm font-bold uppercase tracking-[0.18em] text-primary'>
      {activeStep === 'personal' ? 'Bước 1' : 'Bước 2'}
    </p>
    <h1 className='text-[32px] font-extrabold uppercase leading-none tracking-[-0.01em] text-primary sm:text-[44px]'>
      {activeStep === 'personal' ? 'Thông tin cá nhân' : 'Hồ sơ năng lực'}
    </h1>
    {activeStep === 'personal' ? (
      <div className='mt-4 bg-primary flex w-full items-center justify-between gap-4 rounded-lg px-3 py-4 text-white'>
        <h2 className='tracking-wider'>
          Vui lòng cung cấp thông tin để chúng tôi có thể hỗ trợ tốt nhất
        </h2>
        <div className='flex size-10 aspect-square items-center justify-center rounded-full bg-white'>
          <Volume2 color='#004080' />
        </div>
      </div>
    ) : (
      <div className='mt-4 bg-primary flex w-full items-center justify-center gap-4 rounded-lg px-3 py-4 text-white'>
        <h2 className='tracking-wider'>Nếu không có thông tin vui lòng điền "Chưa cập nhật" để tiếp tục</h2>
      </div>
    )}
  </div>
) 
