import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { SkillLevel } from '@prisma/client'
import { formatRand } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Opportunities' }

export default async function OpportunitiesPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: {
      skills: { include: { skill: true } },
      matches: {
        include: {
          opportunity: {
            include: { skills: { include: { skill: true } } },
          },
        },
        orderBy: { score: 'desc' },
      },
    },
  })

  if (!profile) redirect('/register')

  const verifiedSkills = profile.skills.filter(s => s.level === SkillLevel.VERIFIED)
  const matches = profile.matches

  return (
    <div className="p-8 max-w-[880px]">

      {/* JENI NUDGE */}
      {verifiedSkills.length === 0 && (
        <div className="flex items-center gap-3 bg-blue/5 border border-blue/20 rounded-card px-5 py-3.5 mb-5">
          <div className="w-8 h-8 bg-blue rounded-lg flex items-center justify-center text-white text-sm shrink-0">✦</div>
          <div className="flex-1 text-sm text-gray-600">
            <strong className="text-navy">Verify a skill to unlock more matches.</strong> Companies filtering for verified developers can't see you yet — one assessment changes that.
          </div>
          <Link href="/passport" className="text-sm font-semibold text-blue whitespace-nowrap hover:underline">Verify now →</Link>
        </div>
      )}

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button className="px-3.5 py-1.5 rounded-btn text-sm font-semibold bg-blue/10 border border-blue text-blue">
          All ({matches.length})
        </button>
        <button className="px-3.5 py-1.5 rounded-btn text-sm font-medium border border-border bg-white text-gray-500 hover:border-blue hover:text-blue transition-colors">
          Full-time
        </button>
        <button className="px-3.5 py-1.5 rounded-btn text-sm font-medium border border-border bg-white text-gray-500 hover:border-blue hover:text-blue transition-colors">
          Internship
        </button>
        <button className="px-3.5 py-1.5 rounded-btn text-sm font-medium border border-border bg-white text-gray-500 hover:border-blue hover:text-blue transition-colors">
          Remote
        </button>
        <span className="ml-auto text-sm text-gray-400">Sorted by match %</span>
      </div>

      {/* JOB CARDS */}
      {matches.length === 0 ? (
        <div className="bg-white border border-border rounded-card p-8 text-center">
          <p className="text-gray-500 text-sm mb-2">No matches yet.</p>
          <p className="text-gray-400 text-xs">Complete your passport and verify skills to start matching with companies.</p>
          <Link href="/passport" className="inline-block mt-4 text-sm font-semibold text-blue hover:underline">
            Complete your passport →
          </Link>
        </div>
      ) : (
        matches.map((match, i) => {
          const opp = match.opportunity
          const abbr = opp.companyName?.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '??'
          const isTop = i === 0
          const scoreColor = match.score >= 85 ? 'text-green-600' : 'text-blue'

          return (
            <div key={match.id} className={`bg-white border rounded-card p-5 mb-3 transition-all hover:shadow-sm hover:border-blue ${isTop ? 'border-blue/30 bg-gradient-to-b from-blue/[0.02] to-white' : 'border-border'}`}>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                  {abbr}
                </div>
                <div className="flex-1">
                  <h3 className="text-[15px] font-semibold mb-0.5">{opp.title}</h3>
                  <p className="text-sm text-gray-500 mb-2">{opp.companyName}{opp.city ? ` · ${opp.city}` : ''}</p>
                  <div className="flex gap-3 flex-wrap">
                    {opp.workType && (
                      <span className="text-xs text-gray-400">🏢 {opp.workType}</span>
                    )}
                    {opp.salaryMin && opp.salaryMax && (
                      <span className="text-xs text-gray-400">
                        💰 {formatRand(opp.salaryMin)} – {formatRand(opp.salaryMax)} / month
                      </span>
                    )}
                    {opp.availableFrom && (
                      <span className="text-xs text-gray-400">
                        📅 {new Date(opp.availableFrom).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' })} start
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end shrink-0">
                  <span className={`text-2xl font-bold ${scoreColor}`}>{match.score}%</span>
                  <span className="text-[10px] text-gray-400 font-medium">match</span>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {opp.skills.slice(0, 4).map(os => (
                  <span key={os.id} className="text-[11px] font-medium px-2 py-0.5 bg-blue/10 text-blue rounded-full">
                    {os.skill.name}
                  </span>
                ))}
                {isTop && (
                  <span className="text-[11px] font-semibold bg-yellow/15 text-yellow-700 px-2 py-0.5 rounded">✦ New</span>
                )}
              </div>
            </div>
          )
        })
      )}

      {/* UNLOCK MORE nudge */}
      {verifiedSkills.length === 0 && matches.length > 0 && (
        <div className="flex items-center gap-4 bg-yellow/10 border border-yellow/30 rounded-card p-5 mt-2">
          <div className="text-2xl">✦</div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">More matches are hidden</p>
            <p className="text-sm text-gray-500">Companies searching for verified developers can't see your profile yet. Verify a skill to unlock them.</p>
          </div>
          <Link href="/passport" className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-btn whitespace-nowrap hover:opacity-90">
            Verify a skill →
          </Link>
        </div>
      )}
    </div>
  )
}
