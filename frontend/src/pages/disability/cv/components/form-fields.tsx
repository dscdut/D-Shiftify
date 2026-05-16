import { useId, useState } from 'react'

import { ChevronDown, Plus, X } from 'lucide-react'
import {
  Controller,
  type Control,
  type UseFormRegisterReturn,
  type Path
} from 'react-hook-form'

import { DatePicker } from '@/components/ui/date-picker'
import { cn } from '@/core/lib/utils'
import { type CvFormValues } from '@/core/zod/cv.zod'
import { type CvSelectOption } from '@/models/interface/cv.interfaces'

import { inputClassName, roundedInputClassName } from './constants'
import { VoiceButton } from './voice-button'

export type MultiSelectFieldName = 'disabilityTypes' | 'workConditions' | 'availableEquipment'

export const FieldError = ({ id, message }: { id: string; message?: string }) => {
  if (!message) {
    return null
  }

  return (
    <p id={id} role='alert' className='mt-1 text-base font-medium text-red-600'>
      {message}
    </p>
  )
}

export const TextFieldWithVoice = ({
  id,
  label,
  placeholder,
  registration,
  error,
  onVoiceResult,
  compact = false
}: {
  id: string
  label: string
  placeholder: string
  registration: UseFormRegisterReturn
  error?: string
  onVoiceResult: (value: string) => void
  compact?: boolean
}) => {
  const errorId = `${id}-error`

  return (
    <div className='space-y-2'>
      {label ? (
        <label htmlFor={id} className={cn('block font-bold text-primary', compact ? 'text-base' : 'text-lg')}>
          {label}
        </label>
      ) : null}
      <div className='relative'>
        <input
          id={id}
          type='text'
          placeholder={placeholder}
          className={cn(compact ? roundedInputClassName : inputClassName, error && 'border-red-500 ring-2 ring-red-100')}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...registration}
        />
        <VoiceButton label={label || placeholder} onResult={onVoiceResult} compact={compact} />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export const TextareaWithVoice = ({
  id,
  label,
  placeholder,
  registration,
  error,
  onVoiceResult
}: {
  id: string
  label: string
  placeholder: string
  registration: UseFormRegisterReturn
  error?: string
  onVoiceResult: (value: string) => void
}) => {
  const errorId = `${id}-error`

  return (
    <div className='space-y-2'>
      {label ? (
        <label htmlFor={id} className='block text-base font-bold text-[#1A5590]'>
          {label}
        </label>
      ) : null}
      <div className='relative'>
        <textarea
          id={id}
          placeholder={placeholder}
          className={cn(
            'min-h-24 w-full resize-y rounded-md border-0 bg-white px-4 py-3 pr-11 text-base leading-6 text-primary shadow-sm outline-none transition placeholder:text-[#8B8B8B] focus:ring-2 focus:ring-[#004080]/20',
            error && 'ring-2 ring-red-200'
          )}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? errorId : undefined}
          {...registration}
        />
        <VoiceButton label={label || placeholder} onResult={onVoiceResult} compact />
      </div>
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export const SelectField = ({
  id,
  label,
  placeholder,
  registration,
  options,
  loading,
  error
}: {
  id: string
  label: string
  placeholder: string
  registration: UseFormRegisterReturn
  options?: CvSelectOption[]
  loading?: boolean
  error?: string
}) => {
  const errorId = `${id}-error`

  return (
    <div className='space-y-2'>
      <label htmlFor={id} className='block text-base font-bold text-[#1A5590]'>
        {label}
      </label>
      {loading ? (
        <div className='h-11 animate-pulse rounded-md bg-white/70' aria-hidden='true' />
      ) : (
        <div className='relative'>
          <select
            id={id}
            className={cn(roundedInputClassName, 'appearance-none pr-10', error && 'ring-2 ring-red-200',)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? errorId : undefined}
            {...registration}
          >
            <option value=''>{placeholder}</option>
            {(options || []).map((option) => (
              <option key={option.id} value={option.id}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown className='pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6E]' />
        </div>
      )}
      <FieldError id={errorId} message={error} />
    </div>
  )
}

export const RadioCardGroup = ({
  control,
  error,
  legend,
  loading,
  name,
  options
}: {
  control: Control<CvFormValues>
  error?: string
  legend: string
  loading?: boolean
  name: 'gender' | 'disabilityStatus'
  options?: CvSelectOption[]
}) => {
  const groupId = useId()
  const errorId = `${groupId}-error`

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <fieldset className='bg-white/35 py-5' aria-describedby={error ? errorId : undefined}>
          <legend className='mb-4 text-lg font-bold text-primary'>{legend}</legend>
          {loading ? (
            <div className='space-y-1' aria-hidden='true'>
              {[0, 1].map((item) => (
                <div key={item} className='h-12 animate-pulse rounded-md bg-white/70' />
              ))}
            </div>
          ) : (
            <div className={cn("space-y-1", name === 'gender' ? 'flex space-y-0 flex-row gap-3 w-full items-center justify-between' : 'flex flex-col gap-3')}>
              {(options || []).map((option) => {
                const optionId = `${groupId}-${option.id}`
                const isSelected = field.value === option.id

                return (
                  <label
                    key={option.id}
                    htmlFor={optionId}
                    className={cn(
                      'flex h-12 cursor-pointer items-center rounded-md border border-[#C9C9C9] bg-white px-4 text-base text-primary transition',
                      isSelected && 'border-l-4 border-l-[#004080] pl-3 font-medium',
                      name === 'gender' ? 'w-full flex-1' : 'w-full'
                    )}
                  >
                    <input
                      id={optionId}
                      type='radio'
                      className='sr-only'
                      checked={isSelected}
                      value={option.id}
                      onBlur={field.onBlur}
                      onChange={() => field.onChange(option.id)}
                    />
                    {option.label}
                  </label>
                )
              })}
            </div>
          )}
          <FieldError id={errorId} message={error} />
        </fieldset>
      )}
    />
  )
}



export const MonthRangeField = ({
  control,
  startName,
  endName,
  startError,
  endError,
  label,
  disabledEnd
}: {
  control: Control<CvFormValues>
  startName: Path<CvFormValues>
  endName: Path<CvFormValues>
  startError?: string
  endError?: string
  label: string
  disabledEnd?: boolean
}) => (
  <div className='space-y-2'>
    {label ? <span className='block text-base font-bold text-[#1A5590]'>{label}</span> : null}
    <div className='flex flex-col sm:flex-row gap-3 w-full'>
      <div className='flex items-center gap-2 w-full sm:flex-1'>
        <span className='text-primary font-bold shrink-0 w-10'>Từ</span>

        <div className='relative flex-1'>
          <Controller
            control={control}
            name={startName}
            render={({ field }) => (
              <DatePicker
                value={field.value as string}
                onChange={field.onChange}
                error={Boolean(startError)}
                placeholder='Bắt đầu'
              />
            )}
          />
          <FieldError id={`${startName}-error`} message={startError} />
        </div>
      </div>
      <div className='flex items-center gap-2 w-full sm:flex-1'>
        <span className='text-primary font-bold shrink-0 w-10'>Đến</span>
        <div className='relative flex-1'>
          {disabledEnd ? (
            <div className='flex h-14 w-full items-center justify-center rounded-md border border-[#C9C9C9] bg-neutral-100 px-4 text-base font-bold text-[#228B22]'>
              HIỆN TẠI
            </div>
          ) : (
            <>
              <Controller
                control={control}
                name={endName}
                render={({ field }) => (
                  <DatePicker
                    value={field.value as string}
                    onChange={field.onChange}
                    error={Boolean(endError)}
                    placeholder='Kết thúc'
                  />
                )}
              />
              <FieldError id={`${endName}-error`} message={endError} />
            </>
          )}
        </div>
      </div>
    </div>
  </div>
)

interface MultiSelectWithCustomInputProps {
  control: Control<CvFormValues>
  name: 'softSkills' | 'hardSkills' | 'workConditions' | 'availableEquipment'
  placeholder?: string
  options?: CvSelectOption[]
}

export const MultiSelectWithCustomInput = ({
  control,
  name,
  placeholder = 'Nhập giá trị tùy chỉnh...',
  options = []
}: MultiSelectWithCustomInputProps) => {
  const [customValue, setCustomValue] = useState('')

  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const isArrayType = Array.isArray(field.value)
        const currentValues: string[] = isArrayType
          ? (field.value as string[])
          : String(field.value || '').split(',').map((v) => v.trim()).filter(Boolean)

        const updateFormValue = (newValues: string[]) => {
          if (isArrayType) {
            field.onChange(newValues)
          } else {
            field.onChange(newValues.join(', '))
          }
        }

        const handleAdd = (valueToAdd: string) => {
          const trimmed = valueToAdd.trim()
          if (!trimmed || currentValues.includes(trimmed)) return

          updateFormValue([...currentValues, trimmed])
        }

        const handleRemove = (valueToRemove: string) => {
          updateFormValue(currentValues.filter((v) => v !== valueToRemove))
        }

        const handleAddCustom = () => {
          if (!customValue.trim()) return
          handleAdd(customValue)
          setCustomValue('')
        }

        return (
          <div className='space-y-1 bg-white/40 p-4 rounded-lg border border-neutral-200/60 shadow-sm'>

            <div className='flex flex-wrap gap-2 pt-1'>
              {options.map((opt) => {
                const isSelected = currentValues.includes(opt.id) || currentValues.includes(opt.label)
                const valueToToggle = opt.label

                return (
                  <button
                    key={opt.id}
                    type='button'
                    onClick={() => {
                      if (isSelected) {
                        handleRemove(valueToToggle)
                      } else {
                        handleAdd(valueToToggle)
                      }
                    }}
                    className={cn(
                      'flex items-center gap-1.5 px-3.5 py-2 rounded-full text-base font-medium transition border shadow-xs',
                      isSelected
                        ? 'bg-primary text-white border-primary shadow-sm hover:bg-[#003466]'
                        : 'bg-white text-primary border-neutral-300 hover:bg-neutral-100 dark:bg-neutral-900 dark:text-neutral-200 dark:border-neutral-700'
                    )}
                  >
                    {opt.label}
                    {isSelected && <X className='h-3.5 w-3.5 ml-0.5' />}
                  </button>
                )
              })}
            </div>

            <div className='relative flex gap-2 pt-2'>
              <input
                type='text'
                value={customValue}
                onChange={(e) => setCustomValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    handleAddCustom()
                  }
                }}
                placeholder={placeholder}
                className={cn(roundedInputClassName, 'flex-1 border border-neutral-300')}
              />
              <button
                type='button'
                onClick={handleAddCustom}
                className='flex h-11 px-5 items-center justify-center gap-2 rounded-md bg-primary text-white font-semibold text-base shadow-sm transition hover:bg-[#003466] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
              >
                <Plus className='h-4 w-4' />
                Thêm
              </button>
            </div>

            {currentValues.length > 0 && (
              <div className='pt-2 border-t border-neutral-200 dark:border-neutral-800'>
                <p className='text-base font-semibold text-neutral-500 mb-2 uppercase tracking-wider'>
                  Đã chọn ({currentValues.length}):
                </p>
                <div className='flex flex-wrap gap-2'>
                  {currentValues.map((val) => (
                    <span
                      key={val}
                      className='inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#EAF4FF] text-primary text-base font-semibold border border-[#B8D5F5]'
                    >
                      {val}
                      <button
                        type='button'
                        onClick={() => handleRemove(val)}
                        className='text-primary hover:text-red-600 transition p-0.5 rounded-full hover:bg-white/60'
                        aria-label={`Xóa ${val}`}
                      >
                        <X className='h-3.5 w-3.5' />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )
      }}
    />
  )
}
