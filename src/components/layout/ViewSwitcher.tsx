'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { GraduationCap, Briefcase } from 'lucide-react'

export default function ViewSwitcher() {
  const path = usePathname()
  const isEmployer = path.startsWith('/browse') || path.startsWith('/outreach')

  return (
    <div className="flex items-center gap-0.5 bg-black/20 rounded-btn p-0.5">
      <Link
        href="/dashboard"
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-all ${
          !isEmployer ? 'bg-white text-navy shadow-sm' : 'text-white/60 hover:text-white'
        }`}
      >
        <GraduationCap size={12} />
        Student
      </Link>
      <Link
        href="/browse"
        className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded transition-all ${
          isEmployer ? 'bg-white text-navy shadow-sm' : 'text-white/60 hover:text-white'
        }`}
      >
        <Briefcase size={12} />
        Employer
      </Link>
    </div>
  )
}
