'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { saveStudent, computeCompletion } from '@/lib/student-store'
import Logo from '@/components/Logo'

const INSTITUTIONS = [
  'University of the Witwatersrand',
  'UCT',
  'Stellenbosch University',
  'University of Pretoria',
  'UJ',
  'CPUT',
  'Rhodes University',
  'TUT',
  'DUT',
  'WeThinkCode_',
  'HyperionDev',
  'CodeSpace',
  'Boolean',
  'Other',
]

const SKILLS_BY_CATEGORY: Record<string, string[]> = {
  Languages: ['JavaScript', 'Python', 'TypeScript', 'Java', 'C++', 'C#', 'Go', 'Rust', 'PHP', 'Kotlin', 'Swift', 'R'],
  Frontend: ['React', 'Vue.js', 'Angular', 'Next.js', 'HTML/CSS', 'Tailwind CSS', 'React Native'],
  'Backend & APIs': ['Node.js', 'FastAPI', 'Django', 'Spring Boot', 'Express.js', 'GraphQL', 'REST APIs'],
  'Data & Databases': ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQL', 'Pandas', 'TensorFlow'],
  'Infrastructure & Tools': ['Docker', 'Git', 'Linux', 'AWS', 'GCP', 'Azure', 'CI/CD'],
}

const JENI_TIPS = [
  "Students who add a salary expectation get 3× more recruiter views. It's the signal that unlocks the match.",
  'Mark skills as "Confident" to unlock assessment recommendations. Confident skills carry 4× more weight with recruiters.',
  "This is what puts you in control of the salary conversation. Set it once, never answer that question cold again.",
  'Sorted! Your passport is live. Take an assessment next to get your first verified badge.',
]

