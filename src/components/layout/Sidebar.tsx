'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  BookOpen,
  Map,
  Briefcase,
  MessageSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/passport', label: 'Skills Passport', icon: BookOpen },
  { href: '/learning-path', label: 'Learning Path', icon: Map },
  { href: '/opportunities', label: 'Opportunities', icon: Briefcase },
  { href: '/interview-prep', label: 'Interview Prep', icon: MessageSquare },
]

export default function Sidebar() {
  const path = usePathname()
  return (
    <aside className="w-56 shrink-0 bg-navy min-h-screen flex flex-col py-6 px-4">
      <span className="text-white font-bold text-lg mb-8 px-2">askJeni</span>
      <nav className="flex flex-col gap-1">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2 rounded-btn text-sm transition-colors',
              path === href || path.startsWith(href + '/')
                ? 'bg-blue text-white'
                : 'text-white/70 hover:text-white hover:bg-white/10',
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>
    </aside>
  )
}
