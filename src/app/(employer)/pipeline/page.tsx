'use client'

import { useState } from 'react'
import { MOCK_APPLICATIONS, type PipelineApplication, type PipelineStage } from '@/lib/mock-data'
import { X, MapPin, ChevronRight, ExternalLink } from 'lucide-react'

const COLUMNS: { stage: PipelineStage; label: string; color: string; dot: string }[] = [
  { stage: 'new', label: 'New', color: 'bg-blue/5 border-blue/20', dot: 'bg-blue' },
  { stage: 'screening', label: 'Screening', color: 'bg-yellow/5 border-yellow/30', dot: 'bg-yellow' },
  { stage: 'shortlisted', label: 'Shortlisted', color: 'bg-purple-50 border-purple-100', dot: 'bg-purple-400' },
  { stage: 'interview', label: 'Interview', color: 'bg-indigo-50 border-indigo-100', dot: 'bg-indigo-400' },
  { stage: 'offer', label: 'Offer made', color: 'bg-green-50 border-green-100', dot: 'bg-green-400' },
  { stage: 'hired', label: 'Hired ✓', color: 'bg-emerald-50 border-emerald-100', dot: 'bg-emerald-500' },
  { stage: 'declined', label: 'Not progressing', color: 'bg-gray-50 border-gray-100', dot: 'bg-gray-300' },
]

