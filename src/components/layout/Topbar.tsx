'use client'

import { signOut } from 'next-auth/react'
import { LogOut } from 'lucide-react'

interface TopbarProps {
  userName?: string | null
}

export default function Topbar({ userName }: TopbarProps) {
  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <span className="text-sm text-gray-500">
        {userName ? `Hi, ${userName.split(' ')[0]}` : ''}
      </span>
      <button
        onClick={() => signOut({ callbackUrl: '/login' })}
        className="flex items-center gap-2 text-xs text-gray-400 hover:text-navy transition-colors"
      >
        <LogOut size={14} />
        Sign out
      </button>
    </header>
  )
}
