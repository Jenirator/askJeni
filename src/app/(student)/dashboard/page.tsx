'use client'

import { useEffect, useState } from 'react'
import { loadStudent, type StoredStudent } from '@/lib/student-store'
import ProfileBoostPanel from '@/components/student/ProfileBoostPanel'
import {
  MOCK_STUDENT,
  MOCK_SKILLS,
  MOCK_MATCHES,
  MOCK_ASSESSMENTS_COMPLETED,
  MOCK_ASSESSMENTS_AVAILABLE,
  MOCK_PROFILE_VIEWS,
} from '@/lib/mock-data'
import Link from 'next/link'
import { TrendingUp, Eye, BadgeCheck, ChevronRight } from 'lucide-react'

const COMPANY_COLORS = [
  'bg-[#2563EB]', 'bg-[#7C3AED]', 'bg-[#059669]',
  'bg-[#DC2626]', 'bg-[#D97706]', 'bg-[#0891B2]',
]

function companyColor(name: string) {
  let h = 0
  for (const c of name) h = (h * 31 + c.charCodeAt(0)) & 0xffff
  return COMPANY_COLORS[h % COMPANY_COLORS.length]
}

const CHECKLIST = (stored: StoredStudent | null) => stored ? [
  { label: 'Add your institution & degree', done: !!stored.institution && !!stored.degree },
  { label: 'Select your tech stack', done: Object.keys(stored.skills).length > 0 },
  { label: 'Add your first project', done: false },
  { label: 'Set salary & availability', done: !!stored.salaryExpectation && !!stored.availableFrom },
  { label: 'Verify at least one skill', done: false },
  { label: 'Add a second project', done: false },
] : Array(6).fill({ done: true })

