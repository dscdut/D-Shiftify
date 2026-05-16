import { startTransition, useCallback, useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm, type Path } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { Button } from '@/components/ui/button'
import { ROUTE } from '@/core/constants/path'
import toastifyCommon from '@/core/lib/toastify-common'
import { cn } from '@/core/lib/utils'
import { useCvDraftStore, type CvDraftMode } from '@/core/store/features/cv/cvDraftStore'
import { DEFAULT_CV_FORM_VALUES, CvSchema, type CvFormValues } from '@/core/zod/cv.zod'
import { useCvDetail, useDisabilityOptions } from '@/hooks/tanstack-query/cv/use-query-cv'
import { type CvRecord } from '@/models/interface/cv.interfaces'

import { contentWidthClassName } from './constants'
import { PersonalInfoStep } from './personal-info-step'
import { ProfileInfoStep } from './profile-info-step'
import { StepFooter } from './step-footer'
import { type WizardStep } from './step-header'

type TextFieldName = Path<CvFormValues>

interface CvBuilderPageProps {
  mode: CvDraftMode
  cvId?: string
}

const toFormValues = (record: CvRecord): CvFormValues => ({
  avatarUrl: record.avatarUrl || '',
  fullName: record.fullName || '',
  birthday: record.birthday || '',
  address: record.address || '',
  gender: record.gender === 'female' ? 'female' : 'male',
  phone: record.phone || '',
  email: record.email || '',
  disabilityStatus: record.disabilityStatus || '',
  disabilityTypes: record.disabilityTypes || [],
  disabilityLevel: record.disabilityLevel || '',
  supportNeeds: record.supportNeeds || '',
  workExperiences: record.workExperiences?.length
    ? record.workExperiences.map((exp) => ({
      ...exp,
      isCurrent: Boolean(exp.isCurrent)
    }))
    : record.companyName || record.jobTitle || record.experience
      ? [
        {
          companyName: record.companyName || '',
          jobTitle: record.jobTitle || '',
          contributionStart: record.contributionStart || '',
          contributionEnd: record.contributionEnd || '',
          workTime: record.workTime || 'full_time',
          workMode: record.workMode || 'online',
          experience: record.experience || '',
          isCurrent: false
        }
      ]
      : [
        {
          companyName: '',
          jobTitle: '',
          contributionStart: '',
          contributionEnd: '',
          workTime: '',
          workMode: '',
          experience: '',
          isCurrent: false
        }
      ],
  experience: record.experience || '',
  companyName: record.companyName || '',
  jobTitle: record.jobTitle || '',
  contributionStart: record.contributionStart || '',
  contributionEnd: record.contributionEnd || '',
  workTime: record.workTime || 'full_time',
  workMode: record.workMode || 'online',
  education: record.education || '',
  schoolName: record.schoolName || '',
  major: record.major || '',
  achievement: record.achievement || '',
  educationStart: record.educationStart || '',
  educationEnd: record.educationEnd || '',
  certifications: record.certifications || '',
  softSkills: record.softSkills || '',
  hardSkills: record.hardSkills || '',
  careerGoals: record.careerGoals || '',
  workConditions: record.workConditions || [],
  availableEquipment: record.availableEquipment || [],
  audioReviewUrl: record.audioReviewUrl || ''
})

const CvPageSkeleton = () => (
  <div className={contentWidthClassName} aria-busy='true'>
    <div className='mt-10 h-10 w-72 animate-pulse rounded-md bg-white/70' />
    <div className='mt-8 space-y-7'>
      {[0, 1, 2, 3].map((item) => (
        <div key={item} className='h-20 animate-pulse bg-white/70' />
      ))}
    </div>
  </div>
)

