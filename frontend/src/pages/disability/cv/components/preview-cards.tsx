import React from 'react'

import { Mic, Volume2 } from 'lucide-react'
import { Link } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ROUTE } from '@/core/constants/path'
import { cn } from '@/core/lib/utils'
import { type WorkExperienceItem } from '@/models/interface/cv.interfaces'

export const PreviewMainField = ({
  label,
  value,
  avatarUrl,
  className,
  innerRef
}: {
  label: string
  value: string
  avatarUrl?: string
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
}) => (
  <div
    ref={innerRef}
    className={cn(
      'rounded-2xl bg-white p-7 shadow-[0_18px_45px_rgba(0,64,128,0.08)] flex flex-col sm:flex-row items-center gap-6',
      className
    )}
  >
    {avatarUrl ? (
      <div className='h-28 w-28 shrink-0 rounded-full overflow-hidden border-4 border-[#004080]/20 shadow-md bg-neutral-100 flex items-center justify-center'>
        <img src={avatarUrl} alt={value || label} className='h-full w-full object-cover' />
      </div>
    ) : (
      <div className='h-28 w-28 shrink-0 rounded-full overflow-hidden border-4 border-[#004080]/20 shadow-md bg-[#EAF4FF] flex items-center justify-center text-primary font-black text-3xl uppercase'>
        {value ? value.charAt(0) : 'CV'}
      </div>
    )}
    <div className='flex-1 w-full space-y-3 text-center sm:text-left'>
      <p className='text-base font-bold uppercase tracking-wide text-[#5E5E5E]'>{label}</p>
      <div className='relative'>
        <div className='flex min-h-16 items-center justify-center sm:justify-start border border-[#DDDDDD] bg-white px-7 pr-14 text-xl font-extrabold uppercase text-primary rounded-xl'>
          {value || 'Chưa cập nhật'}
        </div>
        <span className='absolute right-11 top-1/2 h-6 w-px -translate-y-1/2 bg-[#E5E5E5]' aria-hidden='true' />
        <Mic className='absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-primary' aria-hidden='true' />
      </div>
    </div>
  </div>
)

export const PreviewField = ({
  label,
  value,
  className,
  innerRef,
  isTagField
}: {
  label: string
  value: string
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
  isTagField?: boolean
}) => {
  const tagItems = isTagField && value && value !== 'Chưa cập nhật' ? value.split(',').map((item) => item.trim()).filter(Boolean) : []

  return (
    <div
      ref={innerRef}
      className={cn('rounded-2xl bg-white/80 p-5 shadow-sm border border-neutral-200/60 space-y-2.5', className)}
    >
      <p className='text-xs font-bold uppercase tracking-wider text-[#64748B]'>{label}</p>
      {isTagField && tagItems.length > 0 ? (
        <div className='flex flex-wrap gap-2 pt-0.5'>
          {tagItems.map((item, idx) => (
            <span
              key={idx}
              className='inline-flex items-center px-3.5 py-1.5 rounded-sm bg-primary text-white text-sm font-bold border border-[#B8D5F5] shadow-xs hover:bg-[#D5E8FA] transition-colors'
            >
              {item}
            </span>
          ))}
        </div>
      ) : (
        <p className='text-base font-semibold leading-relaxed text-primary'>{value || 'Chưa cập nhật'}</p>
      )}
    </div>
  )
}

