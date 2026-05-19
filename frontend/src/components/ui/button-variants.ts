import { cva } from 'class-variance-authority'

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 dark:focus-visible:ring-brand-primary',
  {
    variants: {
      variant: {
        default: 'bg-brand-primary text-white shadow hover:bg-brand-primary-hover dark:bg-brand-primary dark:text-white dark:hover:bg-brand-primary-hover',
        destructive:
          'bg-red-500 text-neutral-50 shadow-sm hover:bg-red-500/90 dark:bg-red-900 dark:text-neutral-50 dark:hover:bg-red-900/90',
        outline:
          'border border-brand-border bg-white text-brand-primary shadow-sm hover:bg-brand-bg-end hover:text-brand-primary dark:border-brand-primary dark:bg-neutral-950 dark:text-white dark:hover:bg-brand-primary/20',
        secondary:
          'bg-brand-bg-end text-brand-primary shadow-sm hover:bg-brand-border dark:bg-brand-primary/20 dark:text-white dark:hover:bg-brand-primary/30',
        ghost: 'text-brand-primary hover:bg-brand-bg-end hover:text-brand-primary dark:text-white dark:hover:bg-brand-primary/20',
        link: 'text-brand-primary underline-offset-4 hover:underline dark:text-white'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-10 rounded-md px-8',
        icon: 'h-9 w-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)
