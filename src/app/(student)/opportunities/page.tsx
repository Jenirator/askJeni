import { MOCK_MATCHES, MOCK_SKILLS } from '@/lib/mock-data'
import { formatRand } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Opportunities' }

export default function OpportunitiesPage() {
  const verifiedSkills = MOCK_SKILLS.filter(s => s.level === 'VERIFIED')

  return (
    <div className="p-8 max-w-[880px]">

      {/* FILTER BAR */}
      <div className="flex items-center gap-2 mb-5 flex-wrap">
        <button className="px-3.5 py-1.5 rounded-btn text-sm font-semibold bg-blue/10 border border-blue text-blue">
          All ({MOCK_MATCHES.length})
        </button>
        {['Full-time', 'Internship', 'Remote'].map(label => (
          <button key={label} className="px-3.5 py-1.5 rounded-btn text-sm font-medium border border-border bg-white text-gray-500 hover:border-blue hover:text-blue transition-colors">
            {label}
          </button>
        ))}
        <span className="ml-auto text-sm text-gray-400">Sorted by match %</span>
      </div>

      {/* JOB CARDS */}
      {MOCK_MATCHES.map((match, i) => {
        const abbr = match.company.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
        const isTop = i === 0
        const scoreColor = match.score >= 85 ? 'text-green-600' : 'text-blue'

        return (
          <div key={match.id} className={`bg-white border rounded-card p-5 mb-3 transition-all hover:shadow-sm hover:border-blue ${isTop ? 'border-blue/30 bg-gradient-to-b from-blue/[0.02] to-white' : 'border-border'}`}>
            <div className="flex items-start gap-4 mb-4">
              <div className="w-11 h-11 rounded-xl bg-gray-50 border border-border flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
                {abbr}
              </div>
              <div className="flex-1">
                <h3 className="text-[15px] font-semibold mb-0.5">{match.role}</h3>
                <p className="text-sm text-gray-500 mb-2">{match.company} · {match.city}</p>
                <div className="flex gap-3 flex-wrap">
                  <span className="text-xs text-gray-400">🏢 {match.workType}</span>
                  <span className="text-xs text-gray-400">💰 {formatRand(match.salaryMin)} – {formatRand(match.salaryMax)} / month</span>
                  <span className="text-xs text-gray-400">📅 {match.startDate} start</span>
                </div>
              </div>
              <div className="flex flex-col items-end shrink-0">
                <span className={`text-2xl font-bold ${scoreColor}`}>{match.score}%</span>
                <span className="text-[10px] text-gray-400 font-medium">match</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {match.skills.map(skill => (
                <span key={skill} className="text-[11px] font-medium px-2 py-0.5 bg-blue/10 text-blue rounded-full">{skill}</span>
              ))}
              {match.isNew && (
                <span className="text-[11px] font-semibold bg-yellow/15 text-yellow-700 px-2 py-0.5 rounded">✦ New</span>
              )}
            </div>
          </div>
        )
      })}

      {/* UNLOCK MORE nudge */}
      {verifiedSkills.length < 2 && (
        <div className="flex items-center gap-4 bg-yellow/10 border border-yellow/30 rounded-card p-5 mt-2">
          <div className="text-2xl">✦</div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-1">More matches are hidden</p>
            <p className="text-sm text-gray-500">Companies searching for verified developers can&apos;t see your profile yet. Verify a second skill to unlock them.</p>
          </div>
          <Link href="/passport" className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-btn whitespace-nowrap hover:opacity-90">
            Verify a skill →
          </Link>
        </div>
      )}
    </div>
  )
}
