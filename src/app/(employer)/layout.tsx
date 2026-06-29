'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ArrowLeftRight } from 'lucide-react'
import Logo from '@/components/Logo'

const NAV = [
  { href: '/employer-dashboard', label: 'Dashboard' },
  { href: '/pipeline', label: 'Pipeline' },
  { href: '/browse', label: 'Browse talent' },
  { href: '/outreach', label: 'Outreach' },
]

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  const path = usePathname()
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <nav className="bg-navy h-[52px] flex items-center justify-between px-8 sticky top-0 z-50">
        <div className="flex items-center gap-8">
          <Link href="/" className="hover:opacity-80 transition-opacity">
            <Logo size={18} variant="light" />
          </Link>
          <div className="flex items-center gap-1">
            {NAV.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`text-sm px-3 py-1.5 rounded-btn transition-colors ${
                  path === href || path.startsWith(href + '/')
                    ? 'text-white bg-white/10'
                    : 'text-white/50 hover:text-white'
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-white/40 hover:text-white/70 transition-colors"
          >
            <ArrowLeftRight size={12} />
            Student view
          </Link>
          <Link
            href="/apply/peach-payments/junior-software-engineer"
            target="_blank"
            className="text-xs font-semibold text-white/60 hover:text-white border border-white/20 px-3 py-1.5 rounded-btn hover:border-white/40 transition-all"
          >
            View apply portal ↗
          </Link>
          <Link href="/roles/new" className="flex items-center gap-1.5 bg-blue text-white text-xs font-semibold px-4 py-1.5 rounded-btn hover:opacity-90 transition-opacity">
            + Post a role
          </Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
