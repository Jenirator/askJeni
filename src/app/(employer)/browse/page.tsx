'use client'

import { useState, useEffect, useMemo } from 'react'
import { MOCK_CANDIDATES } from '@/lib/mock-data'
import { formatRand } from '@/lib/utils'
import { hasExpressedInterest } from '@/lib/employer-store'
import Link from 'next/link'
import ExpressInterestModal from '@/components/employer/ExpressInterestModal'

type Candidate = typeof MOCK_CANDIDATES[0]
type SortKey = 'passport' | 'salary-asc' | 'salary-desc' | 'grad'

const ALL_CITIES = ['Jhb', 'CPT', 'Pta', 'DBN']
const ALL_SKILLS = ['React', 'Python', 'Node.js', 'Java', 'TypeScript', 'SQL', 'JavaScript', 'Go', 'C++', 'PHP']
const ALL_WORK_TYPES = ['Hybrid', 'Remote', 'In-office']
const ALL_GRAD_YEARS = ['2025', '2026']
const CITY_LABELS: Record<string, string> = { Jhb: 'Johannesburg', CPT: 'Cape Town', Pta: 'Pretoria', DBN: 'Durban' }

export default function BrowsePage() {
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null)
  const [sentSlugs, setSentSlugs] = useState<Set<string>>(new Set())

  const [cities, setCities] = useState<Set<string>>(new Set())
  const [gradYears, setGradYears] = useState<Set<string>>(new Set())
  const [skills, setSkillsFilter] = useState<Set<string>>(new Set())
  const [workTypes, setWorkTypes] = useState<Set<string>>(new Set())
  const [salaryMin, setSalaryMin] = useState(14000)
  const [salaryMax, setSalaryMax] = useState(35000)
  const [verifiedOnly, setVerifiedOnly] = useState(false)
  const [sort, setSort] = useState<SortKey>('passport')

  useEffect(() => {
    const sent = new Set(MOCK_CANDIDATES.filter(c => hasExpressedInterest(c.slug)).map(c => c.slug))
    setSentSlugs(sent)
  }, [])

  function toggle<T>(set: Set<T>, val: T): Set<T> {
    const next = new Set(set)
    next.has(val) ? next.delete(val) : next.add(val)
    return next
  }

  function resetFilters() {
    setCities(new Set())
    setGradYears(new Set())
    setSkillsFilter(new Set())
    setWorkTypes(new Set())
    setSalaryMin(14000)
    setSalaryMax(35000)
    setVerifiedOnly(false)
  }

  const filtered = useMemo(() => {
    let result = MOCK_CANDIDATES.filter(c => {
      if (cities.size > 0 && !cities.has(c.city)) return false
      if (gradYears.size > 0 && !gradYears.has(c.gradDate.slice(-4))) return false
      if (workTypes.size > 0 && !workTypes.has(c.workType)) return false
      if (skills.size > 0 && !c.skills.some(s => skills.has(s.name))) return false
      if (c.salary < salaryMin || c.salary > salaryMax) return false
      if (verifiedOnly && !c.verified) return false
      return true
    })

    switch (sort) {
      case 'salary-asc': result = [...result].sort((a, b) => a.salary - b.salary); break
      case 'salary-desc': result = [...result].sort((a, b) => b.salary - a.salary); break
      case 'grad': result = [...result].sort((a, b) => a.gradDate.localeCompare(b.gradDate)); break
      default: result = [...result].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0))
    }

    return result
  }, [cities, gradYears, workTypes, skills, salaryMin, salaryMax, verifiedOnly, sort])

  const hasActiveFilters = cities.size > 0 || gradYears.size > 0 || skills.size > 0 || workTypes.size > 0 || verifiedOnly || salaryMin !== 14000 || salaryMax !== 35000

  function handleModalClose() {
    const sent = new Set(MOCK_CANDIDATES.filter(c => hasExpressedInterest(c.slug)).map(c => c.slug))
    setSentSlugs(sent)
    setActiveCandidate(null)
  }

  return (
    <>
      <div className="flex min-h-[calc(100vh-52px)]">

        {/* FILTER SIDEBAR */}
        <aside className="w-60 bg-white border-r border-border px-5 py-6 shrink-0 sticky top-[52px] h-[calc(100vh-52px)] overflow-y-auto">
          <div className="flex items-center justify-between mb-5">
            <p className="text-sm font-semibold">Filter candidates</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="text-xs text-blue hover:underline">Reset all</button>
            )}
          </div>

          {/* Location */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Location</p>
            {ALL_CITIES.map(city => {
              const count = MOCK_CANDIDATES.filter(c => c.city === city).length
              return (
                <label key={city} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue"
                    checked={cities.has(city)}
                    onChange={() => setCities(toggle(cities, city))}
                  />
                  <span className="text-sm text-gray-600">{CITY_LABELS[city]} ({count})</span>
                </label>
              )
            })}
          </div>

          {/* Graduating */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Graduating</p>
            {ALL_GRAD_YEARS.map(year => {
              const count = MOCK_CANDIDATES.filter(c => c.gradDate.includes(year)).length
              return (
                <label key={year} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue"
                    checked={gradYears.has(year)}
                    onChange={() => setGradYears(toggle(gradYears, year))}
                  />
                  <span className="text-sm text-gray-600">{year} ({count})</span>
                </label>
              )
            })}
          </div>

          {/* Tech stack */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tech stack</p>
            {ALL_SKILLS.map(skill => {
              const count = MOCK_CANDIDATES.filter(c => c.skills.some(s => s.name === skill)).length
              if (count === 0) return null
              return (
                <label key={skill} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue"
                    checked={skills.has(skill)}
                    onChange={() => setSkillsFilter(toggle(skills, skill))}
                  />
                  <span className="text-sm text-gray-600">{skill} ({count})</span>
                </label>
              )
            })}
          </div>

          {/* Work type */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Work type</p>
            {ALL_WORK_TYPES.map(wt => {
              const count = MOCK_CANDIDATES.filter(c => c.workType === wt).length
              return (
                <label key={wt} className="flex items-center gap-2 py-1 cursor-pointer">
                  <input
                    type="checkbox"
                    className="accent-blue"
                    checked={workTypes.has(wt)}
                    onChange={() => setWorkTypes(toggle(workTypes, wt))}
                  />
                  <span className="text-sm text-gray-600">{wt} ({count})</span>
                </label>
              )
            })}
          </div>

          {/* Salary */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Salary range (R / month)</p>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={salaryMin}
                onChange={e => setSalaryMin(Number(e.target.value))}
                step={1000}
                className="w-20 h-9 border border-border rounded-btn px-2 text-sm outline-none focus:border-blue"
              />
              <span className="text-sm text-gray-400">–</span>
              <input
                type="number"
                value={salaryMax}
                onChange={e => setSalaryMax(Number(e.target.value))}
                step={1000}
                className="w-20 h-9 border border-border rounded-btn px-2 text-sm outline-none focus:border-blue"
              />
            </div>
          </div>

          {/* Verified only */}
          <div className="mb-6">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Verified skills only</p>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                className="accent-blue"
                checked={verifiedOnly}
                onChange={e => setVerifiedOnly(e.target.checked)}
              />
              <span className="text-sm text-gray-600">Must have verified badge</span>
            </label>
          </div>
        </aside>

        {/* MAIN */}
        <div className="flex-1 px-8 py-7">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-[18px] font-bold tracking-tight">
                {filtered.length} {filtered.length === MOCK_CANDIDATES.length ? 'verified' : 'matching'} candidate{filtered.length !== 1 ? 's' : ''}
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                {hasActiveFilters ? `Filtered from ${MOCK_CANDIDATES.length} total` : 'Matching your filters · Sorted by verified first'}
              </p>
            </div>
            <select
              value={sort}
              onChange={e => setSort(e.target.value as SortKey)}
              className="h-9 px-3 border border-border rounded-btn text-sm text-gray-600 bg-white outline-none"
            >
              <option value="passport">Sort: Verified first</option>
              <option value="salary-asc">Sort: Salary (low–high)</option>
              <option value="salary-desc">Sort: Salary (high–low)</option>
              <option value="grad">Sort: Graduation date</option>
            </select>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2 mb-4">
              {[...cities].map(c => (
                <button key={c} onClick={() => setCities(toggle(cities, c))} className="flex items-center gap-1 text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full hover:bg-blue/20">
                  {CITY_LABELS[c]} ×
                </button>
              ))}
              {[...gradYears].map(y => (
                <button key={y} onClick={() => setGradYears(toggle(gradYears, y))} className="flex items-center gap-1 text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full hover:bg-blue/20">
                  Grad {y} ×
                </button>
              ))}
              {[...skills].map(s => (
                <button key={s} onClick={() => setSkillsFilter(toggle(skills, s))} className="flex items-center gap-1 text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full hover:bg-blue/20">
                  {s} ×
                </button>
              ))}
              {[...workTypes].map(w => (
                <button key={w} onClick={() => setWorkTypes(toggle(workTypes, w))} className="flex items-center gap-1 text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full hover:bg-blue/20">
                  {w} ×
                </button>
              ))}
              {verifiedOnly && (
                <button onClick={() => setVerifiedOnly(false)} className="flex items-center gap-1 text-xs bg-blue/10 text-blue px-2.5 py-1 rounded-full hover:bg-blue/20">
                  Verified only ×
                </button>
              )}
            </div>
          )}

          {/* Empty state */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-border rounded-card px-8 py-16 text-center">
              <p className="text-base font-semibold mb-1">No candidates match your filters</p>
              <p className="text-sm text-gray-400 mb-4">Try removing a filter or broadening your salary range.</p>
              <button onClick={resetFilters} className="text-sm font-semibold text-blue hover:underline">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {filtered.map(candidate => {
                const alreadySent = sentSlugs.has(candidate.slug)
                return (
                  <div
                    key={candidate.id}
                    className="bg-white border border-border rounded-card overflow-hidden hover:border-blue hover:shadow-sm transition-all"
                  >
                    <div className="bg-navy px-5 py-4 flex items-center gap-3 relative">
                      <div className={`w-11 h-11 rounded-full ${candidate.avatarColor} flex items-center justify-center text-[15px] font-bold text-white shrink-0 border-2 border-white/15`}>
                        {candidate.initials}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[15px] font-semibold text-white">{candidate.name}</p>
                        <p className="text-xs text-white/45 truncate">{candidate.degree} · {candidate.institution}</p>
                      </div>
                      <div className="flex gap-1.5 shrink-0">
                        {candidate.verified && (
                          <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded">✓ Verified</span>
                        )}
                        {candidate.isNew && (
                          <span className="text-[10px] font-semibold bg-yellow/20 text-yellow px-2 py-0.5 rounded">New</span>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-5 border-b border-border">
                      {[
                        { label: 'Location', value: candidate.city, sub: '' },
                        { label: 'Salary', value: formatRand(candidate.salary), sub: '/month' },
                        { label: 'Grad', value: candidate.gradDate, sub: candidate.institution },
                        { label: 'Stack', value: candidate.topSkill, sub: candidate.topSkillSub },
                        { label: 'From', value: candidate.available, sub: candidate.workType },
                      ].map(({ label, value, sub }, i) => (
                        <div key={label} className={`px-3 py-2.5 ${i < 4 ? 'border-r border-border' : ''}`}>
                          <p className="text-[9px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                          <p className="text-xs font-semibold text-navy leading-tight">{value}</p>
                          {sub && <p className="text-[10px] text-gray-400 truncate">{sub}</p>}
                        </div>
                      ))}
                    </div>

                    <div className="px-4 py-3 flex items-center gap-1.5 flex-wrap">
                      {candidate.skills.map(s => (
                        <span key={s.name} className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${s.verified ? 'bg-blue/10 text-blue' : 'bg-yellow/10 text-yellow-700'}`}>
                          {s.verified ? '✓ ' : ''}{s.name}
                        </span>
                      ))}
                      <div className="ml-auto flex gap-2 shrink-0">
                        <Link href={`/profile/${candidate.slug}`} className="text-xs font-semibold text-blue hover:underline">
                          View profile
                        </Link>
                        <button
                          onClick={() => !alreadySent && setActiveCandidate(candidate)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-btn transition-all ${
                            alreadySent
                              ? 'bg-green-50 text-green-600 border border-green-200 cursor-default'
                              : 'bg-blue text-white hover:opacity-90'
                          }`}
                        >
                          {alreadySent ? '✓ Interest sent' : 'Express interest →'}
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {activeCandidate && (
        <ExpressInterestModal
          candidate={activeCandidate}
          onClose={handleModalClose}
        />
      )}
    </>
  )
}
