'use client'

import Link from 'next/link'
import { useState } from 'react'
import { MOCK_ROLE, MOCK_EMPLOYER_ROLES, MOCK_APPLICATIONS } from '@/lib/mock-data'
import { Plus, ExternalLink, ChevronRight, TrendingUp, Users, Clock, Zap, Check, X } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    id: 'post',
    title: 'Post your first role',
    body: 'Create a role, set the skills you need, and publish your apply link.',
    cta: 'Post a role →',
    href: '/roles/new',
  },
  {
    id: 'share',
    title: 'Share your apply link',
    body: 'Share the link on LinkedIn, your website, or wherever you advertise. No CVs will ever hit your inbox.',
    cta: 'Copy apply link',
    href: null,
  },
  {
    id: 'review',
    title: 'Review your first application',
    body: 'Click any candidate in the New column to see their Skills Passport, assessments, and projects.',
    cta: 'Open pipeline →',
    href: '/pipeline',
  },
  {
    id: 'invite',
    title: 'Invite a candidate to interview',
    body: 'Shortlist a strong candidate and use the Schedule Interview flow to send them time slots.',
    cta: 'Open pipeline →',
    href: '/pipeline',
  },
]

const STAGES = ['new', 'screening', 'shortlisted', 'interview', 'offer', 'hired', 'declined'] as const
const STAGE_LABELS: Record<string, string> = {
  new: 'New',
  screening: 'Screening',
  shortlisted: 'Shortlisted',
  interview: 'Interview',
  offer: 'Offer made',
  hired: 'Hired',
  declined: 'Not progressing',
}

