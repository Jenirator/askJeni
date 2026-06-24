'use client'

import { useState } from 'react'
import {
  MOCK_STUDENT,
  MOCK_SKILLS,
  MOCK_PROJECTS,
  MOCK_ASSESSMENTS_COMPLETED,
  MOCK_ASSESSMENTS_AVAILABLE,
} from '@/lib/mock-data'
import { formatRand } from '@/lib/utils'
import Link from 'next/link'

const CHECKLIST_ITEMS = [
  { key: 'institution', label: 'Institution & degree', points: 10, done: true },
  { key: 'skills',      label: 'Tech stack selected',  points: 15, done: true },
  { key: 'salary',      label: 'Salary & availability', points: 15, done: true },
  { key: 'project',     label: 'First project added',  points: 20, done: true },
  { key: 'assessment',  label: 'First assessment done', points: 15, done: true },
  { key: 'project2',    label: 'Second project added', points: 10, done: true },
  { key: 'verified2',   label: 'Second skill verified', points: 15, done: false },
]

type Tab = 'overview' | 'skills' | 'projects' | 'assessments'

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview',    label: 'Overview'    },
  { key: 'skills',      label: 'Skills'      },
  { key: 'projects',    label: 'Projects'    },
  { key: 'assessments', label: 'Assessments' },
]

