'use client'

import { useState } from 'react'
import { saveInterest, hasExpressedInterest } from '@/lib/employer-store'
import { formatRand } from '@/lib/utils'

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
  onClose: () => void
}

const ROLE_SUGGESTIONS = [
  'Junior Software Engineer',
  'Graduate Developer',
  'Software Engineer Intern',
  'Junior Frontend Developer',
  'Junior Backend Developer',
  'Junior Full-Stack Developer',
  'Vacation Work / Internship',
]

export default function ExpressInterestModal({ candidate, onClose }: Props) {
  const alreadySent = hasExpressedInterest(candidate.slug)
  const [step, setStep] = useState<'form' | 'sent'>(alreadySent ? 'sent' : 'form')
  const [companyName, setCompanyName] = useState('')
  const [roleName, setRoleName] = useState('')
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  function handleSend() {
    if (!companyName.trim() || !roleName.trim()) return
    setSubmitting(true)
    // Small delay so it feels intentional
    setTimeout(() => {
      saveInterest({
        candidateSlug: candidate.slug,
        candidateName: candidate.name,
        companyName: companyName.trim(),
        roleName: roleName.trim(),
        message: message.trim(),
      })
      setSubmitting(false)
      setStep('sent')
    }, 600)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-navy/50 backdrop-blur-sm z-50 flex items-center justify-center px-4"
        onClick={e => { if (e.target === e.currentTarget) onClose() }}
      >
        <div className="bg-white rounded-card w-full max-w-[520px] shadow-2xl overflow-hidden">

          {/* Candidate header */}
          <div className="bg-navy px-6 py-5 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full ${candidate.avatarColor} flex items-center justify-center text-base font-bold text-white shrink-0 border-2 border-white/15`}>
              {candidate.initials}
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-white">{candidate.name}</p>
              <p className="text-xs text-white/50">{candidate.degree} · {candidate.institution}</p>
            </div>
            <div className="flex flex-col items-end gap-1 text-right shrink-0">
              {candidate.verified && (
                <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">✓ Verified</span>
              )}
              <span className="text-xs text-white/40">{formatRand(candidate.salary)}/mo · {candidate.city}</span>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white ml-2 text-xl leading-none shrink-0">×</button>
          </div>

          {step === 'form' ? (
            <div className="px-6 py-6">
              <h2 className="text-[17px] font-bold mb-1">Express interest in {candidate.name.split(' ')[0]}</h2>
              <p className="text-sm text-gray-500 mb-5 leading-relaxed">
                {candidate.name.split(' ')[0]} will be notified and can choose to share their contact details with you. They stay in control — no pressure on either side.
              </p>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-semibold">Your company name</label>
                <input
                  value={companyName}
                  onChange={e => setCompanyName(e.target.value)}
                  type="text"
                  placeholder="e.g. Peach Payments"
                  className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue"
                />
              </div>

              <div className="flex flex-col gap-1.5 mb-4">
                <label className="text-sm font-semibold">Role you have in mind</label>
                <input
                  value={roleName}
                  onChange={e => setRoleName(e.target.value)}
                  type="text"
                  placeholder="e.g. Junior Software Engineer"
                  className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue"
                />
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {ROLE_SUGGESTIONS.map(r => (
                    <button
                      key={r}
                      onClick={() => setRoleName(r)}
                      className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${roleName === r ? 'bg-blue/10 border-blue text-blue' : 'border-border text-gray-500 hover:border-blue hover:text-blue'}`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold">
                  Brief note <span className="text-xs font-normal text-gray-400 ml-1">optional — max 3 sentences</span>
                </label>
                <textarea
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={3}
                  placeholder={`Hi ${candidate.name.split(' ')[0]}, we're building a payments team at ${companyName || 'our company'} and your React and Python skills caught our attention…`}
                  className="px-3 py-2.5 border border-border rounded-btn text-sm outline-none focus:border-blue resize-none leading-relaxed"
                  maxLength={400}
                />
                <p className="text-[11px] text-gray-400 text-right">{message.length}/400</p>
              </div>

              <div className="bg-blue/5 border border-blue/15 rounded-xl px-4 py-3 mb-5">
                <p className="text-xs text-gray-600 leading-relaxed">
                  <strong className="text-navy">How this works:</strong> {candidate.name.split(' ')[0]} will see your company name, the role, and your note. They can accept (sharing their email with you) or decline. You won&apos;t see their contact details until they accept.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border border-border text-sm font-semibold py-2.5 rounded-btn text-gray-600 hover:border-navy transition-colors">
                  Cancel
                </button>
                <button
                  onClick={handleSend}
                  disabled={!companyName.trim() || !roleName.trim() || submitting}
                  className="flex-1 bg-blue text-white text-sm font-semibold py-2.5 rounded-btn hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  {submitting ? 'Sending…' : `Send interest →`}
                </button>
              </div>
            </div>
          ) : (
            <div className="px-6 py-10 text-center">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
              <h2 className="text-[18px] font-bold mb-2">Interest sent to {candidate.name.split(' ')[0]}</h2>
              <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto mb-6">
                {candidate.name.split(' ')[0]} will be notified. If they accept, you&apos;ll receive their contact details by email. Most students respond within 48 hours.
              </p>
              <div className="bg-gray-50 border border-border rounded-xl px-4 py-3 text-left mb-6">
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">What happens next</p>
                <div className="flex flex-col gap-2">
                  {[
                    { done: true, label: `Interest sent to ${candidate.name.split(' ')[0]}` },
                    { done: false, label: `${candidate.name.split(' ')[0]} reviews and accepts or declines` },
                    { done: false, label: 'You receive their contact details by email' },
                    { done: false, label: 'Schedule an intro call or send a take-home task' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2.5 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${item.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 border border-border text-gray-300'}`}>
                        {item.done ? '✓' : i + 1}
                      </div>
                      <span className={item.done ? 'text-gray-400 line-through' : 'text-navy'}>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={onClose} className="flex-1 border border-border text-sm font-semibold py-2.5 rounded-btn text-gray-600 hover:border-navy">
                  Back to browse
                </button>
                <button
                  onClick={() => { window.location.href = `/profile/${candidate.slug}` }}
                  className="flex-1 bg-blue/10 text-blue text-sm font-semibold py-2.5 rounded-btn hover:opacity-80"
                >
                  View full profile →
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  )
}