export default function DashboardPage() {
  const [stored, setStored] = useState<StoredStudent | null>(null)
  const [mounted, setMounted] = useState(false)
  const [showBoost, setShowBoost] = useState(false)

  useEffect(() => { setStored(loadStudent()); setMounted(true) }, [])
  if (!mounted) return null

  const firstName = stored ? stored.firstName : MOCK_STUDENT.name.split(' ')[0]
  const name = stored ? `${stored.firstName} ${stored.lastName}` : MOCK_STUDENT.name
  const initials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
  const degree = stored?.degree || MOCK_STUDENT.degree
  const institution = stored?.institution || MOCK_STUDENT.institution
  const score = stored?.passportCompletion ?? MOCK_STUDENT.passportCompletion
  const verifiedSkills = MOCK_SKILLS.filter(s => s.level === 'VERIFIED')
  const checklist = CHECKLIST(stored)
  const views = stored ? 0 : MOCK_PROFILE_VIEWS
  const skillCount = stored ? Object.keys(stored.skills).length : verifiedSkills.length
  const nextTask = checklist.find(c => !c.done)

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'

  return (
    <div className="p-7 max-w-[960px]">

      {/* ── HEADER ROW ── */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue to-[#7C3AED] flex items-center justify-center text-sm font-bold text-white shrink-0 shadow-md">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-2xl font-bold text-navy dark:text-white leading-tight tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-sm text-gray-400 dark:text-white/40 mt-0.5">
            {degree}{institution ? ` · ${institution}` : ''}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {score < 100 && (
            <button
              onClick={() => setShowBoost(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-blue border border-blue/30 bg-blue/5 dark:bg-blue/10 px-3 py-2 rounded-btn hover:bg-blue/10 dark:hover:bg-blue/20 transition-colors"
            >
              ✦ Boost profile
            </button>
          )}
          <Link href="/passport" className="text-xs font-semibold text-gray-400 dark:text-white/30 hover:text-navy dark:hover:text-white transition-colors">
            View passport →
          </Link>
        </div>
      </div>

      {/* ── STAT ROW ── */}
      <div className="grid grid-cols-4 gap-3 mb-8">

        {/* Passport card — gradient hero */}
        <div className="rounded-2xl px-6 py-5 bg-gradient-to-br from-[#0D1B2A] to-[#162E4A] relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'radial-gradient(circle at 70% 20%, #2563EB 0%, transparent 60%)',
          }} />
          <p className="text-4xl font-bold text-yellow leading-none mb-1 relative z-10">{score}%</p>
          <p className="text-xs font-medium text-white/50 relative z-10">Passport complete</p>
          {score < 100 && (
            <div className="mt-3 h-1 bg-white/10 rounded-full overflow-hidden relative z-10">
              <div className="h-full bg-gradient-to-r from-yellow to-[#FFA500] rounded-full transition-all" style={{ width: `${score}%` }} />
            </div>
          )}
        </div>

        {/* Role matches */}
        <StatCard
          value={MOCK_MATCHES.length}
          label="Role matches"
          icon={<TrendingUp size={14} className="text-blue" />}
          href="/opportunities"
        />

        {/* Profile views */}
        <StatCard
          value={views}
          label="Profile views this week"
          icon={<Eye size={14} className="text-purple-500" />}
        />

        {/* Verified skills */}
        <StatCard
          value={skillCount}
          label={stored ? 'Skills added' : 'Verified skills'}
          icon={<BadgeCheck size={14} className="text-green-500" />}
          href="/passport"
        />
      </div>

      {/* ── BOOST PANEL ── */}
      {showBoost && stored && (
        <ProfileBoostPanel
          student={stored}
          onClose={() => setShowBoost(false)}
          onSaved={() => { setStored(loadStudent()); setShowBoost(false) }}
        />
      )}

      {/* ── MATCHES + NEXT STEP ── */}
      <div className="grid grid-cols-3 gap-4 mb-4">

        <div className="col-span-2 bg-white dark:bg-[#111C2E] border border-border dark:border-[#1E2D40] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold dark:text-white">Top role matches</p>
            <Link href="/opportunities" className="text-xs font-semibold text-blue hover:underline flex items-center gap-0.5">
              See all {MOCK_MATCHES.length} <ChevronRight size={12} />
            </Link>
          </div>
          <div className="flex flex-col gap-1">
            {MOCK_MATCHES.slice(0, 3).map(match => {
              const abbr = match.company.split(' ').map((w: string) => w[0]).join('').slice(0, 2)
              const col = companyColor(match.company)
              const scoreColor = match.score >= 90 ? 'text-green-500' : match.score >= 75 ? 'text-blue' : 'text-yellow-600'
              return (
                <Link
                  key={match.id}
                  href="/opportunities"
                  className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group"
                >
                  <div className={`w-9 h-9 rounded-xl ${col} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                    {abbr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold dark:text-white truncate">{match.role}</p>
                    <p className="text-xs text-gray-400 dark:text-white/40">{match.company} · {match.city}</p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <div className="h-1.5 w-16 bg-gray-100 dark:bg-white/10 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${match.score >= 90 ? 'bg-green-400' : match.score >= 75 ? 'bg-blue' : 'bg-yellow-400'}`}
                        style={{ width: `${match.score}%` }}
                      />
                    </div>
                    <span className={`text-sm font-bold w-9 text-right ${scoreColor}`}>{match.score}%</span>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>

        <div className="bg-white dark:bg-[#111C2E] border border-border dark:border-[#1E2D40] rounded-2xl p-5 flex flex-col shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <p className="text-sm font-semibold mb-1 dark:text-white">Next step</p>
          {nextTask ? (
            <>
              <p className="text-xs text-gray-400 dark:text-white/40 mb-4 leading-relaxed flex-1">{nextTask.label}</p>
              <div className="flex flex-col gap-2 mt-auto">
                <div className="flex gap-1 mb-2">
                  {checklist.map((c, i) => (
                    <div key={i} className={`h-1.5 flex-1 rounded-full ${c.done ? 'bg-blue' : 'bg-gray-100 dark:bg-white/10'}`} />
                  ))}
                </div>
                <button
                  onClick={() => setShowBoost(true)}
                  className="w-full bg-navy dark:bg-blue text-white text-xs font-semibold py-2.5 rounded-btn hover:opacity-90"
                >
                  ✦ Help me with this
                </button>
                <Link href="/passport" className="w-full text-center text-xs text-gray-400 dark:text-white/30 hover:text-navy dark:hover:text-white py-1.5 transition-colors">
                  Do it myself →
                </Link>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-4">
              <div className="w-12 h-12 rounded-full bg-green-50 dark:bg-green-900/20 flex items-center justify-center text-2xl mb-3">✓</div>
              <p className="text-sm font-semibold text-green-600">Passport complete!</p>
              <p className="text-xs text-gray-400 dark:text-white/40 mt-1">You're visible to all employers</p>
            </div>
          )}
        </div>
      </div>

      {/* ── BOTTOM ROW ── */}
      <div className="grid grid-cols-3 gap-4">

        {/* Skills */}
        <div className="bg-white dark:bg-[#111C2E] border border-border dark:border-[#1E2D40] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold dark:text-white">Skills</p>
            <Link href="/passport" className="text-xs text-blue font-semibold hover:underline">Edit →</Link>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {stored
              ? Object.entries(stored.skills).slice(0, 8).map(([skillName, level]) => (
                  <span key={skillName} className={`text-xs font-medium px-2.5 py-1 rounded-full ${
                    level === 'confident'
                      ? 'bg-blue/10 dark:bg-blue/30 text-blue dark:text-blue-400'
                      : 'bg-gray-100 dark:bg-white/15 text-gray-600 dark:text-white/70'
                  }`}>
                    {level === 'confident' ? '✓ ' : ''}{skillName}
                  </span>
                ))
              : verifiedSkills.slice(0, 8).map(s => (
                  <span key={s.id} className="text-xs font-medium px-2.5 py-1 rounded-full bg-blue/10 dark:bg-blue/30 text-blue dark:text-blue-400">
                    ✓ {s.name}
                  </span>
                ))
            }
          </div>
        </div>

        {/* Assessments */}
        <div className="bg-white dark:bg-[#111C2E] border border-border dark:border-[#1E2D40] rounded-2xl p-5 shadow-[0_1px_4px_rgba(0,0,0,0.05)]">
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold dark:text-white">Assessments</p>
            <Link href="/passport" className="text-xs text-blue font-semibold hover:underline">View all →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {!stored && MOCK_ASSESSMENTS_COMPLETED.slice(0, 1).map(a => (
              <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 bg-green-50 dark:bg-green-900/15 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate dark:text-white">{a.title}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/40">Completed · Verified</p>
                </div>
                <span className="text-sm font-bold text-green-600">{a.score}</span>
              </div>
            ))}
            {MOCK_ASSESSMENTS_AVAILABLE.slice(0, 2).map(a => (
              <div key={a.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate dark:text-white">{a.title}</p>
                  <p className="text-[11px] text-gray-400 dark:text-white/40">~{a.minutes} min</p>
                </div>
                <button className="text-xs font-semibold text-blue hover:underline shrink-0">Start →</button>
              </div>
            ))}
          </div>
        </div>

        {/* Video intro CTA */}
        <div className="bg-gradient-to-br from-[#0D1B2A] to-[#162E4A] rounded-2xl p-5 flex flex-col relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: 'radial-gradient(circle at 80% 80%, #7C3AED 0%, transparent 60%)',
          }} />
          <div className="flex items-center gap-2 mb-2 relative z-10">
            <span className="text-base">🎥</span>
            <p className="text-sm font-semibold text-white">Video intro</p>
          </div>
          <p className="text-xs text-white/50 leading-relaxed flex-1 mb-4 relative z-10">
            Profiles with a video get <strong className="text-white">3× more</strong> employer interest. 5 questions, 60 seconds each.
          </p>
          <div className="flex gap-1 mb-4 relative z-10">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex-1 h-1 rounded-full bg-white/15" />
            ))}
          </div>
          <Link
            href="/video-intro"
            className="w-full text-center bg-blue text-white text-xs font-semibold py-2.5 rounded-btn hover:opacity-90 transition-opacity relative z-10"
          >
            Record now →
          </Link>
        </div>
      </div>

    </div>
  )
}

function StatCard({
  value, label, icon, href
}: {
  value: number | string
  label: string
  icon?: React.ReactNode
  href?: string
}) {
  const content = (
    <div className="rounded-2xl px-5 py-5 bg-white dark:bg-[#111C2E] border border-border dark:border-[#1E2D40] shadow-[0_1px_4px_rgba(0,0,0,0.05)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-shadow">
      <div className="flex items-center justify-between mb-1">
        {icon && <div className="opacity-70">{icon}</div>}
      </div>
      <p className="text-3xl font-bold text-navy dark:text-white leading-none mb-1">{value}</p>
      <p className="text-xs font-medium text-gray-400 dark:text-white/40">{label}</p>
    </div>
  )
  return href ? <Link href={href}>{content}</Link> : content
}
