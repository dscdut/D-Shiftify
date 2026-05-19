import { type ReactNode, useMemo, useState } from 'react'

import { Bell, BriefcaseBusiness, Grid2X2, HelpCircle, Mail, Menu, Search, UserRound, X } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

import { ROUTE } from '@/core/constants/path'
import { cn } from '@/core/lib/utils'
import { useAuthStore } from '@/core/store/features/auth/authStore'
import { VoiceListeningPopup } from '@/pages/disability/cv/components/voice-button'

interface DisabilityLayoutProps {
  children?: ReactNode
  className?: string
  contentClassName?: string
}

const getInitials = (name: string) => {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function DisabilityLayout({ children, className, contentClassName }: DisabilityLayoutProps) {
  const location = useLocation()
  const { user } = useAuthStore()
  const [menuOpen, setMenuOpen] = useState(false)
  const userName = user?.name || 'Trần Văn A'
  const userEmail = user?.email || 'abc123456@gmail.com'

  const navItems = useMemo(
    () => [
      { label: 'THÔNG BÁO', path: ROUTE.DISABILITY.NOTIFICATIONS, icon: Bell },
      { label: 'DASHBOARD', path: ROUTE.DISABILITY.DASHBOARD, icon: Grid2X2 },
      { label: 'TIN NHẮN', path: ROUTE.DISABILITY.MESSAGES, icon: Mail },
      { label: 'ỨNG TUYỂN', path: ROUTE.DISABILITY.APPLICATIONS, icon: BriefcaseBusiness },
      { label: 'TÌM VIỆC', path: ROUTE.DISABILITY.JOBS, icon: Search },
      { label: 'HỒ SƠ', path: ROUTE.DISABILITY.CV, icon: UserRound }
    ],
    []
  )

  const renderNavLink = (item: (typeof navItems)[number]) => {
    const Icon = item.icon
    const isActive =
      location.pathname === item.path ||
      (item.path === ROUTE.DISABILITY.CV && location.pathname.startsWith('/disability/cv'))

    return (
      <Link
        key={item.label}
        to={item.path}
        className={cn(
          'flex items-center gap-2 border-b-2 border-transparent py-2 text-sm font-medium tracking-wide text-primary transition hover:border-primary/40',
          isActive && 'border-primary font-bold'
        )}
        onClick={() => setMenuOpen(false)}
      >
        <Icon className='h-4 w-4' aria-hidden='true' />
        {item.label}
      </Link>
    )
  }

  return (
    <section
      className={cn('min-h-screen bg-gradient-to-br from-[#F8FBFF] to-[#EAF4FF] font-sans text-primary', className)}
    >
      <header className='sticky top-0 z-40 border-b border-[#E4E4E4] bg-white'>
        <div className='mx-auto flex h-16 max-w-[1440px] items-center justify-between px-5 sm:px-8 lg:h-[84px]'>
          <div className='flex items-center gap-3'>
            <button
              type='button'
              className='flex h-9 w-9 items-center justify-center rounded-[2px]  text-primary lg:hidden'
              aria-label={menuOpen ? 'Đóng menu' : 'Mở menu'}
              onClick={() => setMenuOpen((current) => !current)}
            >
              {menuOpen ? <X className='h-6 w-6' /> : <Menu className='h-7 w-7' />}
            </button>
            <Link
              to={ROUTE.DISABILITY.DASHBOARD}
              className='inline-flex items-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2'
              aria-label='D Shiftify home'
            >
              <img src='/logo.svg' alt='D Shiftify' className='h-8 w-auto max-w-[150px] object-contain' />
            </Link>
          </div>

          <nav className='hidden items-center gap-7 lg:flex' aria-label='Disability navigation'>
            {navItems.map(renderNavLink)}
          </nav>

          <div className='hidden items-center gap-3 rounded-lg bg-white px-3 py-2 shadow-sm lg:flex'>
            <div className='text-right'>
              <p className='text-xs font-bold uppercase text-primary'>{userName}</p>
              <p className='text-[10px] text-slate-500'>{userEmail}</p>
            </div>
            <div className='flex h-9 w-9 items-center justify-center rounded-md bg-slate-900 text-xs font-semibold text-white'>
              {getInitials(userName) || <UserRound className='h-5 w-5' aria-hidden='true' />}
            </div>
          </div>

          <button type='button' className='text-[#777] lg:hidden' aria-label='Trợ giúp'>
            <HelpCircle className='h-5 w-5' />
          </button>
        </div>

        {menuOpen ? (
          <nav
            className='grid gap-1 border-t border-[#E4E4E4] bg-white px-5 py-3 lg:hidden'
            aria-label='Mobile disability navigation'
          >
            {navItems.map(renderNavLink)}
          </nav>
        ) : null}
      </header>

      <VoiceListeningPopup />

      <main className={cn('min-h-[calc(100vh-64px)] lg:min-h-[calc(100vh-84px)]', contentClassName)}>
        {children || <Outlet />}
      </main>
    </section>
  )
}
