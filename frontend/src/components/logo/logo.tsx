import { Link } from 'react-router-dom'

import { ROUTE } from '@/core/constants/path'
import { cn } from '@/core/lib/utils'

const Logo = ({ className = '' }) => {
  return (
    <Link
      to={ROUTE.PUBLIC.HOME}
      className={cn(
        'inline-flex items-center rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2',
        className
      )}
      aria-label='D Shiftify home'
    >
      <img src='/logo.svg' alt='D Shiftify' className='h-10 w-auto max-w-[180px] object-contain' />
    </Link>
  )
}

export default Logo
