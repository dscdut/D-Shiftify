import { Camera, Loader2, User } from 'lucide-react'
import { Controller, type FieldErrors, type UseFormReturn, type Path } from 'react-hook-form'

import { FALLBACK_GENDERS, FALLBACK_STATUSES } from '@/_mocks/data-cv.mock'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { DatePicker } from '@/components/ui/date-picker'
import FileUpload from '@/components/upload-file/file-upload'
import toastifyCommon from '@/core/lib/toastify-common'
import { type CvFormValues } from '@/core/zod/cv.zod'
import { useUploadCvAvatar } from '@/hooks/tanstack-query/cv/use-query-cv'
import { type DisabilityOptionsResponse } from '@/models/interface/cv.interfaces'

import { contentWidthClassName, getErrorMessage } from './constants'
import { FieldError, RadioCardGroup, TextFieldWithVoice } from './form-fields'
import { StepHeader } from './step-header'

type TextFieldName = Path<CvFormValues>

const getInitials = (name: string) => {
  if (!name) return 'CV'
  return name
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

export const PersonalInfoStep = ({
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
    watch,
    setValue
  } = form
  const errorMessages = errors as FieldErrors<CvFormValues>
  const avatarUrl = watch('avatarUrl')
  const fullName = watch('fullName')
  const uploadAvatarMutation = useUploadCvAvatar()

  const handleAvatarChange = (files: FileList | null) => {
    if (!files || !files[0]) return

    uploadAvatarMutation.mutate(files[0], {
      onSuccess: (res) => {
        if (res.avatarUrl) {
          setValue('avatarUrl', res.avatarUrl, {
            shouldDirty: true,
            shouldValidate: true
          })
          toastifyCommon.success('Cập nhật ảnh đại diện thành công!')
        }
      }
    })
  }

  return (
    <div className={contentWidthClassName}>
      <StepHeader activeStep='personal' />
      <div className='space-y-7'>
        <div className='flex flex-col items-center justify-center pb-2 pt-4'>
          <div className='relative group'>
            <Avatar className='size-48 border-4 border-white shadow-md dark:border-neutral-800'>
              <AvatarImage src={avatarUrl || undefined} alt={fullName || 'Avatar'} className='object-cover' />
              <AvatarFallback className='bg-[#EAF4FF] text-primary text-2xl font-bold dark:bg-neutral-800 dark:text-neutral-200'>
                {fullName ? getInitials(fullName) : <User className='h-12 w-12 text-primary' />}
              </AvatarFallback>
            </Avatar>

            {uploadAvatarMutation.isPending && (
              <div className='absolute inset-0 flex items-center justify-center bg-black/40 rounded-full backdrop-blur-sm'>
                <Loader2 className='h-8 w-8 text-white animate-spin' />
              </div>
            )}

            <FileUpload
              ariaLabel='Tải ảnh đại diện'
              className='absolute bottom-2 right-2'
              onChange={handleAvatarChange}
            >
              <button
                type='button'
                disabled={uploadAvatarMutation.isPending}
                className='flex h-11 w-11 items-center justify-center rounded-full bg-[#004080] text-white shadow-md hover:bg-[#003466] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#004080] transition disabled:opacity-50'
                aria-label='Tải ảnh đại diện'
              >
                {uploadAvatarMutation.isPending ? (
                  <Loader2 className='h-5 w-5 animate-spin' />
                ) : (
                  <Camera className='h-5 w-5' />
                )}
              </button>
            </FileUpload>
          </div>
          <span className='mt-3 text-base font-medium text-slate-500 dark:text-slate-400'>
            Nhấp vào biểu tượng máy ảnh để tải ảnh đại diện (Định dạng: JPG, PNG)
          </span>
        </div>

        <TextFieldWithVoice
          id='cv-full-name'
          label='Họ Và Tên'
          placeholder='Nhập họ và tên'
          registration={register('fullName')}
          error={getErrorMessage(errorMessages.fullName)}
          onVoiceResult={(value) => onVoiceResult('fullName', value)}
        />

        <Controller
          control={control}
          name='birthday'
          render={({ field }) => (
            <div className='space-y-2'>
              <label className='block text-base font-bold text-primary'>
                Ngày tháng năm sinh
              </label>
              <DatePicker
                value={field.value}
                onChange={field.onChange}
                error={Boolean(errorMessages.birthday)}
              />
              <FieldError id='cv-birthday-error' message={getErrorMessage(errorMessages.birthday)} />
            </div>
          )}
        />

        <TextFieldWithVoice
          id='cv-address'
          label='Địa chỉ'
          placeholder='Nhập địa chỉ'
          registration={register('address')}
          error={getErrorMessage(errorMessages.address)}
          onVoiceResult={(value) => onVoiceResult('address', value)}
        />
        <RadioCardGroup
          control={control}
          name='gender'
          legend='Giới tính'
          options={options?.genders?.length ? options.genders : FALLBACK_GENDERS}
          loading={isOptionsLoading}
          error={getErrorMessage(errorMessages.gender)}
        />
        <TextFieldWithVoice
          id='cv-phone'
          label='Số điện thoại'
          placeholder='Nhập số điện thoại'
          registration={register('phone')}
          error={getErrorMessage(errorMessages.phone)}
          onVoiceResult={(value) => onVoiceResult('phone', value)}
        />
        <TextFieldWithVoice
          id='cv-email'
          label='Email'
          placeholder='Nhập email'
          registration={register('email')}
          error={getErrorMessage(errorMessages.email)}
          onVoiceResult={(value) => onVoiceResult('email', value)}
        />
        <RadioCardGroup
          control={control}
          name='disabilityStatus'
          legend='Tình trạng khuyết tật'
          options={options?.statuses?.length ? options.statuses : FALLBACK_STATUSES}
          loading={isOptionsLoading}
          error={getErrorMessage(errorMessages.disabilityStatus)}
        />
      </div>
    </div>
  )
}
