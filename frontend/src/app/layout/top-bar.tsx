import { Activity, Bell, HelpCircle, LogOut, MessageSquare, Search, Settings, Shield, User, Zap } from 'lucide-react'

import { Badge } from '@/components'
import Logo from '@/components/logo/logo'
import { ThemeToggle } from '@/components/theme/theme-toogle'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { cn } from '@/core/lib/utils'
import useToggleSideBar from '@/core/store/features/sidebar'

const TopBar = () => {
  const user = {
    name: 'John Doe',
    email: 'admin@company.com',
    avatar: 'https://i.pravatar.cc/150?img=3',
    role: 'Super Admin'
  }

  const { sidebarOpen } = useToggleSideBar()

  const handleLogout = () => {
    // Implement logout logic here
  }

  return (
    <header className='flex relative z-30 justify-between items-center px-6 h-16 border-b shadow-lg backdrop-blur-xl border-brand-border/80 bg-gradient-to-r from-brand-bg-start/95 to-brand-bg-end/95 dark:bg-gray-800 dark:border-gray-700'>
      {/* Left Section */}
      <div className='flex gap-6 items-center'>
        <div className='transition-all duration-200 hover:scale-105'>
          <Logo />
        </div>

        {/* Search Bar */}
        <div className='hidden relative md:block'>
          <Search className='absolute left-3 top-1/2 w-4 h-4 text-gray-400 transform -translate-y-1/2' />
          <input
            type='text'
            placeholder='Search anything...'
            className='py-2 pr-4 pl-10 w-80 text-sm rounded-xl border transition-all duration-300 bg-white/70 dark:bg-gray-800/50 border-brand-border dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary placeholder:text-gray-400'
          />
          <kbd className='absolute right-3 top-1/2 px-2 py-1 font-mono text-xs text-gray-500 rounded border transform -translate-y-1/2 bg-brand-bg-end dark:bg-gray-800 border-brand-border dark:border-gray-700 dark:text-gray-400'>
            ⌘K
          </kbd>
        </div>
      </div>

      {/* Right Section */}
      <div className='flex gap-3 items-center'>
        {/* Quick Stats */}
        <div className='hidden gap-4 items-center mr-4 lg:flex'>
          <div className='flex items-center gap-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800'>
            <Activity className='w-4 h-4 text-green-600 dark:text-green-400' />
            <span className='text-sm font-medium text-green-700 dark:text-green-300'>Online</span>
          </div>
          <div className='flex items-center gap-2 px-3 py-1.5 bg-brand-bg-end dark:bg-brand-primary/20 rounded-lg border border-brand-border dark:border-brand-primary'>
            <Zap className='w-4 h-4 text-brand-primary dark:text-brand-bg-end' />
            <span className='text-sm font-medium text-brand-primary dark:text-brand-bg-end'>98% Uptime</span>
          </div>
        </div>

        {/* Notifications */}
        <Button
          variant='ghost'
          size='icon'
          className='relative w-10 h-10 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 group'
          aria-label='Notifications'
        >
          <Bell className='w-5 h-5 transition-colors text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white' />
          <Badge className='absolute -top-1 -right-1 p-0 w-5 h-5 text-xs text-white bg-red-500 border-2 border-white hover:bg-red-500 dark:border-slate-900'>
            3
          </Badge>
        </Button>

        {/* Messages */}
        <Button
          variant='ghost'
          size='icon'
          className='relative w-10 h-10 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 group'
          aria-label='Messages'
        >
          <MessageSquare className='w-5 h-5 transition-colors text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white' />
          <Badge className='absolute -top-1 -right-1 p-0 w-5 h-5 text-xs text-white bg-brand-primary border-2 border-white hover:bg-brand-primary dark:border-slate-900'>
            5
          </Badge>
        </Button>

        {/* Theme Toggle */}
        <div className='transition-all duration-200 hover:scale-105'>
          <ThemeToggle />
        </div>

        {/* Divider */}
        <div className='w-px h-6 bg-gradient-to-b from-transparent to-transparent via-slate-300 dark:via-slate-600' />

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant='ghost'
              className={cn(
                'relative gap-3 pr-4 pl-3 h-10 rounded-xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800 group',
                sidebarOpen ? 'w-auto' : 'justify-center px-0 w-10'
              )}
              aria-label='Open user menu'
            >
              <div className='relative'>
                <Avatar className='w-7 h-7 border-2 transition-all duration-300 border-brand-border dark:border-slate-700 group-hover:border-brand-primary dark:group-hover:border-brand-primary'>
                  <AvatarImage src={user.avatar} alt={user.name} className='rounded-full' />
                  <AvatarFallback className='text-xs font-semibold text-white bg-brand-primary'>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full'></div>
              </div>

              {sidebarOpen && (
                <div className='flex-1 min-w-0 text-left'>
                  <p className='text-sm font-medium truncate text-slate-900 dark:text-slate-100'>{user.name}</p>
                  <p className='text-xs truncate text-slate-500 dark:text-slate-400'>{user.role}</p>
                </div>
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align='end'
            className='p-2 mt-2 w-64 rounded-2xl border shadow-2xl backdrop-blur-xl border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-900/95'
            sideOffset={8}
          >
            {/* User Info Header */}
            <div className='px-3 py-4 mb-2 bg-gradient-to-br rounded-xl border-b border-slate-100 dark:border-slate-800 from-slate-50 to-slate-100 dark:from-slate-800/50 dark:to-slate-900/50'>
              <div className='flex gap-3 items-center'>
                <Avatar className='w-12 h-12 border-2 border-white shadow-lg dark:border-slate-700'>
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className='text-sm font-semibold text-white bg-brand-primary'>
                    {user.name
                      .split(' ')
                      .map((n) => n[0])
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-semibold truncate text-slate-900 dark:text-slate-100'>{user.name}</p>
                  <p className='text-xs truncate text-slate-500 dark:text-slate-400'>{user.email}</p>
                  <Badge
                    variant='secondary'
                    className='mt-1 text-xs text-brand-primary bg-brand-bg-end dark:bg-brand-primary/30 dark:text-brand-bg-end'
                  >
                    {user.role}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <DropdownMenuItem className='px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
              <User className='mr-3 w-4 h-4 text-slate-500' />
              <span className='font-medium'>View Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem className='px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
              <Settings className='mr-3 w-4 h-4 text-slate-500' />
              <span className='font-medium'>Account Settings</span>
            </DropdownMenuItem>

            <DropdownMenuItem className='px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
              <Shield className='mr-3 w-4 h-4 text-slate-500' />
              <span className='font-medium'>Security</span>
            </DropdownMenuItem>

            <DropdownMenuItem className='px-3 py-2.5 rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors'>
              <HelpCircle className='mr-3 w-4 h-4 text-slate-500' />
              <span className='font-medium'>Help & Support</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator className='my-2 bg-slate-200 dark:bg-slate-700' />

            <DropdownMenuItem
              className='px-3 py-2.5 rounded-lg cursor-pointer text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors'
              onClick={handleLogout}
            >
              <LogOut className='mr-3 w-4 h-4' />
              <span className='font-medium'>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}

export default TopBar
