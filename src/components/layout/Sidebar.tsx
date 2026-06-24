'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Briefcase,
  MessageSquare,
  Video,
  ArrowLeftRight,
  Sun,
  Moon,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/components/ThemeProvider'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/passport', label: 'Skills Passport', icon: BookOpen },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/learning-path', label: 'Learning Path', icon: Map },
  { href: '/interview-prep', label: 'Interview Prep', icon: MessageSquare },
  { href: '/video-intro', label: 'Video Intro', icon: Video },
]

export default function Sidebar() {
  const path = usePathname()
  const { theme, toggle } = useTheme()

  return (
    <aside className="w-14 shrink-0 bg-[#0D1B2A] min-h-screen flex flex-col items-center py-4 gap-1">

      {/* Logo */}
      <Link
        href="/"
        className="w-9 h-9 rounded-xl bg-blue flex items-center justify-center text-white font-bold text-sm mb-4 hover:opacity-90 transition-opacity"
        title="Home"
      >
        J
      </Link>

      {/* Nav items */}
      <nav className="flex flex-col items-center gap-1 flex-1 w-full px-2">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = path === href || path.startsWith(href + '/')
          return (
            <Link
              key={href}
              href={href}
              title={label}
              className={cn(
                'group relative w-full flex items-center justify-center h-10 rounded-xl transition-all',
                active
                  ? 'bg-blue text-white'
                  : 'text-white/40 hover:text-white hover:bg-white/10',
              )}
            >
              <Icon size={18} />
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
                {label}
              </span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="w-full px-2 flex flex-col gap-1 pb-1">

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          className="group relative w-full flex items-center justify-center h-10 rounded-xl text-white/30 hover:text-white/70 hover:bg-white/10 transition-all"
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </span>
        </button>

        {/* Switch to employer */}
        <Link
          href="/employer-dashboard"
          title="Employer view"
          className="group relative w-full flex items-center justify-center h-10 rounded-xl text-white/30 hover:text-white/60 hover:bg-white/10 transition-all"
        >
          <ArrowLeftRight size={16} />
          <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 bg-gray-900 text-white text-xs font-medium rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-lg">
            Employer view
          </span>
        </Link>
      </div>
    </aside>
  )
}
