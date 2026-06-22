import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { SkillLevel } from '@prisma/client'
import { formatRand } from '@/lib/utils'
import Link from 'next/link'

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const profile = await prisma.studentProfile.findUnique({
    where: { slug: params.slug },
    include: { user: true },
  })
  if (!profile) return { title: 'Not found' }
  return { title: `${profile.user.name} — askJeni` }
}

export default async function PublicProfilePage({ params }: { params: { slug: string } }) {
  const profile = await prisma.studentProfile.findUnique({
    where: { slug: params.slug },
    include: {
      user: true,
      skills: { include: { skill: true }, orderBy: { level: 'desc' } },
      projects: { include: { skills: { include: { skill: true } } } },
    },
  })

  if (!profile) notFound()

  const completedAttempts = await prisma.assessmentAttempt.findMany({
    where: { userId: profile.userId, status: 'COMPLETED' },
    include: { assessment: true },
    orderBy: { score: 'desc' },
  })

  const verifiedSkills = profile.skills.filter(s => s.level === SkillLevel.VERIFIED)
  const confidentSkills = profile.skills.filter(s => s.level === SkillLevel.CONFIDENT)

  const initials = profile.user.name
    ? profile.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
    : '??'

  return (
    <div className="min-h-screen bg-[#F7F9FC] pb-20">
      {/* NAV */}
      <nav className="bg-navy h-[52px] flex items-center justify-between px-10 sticky top-0 z-50">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">askJeni</Link>
        <div className="flex items-center gap-3">
          <Link href="/browse" className="text-sm text-white/50 hover:text-white">Browse candidates</Link>
          <Link href="/register" className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90">Post a role</Link>
        </div>
      </nav>

      <div className="max-w-[860px] mx-auto px-10 py-10">

        {/* HEADER */}
        <div className="bg-navy rounded-t-card px-8 py-8 relative overflow-hidden">
          <div className="absolute w-[500px] h-[500px] rounded-full bg-blue/10 -top-24 -right-20 pointer-events-none" />
          <div className="flex items-center gap-5 relative">
            <div className="w-20 h-20 rounded-full bg-blue flex items-center justify-center text-3xl font-bold text-white shrink-0 border-2 border-white/15">
              {initials}
            </div>
            <div className="flex-1">
              <h1 className="text-[26px] font-bold text-white tracking-tight mb-1">{profile.user.name}</h1>
              <p className="text-sm text-white/55 mb-2.5">
                {profile.degree ?? 'Student'}{profile.institution ? ` · ${profile.institution}` : ''}
                {profile.graduationMonth && profile.graduationYear ? ` · Graduating ${profile.graduationMonth} ${profile.graduationYear}` : ''}
              </p>
              <div className="flex gap-2 flex-wrap">
                {verifiedSkills.length > 0 && (
                  <span className="text-[11px] font-semibold bg-green-500/20 text-green-400 px-2.5 py-0.5 rounded-full">✓ Verified skills</span>
                )}
                <span className="text-[11px] font-semibold bg-yellow/15 text-yellow px-2.5 py-0.5 rounded-full">✦ {profile.passportCompletion}% passport</span>
                {completedAttempts[0] && (
                  <span className="text-[11px] font-semibold bg-blue/25 text-blue-300 px-2.5 py-0.5 rounded-full">
                    {completedAttempts[0].assessment.title.split(' ')[0]} {completedAttempts[0].score}/100
                  </span>
                )}
                <span className="text-[11px] font-semibold bg-blue/25 text-blue-300 px-2.5 py-0.5 rounded-full">Open to opportunities</span>
              </div>
            </div>
            <div className="flex flex-col gap-2 shrink-0">
              <Link href="/browse" className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-btn text-center hover:opacity-90">Express interest</Link>
              <button className="border border-white/20 text-white/70 text-sm font-semibold px-5 py-2 rounded-btn text-center hover:border-white/40">Save profile</button>
            </div>
          </div>
        </div>

        {/* FIVE SIGNAL BAND */}
        <div className="bg-white border border-t-0 border-border rounded-b-card grid grid-cols-5 mb-6">
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
              sub: verifiedSkills.length > 2 ? `+ ${verifiedSkills.length - 2} more verified` : '',
            },
            {
              label: 'Available',
              value: profile.availableFrom ? new Date(profile.availableFrom).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }) : '—',
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

        {/* EMPLOYER CTA */}
        <div className="bg-blue/5 border border-blue/20 rounded-card px-5 py-4 flex items-center gap-4 mb-6">
          <div className="flex-1">
            <p className="text-sm font-semibold mb-0.5">
              Hiring graduates? {profile.user.name?.split(' ')[0]} is open to opportunities{profile.availableFrom ? ` from ${new Date(profile.availableFrom).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}` : ''}.
            </p>
            <p className="text-sm text-gray-500">Request an introduction or browse similar candidates on askJeni. Free to sign up for companies.</p>
          </div>
          <Link href="/browse" className="bg-navy text-white text-sm font-semibold px-5 py-2.5 rounded-btn whitespace-nowrap hover:opacity-90">Browse all candidates →</Link>
        </div>

        {/* TWO-COL: skills + about */}
        <div className="grid grid-cols-2 gap-4 mb-4">

          {/* Skills */}
          <div className="bg-white border border-border rounded-card p-5">
            <p className="text-sm font-semibold mb-4">Tech stack</p>
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
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Self-declared</p>
                <div className="flex flex-wrap gap-2">
                  {confidentSkills.map(s => (
                    <span key={s.id} className="px-2.5 py-1 bg-yellow/10 text-yellow-700 text-xs font-medium rounded-full">{s.skill.name}</span>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-4 pt-3 mt-1 border-t border-border">
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2.5 h-2.5 rounded-sm bg-blue/10 border border-blue/30" /> Assessed
              </div>
              <div className="flex items-center gap-1.5 text-xs text-gray-400">
                <div className="w-2.5 h-2.5 rounded-sm bg-yellow/10 border border-yellow/40" /> Self-declared
              </div>
            </div>
          </div>

          {/* About */}
          <div className="bg-white border border-border rounded-card p-5">
            <p className="text-sm font-semibold mb-3">About</p>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              {profile.bio ?? `${profile.degree ?? 'Student'} at ${profile.institution ?? 'a South African university'}, looking for opportunities${profile.availableFrom ? ` from ${new Date(profile.availableFrom).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}` : ''}.`}
            </p>
            <div className="flex flex-wrap gap-1.5 mb-4">
              {profile.workTypePreferences?.map(t => (
                <span key={t} className="text-xs bg-gray-100 text-gray-600 border border-border px-2.5 py-0.5 rounded-full">{t}</span>
              ))}
              {profile.workLocationPrefs?.map(l => (
                <span key={l} className="text-xs bg-gray-100 text-gray-600 border border-border px-2.5 py-0.5 rounded-full">{l}</span>
              ))}
            </div>
            <div className="flex gap-4 pt-3 border-t border-border">
              {profile.githubUrl && <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue hover:underline">↗ GitHub</a>}
              {profile.linkedinUrl && <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue hover:underline">↗ LinkedIn</a>}
            </div>
          </div>
        </div>

        {/* ASSESSMENTS */}
        {completedAttempts.length > 0 && (
          <div className="bg-white border border-border rounded-card p-5 mb-4">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-semibold">Skill assessments</span>
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ askJeni verified</span>
            </div>
            {completedAttempts.map(attempt => (
              <div key={attempt.id} className="flex items-center gap-3 py-3 border-b border-border last:border-0">
                <div className="w-10 h-10 rounded-lg bg-yellow/10 flex items-center justify-center text-lg shrink-0">📋</div>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{attempt.assessment.title}</p>
                  <p className="text-xs text-gray-400">Verified · 20 questions · Proctored</p>
                  <div className="h-1 bg-gray-100 rounded-full mt-1.5 overflow-hidden w-48">
                    <div className="h-full bg-green-500 rounded-full" style={{ width: `${attempt.score ?? 0}%` }} />
                  </div>
                </div>
                <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ Verified</span>
                <span className="text-base font-bold text-green-600">{attempt.score}/100</span>
              </div>
            ))}
          </div>
        )}

        {/* PROJECTS */}
        {profile.projects.length > 0 && (
          <div className="bg-white border border-border rounded-card p-5 mb-4">
            <p className="text-sm font-semibold mb-4">Projects</p>
            {profile.projects.map(project => (
              <div key={project.id} className="border border-border rounded-xl p-4 mb-3 last:mb-0">
                <h3 className="text-sm font-semibold mb-1">{project.title}</h3>
                {project.description && <p className="text-sm text-gray-500 leading-relaxed mb-3">{project.description}</p>}
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {project.skills.map(ps => (
                    <span key={ps.id} className="text-[11px] font-medium px-2 py-0.5 bg-blue/10 text-blue rounded-full">{ps.skill.name}</span>
                  ))}
                </div>
                {project.githubUrl && (
                  <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium text-blue hover:underline">↗ View on GitHub</a>
                )}
              </div>
            ))}
          </div>
        )}

        {/* EDUCATION */}
        <div className="bg-white border border-border rounded-card p-5">
          <p className="text-sm font-semibold mb-4">Education</p>
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
              {profile.institution?.split(' ').map(w => w[0]).join('').slice(0, 4).toUpperCase() ?? 'UNI'}
            </div>
            <div>
              <p className="text-sm font-semibold mb-0.5">{profile.degree ?? 'Degree'}</p>
              <p className="text-sm text-gray-500">{profile.institution ?? 'Institution'}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                {profile.yearOfStudy ? `Year ${profile.yearOfStudy}` : ''}
                {profile.graduationMonth && profile.graduationYear ? ` · Graduating ${profile.graduationMonth} ${profile.graduationYear}` : ''}
                {profile.city ? ` · ${profile.city}` : ''}
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* STICKY BOTTOM BAR */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border px-10 py-3.5 flex items-center justify-between z-50 shadow-lg">
        <p className="text-sm text-gray-500">
          Viewing <strong className="text-navy">{profile.user.name}</strong>
          {profile.availableFrom ? ` — available from ${new Date(profile.availableFrom).toLocaleDateString('en-ZA', { month: 'long', year: 'numeric' })}` : ''}
          {profile.salaryExpectation ? ` · ${formatRand(profile.salaryExpectation)} / month` : ''}
          {profile.city ? ` · ${profile.city}` : ''}
        </p>
        <div className="flex gap-2">
          <Link href="/browse" className="bg-blue/10 text-blue text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-80">Save profile</Link>
          <Link href="/browse" className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90">Express interest →</Link>
        </div>
      </div>
    </div>
  )
}
