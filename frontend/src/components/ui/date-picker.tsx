import * as React from 'react'

import dayjs from 'dayjs'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { cn } from '@/core/lib/utils'

export interface DatePickerProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  error?: boolean
}

export function DatePicker({
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  className,
  disabled,
  error
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      onChange?.(dayjs(date).format('DD/MM/YYYY'))
      setOpen(false)
    } else {
      onChange?.('')
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          disabled={disabled}
          className={cn(
            'w-full h-14 px-4 text-left font-normal border-[#C9C9C9] hover:bg-white hover:text-primary text-primary justify-start text-base shadow-none rounded-md transition focus:border-[#004080] focus:ring-2 focus:ring-[#004080]/15',
            !value && 'text-[#8B8B8B]',
            error && 'border-red-500 ring-2 ring-red-100',
            className
          )}
        >
          <CalendarIcon className='mr-3 h-5 w-5 text-primary' />
          {value || placeholder}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={value}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
