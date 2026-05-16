import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { Loader2, Mic, Pause, Play, Redo2, SkipBack, SkipForward, Volume2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ROUTE } from '@/core/constants/path'
import { cn } from '@/core/lib/utils'
import { useCvDraftStore } from '@/core/store/features/cv/cvDraftStore'
import { useCreateCv, useDisabilityOptions, useUpdateCv } from '@/hooks/tanstack-query/cv/use-query-cv'
import { useAudioRecorder } from '@/hooks/use-audio-recorder'
import { type CvSelectOption, type CvPayload, type WorkExperienceItem } from '@/models/cv/types'

interface BasePreviewItem {
  globalIndex: number
  id: string
  section: string
  label: string
  value: string
  rawValue: unknown
  customType?: string
}

interface MainPreviewItem extends BasePreviewItem {
  avatarUrl?: string
}

interface EduPreviewItem extends BasePreviewItem {
  data: {
    schoolName?: string
    major?: string
    educationStart?: string
    educationEnd?: string
    achievement?: string
  }
}

interface WorkExpPreviewItem extends BasePreviewItem {
  data: WorkExperienceItem
  expIndex: number
}

const contentWidthClassName = 'mx-auto w-full max-w-md px-5 pb-40 sm:px-8 lg:px-0'

const findOptionLabel = (options: CvSelectOption[] | undefined, value: string) => {
  return options?.find((option) => option.id === value)?.label || value || 'Chưa cập nhật'
}

const formatSelectedOptions = (options: CvSelectOption[] | undefined, values: string[]) => {
  if (values.length === 0) {
    return 'Chưa cập nhật'
  }

  const optionLabels = new Map((options || []).map((option) => [option.id, option.label]))
  return values.map((value) => optionLabels.get(value) || value).join(', ')
}

const formatCommaOptions = (options: CvSelectOption[] | undefined, value: string) => {
  const values = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)

  return formatSelectedOptions(options, values)
}

