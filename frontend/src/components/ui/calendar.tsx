import * as React from 'react'

import dayjs from 'dayjs'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import { cn } from '@/core/lib/utils'

import { buttonVariants } from './button-variants'

export interface CalendarProps {
  mode?: 'single'
  selected?: Date | string
  onSelect?: (date: Date | undefined) => void
  disabled?: (date: Date) => boolean
  className?: string
  initialFocus?: boolean
}

const MONTH_NAMES = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12'
]

const parseDate = (val: Date | string | undefined): dayjs.Dayjs | null => {
  if (!val) return null
  if (val instanceof Date) return dayjs(val)
  if (typeof val === 'string') {
    const parts = val.split('/')
    if (parts.length === 3) {
      const day = Number(parts[0])
      const month = Number(parts[1]) - 1
      const year = Number(parts[2])
      return dayjs(new Date(year, month, day))
    }
    return dayjs(val)
  }
  return null
}

export function Calendar({
  selected,
  onSelect,
  disabled,
  className,
  ...props
}: CalendarProps) {
  const parsedSelected = parseDate(selected)
  const [currentMonth, setCurrentMonth] = React.useState(() =>
    parsedSelected && parsedSelected.isValid() ? parsedSelected.clone() : dayjs()
  )

  const startOfMonth = currentMonth.startOf('month')
  const startDayOfWeek = startOfMonth.day() // 0 is Sunday, 1 is Monday...
  const daysInMonth = currentMonth.daysInMonth()

  // Generate calendar grid
  const days: (dayjs.Dayjs | null)[] = []
  // Add empty slots for previous month
  for (let i = 0; i < startDayOfWeek; i++) {
    days.push(null)
  }
  // Add days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(currentMonth.date(i))
  }

  const handlePrevMonth = () => {
    setCurrentMonth(currentMonth.subtract(1, 'month'))
  }

  const handleNextMonth = () => {
    setCurrentMonth(currentMonth.add(1, 'month'))
  }

  return (
    <div
      className={cn(
        'p-3 bg-white rounded-md border border-neutral-200 shadow-sm dark:bg-neutral-950 dark:border-neutral-800',
        className
      )}
      {...props}
    >
      <div className='flex items-center justify-between pt-1 pb-4'>
        <button
          type='button'
          onClick={handlePrevMonth}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
          )}
        >
          <ChevronLeft className='h-4 w-4' />
        </button>

        <div className='flex items-center gap-1'>
          <select
            value={currentMonth.month()}
            onChange={(e) =>
              setCurrentMonth(currentMonth.month(Number(e.target.value)))
            }
            className='text-base font-medium bg-transparent border-0 pr-1 cursor-pointer focus:outline-none text-primary dark:text-neutral-100'
          >
            {MONTH_NAMES.map((name, i) => (
              <option key={name} value={i} className='text-neutral-900'>
                {name}
              </option>
            ))}
          </select>
          <select
            value={currentMonth.year()}
            onChange={(e) =>
              setCurrentMonth(currentMonth.year(Number(e.target.value)))
            }
            className='text-base font-medium bg-transparent border-0 pr-1 cursor-pointer focus:outline-none text-primary dark:text-neutral-100'
          >
            {Array.from({ length: 100 }, (_, i) => dayjs().year() - i).map(
              (year) => (
                <option key={year} value={year} className='text-neutral-900'>
                  {year}
                </option>
              )
            )}
          </select>
        </div>

        <button
          type='button'
          onClick={handleNextMonth}
          className={cn(
            buttonVariants({ variant: 'outline' }),
            'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
          )}
        >
          <ChevronRight className='h-4 w-4' />
        </button>
      </div>
      <div className='grid grid-cols-7 gap-1 text-center mb-2'>
        {['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'].map((day) => (
          <div
            key={day}
            className='text-[0.8rem] font-medium text-neutral-500 dark:text-neutral-400 py-1'
          >
            {day}
          </div>
        ))}
      </div>
      <div className='grid grid-cols-7 gap-1'>
        {days.map((dayObj, index) => {
          if (!dayObj) {
            return <div key={`empty-${index}`} className='h-9 w-9' />
          }
          const isSelected = parsedSelected ? parsedSelected.isSame(dayObj, 'day') : false
          const isDisabled = disabled ? disabled(dayObj.toDate()) : false

          return (
            <button
              key={dayObj.format('YYYY-MM-DD')}
              type='button'
              disabled={isDisabled}
              onClick={() => onSelect?.(dayObj.toDate())}
              className={cn(
                buttonVariants({ variant: isSelected ? 'default' : 'ghost' }),
                'h-9 w-9 p-0 font-normal text-sm rounded-md aria-selected:opacity-100',
                isSelected && 'bg-[#004080] text-white hover:bg-[#003466]',
                !isSelected &&
                !isDisabled &&
                'hover:bg-neutral-100 text-neutral-900 dark:text-neutral-100 dark:hover:bg-neutral-800',
                isDisabled && 'opacity-30 cursor-not-allowed'
              )}
            >
              {dayObj.date()}
            </button>
          )
        })}
      </div>
    </div>
  )
}