export default function RegisterPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)

  // Step 1
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState(INSTITUTIONS[0])
  const [degree, setDegree] = useState('')
  const [yearOfStudy, setYearOfStudy] = useState('3rd year')
  const [graduationDate, setGraduationDate] = useState('November 2025')
  const [city, setCity] = useState('Johannesburg, Gauteng')
  const [githubUsername, setGithubUsername] = useState('')

  // Step 2
  const [skills, setSkills] = useState<Record<string, 'learning' | 'confident'>>({})

  // Step 3
  const [salary, setSalary] = useState(22000)
  const [availableFrom, setAvailableFrom] = useState('January 2026')
  const [workTypes, setWorkTypes] = useState<string[]>(['Full-time', 'Internship'])
  const [workLocations, setWorkLocations] = useState<string[]>(['Hybrid', 'Remote'])

  function toggleSkill(name: string) {
    setSkills(prev => {
      const current = prev[name]
      const count = Object.keys(prev).length
      if (!current) {
        if (count >= 8) return prev
        return { ...prev, [name]: 'learning' }
      }
      if (current === 'learning') return { ...prev, [name]: 'confident' }
      const next = { ...prev }
      delete next[name]
      return next
    })
  }

  function toggleList(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter(v => v !== value) : [...list, value])
  }

  function handleFinish() {
    const data = {
      firstName,
      lastName,
      email,
      institution,
      degree,
      yearOfStudy,
      graduationDate,
      city,
      githubUsername,
      salaryExpectation: salary,
      availableFrom,
      workTypes,
      workLocations,
      skills,
      passportCompletion: computeCompletion({ institution, degree, salaryExpectation: salary, availableFrom, skills }),
      createdAt: new Date().toISOString(),
    }
    saveStudent(data)
    setStep(4)
  }

  const selectedCount = Object.keys(skills).length

  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      {/* NAV */}
      <nav className="bg-navy h-[52px] flex items-center justify-between px-10">
        <Logo size={18} variant="light" />
        <Link href="/" className="text-sm text-white/50 hover:text-white/80">← Back to home</Link>
      </nav>

      <div className="flex min-h-[calc(100vh-52px)]">

        {/* LEFT PANEL */}
        <div className="w-[340px] bg-navy px-9 py-12 flex flex-col shrink-0">
          <h2 className="text-[22px] font-bold text-white tracking-tight mb-2">Build your Skills Passport</h2>
          <p className="text-sm text-white/50 leading-relaxed mb-10">Four quick steps and your profile is live. Takes about 10 minutes.</p>

          <div className="flex flex-col">
            {['Your basics', 'Tech stack', 'Salary & availability', 'Passport ready'].map((label, i) => {
              const n = i + 1
              const isDone = n < step
              const isActive = n === step
              return (
                <div key={n} className="flex gap-3.5 relative pb-7 last:pb-0">
                  {n < 4 && (
                    <div className={`absolute left-[17px] top-9 w-0.5 bottom-0 ${isDone ? 'bg-green-500' : 'bg-white/10'}`} />
                  )}
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 z-10 ${isDone ? 'bg-green-500 text-white' : isActive ? 'bg-blue text-white' : 'bg-white/10 text-white/30 border border-white/10'}`}>
                    {isDone ? '✓' : n}
                  </div>
                  <div className="pt-2">
                    <p className={`text-sm font-semibold ${isActive ? 'text-white' : isDone ? 'text-white/60' : 'text-white/35'}`}>{label}</p>
                    <p className="text-xs text-white/35 mt-0.5">
                      {['Name, institution, degree', 'Skills you know and are learning', 'Your number, upfront and honest', 'Review and go live'][i]}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="mt-auto bg-yellow/10 border border-yellow/20 rounded-xl p-4">
            <p className="text-[11px] font-semibold text-yellow uppercase tracking-wider mb-2">✦ Jeni says</p>
            <p className="text-sm text-white/60 leading-relaxed">{JENI_TIPS[step - 1]}</p>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="flex-1 px-14 py-12 overflow-y-auto">

          {/* STEP 1: BASICS */}
          {step === 1 && (
            <div>
              <div className="h-1 bg-border rounded-full mb-9 overflow-hidden">
                <div className="h-full bg-blue rounded-full" style={{ width: '25%' }} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-1.5">Let&apos;s start with the basics</h1>
              <p className="text-[15px] text-gray-500 mb-9 leading-relaxed">Tell us about yourself and where you&apos;re studying. This is the foundation of your Skills Passport.</p>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">First name</label>
                  <input value={firstName} onChange={e => setFirstName(e.target.value)} type="text" placeholder="Thabo" className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white" />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Last name</label>
                  <input value={lastName} onChange={e => setLastName(e.target.value)} type="text" placeholder="Nkosi" className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white" />
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold">Student email</label>
                <input value={email} onChange={e => setEmail(e.target.value)} type="email" placeholder="thabo@students.wits.ac.za" className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white" />
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Institution</label>
                  <select value={institution} onChange={e => setInstitution(e.target.value)} className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white text-gray-700">
                    {INSTITUTIONS.map(inst => <option key={inst}>{inst}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Degree / Programme</label>
                  <input value={degree} onChange={e => setDegree(e.target.value)} type="text" placeholder="BSc Computer Science" className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Year of study</label>
                  <select value={yearOfStudy} onChange={e => setYearOfStudy(e.target.value)} className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white text-gray-700">
                    {['1st year', '2nd year', '3rd year', '4th year / Honours', 'Masters', 'Recent graduate (≤ 1 year)'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Expected graduation</label>
                  <select value={graduationDate} onChange={e => setGraduationDate(e.target.value)} className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white text-gray-700">
                    {['June 2025', 'November 2025', 'June 2026', 'November 2026', '2027 or later'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold">City</label>
                <select value={city} onChange={e => setCity(e.target.value)} className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white text-gray-700">
                  {['Johannesburg, Gauteng', 'Cape Town, Western Cape', 'Pretoria, Gauteng', 'Durban, KwaZulu-Natal', 'Stellenbosch, Western Cape', 'Other'].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold">GitHub <span className="text-xs font-normal text-gray-400 ml-1">optional — adds credibility</span></label>
                <div className="flex h-10 border border-border rounded-btn overflow-hidden bg-white focus-within:border-blue">
                  <span className="px-3 bg-gray-50 border-r border-border text-sm text-gray-400 flex items-center whitespace-nowrap">github.com/</span>
                  <input value={githubUsername} onChange={e => setGithubUsername(e.target.value)} type="text" placeholder="thabonkosi" className="flex-1 px-3 text-sm outline-none" />
                </div>
              </div>

              <div className="flex justify-end pt-6 border-t border-border mt-9">
                <button
                  onClick={() => setStep(2)}
                  disabled={!firstName || !lastName || !email}
                  className="bg-blue text-white text-sm font-semibold px-6 py-2.5 rounded-btn hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next: Tech stack →
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: TECH STACK */}
          {step === 2 && (
            <div>
              <div className="h-1 bg-border rounded-full mb-9 overflow-hidden">
                <div className="h-full bg-blue rounded-full" style={{ width: '50%' }} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-1.5">What&apos;s in your tech stack?</h1>
              <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">Select up to 8 skills. <strong>One tap = learning.</strong> <strong>Two taps = confident.</strong> Confident skills unlock assessment recommendations.</p>

              <div className="flex gap-4 mb-6">
                {[
                  ['bg-white border border-border text-gray-500', 'Not selected'],
                  ['bg-yellow/10 border border-yellow/40 text-yellow-700', 'Learning (1 tap)'],
                  ['bg-blue/10 border border-blue/20 text-blue', 'Confident (2 taps)'],
                ].map(([cls, label]) => (
                  <div key={label} className={`flex items-center gap-2 text-xs font-medium px-3 py-1 rounded-full border ${cls}`}>
                    {label}
                  </div>
                ))}
              </div>

              {Object.entries(SKILLS_BY_CATEGORY).map(([cat, list]) => (
                <div key={cat} className="mb-5">
                  <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">{cat}</p>
                  <div className="flex flex-wrap gap-2">
                    {list.map(name => {
                      const state = skills[name]
                      return (
                        <button
                          key={name}
                          onClick={() => toggleSkill(name)}
                          className={`px-3.5 py-2 rounded-btn text-sm font-medium border transition-all ${
                            state === 'confident' ? 'bg-blue/10 border-blue/30 text-blue' :
                            state === 'learning' ? 'bg-yellow/10 border-yellow/40 text-yellow-700' :
                            'bg-white border-border text-gray-600 hover:border-blue hover:text-blue'
                          }`}
                        >
                          {state === 'confident' ? '✓ ' : state === 'learning' ? '~ ' : ''}{name}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}

              <p className="text-xs text-gray-400">Selected: <span className="font-semibold text-navy">{selectedCount}</span> / 8</p>

              <div className="flex justify-between pt-6 border-t border-border mt-9">
                <button onClick={() => setStep(1)} className="border border-border text-sm font-semibold px-5 py-2.5 rounded-btn text-gray-600 hover:border-navy">← Back</button>
                <button
                  onClick={() => setStep(3)}
                  disabled={selectedCount < 2}
                  className="bg-blue text-white text-sm font-semibold px-6 py-2.5 rounded-btn hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next: Salary & availability →
                </button>
              </div>
              {selectedCount < 2 && (
                <p className="text-xs text-gray-400 text-right mt-2">Select at least 2 skills to continue</p>
              )}
            </div>
          )}

          {/* STEP 3: SALARY */}
          {step === 3 && (
            <div>
              <div className="h-1 bg-border rounded-full mb-9 overflow-hidden">
                <div className="h-full bg-blue rounded-full" style={{ width: '75%' }} />
              </div>
              <h1 className="text-2xl font-bold tracking-tight mb-1.5">Set your number upfront</h1>
              <p className="text-[15px] text-gray-500 mb-6 leading-relaxed">This is what puts you in control of the salary conversation. You set it once and every recruiter who finds you sees it.</p>

              <div className="bg-navy rounded-card px-6 py-5 flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-white/40 mb-1">Your monthly salary expectation</p>
                  <p className="text-[32px] font-bold text-white tracking-tight">R{salary.toLocaleString('en-ZA').replace(/,/g, ' ')}</p>
                </div>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">Graduate range</span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Monthly salary expectation <span className="text-xs font-normal text-gray-400">in Rand</span></label>
                  <div className="flex h-10 border border-border rounded-btn overflow-hidden bg-white focus-within:border-blue">
                    <span className="px-3 bg-gray-50 border-r border-border text-sm text-gray-400 flex items-center">R</span>
                    <input type="number" value={salary} onChange={e => setSalary(Number(e.target.value))} min={8000} max={80000} className="flex-1 px-3 text-sm outline-none" />
                  </div>
                  <p className="text-xs text-gray-400">SA graduate range: R14 000 – R35 000 / month</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Available from</label>
                  <select value={availableFrom} onChange={e => setAvailableFrom(e.target.value)} className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue bg-white text-gray-700">
                    {['Immediately', '1 month notice', 'January 2026', 'March 2026', 'June 2026', 'After graduation'].map(v => <option key={v}>{v}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold">Work type preference <span className="text-xs font-normal text-gray-400 ml-1">select all that apply</span></label>
                <div className="flex flex-wrap gap-2">
                  {['Full-time', 'Internship', 'Contract', 'Part-time', 'Vacation work'].map(v => (
                    <button key={v} onClick={() => toggleList(workTypes, setWorkTypes, v)}
                      className={`px-4 py-2 rounded-btn text-sm font-medium border transition-all ${workTypes.includes(v) ? 'bg-blue/10 border-blue text-blue' : 'bg-white border-border text-gray-500 hover:border-blue'}`}>
                      {workTypes.includes(v) ? '✓ ' : ''}{v}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-1.5 mb-5">
                <label className="text-sm font-semibold">Work location preference</label>
                <div className="flex flex-wrap gap-2">
                  {['Hybrid', 'Remote', 'In-office', 'Willing to relocate'].map(v => (
                    <button key={v} onClick={() => toggleList(workLocations, setWorkLocations, v)}
                      className={`px-4 py-2 rounded-btn text-sm font-medium border transition-all ${workLocations.includes(v) ? 'bg-blue/10 border-blue text-blue' : 'bg-white border-border text-gray-500 hover:border-blue'}`}>
                      {workLocations.includes(v) ? '✓ ' : ''}{v}
                    </button>
                  ))}
                </div>
              </div>

              <p className="text-xs text-gray-400 mb-8">Your salary expectation is visible to employers on your profile. You can update or hide it at any time from your settings. All data is handled in accordance with POPIA.</p>

              <div className="flex justify-between pt-6 border-t border-border">
                <button onClick={() => setStep(2)} className="border border-border text-sm font-semibold px-5 py-2.5 rounded-btn text-gray-600">← Back</button>
                <button onClick={handleFinish} className="bg-blue text-white text-sm font-semibold px-6 py-2.5 rounded-btn hover:opacity-90">
                  Create my passport →
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: COMPLETE */}
          {step === 4 && (
            <div>
              <div className="h-1 bg-border rounded-full mb-9 overflow-hidden">
                <div className="h-full bg-blue rounded-full w-full" />
              </div>
              <div className="text-center py-10">
                <div className="w-[72px] h-[72px] rounded-full bg-green-50 flex items-center justify-center text-4xl mx-auto mb-6">🎉</div>
                <h1 className="text-[28px] font-bold tracking-tight mb-2">Your passport is ready, {firstName}!</h1>
                <p className="text-[15px] text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
                  Your Skills Passport is live. Jeni will guide you through the next steps to unlock your first matches.
                </p>
                <div className="flex gap-3 justify-center">
                  <Link href="/dashboard" className="bg-blue text-white text-sm font-semibold px-6 py-2.5 rounded-btn hover:opacity-90">
                    Go to my dashboard →
                  </Link>
                  <Link href="/passport" className="bg-blue/10 text-blue text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-80">
                    View my passport
                  </Link>
                </div>

                <div className="mt-10 bg-yellow/10 border border-yellow/30 rounded-card p-5 text-left max-w-md mx-auto">
                  <p className="text-xs font-semibold text-yellow-700 mb-2">✦ Jeni&apos;s next step for you</p>
                  <p className="text-sm font-semibold text-navy mb-1">Take an assessment to get your first verified badge</p>
                  <p className="text-sm text-gray-500 mb-3">Your passport shows your skills as self-declared. One 20-question assessment turns that into a verified badge — and verified skills get 4× more recruiter attention.</p>
                  <Link href="/passport" className="text-sm font-semibold text-blue hover:underline">Start assessment →</Link>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