export const PreviewWorkExperienceCard = ({
  data,
  className,
  innerRef,
  index
}: {
  data: WorkExperienceItem
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
  index?: number
}) => {
  const expLines = String(data.experience || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const isCurrent = data.isCurrent || !data.contributionEnd || data.contributionEnd.trim() === ''
  const timeDisplay = isCurrent ? `${data.contributionStart || ''} - HIỆN TẠI` : `${data.contributionStart || ''} - ${data.contributionEnd || ''}`

  return (
    <div
      ref={innerRef}
      className={cn(
        'rounded-2xl bg-[#F8FAFC] border border-neutral-200/80 p-6 shadow-sm relative overflow-hidden space-y-4 sm:col-span-2',
        className
      )}
    >
      <h2 className='border-l-4 border-[#004080] pl-3 text-sm font-bold uppercase text-primary tracking-wider'>
        Kinh nghiệm làm việc {index !== undefined ? `#${index + 1}` : ''}
      </h2>

      <div className='flex items-start justify-between gap-4 pt-1'>
        <h3 className='text-xl font-black uppercase text-primary tracking-wide leading-tight max-w-[70%]'>
          {data.jobTitle || 'CHỨC VỤ'}
        </h3>
        <div
          className={cn(
            'px-3.5 py-1 rounded-full text-xs font-extrabold uppercase inline-flex items-center gap-1.5 shadow-xs shrink-0',
            isCurrent ? 'bg-[#228B22] text-white' : 'bg-[#004080] text-white'
          )}
        >
          {isCurrent && <span className='h-1.5 w-1.5 rounded-full bg-white animate-pulse' />}
          {timeDisplay}
        </div>
      </div>

      <div className='flex items-center gap-2 text-primary font-bold text-base uppercase tracking-wider'>
        <Volume2 className='h-4 w-4 shrink-0' />
        <span>{data.companyName || 'TÊN CÔNG TY'}</span>
      </div>

      {expLines.length > 0 && (
        <div className='space-y-2.5 pt-2 border-t border-neutral-200/60'>
          {expLines.map((line, idx) => (
            <div key={idx} className='flex items-start gap-2.5 text-sm leading-relaxed text-neutral-700'>
              <p>{line.replace(/^\/\s*/, '')}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export const PreviewEducationCard = ({
  data,
  className,
  innerRef
}: {
  data: { schoolName?: string; major?: string; educationStart?: string; educationEnd?: string; achievement?: string }
  className?: string
  innerRef?: React.Ref<HTMLDivElement>
}) => {
  const achLines = String(data.achievement || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const timeDisplay = [data.educationStart, data.educationEnd].filter(Boolean).join(' - ')

  return (
    <div
      ref={innerRef}
      className={cn(
        'rounded-2xl bg-[#F8FAFC] border border-neutral-200/80 p-6 shadow-sm relative overflow-hidden space-y-4 sm:col-span-2',
        className
      )}
    >
      <h2 className='border-l-4 border-[#004080] pl-3 text-sm font-bold uppercase text-primary tracking-wider'>
        Học vấn
      </h2>

      <div className='space-y-2 pt-1'>
        <h3 className='text-xl font-black uppercase text-primary tracking-wide leading-tight'>
          {data.schoolName || 'TÊN TRƯỜNG'}
        </h3>
        {timeDisplay && (
          <div className='bg-[#004080] text-white px-4 py-1 rounded-full text-xs font-bold inline-block tracking-wider shadow-xs'>
            {timeDisplay}
          </div>
        )}
      </div>

      <div className='flex items-center gap-2 text-primary font-bold text-base uppercase tracking-wider pt-1'>
        <Volume2 className='h-4 w-4 shrink-0' />
        <span>Khoa: {data.major || 'CHUYÊN NGÀNH'}</span>
      </div>

      {achLines.length > 0 && (
        <div className='space-y-2 pt-2 border-t border-neutral-200/60'>
          {achLines.map((line, idx) => (
            <p key={idx} className='text-sm leading-relaxed text-neutral-700'>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export const PreviewSection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <section className='space-y-4 rounded-2xl bg-white/40 p-5 border border-neutral-200/60 shadow-sm'>
    <h2 className='border-l-4 border-[#004080] pl-3 text-base font-bold uppercase text-primary tracking-wider'>{title}</h2>
    <div className='grid gap-3 sm:grid-cols-2'>{children}</div>
  </section>
)

export const EmptyPreviewState = () => (
  <div className='mx-auto max-w-xl px-5 py-16 text-center'>
    <h1 className='text-2xl font-bold text-primary'>Chưa có dữ liệu xem trước</h1>
    <p className='mt-3 text-sm leading-6 text-slate-600'>Vui lòng hoàn tất bước thông tin cá nhân và hồ sơ năng lực trước.</p>
    <Button asChild className='mt-6'>
      <Link to={ROUTE.DISABILITY.CV}>Tạo hồ sơ</Link>
    </Button>
  </div>
)
