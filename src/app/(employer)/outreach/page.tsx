'use client'

import { useState, useEffect } from 'react'
import { getInterests, type InterestRecord } from '@/lib/employer-store'
import { MOCK_CANDIDATES } from '@/lib/mock-data'
import { formatRand } from '@/lib/utils'
import Link from 'next/link'
import ExpressInterestModal from '@/components/employer/ExpressInterestModal'

type CandidateMap = Record<string, typeof MOCK_CANDIDATES[0]>

const CANDIDATE_MAP: CandidateMap = Object.fromEntries(
  MOCK_CANDIDATES.map(c => [c.slug, c])
)

const STATUS_CONFIG = {
  pending: { label: 'Awaiting response', dot: 'bg-yellow', text: 'text-yellow-700', bg: 'bg-yellow/10 border-yellow/20' },
  accepted: { label: 'Accepted ✓', dot: 'bg-green-500', text: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  declined: { label: 'Declined', dot: 'bg-gray-300', text: 'text-gray-500', bg: 'bg-gray-50 border-gray-200' },
}

function timeAgo(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  return `${days}d ago`
}

export default function OutreachPage() {
  const [records, setRecords] = useState<InterestRecord[]>([])
  const [filter, setFilter] = useState<'all' | 'pending' | 'accepted' | 'declined'>('all')
  const [reachOutCandidate, setReachOutCandidate] = useState<typeof MOCK_CANDIDATES[0] | null>(null)

  useEffect(() => {
    setRecords(getInterests())
  }, [])

  function refresh() {
    setRecords(getInterests())
    setReachOutCandidate(null)
  }

  const filtered = filter === 'all' ? records : records.filter(r => r.status === filter)
  const counts = {
    all: records.length,
    pending: records.filter(r => r.status === 'pending').length,
    accepted: records.filter(r => r.status === 'accepted').length,
    declined: records.filter(r => r.status === 'declined').length,
  }

  return (
    <>
      <div className="max-w-[900px] mx-auto px-8 py-10">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-[22px] font-bold tracking-tight mb-1">My outreach</h1>
          <p className="text-sm text-gray-500">Candidates you've expressed interest in — auto-updated as they respond.</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 mb-7">
          {([
            { key: 'all', label: 'Total reached out', color: 'text-navy' },
            { key: 'pending', label: 'Awaiting response', color: 'text-yellow-700' },
            { key: 'accepted', label: 'Accepted', color: 'text-green-600' },
            { key: 'declined', label: 'Declined', color: 'text-gray-500' },
          ] as const).map(({ key, label, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`bg-white border rounded-card px-4 py-4 text-left transition-all hover:border-blue/40 ${filter === key ? 'border-blue shadow-sm' : 'border-border'}`}
            >
              <p className={`text-2xl font-bold ${color} mb-0.5`}>{counts[key]}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </button>
          ))}
        </div>

        {/* Empty state */}
        {records.length === 0 ? (
          <div className="bg-white border border-border rounded-card px-8 py-16 text-center">
            <div className="w-14 h-14 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-4 text-2xl">📬</div>
            <p className="text-base font-semibold mb-1">No outreach yet</p>
            <p className="text-sm text-gray-500 mb-5 max-w-xs mx-auto">Go to Browse candidates and click "Express interest →" on anyone who catches your eye.</p>
            <Link href="/browse" className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-90">
              Browse candidates →
            </Link>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div className="flex items-center gap-1 mb-4">
              {(['all', 'pending', 'accepted', 'declined'] as const).map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`text-sm px-3.5 py-1.5 rounded-btn font-medium transition-all ${
                    filter === f ? 'bg-navy text-white' : 'text-gray-500 hover:text-navy hover:bg-gray-100'
                  }`}
                >
                  {f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
                  <span className={`ml-1.5 text-[11px] px-1.5 py-0.5 rounded-full ${filter === f ? 'bg-white/20' : 'bg-gray-100'}`}>
                    {counts[f]}
                  </span>
                </button>
              ))}
            </div>

            {/* Records list */}
            <div className="flex flex-col gap-3">
              {filtered.length === 0 ? (
                <div className="bg-white border border-border rounded-card px-6 py-10 text-center text-sm text-gray-400">
                  No {filter} outreach yet.
                </div>
              ) : (
                filtered.map(record => {
                  const candidate = CANDIDATE_MAP[record.candidateSlug]
                  const status = STATUS_CONFIG[record.status]

                  return (
                    <div key={record.id} className="bg-white border border-border rounded-card overflow-hidden hover:border-blue/30 transition-all">
                      <div className="flex items-start gap-4 px-5 py-4">

                        {/* Avatar */}
                        {candidate ? (
                          <div className={`w-11 h-11 rounded-full ${candidate.avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0 border-2 border-white/15`}>
                            {candidate.initials}
                          </div>
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-gray-200 flex items-center justify-center text-sm font-bold text-gray-500 shrink-0">
                            {record.candidateName.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </div>
                        )}

                        {/* Main info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <p className="text-sm font-semibold">{record.candidateName}</p>
                            {candidate && (
                              <span className="text-xs text-gray-400">{candidate.degree} · {candidate.institution} · {candidate.city}</span>
                            )}
                          </div>

                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${status.bg} ${status.text}`}>
                              <span className={`inline-block w-1.5 h-1.5 rounded-full ${status.dot} mr-1.5 align-middle`} />
                              {status.label}
                            </span>
                            <span className="text-xs text-gray-400">Sent {timeAgo(record.sentAt)}</span>
                            {candidate && (
                              <span className="text-xs text-gray-400">{formatRand(candidate.salary)}/mo</span>
                            )}
                          </div>

                          <div className="bg-gray-50 border border-border rounded-lg px-3 py-2.5 flex flex-col gap-1">
                            <div className="flex gap-4 text-xs">
                              <span className="text-gray-400">Role</span>
                              <span className="font-medium text-navy">{record.roleName}</span>
                            </div>
                            <div className="flex gap-4 text-xs">
                              <span className="text-gray-400">Company</span>
                              <span className="font-medium text-navy">{record.companyName}</span>
                            </div>
                            {record.message && (
                              <div className="flex gap-4 text-xs pt-1 border-t border-border mt-1">
                                <span className="text-gray-400 shrink-0">Note</span>
                                <span className="text-gray-600 leading-relaxed">{record.message}</span>
                              </div>
                            )}
                          </div>

                          {record.status === 'accepted' && (
                            <div className="mt-2.5 bg-green-50 border border-green-200 rounded-lg px-3 py-2 flex items-center gap-2">
                              <span className="text-green-600 text-sm">✓</span>
                              <p className="text-xs text-green-700 font-medium">
                                {record.candidateName.split(' ')[0]} accepted — their contact details would appear here in production.
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 shrink-0">
                          {candidate && (
                            <Link
                              href={`/profile/${record.candidateSlug}`}
                              className="text-xs font-semibold text-blue hover:underline text-right"
                            >
                              View profile →
                            </Link>
                          )}
                          {record.status === 'declined' && candidate && (
                            <button
                              onClick={() => setReachOutCandidate(candidate)}
                              className="text-xs font-semibold text-gray-400 hover:text-navy"
                            >
                              Try again
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })
              )}
            </div>

            {/* Browse more */}
            <div className="mt-6 text-center">
              <Link href="/browse" className="text-sm font-semibold text-blue hover:underline">
                Browse more candidates →
              </Link>
            </div>
          </>
        )}
      </div>

      {reachOutCandidate && (
        <ExpressInterestModal
          candidate={reachOutCandidate}
          onClose={refresh}
        />
      )}
    </>
  )
}