export default function PassportPage() {
  const [tab, setTab] = useState<Tab>('overview')

  const score = MOCK_STUDENT.passportCompletion
  const verifiedSkills  = MOCK_SKILLS.filter(s => s.level === 'VERIFIED')
  const confidentSkills = MOCK_SKILLS.filter(s => s.level === 'CONFIDENT')
  const learningSkills  = MOCK_SKILLS.filter(s => s.level === 'LEARNING')
  const stepsLeft = CHECKLIST_ITEMS.filter(c => !c.done).length

  return (
    <div className="p-7 max-w-[960px]">

      {/* ── HERO ───────────────────────────────────────────── */}
      <div className="bg-navy rounded-2xl mb-5">
        <div className="px-7 py-6 flex items-center gap-6">
          <div className="w-14 h-14 rounded-full bg-blue flex items-center justify-center text-lg font-bold text-white shrink-0">
            {MOCK_STUDENT.initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-lg font-bold text-white truncate">{MOCK_STUDENT.name}</h1>
              <span className="text-[10px] font-semibold bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full shrink-0">✓ Verified</span>
            </div>
            <p className="text-sm text-white/50 truncate">{MOCK_STUDENT.degree} · {MOCK_STUDENT.institution}</p>
          </div>

          {/* Key signals */}
          <div className="flex gap-6 shrink-0">
            {[
              { label: 'Salary', value: formatRand(MOCK_STUDENT.salaryExpectation) },
              { label: 'Available', value: MOCK_STUDENT.availableFrom },
              { label: 'Location', value: MOCK_STUDENT.city },
            ].map(({ label, value }) => (
              <div key={label}>
                <p className="text-[10px] text-white/30 uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-sm font-semibold text-white">{value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-2 shrink-0">
            <Link
              href={`/profile/${MOCK_STUDENT.slug}`}
              className="text-xs font-semibold text-white/50 hover:text-white border border-white/20 hover:border-white/40 px-3 py-1.5 rounded-btn transition-all text-center"
            >
              View public profile →
            </Link>
            <Link
              href={`/profile/${MOCK_STUDENT.slug}/cv`}
              className="text-xs font-semibold bg-yellow text-navy px-3 py-1.5 rounded-btn hover:opacity-90 transition-all text-center"
            >
              ↓ Download CV
            </Link>
          </div>
        </div>
      </div>

      {/* ── TABS ───────────────────────────────────────────── */}
      <div className="flex gap-1 mb-5 bg-white border border-border rounded-xl p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`flex-1 text-sm font-semibold py-2 rounded-lg transition-all ${
              tab === t.key ? 'bg-navy text-white shadow-sm' : 'text-gray-500 hover:text-navy'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ───────────────────────────────────── */}
      {tab === 'overview' && (
        <div className="flex flex-col gap-4">

          {/* Completion + bio side by side */}
          <div className="grid grid-cols-2 gap-4">

            {/* Passport checklist */}
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-semibold">Passport progress</p>
                <span className="text-sm font-bold text-blue">{score}%</span>
              </div>
              <div className="flex flex-col gap-2.5">
                {CHECKLIST_ITEMS.map(({ key, label, points, done }) => (
                  <div key={key} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 font-bold ${
                      done ? 'bg-green-100 text-green-600' : 'bg-gray-100 border border-border text-gray-300'
                    }`}>
                      {done ? '✓' : ''}
                    </div>
                    <span className={`text-sm flex-1 ${done ? 'text-gray-400 line-through' : 'text-navy'}`}>{label}</span>
                    <span className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
                      done ? 'text-gray-300' : 'bg-blue/10 text-blue'
                    }`}>+{points}</span>
                  </div>
                ))}
              </div>
              {stepsLeft > 0 && (
                <button className="mt-4 w-full bg-blue/5 border border-blue/20 text-blue text-xs font-semibold py-2 rounded-btn hover:bg-blue/10 transition-colors">
                  ✦ Help me complete this
                </button>
              )}
            </div>

            {/* Bio + links */}
            <div className="bg-white border border-border rounded-2xl p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <p className="text-sm font-semibold">About</p>
                <button className="text-xs font-semibold text-blue hover:underline">Edit</button>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed flex-1">{MOCK_STUDENT.bio}</p>
              <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-border">
                {MOCK_STUDENT.workLocationPrefs.map(p => (
                  <span key={p} className="text-xs bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{p}</span>
                ))}
              </div>
              <div className="flex gap-4 mt-3 pt-3 border-t border-border">
                <a href={MOCK_STUDENT.githubUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue hover:underline">↗ GitHub</a>
                <a href={MOCK_STUDENT.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-blue hover:underline">↗ LinkedIn</a>
              </div>
            </div>
          </div>

          {/* Quick skill preview */}
          <div className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold">Top skills</p>
              <button onClick={() => setTab('skills')} className="text-xs font-semibold text-blue hover:underline">See all →</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {verifiedSkills.map(s => (
                <span key={s.id} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-blue/10 text-blue rounded-full border border-blue/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue inline-block" />
                  {s.name}
                  <span className="text-[10px] font-bold bg-blue text-white px-1.5 py-0.5 rounded-full ml-0.5">✓</span>
                </span>
              ))}
              {confidentSkills.slice(0, 3).map(s => (
                <span key={s.id} className="text-xs font-medium px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full">{s.name}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── SKILLS TAB ─────────────────────────────────────── */}
      {tab === 'skills' && (
        <div className="flex flex-col gap-4">
          {/* Verified */}
          {verifiedSkills.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">✓ Verified by assessment</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {verifiedSkills.map(s => (
                  <div key={s.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-blue/5 border border-blue/15">
                    <div className="w-8 h-8 rounded-lg bg-blue/15 flex items-center justify-center text-blue font-bold text-xs shrink-0">
                      {s.name.slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold">{s.name}</p>
                      <p className="text-[10px] text-gray-400">{s.category}</p>
                    </div>
                    <span className="text-[10px] font-bold bg-green-100 text-green-600 px-1.5 py-0.5 rounded-full shrink-0">✓</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Confident */}
          {confidentSkills.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-blue bg-blue/10 px-2.5 py-1 rounded-full">Self-declared confident</span>
                <button className="text-xs font-semibold text-blue hover:underline">Edit</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {confidentSkills.map(s => (
                  <span key={s.id} className="flex items-center gap-1.5 text-xs font-medium px-3 py-2 bg-blue/5 border border-blue/15 text-blue rounded-full">
                    {s.name}
                    <button className="text-blue/40 hover:text-blue ml-0.5 text-[10px]">→ verify</button>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Learning */}
          {learningSkills.length > 0 && (
            <div className="bg-white border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-bold text-yellow-700 bg-yellow/10 px-2.5 py-1 rounded-full">Currently learning</span>
                <button className="text-xs font-semibold text-blue hover:underline">Edit</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {learningSkills.map(s => (
                  <span key={s.id} className="text-xs font-medium px-3 py-2 bg-yellow/10 text-yellow-700 border border-yellow/20 rounded-full">
                    {s.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="bg-blue/5 border border-blue/15 rounded-2xl p-5 flex items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold mb-0.5">Turn confident → verified</p>
              <p className="text-sm text-gray-500">Take a 20-question assessment to earn a verified badge. Most take under 20 minutes.</p>
            </div>
            <button onClick={() => setTab('assessments')} className="bg-blue text-white text-xs font-semibold px-4 py-2.5 rounded-btn hover:opacity-90 shrink-0">
              Take assessment →
            </button>
          </div>
        </div>
      )}

      {/* ── PROJECTS TAB ───────────────────────────────────── */}
      {tab === 'projects' && (
        <div className="flex flex-col gap-3">
          {MOCK_PROJECTS.map((project, i) => (
            <div key={project.id} className="bg-white border border-border rounded-2xl p-5 hover:border-blue/30 transition-colors">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="text-base font-semibold">{project.title}</h3>
                    {i === 0 && <span className="text-[10px] font-bold bg-yellow/15 text-yellow-700 px-2 py-0.5 rounded-full">Featured</span>}
                  </div>
                  {project.stars && (
                    <span className="text-xs text-gray-400">★ {project.stars} GitHub stars</span>
                  )}
                </div>
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                  className="text-xs font-semibold text-blue border border-blue/20 px-3 py-1.5 rounded-btn hover:bg-blue/5 transition-colors shrink-0 ml-3">
                  ↗ GitHub
                </a>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed mb-3">{project.description}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map(skill => (
                  <span key={skill} className="text-[11px] font-medium px-2.5 py-1 bg-blue/10 text-blue rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          ))}

          {/* Add project CTA */}
          <button className="flex items-center justify-center gap-2 bg-white border-2 border-dashed border-border text-gray-400 hover:border-blue hover:text-blue rounded-2xl p-5 text-sm font-semibold transition-all">
            + Add another project
          </button>
        </div>
      )}

      {/* ── ASSESSMENTS TAB ────────────────────────────────── */}
      {tab === 'assessments' && (
        <div className="flex flex-col gap-4">

          {/* Completed */}
          {MOCK_ASSESSMENTS_COMPLETED.length > 0 && (
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Completed</p>
              <div className="flex flex-col gap-3">
                {MOCK_ASSESSMENTS_COMPLETED.map(a => (
                  <div key={a.id} className="bg-white border border-green-100 rounded-2xl p-5 flex items-center gap-4">
                    <div className="relative shrink-0">
                      <svg viewBox="0 0 48 48" width="48" height="48">
                        <circle cx="24" cy="24" r="19" fill="none" stroke="#f0fdf4" strokeWidth="4" />
                        <circle cx="24" cy="24" r="19" fill="none" stroke="#22c55e" strokeWidth="4"
                          strokeLinecap="round" strokeDasharray="119.4"
                          strokeDashoffset={119.4 - (a.score / 100) * 119.4}
                          transform="rotate(-90 24 24)" />
                        <text x="24" y="27" textAnchor="middle" fill="#16a34a" fontSize="11" fontWeight="700" fontFamily="Inter">{a.score}</text>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold mb-0.5">{a.title}</p>
                      <p className="text-xs text-gray-400">{a.questions} questions · Completed {a.completedAt}</p>
                    </div>
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-2.5 py-1 rounded-full shrink-0">✓ Verified</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Available */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Available</p>
            <div className="grid grid-cols-2 gap-3">
              {MOCK_ASSESSMENTS_AVAILABLE.map((a, i) => (
                <div key={a.id} className={`bg-white border rounded-2xl p-5 flex flex-col gap-3 ${a.locked ? 'border-border opacity-60' : 'border-border hover:border-blue transition-colors'}`}>
                  <div className="flex items-start justify-between">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-blue/5">
                      {a.locked ? '🔒' : '💻'}
                    </div>
                    {i === 0 && !a.locked && (
                      <span className="text-[10px] font-bold bg-blue/10 text-blue px-2 py-0.5 rounded-full">Recommended</span>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-semibold mb-0.5 ${a.locked ? 'text-gray-400' : ''}`}>{a.title}</p>
                    <p className="text-xs text-gray-400">~{a.minutes} min · 20 questions</p>
                  </div>
                  <button disabled={a.locked} className={`w-full text-xs font-semibold py-2 rounded-btn transition-all ${
                    a.locked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                    i === 0 ? 'bg-blue text-white hover:opacity-90' : 'bg-blue/10 text-blue hover:bg-blue/20'
                  }`}>
                    {a.locked ? 'Complete previous first' : 'Start assessment →'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
