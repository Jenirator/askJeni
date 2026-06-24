'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MOCK_ROLE } from '@/lib/mock-data'
import Logo from '@/components/Logo'
import { Check, ChevronRight, MapPin, Clock, Briefcase, DollarSign } from 'lucide-react'

type Path = 'none' | 'existing' | 'new'
type Screen = 'landing' | 'screening' | 'confirm'

interface Answers {
  [key: string]: string
}

export default function ApplyPortalPage() {
  const role = MOCK_ROLE
  const [path, setPath] = useState<Path>('none')
  const [screen, setScreen] = useState<Screen>('landing')
  const [answers, setAnswers] = useState<Answers>({})
  const [newUser, setNewUser] = useState({ name: '', email: '', institution: '', gradYear: '', stack: '' })

  function handleScreening() {
    setScreen('screening')
  }

  function handleSubmit() {
    setScreen('confirm')
  }

  const allAnswered = role.screeningQuestions.every(q => answers[q.id] !== undefined && answers[q.id] !== '')

  if (screen === 'confirm') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="max-w-[480px] w-full text-center">
            <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-3xl mx-auto mb-5">✓</div>
            <h1 className="text-2xl font-bold mb-2">Application submitted!</h1>
            <p className="text-gray-500 mb-1">
              Your application to <strong>{role.companyName}</strong> for <strong>{role.title}</strong> has been received.
            </p>
            <p className="text-sm text-gray-400 mb-8">{role.contactName} will review your profile and be in touch.</p>

            {/* Jeni nudge */}
            <div className="bg-navy rounded-2xl p-6 text-left mb-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-yellow text-lg">✦</span>
                <p className="text-white font-semibold text-sm">Want to stand out from the other applicants?</p>
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Complete your Skills Passport — applicants with verified skills get <strong className="text-yellow">2.4× more</strong> interview requests than those without.
              </p>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 bg-yellow text-navy text-sm font-bold py-3 rounded-btn hover:opacity-90 transition-opacity"
              >
                Complete my Skills Passport →
              </Link>
            </div>
            <Link href="/opportunities" className="text-sm text-gray-400 hover:text-navy">
              Browse other opportunities →
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (screen === 'screening') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Nav />
        <div className="flex-1 flex items-start justify-center p-6 pt-10">
          <div className="max-w-[560px] w-full">
            <RoleHeaderCard role={role} compact />

            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-4 shadow-sm">
              <h2 className="font-semibold text-base mb-1">A few quick questions</h2>
              <p className="text-sm text-gray-400 mb-5">{role.companyName} asks all applicants these questions before reviewing applications.</p>

              <div className="flex flex-col gap-5">
                {role.screeningQuestions.map(q => (
                  <div key={q.id}>
                    <p className="text-sm font-medium mb-2">{q.question}</p>
                    {q.type === 'yesno' ? (
                      <div className="flex gap-3">
                        {['Yes', 'No'].map(opt => (
                          <button
                            key={opt}
                            onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                            className={`flex-1 py-2.5 rounded-btn text-sm font-semibold border transition-all ${
                              answers[q.id] === opt
                                ? 'bg-blue text-white border-blue'
                                : 'border-gray-200 text-gray-600 hover:border-blue/40'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <textarea
                        rows={2}
                        value={answers[q.id] || ''}
                        onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                        className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue resize-none"
                        placeholder="Your answer…"
                      />
                    )}
                  </div>
                ))}
              </div>

              <button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className={`mt-6 w-full py-3 rounded-btn text-sm font-bold transition-all ${
                  allAnswered
                    ? 'bg-navy text-white hover:opacity-90'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Submit application →
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Landing screen
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Nav />

      <div className="flex-1 flex items-start justify-center p-6 pt-10">
        <div className="max-w-[640px] w-full">
          <RoleHeaderCard role={role} />

          {/* Two paths */}
          <div className="grid grid-cols-2 gap-3 mt-5">
            <PathCard
              active={path === 'existing'}
              onClick={() => setPath(path === 'existing' ? 'none' : 'existing')}
              icon="👤"
              title="I'm on askJeni already"
              sub="Log in and apply in one click — your profile pre-fills the application."
            />
            <PathCard
              active={path === 'new'}
              onClick={() => setPath(path === 'new' ? 'none' : 'new')}
              icon="✦"
              title="I'm new to askJeni"
              sub="Apply in 3 minutes. Create a basic profile, then submit."
            />
          </div>

          {/* Existing user path */}
          {path === 'existing' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-3 shadow-sm">
              <p className="text-sm font-semibold mb-4">Log in to your account</p>
              <input className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-3 outline-none focus:border-blue" placeholder="Email address" type="email" />
              <input className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-4 outline-none focus:border-blue" placeholder="Password" type="password" />
              <button onClick={handleScreening} className="w-full bg-navy text-white text-sm font-bold py-3 rounded-btn hover:opacity-90 transition-opacity">
                Log in and continue →
              </button>
              <p className="text-xs text-center text-gray-400 mt-3">Your profile will pre-fill the application automatically.</p>
            </div>
          )}

          {/* New user path */}
          {path === 'new' && (
            <div className="bg-white rounded-2xl border border-gray-100 p-6 mt-3 shadow-sm">
              <p className="text-sm font-semibold mb-1">Create your askJeni profile</p>
              <p className="text-xs text-gray-400 mb-4">Takes about 3 minutes. You'll join the talent pool automatically.</p>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                  placeholder="Full name"
                  value={newUser.name}
                  onChange={e => setNewUser(u => ({ ...u, name: e.target.value }))}
                />
                <input
                  className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                  placeholder="Email address"
                  type="email"
                  value={newUser.email}
                  onChange={e => setNewUser(u => ({ ...u, email: e.target.value }))}
                />
              </div>
              <div className="grid grid-cols-2 gap-3 mb-3">
                <input
                  className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue"
                  placeholder="University / institution"
                  value={newUser.institution}
                  onChange={e => setNewUser(u => ({ ...u, institution: e.target.value }))}
                />
                <select
                  className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-blue bg-white text-gray-600"
                  value={newUser.gradYear}
                  onChange={e => setNewUser(u => ({ ...u, gradYear: e.target.value }))}
                >
                  <option value="">Graduation year</option>
                  {['2025', '2026', '2027'].map(y => <option key={y}>{y}</option>)}
                </select>
              </div>
              <input
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm mb-4 outline-none focus:border-blue"
                placeholder="Tech stack (e.g. React, Python, Node.js)"
                value={newUser.stack}
                onChange={e => setNewUser(u => ({ ...u, stack: e.target.value }))}
              />
              <button
                onClick={handleScreening}
                disabled={!newUser.name || !newUser.email}
                className={`w-full py-3 rounded-btn text-sm font-bold transition-all ${
                  newUser.name && newUser.email
                    ? 'bg-navy text-white hover:opacity-90'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
              >
                Create profile and continue →
              </button>
            </div>
          )}

          {/* Why askJeni */}
          <div className="mt-6 border-t border-gray-200 pt-6">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Why apply via askJeni?</p>
            <p className="text-sm text-gray-500 leading-relaxed">
              askJeni replaces the CV inbox. Your application arrives as a structured, comparable profile — not a PDF in a pile. Employers see your verified skills, assessment scores, and projects side-by-side with other candidates. No formatting games, no guesswork. If your skills match, you get seen.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Nav() {
  return (
    <nav className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Logo size={18} />
        <span className="text-gray-300 text-sm ml-1">·</span>
        <span className="text-xs text-gray-400 font-medium">Apply portal</span>
      </div>
      <Link href="/dashboard" className="text-xs font-semibold text-gray-500 hover:text-navy">
        Already have an account? Log in
      </Link>
    </nav>
  )
}

function RoleHeaderCard({ role, compact = false }: { role: typeof MOCK_ROLE; compact?: boolean }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl ${role.companyColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
          {role.companyInitials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-gray-400">{role.companyName}</span>
            <span className="text-gray-200">·</span>
            <span className="text-xs text-gray-400">{role.industry}</span>
          </div>
          <h1 className={`font-bold text-navy leading-tight mt-0.5 ${compact ? 'text-base' : 'text-xl'}`}>{role.title}</h1>
          {!compact && (
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-400"><MapPin size={11} />{role.location}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Clock size={11} />{role.workType}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><Briefcase size={11} />{role.roleType}</span>
              <span className="flex items-center gap-1 text-xs text-gray-400"><DollarSign size={11} />R{role.salaryMin.toLocaleString()} – R{role.salaryMax.toLocaleString()} / month</span>
            </div>
          )}
        </div>
        {!compact && (
          <div className="shrink-0 text-right">
            <p className="text-[11px] text-gray-400 font-medium">R{role.salaryMin.toLocaleString()}–{role.salaryMax.toLocaleString()}</p>
            <p className="text-[11px] text-gray-400">per month</p>
          </div>
        )}
      </div>

      {!compact && (
        <>
          <div className="flex flex-wrap gap-1.5 mt-4">
            {role.stack.map(s => (
              <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy/5 text-navy border border-navy/10">{s}</span>
            ))}
          </div>
          <p className="text-sm text-gray-500 leading-relaxed mt-4 line-clamp-3">{role.description}</p>
        </>
      )}
    </div>
  )
}

function PathCard({ active, onClick, icon, title, sub }: {
  active: boolean; onClick: () => void; icon: string; title: string; sub: string
}) {
  return (
    <button
      onClick={onClick}
      className={`p-5 rounded-2xl border text-left transition-all ${
        active
          ? 'border-blue bg-blue/5 shadow-sm'
          : 'border-gray-100 bg-white hover:border-blue/30 hover:bg-blue/[0.02]'
      }`}
    >
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-base mb-3 ${active ? 'bg-blue/10' : 'bg-gray-50'}`}>
        {icon}
      </div>
      <p className={`text-sm font-semibold mb-1 ${active ? 'text-blue' : 'text-navy'}`}>{title}</p>
      <p className="text-xs text-gray-400 leading-relaxed">{sub}</p>
      {active && (
        <div className="flex items-center gap-1 mt-3">
          <div className="w-4 h-4 rounded-full bg-blue flex items-center justify-center">
            <Check size={10} className="text-white" />
          </div>
          <span className="text-xs font-semibold text-blue">Selected</span>
        </div>
      )}
    </button>
  )
}
