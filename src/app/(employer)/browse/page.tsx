import { prisma } from '@/lib/prisma'
import { SkillLevel } from '@prisma/client'
import { formatRand } from '@/lib/utils'
import Link from 'next/link'

export const metadata = { title: 'Browse Candidates — askJeni' }

export default async function BrowsePage() {
  const candidates = await prisma.studentProfile.findMany({
    where: { passportCompletion: { gte: 30 } },
    include: {
      user: true,
      skills: { include: { skill: true }, orderBy: { level: 'desc' } },
    },
    orderBy: { passportCompletion: 'desc' },
    take: 20,
  })

  return (
    <div className="flex min-h-[calc(100vh-52px)]">

      {/* FILTER SIDEBAR */}
      <aside className="w-60 bg-white border-r border-border px-5 py-6 shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
        <p className="text-sm font-semibold mb-5">Filter candidates</p>

        {[
          { label: 'Location', options: ['Johannesburg (24)', 'Cape Town (18)', 'Pretoria (11)', 'Durban (8)', 'Willing to relocate (47)'] },
          { label: 'Graduating', options: ['Nov 2025 (31)', '2026 (44)', 'Already graduated (12)'] },
          { label: 'Tech stack', options: ['React (38)', 'Python (52)', 'Node.js (29)', 'Java (24)', 'TypeScript (21)', 'SQL (44)'] },
          { label: 'Work type', options: ['Full-time', 'Internship', 'Contract'] },
        ].map(({ label, options }) => (
          <div key={label} className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
            {options.map(opt => (
              <label key={opt} className="flex items-center gap-2 py-1 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-blue" />
                <span className="text-sm text-gray-600">{opt}</span>
              </label>
            ))}
          </div>
        ))}

        <div className="mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Salary range (R / month)</p>
          <div className="flex items-center gap-2">
            <input type="number" placeholder="14 000" defaultValue={14000} className="w-20 h-9 border border-border rounded-btn px-2 text-sm outline-none focus:border-blue" />
            <span className="text-sm text-gray-400">–</span>
            <input type="number" placeholder="35 000" defaultValue={35000} className="w-20 h-9 border border-border rounded-btn px-2 text-sm outline-none focus:border-blue" />
          </div>
        </div>

        <div className="mb-6">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Verified skills only</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" defaultChecked className="accent-blue" />
            <span className="text-sm text-gray-600">Must have verified badge</span>
          </label>
        </div>

        <button className="text-sm font-medium text-blue hover:underline">Reset all filters</button>
      </aside>

      {/* MAIN */}
      <div className="flex-1 px-8 py-7">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h1 className="text-[18px] font-bold tracking-tight">{candidates.length} verified candidates</h1>
            <p className="text-sm text-gray-400 mt-0.5">Matching your filters · Sorted by passport completion</p>
          </div>
          <select className="h-9 px-3 border border-border rounded-btn text-sm text-gray-600 bg-white outline-none">
            <option>Sort: Passport completion</option>
            <option>Sort: Salary (low–high)</option>
            <option>Sort: Graduation date</option>
            <option>Sort: Newest</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {candidates.length === 0 ? (
            <div className="col-span-2 text-center py-12 text-gray-400 text-sm">No candidates yet. Check back soon.</div>
          ) : (
            candidates.map(candidate => {
              const initials = candidate.user.name
                ? candidate.user.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                : '??'
              const verifiedSkills = candidate.skills.filter(s => s.level === SkillLevel.VERIFIED)
              const topSkills = candidate.skills.slice(0, 3)

              return (
                <Link
                  key={candidate.id}
                  href={candidate.slug ? `/profile/${candidate.slug}` : '#'}
                  className="bg-white border border-border rounded-card overflow-hidden hover:border-blue hover:shadow-sm transition-all block"
                >
                  {/* Card header */}
                  <div className="bg-navy px-5 py-4 flex items-center gap-3 relative">
                    <div className="w-11 h-11 rounded-full bg-blue flex items-center justify-center text-[15px] font-bold text-white shrink-0 border-2 border-white/15">
                      {initials}
                    </div>
                    <div>
                      <p className="text-[15px] font-semibold text-white">{candidate.user.name}</p>
                      <p className="text-xs text-white/45">
                        {candidate.degree ?? 'Student'}{candidate.institution ? ` · ${candidate.institution}` : ''}
                      </p>
                    </div>
                    <div className="absolute top-3 right-3 flex gap-1.5">
                      {verifiedSkills.length > 0 && (
                        <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">✓ Verified</span>
                      )}
                    </div>
                  </div>

                  {/* Five signals */}
                  <div className="grid grid-cols-5 border-b border-border">
                    {[
                      { label: 'Location', value: candidate.city ?? '—', sub: '' },
                      { label: 'Salary', value: candidate.salaryExpectation ? formatRand(candidate.salaryExpectation) : '—', sub: '/month' },
                      {
                        label: 'Grad',
                        value: candidate.graduationMonth && candidate.graduationYear ? `${candidate.graduationMonth.slice(0, 3)} ${candidate.graduationYear}` : '—',
                        sub: candidate.institution?.split(' ').slice(-1)[0] ?? '',
                      },
                      {
                        label: 'Stack',
                        value: verifiedSkills[0]?.skill.name ?? (topSkills[0]?.skill.name ?? '—'),
                        sub: verifiedSkills.length > 1 ? `+${verifiedSkills.length - 1} verified` : topSkills[1]?.skill.name ?? '',
                      },
                      {
                        label: 'From',
                        value: candidate.availableFrom ? new Date(candidate.availableFrom).toLocaleDateString('en-ZA', { month: 'short', year: 'numeric' }) : '—',
                        sub: candidate.workTypePreferences?.[0] ?? '',
                      },
                    ].map(({ label, value, sub }, i) => (
                      <div key={label} className={`px-3 py-2.5 ${i < 4 ? 'border-r border-border' : ''}`}>
                        <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                        <p className="text-xs font-semibold text-navy leading-tight">{value}</p>
                        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
                      </div>
                    ))}
                  </div>

                  {/* Footer chips */}
                  <div className="px-4 py-3 flex items-center gap-1.5 flex-wrap">
                    {topSkills.map(s => (
                      <span key={s.id} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.level === SkillLevel.VERIFIED ? 'bg-blue/10 text-blue' : 'bg-yellow/10 text-yellow-700'}`}>
                        {s.level === SkillLevel.VERIFIED ? '✓ ' : ''}{s.skill.name}
                      </span>
                    ))}
                    <span className="ml-auto text-xs font-semibold text-blue">View profile →</span>
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
