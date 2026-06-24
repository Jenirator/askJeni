'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { loadStudent } from '@/lib/student-store'
import { MOCK_STUDENT } from '@/lib/mock-data'

export default function Topbar() {
  const [firstName, setFirstName] = useState(MOCK_STUDENT.name.split(' ')[0])
  const [initials, setInitials] = useState(
    MOCK_STUDENT.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
  )

  useEffect(() => {
    const stored = loadStudent()
    if (stored) {
      setFirstName(stored.firstName)
      setInitials(`${stored.firstName[0]}${stored.lastName?.[0] ?? ''}`.toUpperCase())
    }
  }, [])

  return (
    <header className="h-14 bg-white border-b border-border flex items-center justify-between px-6 shrink-0">
      <p className="text-sm text-gray-400">
        Hi, <span className="text-navy font-semibold">{firstName}</span>
      </p>
      <div className="flex items-center gap-3">
        <Link
          href="/passport"
          className="text-xs font-semibold text-gray-400 hover:text-navy transition-colors"
        >
          My passport
        </Link>
        <div className="w-8 h-8 rounded-full bg-navy flex items-center justify-center text-xs font-bold text-white">
          {initials}
        </div>
      </div>
    </header>
  )
}