export default function EmployerDashboardPage() {
  const role = MOCK_ROLE
  const apps = MOCK_APPLICATIONS
  const [done, setDone] = useState<Set<string>>(new Set())
  const [checklistDismissed, setChecklistDismissed] = useState(false)

  function toggleStep(id: string) {
    setDone(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const allDone = ONBOARDING_STEPS.every(s => done.has(s.id))
  const newCount = apps.filter(a => a.stage === 'new').length
  const thisWeek = apps.filter(a => a.appliedAt.includes('hour') || a.appliedAt.includes('day')).length
  const shortlisted = apps.filter(a => a.stage === 'shortlisted').length

  const stageCounts = STAGES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.stage === s).length
    return acc
  }, {} as Record<string, number>)

  const recent = apps.slice(0, 5)

  return (
    <div className="p-6 max-w-[960px]">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-sm text-gray-400 mt-0.5">Peach Payments · Naledi Dlamini</p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/apply/peach-payments/junior-software-engineer"
            target="_blank"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-2 rounded-btn hover:border-navy transition-colors"
          >
            <ExternalLink size={12} />
            View apply portal
          </Link>
          <Link href="/roles/new" className="flex items-center gap-1.5 bg-navy text-white text-xs font-semibold px-3 py-2 rounded-btn hover:opacity-90">
            <Plus size={14} />
            Post a role
          </Link>
        </div>
      </div>

      {/* Onboarding checklist */}
      {!checklistDismissed && (
        <div className="bg-white border border-border rounded-2xl p-5 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <p className="text-sm font-bold">Get started with askJeni</p>
                {allDone && (
                  <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-0.5 rounded-full">All done!</span>
                )}
              </div>
              <p className="text-xs text-gray-400">
                {done.size}/{ONBOARDING_STEPS.length} steps completed · Follow these steps to set up your first role
              </p>
            </div>
            <button onClick={() => setChecklistDismissed(true)} className="text-gray-300 hover:text-gray-500 transition-colors p-1">
              <X size={14} />
            </button>
          </div>

          {/* Progress bar */}
          <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
            <div
              className="h-full bg-blue rounded-full transition-all duration-500"
              style={{ width: `${(done.size / ONBOARDING_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-4 gap-3">
            {ONBOARDING_STEPS.map((step, i) => {
              const isDone = done.has(step.id)
              return (
                <div key={step.id}
                  className={`rounded-xl border p-4 transition-all ${isDone ? 'border-green-200 bg-green-50' : 'border-border bg-[#FAFBFC]'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                      isDone ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {isDone ? <Check size={12} /> : i + 1}
                    </div>
                    <button onClick={() => toggleStep(step.id)}
                      className="text-[10px] font-semibold text-gray-400 hover:text-navy transition-colors">
                      {isDone ? 'undo' : 'mark done'}
                    </button>
                  </div>
                  <p className={`text-xs font-bold mb-1 ${isDone ? 'text-green-700 line-through' : 'text-navy'}`}>
                    {step.title}
                  </p>
                  <p className="text-[11px] text-gray-400 leading-relaxed mb-3">{step.body}</p>
                  {step.href ? (
                    <Link href={step.href}
                      className="text-[11px] font-semibold text-blue hover:underline">
                      {step.cta}
                    </Link>
                  ) : (
                    <button className="text-[11px] font-semibold text-blue hover:underline">
                      {step.cta}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Stat strip */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        {[
          { icon: <Zap size={16} className="text-yellow" />, value: MOCK_EMPLOYER_ROLES.length, label: 'Active roles', accent: 'text-navy', bg: 'bg-yellow/10' },
          { icon: <Users size={16} className="text-blue" />, value: apps.length, label: 'Total applications', accent: 'text-navy', bg: 'bg-blue/10' },
          { icon: <TrendingUp size={16} className="text-green-500" />, value: newCount, label: 'Unreviewed', accent: 'text-green-600', bg: 'bg-green-50' },
          { icon: <Clock size={16} className="text-purple-500" />, value: thisWeek, label: 'This week', accent: 'text-navy', bg: 'bg-purple-50' },
        ].map(({ icon, value, label, accent, bg }) => (
          <div key={label} className="bg-white border border-border rounded-2xl p-5">
            <div className={`w-8 h-8 rounded-xl ${bg} flex items-center justify-center mb-3`}>{icon}</div>
            <p className={`text-2xl font-bold ${accent}`}>{value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Active roles */}
        <div className="col-span-2 bg-white border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-semibold">Active roles</p>
            <button className="text-xs font-semibold text-blue hover:underline">Manage roles →</button>
          </div>
          {MOCK_EMPLOYER_ROLES.map(r => (
            <div key={r.id} className="border border-border rounded-xl p-4">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{r.location} · {r.roleType}</p>
                </div>
                <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center gap-3 mb-3">
                {STAGES.slice(0, 5).map(s => (
                  <div key={s} className="flex flex-col items-center gap-1">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                      stageCounts[s] > 0 ? 'bg-blue/10 text-blue' : 'bg-gray-50 text-gray-300'
                    }`}>
                      {stageCounts[s]}
                    </div>
                    <span className="text-[9px] text-gray-400 font-medium">{STAGE_LABELS[s]}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <Link
                  href="/pipeline"
                  className="flex-1 text-center bg-navy text-white text-xs font-semibold py-2 rounded-btn hover:opacity-90"
                >
                  View pipeline →
                </Link>
                <Link
                  href={`/apply/${r.companySlug}/${r.roleSlug}`}
                  className="flex items-center gap-1 text-xs font-semibold text-gray-500 border border-gray-200 px-3 py-2 rounded-btn hover:border-navy transition-colors"
                >
                  <ExternalLink size={11} />
                  Apply link
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Apply link card */}
        <div className="bg-white border border-border rounded-2xl p-5 flex flex-col">
          <p className="text-sm font-semibold mb-1">Your apply link</p>
          <p className="text-xs text-gray-400 mb-4 leading-relaxed">Share this link wherever you advertise the role. No CVs in your inbox — ever.</p>
          <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3 flex-1">
            <p className="text-[11px] text-gray-400 font-medium mb-1">Apply portal URL</p>
            <p className="text-xs font-mono text-navy break-all leading-relaxed">
              apply.askjeni.co.za/peach-payments/junior-software-engineer
            </p>
          </div>
          <button className="w-full bg-blue/10 text-blue text-xs font-semibold py-2.5 rounded-btn hover:bg-blue/20 transition-colors mb-2">
            Copy link
          </button>
          <button className="w-full border border-gray-200 text-gray-500 text-xs font-semibold py-2.5 rounded-btn hover:border-navy transition-colors">
            Copy embed button
          </button>
        </div>
      </div>

      {/* Recent applications */}
      <div className="bg-white border border-border rounded-2xl p-5">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-semibold">Recent applications</p>
          <Link href="/pipeline" className="text-xs font-semibold text-blue hover:underline">View all in pipeline →</Link>
        </div>
        <div className="flex flex-col gap-2">
          {recent.map(app => (
            <div key={app.id} className="flex items-center gap-3 px-4 py-3 rounded-xl border border-border hover:border-blue/30 hover:bg-blue/[0.01] transition-all">
              <div className={`w-9 h-9 rounded-full ${app.avatarColor} flex items-center justify-center text-xs font-bold text-white shrink-0`}>
                {app.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-semibold">{app.candidateName}</p>
                  {app.isNew && (
                    <span className="text-[10px] font-bold bg-blue text-white px-1.5 py-0.5 rounded">NEW</span>
                  )}
                  {app.verified && (
                    <span className="text-[10px] font-semibold text-blue bg-blue/10 px-1.5 py-0.5 rounded-full">✓ Verified</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">{app.institution} · {app.city} · {app.appliedAt}</p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-gray-600">R{app.salary.toLocaleString()}</p>
                  <p className="text-[10px] text-gray-400">/month</p>
                </div>
                <div className="text-right">
                  <p className="text-[11px] font-semibold text-gray-600">{app.passportCompletion}%</p>
                  <p className="text-[10px] text-gray-400">passport</p>
                </div>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded-full ${
                  app.stage === 'new' ? 'bg-blue/10 text-blue' :
                  app.stage === 'shortlisted' ? 'bg-green-50 text-green-600' :
                  app.stage === 'interview' ? 'bg-purple-50 text-purple-600' :
                  'bg-gray-100 text-gray-500'
                }`}>
                  {STAGE_LABELS[app.stage]}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