export default function CvBuilderPage({ mode, cvId }: CvBuilderPageProps) {
  const navigate = useNavigate()
  const [step, setStep] = useState<WizardStep>('personal')
  const { cvId: draftCvId, formValues, mode: draftMode, setDraft, setFormValues } = useCvDraftStore()
  const form = useForm<CvFormValues>({
    resolver: zodResolver(CvSchema),
    defaultValues: DEFAULT_CV_FORM_VALUES,
    mode: 'onChange'
  })
  const { getValues, reset, setValue } = form
  const optionsQuery = useDisabilityOptions()
  const cvDetailQuery = useCvDetail(mode === 'edit' ? cvId : undefined)

  const isMatchingDraft = draftMode === mode && (mode === 'create' || draftCvId === (cvId || null))

  useEffect(() => {
    if (isMatchingDraft && formValues) {
      reset(formValues)
      return
    }

    if (cvDetailQuery.data) {
      reset(toFormValues(cvDetailQuery.data))
    }
  }, [cvDetailQuery.data, formValues, isMatchingDraft, reset])

  const handleVoiceResult = useCallback(
    (fieldName: TextFieldName, value: string) => {
      setValue(fieldName, value, {
        shouldDirty: true,
        shouldValidate: true
      })
    },
    [setValue]
  )

  const handleNextFromPersonal = useCallback(async () => {
    const isValid = await form.trigger(['fullName', 'birthday', 'address', 'gender', 'phone', 'email', 'disabilityStatus'])

    if (!isValid) {
      toastifyCommon.error('Vui lòng điền đầy đủ các thông tin bắt buộc.')
      return
    }

    const values = getValues()
    setDraft({
      mode,
      cvId: mode === 'edit' ? cvId || null : null,
      formValues: values
    })
    startTransition(() => {
      setStep('profile')
    })
  }, [cvId, form, getValues, mode, setDraft])

  const handleBackToPersonal = useCallback(() => {
    setFormValues(getValues())
    startTransition(() => {
      setStep('personal')
    })
  }, [getValues, setFormValues])

  const handlePreview = useCallback(async () => {
    const isValid = await form.trigger()

    if (!isValid) {
      const errors = form.formState.errors
      const firstError = Object.values(errors)[0]
      if (firstError?.message) {
        toastifyCommon.error(firstError.message as string)
      } else {
        toastifyCommon.error('Vui lòng điền đầy đủ các thông tin bắt buộc.')
      }
      return
    }

    const values = getValues()
    setDraft({
      mode,
      cvId: mode === 'edit' ? cvId || null : null,
      formValues: values,
      preview: {
        completenessScore: 100,
        summary: 'Hồ sơ đã điền đầy đủ thông tin cơ bản.',
        warnings: [],
        sections: [
          { label: 'Mục tiêu nghề nghiệp', value: values.careerGoals || '' },
          { label: 'Kinh nghiệm', value: values.experience || '' },
          { label: 'Học vấn', value: values.education || [values.schoolName, values.major].filter(Boolean).join(' - ') || '' },
          { label: 'Hỗ trợ cần thiết', value: values.supportNeeds || '' }
        ].filter((section) => section.value.trim().length > 0)
      }
    })
    navigate(ROUTE.DISABILITY.CV_PREVIEW)
  }, [cvId, form, getValues, mode, navigate, setDraft])

  if (mode === 'edit' && cvDetailQuery.isLoading && !formValues) {
    return <CvPageSkeleton />
  }

  if (mode === 'edit' && cvDetailQuery.isError) {
    return (
      <div className='mx-auto max-w-3xl px-5 py-12 text-center'>
        <h1 className='text-2xl font-bold text-primary'>Không thể tải hồ sơ</h1>
        <Button className='mt-5' onClick={() => navigate(ROUTE.DISABILITY.CV)}>
          Quay lại
        </Button>
      </div>
    )
  }

  return (
    <form
      className={cn(step === 'profile' && 'bg-[#EAF4FF]/45')}
      noValidate
      onSubmit={(event) => {
        event.preventDefault()
      }}
    >
      {step === 'personal' ? (
        <PersonalInfoStep
          form={form}
          options={optionsQuery.data}
          isOptionsLoading={optionsQuery.isLoading}
          onVoiceResult={handleVoiceResult}
        />
      ) : (
        <ProfileInfoStep
          form={form}
          options={optionsQuery.data}
          isOptionsLoading={optionsQuery.isLoading}
          onVoiceResult={handleVoiceResult}
        />
      )}

      <StepFooter
        step={step}
        previewing={false}
        onBack={handleBackToPersonal}
        onNext={handleNextFromPersonal}
        onPreview={handlePreview}
      />
    </form>
  )
}
