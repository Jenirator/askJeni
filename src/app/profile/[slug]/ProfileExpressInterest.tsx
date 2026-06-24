'use client'

import { useState, useEffect } from 'react'
import { hasExpressedInterest } from '@/lib/employer-store'
import ExpressInterestModal from '@/components/employer/ExpressInterestModal'

interface Candidate {
  slug: string
  name: string
  initials: string
  avatarColor: string
  degree: string
  institution: string
  city: string
  salary: number
  available: string
  workType: string
  verified: boolean
}

interface Props {
  candidate: Candidate
  variant?: 'header' | 'bottom-bar'
}

export default function ProfileExpressInterest({ candidate, variant = 'header' }: Props) {
  const [open, setOpen] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    setSent(hasExpressedInterest(candidate.slug))
  }, [candidate.slug])

  const isBottomBar = variant === 'bottom-bar'

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={
          isBottomBar
            ? `text-sm font-semibold px-4 py-2 rounded-btn transition-all ${sent ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-blue text-white hover:opacity-90'}`
            : `text-sm font-semibold px-5 py-2.5 rounded-btn text-center transition-all ${sent ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-blue text-white hover:opacity-90'}`
        }
      >
        {sent ? '✓ Interest sent' : 'Express interest →'}
      </button>

      {open && (
        <ExpressInterestModal
          candidate={candidate}
          onClose={() => {
            setSent(hasExpressedInterest(candidate.slug))
            setOpen(false)
          }}
        />
      )}
    </>
  )
}
