import { Plus, Trash2 } from 'lucide-react'
import { type FieldErrors, type UseFormReturn, useFieldArray, type Path } from 'react-hook-form'

import {
  FALLBACK_EQUIPMENT,
  FALLBACK_HARD_SKILLS,
  FALLBACK_SOFT_SKILLS,
  FALLBACK_WORK_CONDITIONS,
  FALLBACK_WORK_MODES,
  FALLBACK_WORK_TIMES
} from '@/_mocks/data-cv.mock'
import { type CvFormValues } from '@/core/zod/cv.zod'
import { type DisabilityOptionsResponse } from '@/models/cv/types'

import { profileWidthClassName, getErrorMessage } from './constants'
import {
  MonthRangeField,
  MultiSelectWithCustomInput,
  SelectField,
  TextareaWithVoice,
  TextFieldWithVoice
} from './form-fields'
import { StepHeader } from './step-header'

type TextFieldName = Path<CvFormValues>

export const SectionTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className='border-l-4 border-[#004080] pl-3 text-lg font-bold uppercase text-primary'>{children}</h2>
)

export const ProfileInfoStep = ({
  form,
  isOptionsLoading,
  onVoiceResult,
  options
}: {
  form: UseFormReturn<CvFormValues>
  isOptionsLoading: boolean
  onVoiceResult: (fieldName: TextFieldName, value: string) => void
  options?: DisabilityOptionsResponse
}) => {
  const {
    control,
    formState: { errors },
    register,
    watch
  } = form
  const errorMessages = errors as FieldErrors<CvFormValues>
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'workExperiences'
  })

  return (
    <div className={profileWidthClassName}>
      <StepHeader activeStep='profile' />
      <div className='space-y-7'>
        <SectionTitle>Kinh nghiệm làm việc</SectionTitle>
        <div className='space-y-6'>
          {fields.map((field, index) => {
            const expError = errorMessages?.workExperiences?.[index]
            const isCurrent = watch(`workExperiences.${index}.isCurrent`)

            return (
              <div key={field.id} className='p-6 bg-white/70 rounded-2xl border border-[#004080]/15 shadow-sm space-y-5 relative transition-all hover:shadow-md'>
                <div className='flex items-center justify-between border-b border-[#004080]/10 pb-3 mb-2'>
                  <h3 className='font-bold text-primary text-lg'>Kinh nghiệm #{index + 1}</h3>
                  {fields.length > 1 && (
                    <button
                      type='button'
                      onClick={() => remove(index)}
                      className='text-red-500 hover:text-red-700 flex items-center gap-1 text-sm font-semibold transition bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-lg'
                    >
                      <Trash2 className='h-4 w-4' /> Xóa
                    </button>
                  )}
                </div>

                <TextFieldWithVoice
                  id={`cv-company-${index}`}
                  label='Tên công ty/ doanh nghiệp'
                  placeholder='Nhập công ty/ doanh nghiệp'
                  registration={register(`workExperiences.${index}.companyName`)}
                  error={getErrorMessage(expError?.companyName)}
                  onVoiceResult={(value) => onVoiceResult(`workExperiences.${index}.companyName`, value)}
                  compact
                />
                <TextFieldWithVoice
                  id={`cv-job-title-${index}`}
                  label='Chức vụ'
                  placeholder='Nhập chức vụ'
                  registration={register(`workExperiences.${index}.jobTitle`)}
                  error={getErrorMessage(expError?.jobTitle)}
                  onVoiceResult={(value) => onVoiceResult(`workExperiences.${index}.jobTitle`, value)}
                  compact
                />

                <div className='space-y-3 bg-[#EAF4FF]/40 p-4 rounded-xl border border-[#004080]/10'>
                  <div className='flex items-center justify-between'>
                    <label className='text-base font-bold text-[#1A5590]'>Thời gian công tác</label>

                  </div>
                  <label className='flex items-center gap-2 text-base font-semibold text-primary cursor-pointer select-none bg-white px-3 py-1.5 rounded-lg border shadow-xs'>
                    <input
                      type='checkbox'
                      {...register(`workExperiences.${index}.isCurrent`)}
                      className='rounded border-neutral-300 text-primary focus:ring-[#004080] h-4 w-4'
                    />
                    Đang làm việc tại đây
                  </label>
                  <MonthRangeField
                    control={control}
                    label=''
                    startName={`workExperiences.${index}.contributionStart`}
                    endName={`workExperiences.${index}.contributionEnd`}
                    startError={getErrorMessage(expError?.contributionStart)}
                    endError={getErrorMessage(expError?.contributionEnd)}
                    disabledEnd={isCurrent}
                  />
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <SelectField
                    id={`cv-work-time-${index}`}
                    label='Thời gian làm việc'
                    placeholder='-- Chọn thời gian làm việc --'
                    registration={register(`workExperiences.${index}.workTime`)}
                    options={options?.workTimes?.length ? options.workTimes : FALLBACK_WORK_TIMES}
                    loading={isOptionsLoading}
                    error={getErrorMessage(expError?.workTime)}
                  />
                  <SelectField
                    id={`cv-work-mode-${index}`}
                    label='Hình thức làm việc'
                    placeholder='-- Chọn hình thức làm việc --'
                    registration={register(`workExperiences.${index}.workMode`)}
                    options={options?.workModes?.length ? options.workModes : FALLBACK_WORK_MODES}
                    loading={isOptionsLoading}
                    error={getErrorMessage(expError?.workMode)}
                  />
                </div>

                <TextareaWithVoice
                  id={`cv-experience-${index}`}
                  label='Mô tả công việc / Kinh nghiệm'
                  placeholder='Nhập chi tiết các công việc đã làm...'
                  registration={register(`workExperiences.${index}.experience`)}
                  error={getErrorMessage(expError?.experience)}
                  onVoiceResult={(value) => onVoiceResult(`workExperiences.${index}.experience`, value)}
                />
              </div>
            )
          })}

          <button
            type='button'
            onClick={() => append({
              companyName: '',
              jobTitle: '',
              contributionStart: '',
              contributionEnd: '',
              workTime: '',
              workMode: '',
              experience: '',
              isCurrent: false
            })}
            className='flex h-12 w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#004080]/40 bg-white/60 px-4 text-base font-bold text-primary shadow-sm hover:bg-[#004080]/10 hover:border-[#004080] transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004080]'
          >
            <Plus className='h-5 w-5' />
            Thêm kinh nghiệm làm việc
          </button>
        </div>

        <SectionTitle>Học vấn</SectionTitle>
        <TextFieldWithVoice
          id='cv-school'
          label='Trường'
          placeholder='Nhập trường'
          registration={register('schoolName')}
          error={getErrorMessage(errorMessages.schoolName)}
          onVoiceResult={(value) => onVoiceResult('schoolName', value)}
          compact
        />
        <TextFieldWithVoice
          id='cv-major'
          label='Ngành'
          placeholder='Nhập ngành'
          registration={register('major')}
          error={getErrorMessage(errorMessages.major)}
          onVoiceResult={(value) => onVoiceResult('major', value)}
          compact
        />
        <TextFieldWithVoice
          id='cv-achievement'
          label='Thành tựu'
          placeholder='Nhập thành tựu'
          registration={register('achievement')}
          error={getErrorMessage(errorMessages.achievement)}
          onVoiceResult={(value) => onVoiceResult('achievement', value)}
          compact
        />
        <MonthRangeField
          control={control}
          label='Thời gian học'
          startName='educationStart'
          endName='educationEnd'
          startError={getErrorMessage(errorMessages.educationStart)}
          endError={getErrorMessage(errorMessages.educationEnd)}
        />

        <SectionTitle>Chứng chỉ</SectionTitle>
        <TextFieldWithVoice
          id='cv-certifications'
          label=''
          placeholder='Liệt kê các bằng cấp liên quan (cách nhau bởi dấu phẩy)'
          registration={register('certifications')}
          error={getErrorMessage(errorMessages.certifications)}
          onVoiceResult={(value) => onVoiceResult('certifications', value)}
          compact
        />

        <SectionTitle>Kỹ năng mềm</SectionTitle>
        <MultiSelectWithCustomInput
          control={control}
          name='softSkills'
          options={options?.softSkillOptions?.length ? options.softSkillOptions : FALLBACK_SOFT_SKILLS}
          placeholder='Khác...'
        />

        <SectionTitle>Kỹ năng cứng</SectionTitle>
        <MultiSelectWithCustomInput
          control={control}
          name='hardSkills'
          options={options?.hardSkillOptions?.length ? options.hardSkillOptions : FALLBACK_HARD_SKILLS}
          placeholder='Khác...'
        />

        <SectionTitle>Mục tiêu nghề nghiệp</SectionTitle>
        <TextareaWithVoice
          id='cv-career-goals'
          label=''
          placeholder='Mục tiêu của bạn là gì?'
          registration={register('careerGoals')}
          error={getErrorMessage(errorMessages.careerGoals)}
          onVoiceResult={(value) => onVoiceResult('careerGoals', value)}
        />

        <SectionTitle>Điều kiện làm việc</SectionTitle>
        <MultiSelectWithCustomInput
          control={control}
          name='workConditions'
          options={options?.workConditions?.length ? options.workConditions : FALLBACK_WORK_CONDITIONS}
          placeholder='Khác...'
        />

        <SectionTitle>Thiết bị hiện có</SectionTitle>
        <MultiSelectWithCustomInput
          control={control}
          name='availableEquipment'
          options={options?.equipment?.length ? options.equipment : FALLBACK_EQUIPMENT}
          placeholder='Khác...'
        />

        <button
          type='button'
          className='flex h-12 w-full items-center gap-3 rounded-md border-l-4 border-[#004080] bg-white px-4 text-sm font-bold uppercase text-primary shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004080]'
        >
          <Plus className='h-7 w-7' />
          Thêm thông tin mới
        </button>
      </div>
    </div>
  )
}
