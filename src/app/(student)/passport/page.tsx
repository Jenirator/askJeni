import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SkillLevel } from '@prisma/client'
import { formatRand, computePassportCompletion } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Skills Passport' }

const CHECKLIST = [
  { key: 'institution', label: 'Add institution & degree', points: 10 },
  { key: 'skills', label: 'Select tech stack', points: 15 },
  { key: 'salary', label: 'Set salary & availability', points: 15 },
  { key: 'project', label: 'Add a project', points: 20 },
  { key: 'assessment', label: 'Complete first assessment', points: 15 },
  { key: 'project2', label: 'Add second project', points: 10 },
  { key: 'verified2', label: 'Verify a second skill', points: 15 },
]

async function getStudentData(userId: string) {
  return prisma.studentProfile.findUnique({
    where: { userId },
    include: {
      user: {
        include: {
          assessmentAttempts: {
            include: { assessment: true },
            orderBy: { completedAt: 'desc' },
          },
        },
      },
      skills: { include: { skill: true }, orderBy: { level: 'desc' } },
      projects: { include: { skills: { include: { skill: true } } } },
    },
  })
}

export default async function PassportPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const [profile, assessments] = await Promise.all([
    getStudentData(session.user.id),
    prisma.assessment.findMany({ where: { isPublished: true }, orderBy: { title: 'asc' } }),
  ])

  if (!profile) redirect('/login')

  const score = computePassportCompletion(profile)
  const verifiedSkills = profile.skills.filter(s => s.level === SkillLevel.VERIFIED)
  const confidentSkills = profile.skills.filter(s => s.level === SkillLevel.CONFIDENT)
  const learningSkills = profile.skills.filter(s => s.level === SkillLevel.LEARNING)
  const completedAttempts = profile.user.assessmentAttempts?.filter(a => a.status === 'COMPLETED') ?? []
  const completedAssessmentIds = new Set(completedAttempts.map(a => a.assessmentId))

  const checklist: Record<string, boolean> = {
    institution: !!profile.institution,
    skills: profile.skills.length > 0,
    salary: !!profile.salaryExpectation && !!profile.availableFrom,
    project: profile.projects.length >= 1,
    assessment: completedAttempts.length >= 1,
    project2: profile.projects.length >= 2,
    verified2: verifiedSkills.length >= 2,
  }

  const initials = profile.user.name
    ? profile.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '?'

  return (
    <div className="p-8 max-w-[880px]">

      {/* JENI NUDGE */}
      {score < 100 && (
        <div className="flex items-center gap-4 bg-blue/5 border border-blue/20 rounded-card px-5 py-4 mb-6">
          <div className="w-9 h-9 bg-blue rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">✦</div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-0.5">
              {score < 50
                ? 'Complete your passport to unlock recruiter visibility'
                : `You're ${score}% complete — one more verified skill unlocks more matches`}
            </p>
            <p className="text-sm text-gray-500">
              {verifiedSkills.length === 0
                ? 'Take your first assessment to verify a skill and get noticed by recruiters.'
                : 'Verified skills make your profile visible to more companies actively hiring.'}
            </p>
          </div>
          <Link href="/assessments" className="text-sm font-semibold text-blue whitespace-nowrap hover:underline">
            Take an assessment →
          </Link>
        </div>
      )}

      {/* PROFILE HEADER */}
      <div className="bg-navy rounded-t-card px-8 py-7 relative overflow-hidden">
        <div className="absolute w-96 h-96 rounded-full bg-blue/10 -top-24 -right-12 pointer-events-none" />
        <div className="flex items-center gap-5 relative">
          <div className="w-[72px] h-[72px] rounded-full bg-blue flex items-center justify-center text-2xl font-bold text-white shrink-0 border-2 border-white/15">
            {initials}
          </div>
          <div className="flex-1">
            <h1 className="text-[22px] font-bold text-white tracking-tight mb-1">{profile.user.name}</h1>
            <p className="text-sm text-white/50 mb-2">
              {profile.degree ?? 'Student'}{profile.institution ? ` · ${profile.institution}` : ''}
              {profile.yearOfStudy ? ` · Year ${profile.yearOfStudy}` : ''}
            </p>
            <div className="flex items-center gap-2 flex-wrap">
              {verifiedSkills.length > 0 && (
                <span className="text-xs font-semibold text-green-400 bg-green-400/10 px-2.5 py-0.5 rounded-full">✓ Verified</span>
              )}
              <span className="text-xs font-semibold text-yellow bg-yellow/15 px-2.5 py-0.5 rounded-full">✦ {score}% complete</span>
              {profile.slug && (
                <span className="text-xs text-white/40 bg-white/5 px-2.5 py-0.5 rounded-full">askjeni.co.za/{profile.slug}</span>
              )}
            </div>
          </div>
          <svg viewBox="0 0 72 72" width="72" height="72" className="shrink-0">
            <circle cx="36" cy="36" r="28" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="5" />
            <circle
              cx="36" cy="36" r="28" fill="none"
              stroke="#FFC84D" strokeWidth="5" strokeLinecap="round"
              strokeDasharray="175.9"
              strokeDashoffset={175.9 - (score / 100) * 175.9}
              transform="rotate(-90 36 36)"
            />
            <text x="36" y="33" textAnchor="middle" fill="white" fontSize="14" fontWeight="700" fontFamily="Inter">{score}%</text>
            <text x="36" y="45" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="Inter">complete</text>
          </svg>
        </div>
      </div>

      {/* FIVE SIGNAL BAND */}
      <div className="bg-white border border-t-0 border-border rounded-b-card grid grid-cols-5 mb-4">
        {[
          { label: 'Location', value: profile.city ?? '—', sub: profile.province ?? '' },
          { label: 'Salary', value: profile.salaryExpectation ? formatRand(profile.salaryExpectation) : '—', sub: 'per month' },
          {
            label: 'Graduating',
            value: profile.graduationMonth && profile.graduationYear ? `${profile.graduationMonth} ${profile.graduationYear}` : '—',
            sub: profile.institution ?? '',
          },
          {
            label: 'Top Skills',
            value: verifiedSkills.slice(0, 2).map(s => s.skill.name).join(', ') || '—',
            sub: verifiedSkills.length > 2 ? `+ ${verifiedSkills.length - 2} more verified` : confidentSkills.length > 0 ? 'self-declared' : '',
          },
          {
            label: 'Available',
            value: profile.availableFrom
              ? new Date(profile.availableFrom).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })
              : '—',
            sub: profile.workTypePreferences?.join(' · ') ?? '',
          },
        ].map(({ label, value, sub }, i, arr) => (
          <div key={label} className={`px-5 py-4 ${i < arr.length - 1 ? 'border-r border-border' : ''}`}>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
            <p className="text-sm font-semibold text-navy">{value}</p>
            {sub && <p className="text-xs text-gray-400">{sub}</p>}
          </div>
        ))}
      </div>

      {/* TWO-COL: completion + tech stack */}
      <div className="grid grid-cols-2 gap-4 mb-4">

        {/* Passport completion */}
        <div className="bg-white border border-border rounded-card overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-4">
            <span className="text-sm font-semibold">Passport completion</span>
            <span className="text-sm font-bold text-blue">{score}%</span>
          </div>
          <div className="px-5 pt-3 pb-4">
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-4">
              <div className="h-full bg-blue rounded-full" style={{ width: `${score}%` }} />
            </div>
            <div className="flex flex-col gap-2">
              {CHECKLIST.map(({ key, label, points }) => {
                const done = checklist[key]
                return (
                  <div key={key} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${done ? 'bg-green-100 text-green-600' : 'bg-gray-100 border border-border text-gray-400'}`}>
                      {done ? '✓' : '○'}
                    </div>
                    <span className={done ? 'line-through text-gray-400' : 'text-navy'}>{label}</span>
                    <span className={`text-[11px] font-semibold ml-auto ${done ? 'text-gray-400' : 'text-blue'}`}>+{points}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Tech stack */}
        <div className="bg-white border border-border rounded-card p-5">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm font-semibold">Tech stack</span>
            <button className="text-sm font-medium text-blue hover:underline">Edit</button>
          </div>
          {verifiedSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Verified by assessment</p>
              <div className="flex flex-wrap gap-2">
                {verifiedSkills.map(s => (
                  <span key={s.id} className="px-2.5 py-1 bg-blue/10 text-blue text-xs font-medium rounded-full">✓ {s.skill.name}</span>
                ))}
              </div>
            </div>
          )}
          {confidentSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Confident</p>
              <div className="flex flex-wrap gap-2">
                {confidentSkills.map(s => (
                  <span key={s.id} className="px-2.5 py-1 bg-blue/5 text-blue border border-blue/20 text-xs font-medium rounded-full">{s.skill.name}</span>
                ))}
              </div>
            </div>
          )}
          {learningSkills.length > 0 && (
            <div className="mb-4">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Learning</p>
              <div className="flex flex-wrap gap-2">
                {learningSkills.map(s => (
                  <span key={s.id} className="px-2.5 py-1 bg-yellow/10 text-yellow-700 text-xs font-medium rounded-full">{s.skill.name}</span>
                ))}
              </div>
            </div>
          )}
          {profile.skills.length === 0 && (
            <p className="text-sm text-gray-400">No skills added yet. Add skills to your profile.</p>
          )}
          <div className="flex gap-4 pt-3 mt-3 border-t border-border">
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-2.5 h-2.5 rounded-sm bg-blue/10 border border-blue/30" />
              Assessed &amp; verified
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <div className="w-2.5 h-2.5 rounded-sm bg-yellow/10 border border-yellow/40" />
              Self-declared
            </div>
          </div>
        </div>
      </div>

      {/* ASSESSMENTS */}
      <div className="bg-white border border-border rounded-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Skill assessments</span>
          <Link href="/assessments" className="text-sm font-medium text-blue hover:underline">Take an assessment →</Link>
        </div>
        {completedAttempts.map(attempt => (
          <div key={attempt.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="w-10 h-10 rounded-lg bg-yellow/10 flex items-center justify-center text-lg shrink-0">📋</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{attempt.assessment.title}</p>
              <p className="text-xs text-gray-400">
                Completed {attempt.completedAt ? new Date(attempt.completedAt).toLocaleDateString('en-ZA', { day: 'numeric', month: 'short' }) : ''} · 20 questions
              </p>
              <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden w-48">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${attempt.score ?? 0}%` }} />
              </div>
            </div>
            <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ Verified</span>
            <span className="text-base font-bold text-green-600">{attempt.score}/100</span>
          </div>
        ))}
        {assessments.filter(a => !completedAssessmentIds.has(a.id)).slice(0, 4).map((assessment, i) => (
          <div key={assessment.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
            <div className="w-10 h-10 rounded-lg bg-blue/5 flex items-center justify-center text-lg shrink-0">💻</div>
            <div className="flex-1">
              <p className="text-sm font-semibold">{assessment.title}</p>
              <p className="text-xs text-gray-400">{i === 0 ? 'Recommended · ' : 'Available · '}~15 min · 20 questions</p>
            </div>
            <Link
              href={`/assessments/${assessment.id}`}
              className={`text-xs font-semibold px-4 py-2 rounded-btn ${i === 0 ? 'bg-blue text-white' : 'bg-blue/10 text-blue'}`}
            >
              {i === 0 ? 'Start →' : 'Start'}
            </Link>
          </div>
        ))}
      </div>

      {/* PROJECTS */}
      <div className="bg-white border border-border rounded-card p-5 mb-4">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm font-semibold">Projects</span>
          <button className="text-sm font-medium text-blue hover:underline">+ Add project</button>
        </div>
        {profile.projects.map(project => (
          <div key={project.id} className="border border-border rounded-xl p-4 mb-3 last:mb-0">
            <h3 className="text-sm font-semibold mb-1">{project.title}</h3>
            {project.description && <p className="text-sm text-gray-500 leading-relaxed mb-3">{project.description}</p>}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {project.skills.map(ps => (
                <span key={ps.id} className="text-[11px] font-medium px-2 py-0.5 bg-blue/10 text-blue rounded-full">{ps.skill.name}</span>
              ))}
            </div>
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue hover:underline">↗ GitHub</a>
            )}
          </div>
        ))}
        <div className="border border-dashed border-border rounded-xl p-4 bg-gray-50 flex items-center gap-3 mt-3">
          <div className="w-9 h-9 rounded-lg bg-border flex items-center justify-center text-lg shrink-0">🔬</div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-500">Final Year Research Project</p>
            <p className="text-xs text-gray-400">In progress · Add details to complete your passport</p>
          </div>
          <button className="text-sm font-medium text-blue hover:underline">Add details →</button>
        </div>
      </div>

      {/* ABOUT */}
      <div className="bg-white border border-border rounded-card p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-semibold">About</span>
          <button className="text-sm font-medium text-blue hover:underline">Edit</button>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed">
          {profile.bio ?? "Add a short bio to help recruiters understand who you are and what you're looking for."}
        </p>
        <div className="flex gap-4 mt-4 pt-4 border-t border-border">
          {profile.githubUrl && (
            <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue hover:underline">↗ GitHub</a>
          )}
          {profile.linkedinUrl && (
            <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue hover:underline">↗ LinkedIn</a>
          )}
          {profile.slug && <span className="text-sm text-gray-400">askjeni.co.za/{profile.slug}</span>}
        </div>
      </div>

    </div>
  )
}
