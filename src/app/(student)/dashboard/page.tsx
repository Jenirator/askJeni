import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SkillLevel } from '@prisma/client'
import { computePassportCompletion, formatRand } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      user: true,
      skills: { include: { skill: true } },
      projects: true,
      matches: {
        include: { opportunity: { include: { employer: { include: { user: true } } } } },
        orderBy: { score: 'desc' },
        take: 4,
      },
    },
  })

  if (!profile) redirect('/register')

  const assessmentAttempts = await prisma.assessmentAttempt.findMany({
    where: { userId: session.user.id, status: 'COMPLETED' },
    include: { assessment: true },
    orderBy: { completedAt: 'desc' },
  })

  const availableAssessments = await prisma.assessment.findMany({
    where: { isPublished: true },
    take: 4,
  })

  const score = computePassportCompletion(profile)
  const verifiedSkills = profile.skills.filter(s => s.level === SkillLevel.VERIFIED)
  const completedIds = new Set(assessmentAttempts.map(a => a.assessmentId))
  const profileViews = await prisma.profileView.count({ where: { profileId: profile.id } })

  const initials = profile.user.name
    ? profile.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'
  const firstName = profile.user.name?.split(' ')[0] ?? 'there'

  const CHECKLIST = [
    { key: 'institution', label: 'Add your institution & degree', done: !!profile.institution },
    { key: 'skills', label: 'Select your tech stack', done: profile.skills.length > 0 },
    { key: 'project', label: 'Add your first project', done: profile.projects.length >= 1 },
    { key: 'salary', label: 'Set salary & availability', done: !!profile.salaryExpectation && !!profile.availableFrom },
    { key: 'assessment', label: 'Verify at least one skill', done: verifiedSkills.length > 0 },
    { key: 'project2', label: 'Add a second project', done: profile.projects.length >= 2 },
  ]

  return (
    <div className="p-8 max-w-[880px]">

      {/* BANNER */}
      <div className="bg-navy rounded-card p-7 flex items-center gap-5 mb-6">
        <div className="w-16 h-16 rounded-full bg-blue flex items-center justify-center text-xl font-bold text-white shrink-0 border-2 border-white/15">
          {initials}
        </div>
        <div className="flex-1">
          <h1 className="text-xl font-bold text-white mb-1">Good morning, {firstName} 👋</h1>
          <p className="text-sm text-white/50">
            {profile.degree ?? 'Student'}{profile.institution ? ` · ${profile.institution}` : ''}
            {profile.graduationMonth && profile.graduationYear ? ` · Graduating ${profile.graduationMonth} ${profile.graduationYear}` : ''}
          </p>
        </div>
        <svg viewBox="0 0 72 72" width="72" height="72" className="shrink-0">
          <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
          <circle cx="36" cy="36" r="28" fill="none" stroke="#FFC84D" strokeWidth="5" strokeLinecap="round"
            strokeDasharray="175.9" strokeDashoffset={175.9 - (score / 100) * 175.9}
            transform="rotate(-90 36 36)" />
          <text x="36" y="33" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter">{score}%</text>
          <text x="36" y="45" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="Inter">complete</text>
        </svg>
      </div>

      {/* JENI NUDGE */}
      {verifiedSkills.length === 0 && (
        <div className="flex items-center gap-4 bg-blue/5 border border-blue/20 rounded-card px-5 py-4 mb-6">
          <div className="w-9 h-9 bg-blue rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">✦</div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-0.5">Take an assessment to get your first verified badge</p>
            <p className="text-sm text-gray-500">Your skills are self-declared. One 20-question assessment unlocks more recruiter matches and a verified badge.</p>
          </div>
          <Link href="/passport" className="text-sm font-semibold text-blue whitespace-nowrap hover:underline">Start assessment →</Link>
        </div>
      )}

      {/* STATS */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { value: profile.matches.length, label: 'Matched roles', delta: '↑ updated today', up: true },
          { value: profileViews, label: 'Recruiter views', delta: 'total views', up: false },
          { value: `${score}%`, label: 'Passport complete', delta: `${CHECKLIST.filter(c => !c.done).length} steps left`, up: false },
          { value: verifiedSkills.length, label: 'Verified skills', delta: `${availableAssessments.filter(a => !completedIds.has(a.id)).length} more available`, up: false },
        ].map(({ value, label, delta, up }) => (
          <div key={label} className="bg-white border border-border rounded-card p-4">
            <div className="text-3xl font-bold tracking-tight mb-0.5">{value}</div>
            <div className="text-xs text-gray-400 font-medium">{label}</div>
            <div className={`text-[11px] font-semibold mt-1 ${up ? 'text-green-600' : 'text-gray-400'}`}>{delta}</div>
          </div>
        ))}
      </div>

      {/* TWO-COL */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Passport */}
        <div className="bg-white border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">Skills Passport</span>
            <Link href="/passport" className="text-sm font-medium text-blue hover:underline">View full →</Link>
          </div>
          <div className="flex items-center gap-4 mb-4">
            <svg viewBox="0 0 56 56" width="56" height="56" className="shrink-0">
              <circle cx="28" cy="28" r="22" fill="none" stroke="#F3F4F6" strokeWidth="4" />
              <circle cx="28" cy="28" r="22" fill="none" stroke="#2563EB" strokeWidth="4" strokeLinecap="round"
                strokeDasharray="138.2" strokeDashoffset={138.2 - (score / 100) * 138.2}
                transform="rotate(-90 28 28)" />
            </svg>
            <div>
              <div className="text-2xl font-bold tracking-tight">{score}%</div>
              <p className="text-sm text-gray-500">{CHECKLIST.filter(c => !c.done).length} tasks to complete</p>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {CHECKLIST.map(({ key, label, done }) => (
              <div key={key} className="flex items-center gap-2.5 text-sm">
                <div className={`w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] shrink-0 ${done ? 'bg-green-100 text-green-600' : 'bg-gray-100 border border-border text-gray-400'}`}>
                  {done ? '✓' : '○'}
                </div>
                <span className={done ? 'line-through text-gray-400' : 'text-navy'}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top matches */}
        <div className="bg-white border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">Top matches</span>
            <Link href="/opportunities" className="text-sm font-medium text-blue hover:underline">
              See all {profile.matches.length} →
            </Link>
          </div>
          {profile.matches.length === 0 ? (
            <div className="text-sm text-gray-400 py-4">
              Complete your passport to unlock your first matches.
            </div>
          ) : (
            profile.matches.map(match => {
              const opp = match.opportunity
              const abbr = opp.companyName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'
              return (
                <Link key={match.id} href="/opportunities" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-blue transition-colors mb-2 last:mb-0">
                  <div className="w-10 h-10 rounded-lg bg-gray-50 border border-border flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                    {abbr}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate">{opp.title}</p>
                    <p className="text-xs text-gray-400 truncate">{opp.companyName} · {opp.city}</p>
                  </div>
                  <span className="text-sm font-bold text-green-600 shrink-0">{match.score}%</span>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* ASSESSMENTS */}
      <div className="bg-white border border-border rounded-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Skill assessments</span>
          <Link href="/passport" className="text-sm font-medium text-blue hover:underline">View all →</Link>
        </div>
        {assessmentAttempts.slice(0, 2).map(attempt => (
          <div key={attempt.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="w-9 h-9 rounded-lg bg-yellow/10 flex items-center justify-center text-base shrink-0">📋</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{attempt.assessment.title}</p>
              <p className="text-xs text-gray-400">Completed · 20 questions</p>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">✓ Verified</span>
            <span className="text-sm font-bold text-green-600">{attempt.score}/100</span>
          </div>
        ))}
        {availableAssessments.filter(a => !completedIds.has(a.id)).slice(0, 3 - assessmentAttempts.length).map((a, i) => (
          <div key={a.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="w-9 h-9 rounded-lg bg-blue/5 flex items-center justify-center text-base shrink-0">💻</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{a.title}</p>
              <p className="text-xs text-gray-400">{i === 0 ? 'Recommended · ' : 'Available · '}20 questions · ~15 min</p>
            </div>
            <Link href={`/assessments/${a.id}`} className="text-xs font-semibold text-blue hover:underline">Start →</Link>
          </div>
        ))}
      </div>

      {/* RECENT ACTIVITY */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="text-sm font-semibold mb-4">Recent activity</div>
        <div className="flex flex-col gap-3">
          {assessmentAttempts.slice(0, 1).map(a => (
            <div key={a.id} className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 rounded-full bg-yellow shrink-0" />
              <span className="flex-1">{a.assessment.title} completed — {a.score}/100 ✓</span>
              <span className="text-xs text-gray-400">{a.completedAt ? new Date(a.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : ''}</span>
            </div>
          ))}
          <div className="flex items-center gap-3 text-sm">
            <div className="w-2 h-2 rounded-full bg-gray-300 shrink-0" />
            <span className="flex-1">Profile created and passport started</span>
            <span className="text-xs text-gray-400">–</span>
          </div>
        </div>
      </div>

    </div>
  )
}