const PreviewMainField = ({ label, value, avatarUrl, className, innerRef }: { label: string; value: string; avatarUrl?: string; className?: string; innerRef?: React.Ref<HTMLDivElement> }) => (
  <div ref={innerRef} className={cn('rounded-2xl  bg-white p-7 shadow-[0_18px_45px_rgba(0,64,128,0.08)] flex flex-col sm:flex-row items-center gap-6', className)}>
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

const PreviewField = ({ label, value, className, innerRef, isTagField }: { label: string; value: string; className?: string; innerRef?: React.Ref<HTMLDivElement>; isTagField?: boolean }) => {
  const tagItems = isTagField && value && value !== 'Chưa cập nhật' ? value.split(',').map((item) => item.trim()).filter(Boolean) : []

  return (
    <div ref={innerRef} className={cn('rounded-2xl bg-white/80 p-5 shadow-sm border border-neutral-200/60 space-y-2.5', className)}>
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

const PreviewWorkExperienceCard = ({ data, className, innerRef, index }: { data: WorkExperienceItem; className?: string; innerRef?: React.Ref<HTMLDivElement>; index?: number }) => {
  const expLines = String(data.experience || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const isCurrent = data.isCurrent || !data.contributionEnd || data.contributionEnd.trim() === ''
  const timeDisplay = isCurrent ? `${data.contributionStart || ''} - HIỆN TẠI` : `${data.contributionStart || ''} - ${data.contributionEnd || ''}`

  return (
    <div ref={innerRef} className={cn('rounded-2xl bg-[#F8FAFC] border border-neutral-200/80 p-6 shadow-sm relative overflow-hidden space-y-4 sm:col-span-2', className)}>
      <h2 className='border-l-4 border-[#004080] pl-3 text-sm font-bold uppercase text-primary tracking-wider'>
        Kinh nghiệm làm việc {index !== undefined ? `#${index + 1}` : ''}
      </h2>

      <div className='flex items-start justify-between gap-4 pt-1'>
        <h3 className='text-xl font-black uppercase text-primary tracking-wide leading-tight max-w-[70%]'>
          {data.jobTitle || 'CHỨC VỤ'}
        </h3>
        <div className={cn('px-3.5 py-1 rounded-full text-xs font-extrabold uppercase inline-flex items-center gap-1.5 shadow-xs shrink-0', isCurrent ? 'bg-[#228B22] text-white' : 'bg-[#004080] text-white')}>
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

const PreviewEducationCard = ({ data, className, innerRef }: { data: { schoolName?: string; major?: string; educationStart?: string; educationEnd?: string; achievement?: string }; className?: string; innerRef?: React.Ref<HTMLDivElement> }) => {
  const achLines = String(data.achievement || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean)

  const timeDisplay = [data.educationStart, data.educationEnd].filter(Boolean).join(' - ')

  return (
    <div ref={innerRef} className={cn('rounded-2xl bg-[#F8FAFC] border border-neutral-200/80 p-6 shadow-sm relative overflow-hidden space-y-4 sm:col-span-2', className)}>
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

const PreviewSection = ({ children, title }: { children: React.ReactNode; title: string }) => (
  <section className='space-y-4 rounded-2xl bg-white/40 p-5 border border-neutral-200/60 shadow-sm'>
    <h2 className='border-l-4 border-[#004080] pl-3 text-base font-bold uppercase text-primary tracking-wider'>{title}</h2>
    <div className='grid gap-3 sm:grid-cols-2'>{children}</div>
  </section>
)

const EmptyPreviewState = () => (
  <div className='mx-auto max-w-xl px-5 py-16 text-center'>
    <h1 className='text-2xl font-bold text-primary'>Chưa có dữ liệu xem trước</h1>
    <p className='mt-3 text-sm leading-6 text-slate-600'>Vui lòng hoàn tất bước thông tin cá nhân và hồ sơ năng lực trước.</p>
    <Button asChild className='mt-6'>
      <Link to={ROUTE.DISABILITY.CV}>Tạo hồ sơ</Link>
    </Button>
  </div>
)

export default function CvPreviewPage() {
  const navigate = useNavigate()
  const { audioUrl: storedAudioUrl, clearDraft, cvId, formValues, mode, setAudioUrl } = useCvDraftStore()
  const { data: options } = useDisabilityOptions()
  const { isPending: isCreatingCv, mutate: createCv } = useCreateCv()
  const { isPending: isUpdatingCv, mutate: updateCv } = useUpdateCv()
  const { audioUrl } = useAudioRecorder()
  const activeAudioUrl = audioUrl || storedAudioUrl
  const isSubmitting = isCreatingCv || isUpdatingCv

  const [activeBlockIndex, setActiveBlockIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const blockRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    if (audioUrl) {
      setAudioUrl(audioUrl)
    }
  }, [audioUrl, setAudioUrl])

  const groupedPreviewItems = useMemo(() => {
    if (!formValues) {
      return {
        all: [],
        main: [],
        personal: [],
        careerGoals: undefined,
        education: [],
        workExp: [],
        other: []
      }
    }

    const workExpItems = (formValues.workExperiences || []).map((exp, idx) => ({
      id: `workExperience-${idx}`,
      section: 'workExperience',
      label: `Kinh nghiệm #${idx + 1}`,
      value: exp.jobTitle || exp.companyName || 'Kinh nghiệm làm việc',
      rawValue: exp.jobTitle || exp.companyName || exp.experience,
      customType: 'workExperience',
      data: exp,
      expIndex: idx
    }))

    const eduItem = {
      id: 'educationCard',
      section: 'education',
      label: 'Học vấn',
      value: formValues.schoolName || formValues.major || formValues.achievement || 'Học vấn',
      rawValue: formValues.schoolName || formValues.major || formValues.achievement || formValues.education,
      customType: 'education',
      data: {
        schoolName: formValues.schoolName,
        major: formValues.major,
        educationStart: formValues.educationStart,
        educationEnd: formValues.educationEnd,
        achievement: formValues.achievement || formValues.education
      }
    }

    const rawItems = [
      { id: 'fullName', section: 'main', label: 'Họ và tên', value: formValues.fullName, rawValue: formValues.fullName, avatarUrl: formValues.avatarUrl },
      { id: 'birthday', section: 'personal', label: 'Ngày sinh', value: formValues.birthday, rawValue: formValues.birthday },
      { id: 'address', section: 'personal', label: 'Địa chỉ', value: formValues.address, rawValue: formValues.address },
      { id: 'gender', section: 'personal', label: 'Giới tính', value: findOptionLabel(options?.genders, formValues.gender), rawValue: formValues.gender },
      { id: 'phone', section: 'personal', label: 'Số điện thoại', value: formValues.phone, rawValue: formValues.phone },
      { id: 'email', section: 'personal', label: 'Email', value: formValues.email, rawValue: formValues.email },
      { id: 'disabilityStatus', section: 'personal', label: 'Tình trạng khuyết tật', value: findOptionLabel(options?.statuses, formValues.disabilityStatus), rawValue: formValues.disabilityStatus },
      { id: 'careerGoals', section: 'careerGoals', label: 'Mục tiêu nghề nghiệp', value: formValues.careerGoals, rawValue: formValues.careerGoals, customType: 'careerGoals' },
      eduItem,
      ...workExpItems,
      { id: 'certifications', section: 'other', label: 'Chứng chỉ', value: formatCommaOptions(options?.certifications, formValues.certifications), rawValue: formValues.certifications },
      { id: 'softSkills', section: 'other', label: 'Kỹ năng mềm', value: formatCommaOptions(options?.softSkillOptions, formValues.softSkills), rawValue: formValues.softSkills },
      { id: 'hardSkills', section: 'other', label: 'Kỹ năng cứng', value: formatCommaOptions(options?.hardSkillOptions, formValues.hardSkills), rawValue: formValues.hardSkills },
      { id: 'workConditions', section: 'other', label: 'Điều kiện làm việc', value: formatSelectedOptions(options?.workConditions, formValues.workConditions), rawValue: formValues.workConditions?.length ? 'has_data' : '' },
      { id: 'availableEquipment', section: 'other', label: 'Thiết bị hiện có', value: formatSelectedOptions(options?.equipment, formValues.availableEquipment), rawValue: formValues.availableEquipment?.length ? 'has_data' : '' }
    ]

    const filtered = rawItems
      .filter((item) => {
        if (!item.rawValue) return false
        if (typeof item.rawValue === 'string' && item.rawValue.trim() === '') return false
        if (item.value === 'Chưa cập nhật') return false
        return true
      })
      .map((item, index) => ({ ...item, globalIndex: index }))

    const main: MainPreviewItem[] = []
    const personal: BasePreviewItem[] = []
    let careerGoals: BasePreviewItem | undefined
    const education: EduPreviewItem[] = []
    const workExp: WorkExpPreviewItem[] = []
    const other: BasePreviewItem[] = []

    for (const item of filtered) {
      if (item.section === 'main') main.push(item as unknown as MainPreviewItem)
      else if (item.section === 'personal') personal.push(item as unknown as BasePreviewItem)
      else if (item.section === 'careerGoals') careerGoals = item as unknown as BasePreviewItem
      else if (item.section === 'education') education.push(item as unknown as EduPreviewItem)
      else if (item.section === 'workExperience') workExp.push(item as unknown as WorkExpPreviewItem)
      else if (item.section === 'other') other.push(item as unknown as BasePreviewItem)
    }

    return {
      all: filtered,
      main,
      personal,
      careerGoals,
      education,
      workExp,
      other
    }
  }, [formValues, options])

  const totalBlocks = groupedPreviewItems.all.length

  const scrollToBlock = useCallback((index: number) => {
    const element = blockRefs.current[index]
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' })
    }
  }, [])

  useEffect(() => {
    scrollToBlock(activeBlockIndex)
  }, [activeBlockIndex, scrollToBlock])

  const handlePrev = useCallback(() => {
    setActiveBlockIndex((prev) => Math.max(0, prev - 1))
  }, [])

  const handleNext = useCallback(() => {
    setActiveBlockIndex((prev) => Math.min(totalBlocks - 1, prev + 1))
  }, [totalBlocks])

  const handleReplay = useCallback(() => {
    setIsPlaying(true)
    scrollToBlock(activeBlockIndex)
  }, [activeBlockIndex, scrollToBlock])

  const getBlockClassName = useCallback((index: number) => {
    const isActive = index === activeBlockIndex
    return cn(
      'transition-all duration-500',
      isActive
        ? 'ring-2 ring-[#004080] ring-offset-2 opacity-100 shadow-[0_18px_45px_rgba(0,64,128,0.12)] scale-[1.01]'
        : 'opacity-35 blur-[0.5px] grayscale-[30%]'
    )
  }, [activeBlockIndex])

  const handleConfirm = useCallback(() => {
    if (!formValues) {
      return
    }

    const payload: CvPayload = {
      ...formValues,
      schoolName: formValues.schoolName || '',
      major: formValues.major || '',
      audioReviewUrl: activeAudioUrl
    }

    const handleSuccess = () => {
      clearDraft()
      navigate(ROUTE.DISABILITY.CV)
    }

    if (mode === 'edit') {
      updateCv(
        {
          cvId: cvId || 'current',
          payload
        },
        {
          onSuccess: handleSuccess
        }
      )
      return
    }

    createCv(payload, {
      onSuccess: handleSuccess
    })
  }, [activeAudioUrl, clearDraft, createCv, cvId, formValues, mode, navigate, updateCv])

  if (!formValues) {
    return <EmptyPreviewState />
  }

  return (
    <div className='min-h-[calc(100vh-84px)]'>
      <div className={contentWidthClassName}>
        <div className='mb-7 mt-8 sm:mt-12 lg:mt-16'>
          <h1 className='text-2xl font-extrabold uppercase text-primary sm:text-3xl'>Xác nhận hồ sơ</h1>
        </div>

        <div className='space-y-6'>
          {groupedPreviewItems.main.map((item) => (
            <PreviewMainField
              key={item.id}
              innerRef={(el) => { blockRefs.current[item.globalIndex] = el }}
              className={getBlockClassName(item.globalIndex)}
              label={item.label}
              value={item.value}
              avatarUrl={item.avatarUrl}
            />
          ))}

          {groupedPreviewItems.personal.length > 0 ? (
            <PreviewSection title='Thông tin cá nhân'>
              {groupedPreviewItems.personal.map((item) => (
                <PreviewField
                  key={item.id}
                  innerRef={(el) => { blockRefs.current[item.globalIndex] = el }}
                  className={getBlockClassName(item.globalIndex)}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </PreviewSection>
          ) : null}

          {groupedPreviewItems.careerGoals ? (
            <PreviewField
              innerRef={(el) => { blockRefs.current[groupedPreviewItems.careerGoals?.globalIndex || 0] = el }}
              className={cn('sm:col-span-2', getBlockClassName(groupedPreviewItems.careerGoals.globalIndex))}
              label={groupedPreviewItems.careerGoals.label}
              value={groupedPreviewItems.careerGoals.value}
            />
          ) : null}

          {groupedPreviewItems.education.map((item) => (
            <PreviewEducationCard
              key={item.id}
              innerRef={(el) => { blockRefs.current[item.globalIndex] = el }}
              className={getBlockClassName(item.globalIndex)}
              data={item.data}
            />
          ))}

          {groupedPreviewItems.workExp.map((item) => (
            <PreviewWorkExperienceCard
              key={item.id}
              innerRef={(el) => { blockRefs.current[item.globalIndex] = el }}
              className={getBlockClassName(item.globalIndex)}
              data={item.data}
              index={item.expIndex}
            />
          ))}

          {groupedPreviewItems.other.length > 0 ? (
            <PreviewSection title='Thông tin bổ sung'>
              {groupedPreviewItems.other.map((item) => (
                <PreviewField
                  key={item.id}
                  innerRef={(el) => { blockRefs.current[item.globalIndex] = el }}
                  className={getBlockClassName(item.globalIndex)}
                  label={item.label}
                  value={item.value}
                  isTagField={['certifications', 'softSkills', 'hardSkills', 'workConditions', 'availableEquipment'].includes(item.id)}
                />
              ))}
            </PreviewSection>
          ) : null}
        </div>
      </div>

      <footer className='fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E5E5] bg-white px-5 py-4 shadow-[0_-8px_30px_rgba(0,64,128,0.08)]'>
        <div className='mx-auto max-w-md space-y-3'>
          <div className='grid grid-cols-4 gap-2'>
            <button
              type='button'
              disabled={activeBlockIndex === 0}
              onClick={handlePrev}
              className={cn(
                'flex flex-col items-center justify-center py-2 rounded transition-all',
                activeBlockIndex === 0 ? 'opacity-40 cursor-not-allowed text-[#A0A0A0]' : 'text-[#5E5E5E] hover:bg-slate-100 active:bg-slate-200'
              )}
            >
              <SkipBack className='h-5 w-5 mb-1' />
              <span className='text-sm font-bold tracking-wider uppercase'>Trước</span>
            </button>

            <button
              type='button'
              onClick={() => setIsPlaying(!isPlaying)}
              className={cn(
                'flex flex-col items-center justify-center py-2 rounded transition-all',
                isPlaying
                  ? 'bg-[#F5F5F5] text-primary font-bold shadow-sm'
                  : 'text-[#5E5E5E] hover:bg-slate-100 active:bg-slate-200'
              )}
            >
              {isPlaying ? <Pause className='h-5 w-5 mb-1' /> : <Play className='h-5 w-5 mb-1' />}
              <span className='text-sm font-bold tracking-wider uppercase'>{isPlaying ? 'Tạm dừng' : 'Phát'}</span>
            </button>

            <button
              type='button'
              disabled={activeBlockIndex === totalBlocks - 1}
              onClick={handleNext}
              className={cn(
                'flex flex-col items-center justify-center py-2 rounded transition-all',
                activeBlockIndex === totalBlocks - 1 ? 'opacity-40 cursor-not-allowed text-[#A0A0A0]' : 'text-[#5E5E5E] hover:bg-slate-100 active:bg-slate-200'
              )}
            >
              <SkipForward className='h-5 w-5 mb-1' />
              <span className='text-sm font-bold tracking-wider uppercase'>Sau</span>
            </button>

            <button
              type='button'
              onClick={handleReplay}
              className='flex flex-col items-center justify-center py-2 rounded text-[#5E5E5E] hover:bg-slate-100 active:bg-slate-200 transition-all'
            >
              <Redo2 className='h-5 w-5 mb-1' />
              <span className='text-sm font-bold tracking-wider uppercase'>Lặp lại</span>
            </button>
          </div>

          <Button
            type='button'
            className='w-full h-12 rounded-none bg-[#004080] text-sm font-bold uppercase tracking-[0.22em] text-white shadow-[0_12px_24px_rgba(0,64,128,0.22)] hover:bg-[#003466]'
            disabled={isSubmitting}
            onClick={handleConfirm}
          >
            {isSubmitting ? <Loader2 className='h-4 w-4 animate-spin mr-2' /> : null}
            Xác nhận
          </Button>
        </div>
      </footer>
    </div>
  )
}