export default function PipelinePage() {
  const [apps, setApps] = useState<PipelineApplication[]>(MOCK_APPLICATIONS)
  const [selected, setSelected] = useState<PipelineApplication | null>(null)

  function moveStage(appId: string, stage: PipelineStage) {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, stage, isNew: false } : a))
    if (selected?.id === appId) setSelected(prev => prev ? { ...prev, stage, isNew: false } : null)
  }

  const nextStage = (current: PipelineStage): PipelineStage | null => {
    const idx = COLUMNS.findIndex(c => c.stage === current)
    if (idx < 0 || idx >= COLUMNS.length - 2) return null
    return COLUMNS[idx + 1].stage
  }

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 52px)' }}>
      {/* Header */}
      <div className="px-6 py-4 border-b border-border bg-white flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Application pipeline</h1>
          <p className="text-xs text-gray-400 mt-0.5">Junior Software Engineer · Peach Payments · {apps.length} applications</p>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 font-medium">
          {COLUMNS.slice(0, 5).map(c => {
            const count = apps.filter(a => a.stage === c.stage).length
            return count > 0 ? (
              <span key={c.stage} className="flex items-center gap-1">
                <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                {c.label}: {count}
              </span>
            ) : null
          })}
        </div>
      </div>

      {/* Kanban + slide panel */}
      <div className="flex overflow-hidden" style={{ height: 'calc(100vh - 52px - 61px)' }}>
        {/* Kanban */}
        <div className={`flex-1 overflow-x-auto p-4 transition-all ${selected ? 'mr-[380px]' : ''}`}>
          <div className="flex gap-3 h-full" style={{ minWidth: `${COLUMNS.length * 220}px` }}>
            {COLUMNS.map(col => {
              const colApps = apps.filter(a => a.stage === col.stage)
              return (
                <div key={col.stage} className="flex flex-col" style={{ width: 210, minWidth: 210 }}>
                  {/* Column header */}
                  <div className="flex items-center gap-2 px-2 py-2 mb-2">
                    <span className={`w-2 h-2 rounded-full ${col.dot}`} />
                    <span className="text-xs font-semibold text-gray-600">{col.label}</span>
                    <span className="ml-auto text-[11px] font-bold text-gray-400">{colApps.length}</span>
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2 flex-1">
                    {colApps.map(app => (
                      <AppCard
                        key={app.id}
                        app={app}
                        active={selected?.id === app.id}
                        onClick={() => setSelected(selected?.id === app.id ? null : app)}
                      />
                    ))}
                    {colApps.length === 0 && (
                      <div className={`border border-dashed ${col.color} rounded-xl p-4 text-center`}>
                        <p className="text-[11px] text-gray-300">No candidates</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Slide-in panel */}
        {selected && (
          <div className="fixed right-0 top-0 bottom-0 w-[380px] bg-white border-l border-border shadow-2xl overflow-y-auto z-10 flex flex-col"
            style={{ top: 'var(--topbar-height, 0px)' }}
          >
            <CandidatePanel
              app={selected}
              onClose={() => setSelected(null)}
              onMove={stage => moveStage(selected.id, stage)}
              nextStage={nextStage(selected.stage)}
            />
          </div>
        )}
      </div>
    </div>
  )
}

function AppCard({ app, active, onClick }: { app: PipelineApplication; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all ${
        active ? 'border-blue bg-blue/5 shadow-sm' : 'border-border bg-white hover:border-blue/30 hover:shadow-sm'
      }`}
    >
      {/* Top row */}
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 rounded-full ${app.avatarColor} flex items-center justify-center text-[10px] font-bold text-white shrink-0`}>
          {app.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 flex-wrap">
            <p className="text-xs font-semibold leading-tight truncate">{app.candidateName}</p>
            {app.isNew && <span className="text-[8px] font-bold bg-blue text-white px-1 py-px rounded shrink-0">NEW</span>}
          </div>
          <p className="text-[10px] text-gray-400 truncate">{app.institution}</p>
        </div>
      </div>

      {/* Stack */}
      <div className="flex flex-wrap gap-1 mb-2">
        {app.stack.slice(0, 2).map(s => (
          <span key={s} className="text-[9px] font-medium px-1.5 py-0.5 rounded-full bg-navy/5 text-navy border border-navy/10">{s}</span>
        ))}
        {app.stack.length > 2 && (
          <span className="text-[9px] text-gray-400">+{app.stack.length - 2}</span>
        )}
      </div>

      {/* Bottom row */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
          <MapPin size={9} />{app.city}
        </span>
        <span className="text-[10px] font-semibold text-gray-500">R{(app.salary / 1000).toFixed(0)}k</span>
        {/* Passport ring */}
        <PassportRing pct={app.passportCompletion} size={22} />
      </div>
    </button>
  )
}

function PassportRing({ pct, size = 28 }: { pct: number; size?: number }) {
  const r = (size - 4) / 2
  const circ = 2 * Math.PI * r
  const fill = (pct / 100) * circ
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#e5e7eb" strokeWidth={3} />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        fill="none"
        stroke={pct >= 80 ? '#22c55e' : pct >= 60 ? '#3b82f6' : '#f59e0b'}
        strokeWidth={3}
        strokeDasharray={`${fill} ${circ - fill}`}
        strokeLinecap="round"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
      <text x={size / 2} y={size / 2 + 3} textAnchor="middle" fontSize={6} fontWeight="700" fill="#374151">{pct}</text>
    </svg>
  )
}

function CandidatePanel({ app, onClose, onMove, nextStage }: {
  app: PipelineApplication
  onClose: () => void
  onMove: (stage: PipelineStage) => void
  nextStage: PipelineStage | null
}) {
  const STAGE_LABELS: Record<string, string> = {
    new: 'New', screening: 'Screening', shortlisted: 'Shortlisted',
    interview: 'Interview', offer: 'Offer made', hired: 'Hired', declined: 'Not progressing',
  }
  const STAGE_NEXT_LABEL: Record<string, string> = {
    new: 'Move to Screening', screening: 'Move to Shortlisted', shortlisted: 'Schedule interview',
    interview: 'Make offer', offer: 'Mark as hired',
  }

  return (
    <div className="flex flex-col h-full">
      {/* Panel header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full ${app.avatarColor} flex items-center justify-center text-sm font-bold text-white`}>
            {app.initials}
          </div>
          <div>
            <p className="text-sm font-semibold">{app.candidateName}</p>
            <p className="text-xs text-gray-400">{app.institution} · Applied {app.appliedAt}</p>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-navy p-1">
          <X size={16} />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">

        {/* 5 scan signals */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Candidate signals</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Passport', value: `${app.passportCompletion}%`, color: app.passportCompletion >= 80 ? 'text-green-600 bg-green-50' : 'text-yellow-700 bg-yellow/10' },
              { label: 'Salary ask', value: `R${app.salary.toLocaleString()}`, color: 'text-navy bg-gray-50' },
              { label: 'Location', value: app.city, color: 'text-navy bg-gray-50' },
              { label: 'Grad year', value: app.gradDate.slice(-4), color: 'text-navy bg-gray-50' },
            ].map(({ label, value, color }) => (
              <div key={label} className={`rounded-xl px-3 py-2.5 ${color}`}>
                <p className="text-[10px] font-medium opacity-60 mb-0.5">{label}</p>
                <p className="text-sm font-bold">{value}</p>
              </div>
            ))}
          </div>
          {app.verified && (
            <div className="mt-2 flex items-center gap-1.5 text-xs font-semibold text-blue bg-blue/10 px-3 py-2 rounded-xl">
              <span>✓</span> Skills Passport verified
            </div>
          )}
        </div>

        {/* Tech stack */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tech stack</p>
          <div className="flex flex-wrap gap-1.5">
            {app.stack.map(s => (
              <span key={s} className="text-xs font-medium px-2.5 py-1 rounded-full bg-navy/5 text-navy border border-navy/10">{s}</span>
            ))}
          </div>
        </div>

        {/* Screening answers */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Screening responses</p>
          <div className="flex flex-col gap-3">
            {app.screeningAnswers.map((qa, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-3 py-3">
                <p className="text-[11px] font-medium text-gray-500 mb-1">{qa.question}</p>
                <p className="text-sm text-navy">{qa.answer}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Current stage */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Pipeline stage</p>
          <div className="flex flex-wrap gap-1.5">
            {COLUMNS.slice(0, 5).map(c => (
              <button
                key={c.stage}
                onClick={() => onMove(c.stage)}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                  app.stage === c.stage
                    ? 'bg-navy text-white border-navy'
                    : 'border-gray-200 text-gray-500 hover:border-navy/40'
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Action bar */}
      <div className="px-5 py-4 border-t border-border flex flex-col gap-2">
        {nextStage && (
          <button
            onClick={() => onMove(nextStage)}
            className="w-full bg-navy text-white text-sm font-semibold py-2.5 rounded-btn hover:opacity-90 flex items-center justify-center gap-2"
          >
            {STAGE_NEXT_LABEL[app.stage] || `Move to ${STAGE_LABELS[nextStage]}`}
            <ChevronRight size={14} />
          </button>
        )}
        <button
          onClick={() => onMove('declined')}
          className="w-full border border-gray-200 text-gray-500 text-xs font-semibold py-2 rounded-btn hover:border-red-200 hover:text-red-500 transition-colors"
        >
          Mark as not progressing
        </button>
      </div>
    </div>
  )
}
