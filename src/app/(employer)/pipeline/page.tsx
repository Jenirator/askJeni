'use client'

import { useState, useEffect } from 'react'
import { MOCK_APPLICATIONS, type PipelineApplication, type PipelineStage } from '@/lib/mock-data'
import { X, MapPin, ChevronRight, ExternalLink, Github, Linkedin, FileText, StickyNote } from 'lucide-react'
import Link from 'next/link'
import InterviewModal from './InterviewModal'

const COLUMNS: { stage: PipelineStage; label: string; colBg: string; cardBg: string; cardBorder: string; cardActiveBorder: string; headerBg: string; dot: string; dotText: string }[] = [
  { stage: 'new',       label: 'New',              colBg: 'bg-blue-50/60',    cardBg: 'bg-white',          cardBorder: 'border-blue-100',    cardActiveBorder: 'border-blue-400',    headerBg: 'bg-blue-50',     dot: 'bg-blue',        dotText: 'text-blue-700'    },
  { stage: 'screening', label: 'Screening',         colBg: 'bg-yellow-50/60',  cardBg: 'bg-white',          cardBorder: 'border-yellow-100',  cardActiveBorder: 'border-yellow-400',  headerBg: 'bg-yellow-50',   dot: 'bg-yellow-400',  dotText: 'text-yellow-800'  },
  { stage: 'shortlisted',label:'Shortlisted',       colBg: 'bg-purple-50/60',  cardBg: 'bg-white',          cardBorder: 'border-purple-100',  cardActiveBorder: 'border-purple-400',  headerBg: 'bg-purple-50',   dot: 'bg-purple-400',  dotText: 'text-purple-700'  },
  { stage: 'interview', label: 'Interview',         colBg: 'bg-indigo-50/60',  cardBg: 'bg-white',          cardBorder: 'border-indigo-100',  cardActiveBorder: 'border-indigo-400',  headerBg: 'bg-indigo-50',   dot: 'bg-indigo-400',  dotText: 'text-indigo-700'  },
  { stage: 'offer',     label: 'Offer made',        colBg: 'bg-green-50/60',   cardBg: 'bg-white',          cardBorder: 'border-green-100',   cardActiveBorder: 'border-green-500',   headerBg: 'bg-green-50',    dot: 'bg-green-500',   dotText: 'text-green-700'   },
  { stage: 'hired',     label: 'Hired ✓',           colBg: 'bg-emerald-50/60', cardBg: 'bg-white',          cardBorder: 'border-emerald-100', cardActiveBorder: 'border-emerald-500', headerBg: 'bg-emerald-50',  dot: 'bg-emerald-500', dotText: 'text-emerald-700' },
  { stage: 'declined',  label: 'Not progressing',   colBg: 'bg-gray-100/60',   cardBg: 'bg-white',          cardBorder: 'border-gray-200',    cardActiveBorder: 'border-gray-400',    headerBg: 'bg-gray-100',    dot: 'bg-gray-300',    dotText: 'text-gray-500'    },
]

const STAGE_LABELS: Record<PipelineStage, string> = {
  new: 'New', screening: 'Screening', shortlisted: 'Shortlisted',
  interview: 'Interview', offer: 'Offer made', hired: 'Hired', declined: 'Declined',
}

export default function PipelinePage() {
  const [apps, setApps] = useState<PipelineApplication[]>(MOCK_APPLICATIONS)
  const [selected, setSelected] = useState<PipelineApplication | null>(null)
  const [interviewApp, setInterviewApp] = useState<PipelineApplication | null>(null)
  const [toast, setToast] = useState<{ message: string; id: number } | null>(null)

  // Merge any applications submitted via the apply portal
  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('askjeni_applications') || '[]')
      if (stored.length > 0) {
        setApps(prev => {
          const existingIds = new Set(prev.map(a => a.id))
          const fresh = stored.filter((a: PipelineApplication) => !existingIds.has(a.id))
          return fresh.length > 0 ? [...prev, ...fresh] : prev
        })
      }
    } catch {}
  }, [])

  function showToast(message: string) {
    const id = Date.now()
    setToast({ message, id })
    setTimeout(() => setToast(prev => prev?.id === id ? null : prev), 3500)
  }

  function moveStage(appId: string, stage: PipelineStage) {
    const app = apps.find(a => a.id === appId)
    setApps(prev => prev.map(a => a.id === appId ? { ...a, stage, isNew: false } : a))
    if (selected?.id === appId) setSelected(prev => prev ? { ...prev, stage, isNew: false } : null)
    if (app) {
      const msg = stage === 'interview'
        ? `Interview invitation sent to ${app.candidateName}`
        : stage === 'declined'
        ? `${app.candidateName} marked as not progressing`
        : `${app.candidateName} moved to ${STAGE_LABELS[stage]}`
      showToast(msg)
    }
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
        <div className={`flex-1 overflow-x-auto bg-[#F1F4F8] transition-all ${selected ? 'mr-[460px]' : ''}`}>
          <div className="flex gap-0 h-full" style={{ minWidth: `${COLUMNS.length * 230}px` }}>
            {COLUMNS.map((col, colIdx) => {
              const colApps = apps
                .filter(a => a.stage === col.stage)
                .sort((a, b) => col.stage === 'new' ? b.passportCompletion - a.passportCompletion : 0)
              return (
                <div key={col.stage}
                  className={`flex flex-col ${col.colBg} ${colIdx < COLUMNS.length - 1 ? 'border-r border-[#DDE2EA]' : ''}`}
                  style={{ width: 230, minWidth: 230 }}
                >
                  {/* Column header */}
                  <div className={`flex items-center gap-2 px-4 py-3 ${col.headerBg} border-b border-[#DDE2EA] sticky top-0 z-10`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${col.dot} shrink-0`} />
                    <span className={`text-xs font-bold tracking-tight ${col.dotText}`}>{col.label}</span>
                    {colApps.length > 0 && (
                      <span className={`ml-auto text-[11px] font-bold ${col.dotText} opacity-70 rounded-full w-5 h-5 flex items-center justify-center`}>{colApps.length}</span>
                    )}
                  </div>

                  {/* Cards */}
                  <div className="flex flex-col gap-2 flex-1 p-3">
                    {colApps.map(app => (
                      <AppCard
                        key={app.id}
                        app={app}
                        active={selected?.id === app.id}
                        cardBg={col.cardBg}
                        cardBorder={col.cardBorder}
                        cardActiveBorder={col.cardActiveBorder}
                        onClick={() => setSelected(selected?.id === app.id ? null : app)}
                      />
                    ))}
                    {colApps.length === 0 && (
                      <div className="border-2 border-dashed border-[#DDE2EA] rounded-xl p-4 text-center mt-1">
                        <p className="text-[11px] text-gray-300">Empty</p>
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
          <div className="fixed right-0 top-0 bottom-0 w-[460px] bg-white border-l border-border shadow-2xl overflow-y-auto z-10 flex flex-col"
            style={{ top: 'var(--topbar-height, 0px)' }}
          >
            <CandidatePanel
              app={selected}
              onClose={() => setSelected(null)}
              onMove={stage => moveStage(selected.id, stage)}
              nextStage={nextStage(selected.stage)}
              onScheduleInterview={() => setInterviewApp(selected)}
            />
          </div>
        )}
      </div>

      {interviewApp && (
        <InterviewModal
          app={interviewApp}
          onClose={() => setInterviewApp(null)}
          onConfirm={() => {
            moveStage(interviewApp.id, 'interview')
            setInterviewApp(null)
          }}
        />
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center gap-3 bg-navy text-white text-sm font-medium px-5 py-3 rounded-2xl shadow-xl">
            <span className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </span>
            {toast.message}
          </div>
        </div>
      )}
    </div>
  )
}

function AppCard({ app, active, cardBg, cardBorder, cardActiveBorder, onClick }: {
  app: PipelineApplication; active: boolean
  cardBg: string; cardBorder: string; cardActiveBorder: string
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3.5 rounded-xl border transition-all shadow-sm ${
        active
          ? `${cardActiveBorder} ${cardBg} shadow-md ring-1 ring-inset ring-current/10`
          : `${cardBorder} ${cardBg} hover:shadow-md`
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

function CandidatePanel({ app, onClose, onMove, nextStage, onScheduleInterview }: {
  app: PipelineApplication
  onClose: () => void
  onMove: (stage: PipelineStage) => void
  nextStage: PipelineStage | null
  onScheduleInterview: () => void
}) {
  const [tab, setTab] = useState<'overview' | 'screening' | 'notes'>('overview')
  const [notes, setNotes] = useState(app.notes ?? '')

  const STAGE_NEXT_LABEL: Record<string, string> = {
    new: 'Move to Screening', screening: 'Move to Shortlisted', shortlisted: 'Schedule interview',
    interview: 'Make offer', offer: 'Mark as hired',
  }
  const STAGE_LABELS: Record<string, string> = {
    new: 'New', screening: 'Screening', shortlisted: 'Shortlisted',
    interview: 'Interview', offer: 'Offer made', hired: 'Hired', declined: 'Not progressing',
  }

  return (
    <div className="flex flex-col h-full">

      {/* Header */}
      <div className="px-5 pt-4 pb-0 border-b border-border">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-full ${app.avatarColor} flex items-center justify-center text-sm font-bold text-white shrink-0`}>
              {app.initials}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-navy">{app.candidateName}</p>
                {app.verified && <span className="text-[10px] font-bold text-blue bg-blue/10 px-1.5 py-0.5 rounded-full">✓ Verified</span>}
              </div>
              <p className="text-xs text-gray-400">{app.institution} · {app.gradDate} · Applied {app.appliedAt}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-navy p-1 mt-0.5">
            <X size={15} />
          </button>
        </div>

        {/* Quick links */}
        <div className="flex items-center gap-2 mb-3">
          <Link href={`/profile/${app.candidateSlug}`} target="_blank"
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-btn hover:border-navy transition-colors">
            <ExternalLink size={10} /> Full profile
          </Link>
          <Link href={`/profile/${app.candidateSlug}/cv`} target="_blank"
            className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-btn hover:border-navy transition-colors">
            <FileText size={10} /> View CV
          </Link>
          {app.githubUrl && (
            <a href={app.githubUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-btn hover:border-navy transition-colors">
              <Github size={10} /> GitHub
            </a>
          )}
          {app.linkedinUrl && (
            <a href={app.linkedinUrl} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1 text-[11px] font-semibold text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-btn hover:border-navy transition-colors">
              <Linkedin size={10} /> LinkedIn
            </a>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-0 -mb-px">
          {(['overview', 'screening', 'notes'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`text-xs font-semibold px-4 py-2 border-b-2 transition-colors capitalize ${
                tab === t ? 'border-navy text-navy' : 'border-transparent text-gray-400 hover:text-navy'
              }`}>
              {t}{t === 'notes' && notes.trim() && <span className="ml-1 w-1.5 h-1.5 rounded-full bg-yellow inline-block" />}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="flex-1 overflow-y-auto p-5">

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="flex flex-col gap-5">

            {/* Signal grid */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Signals</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Passport', value: `${app.passportCompletion}%`, color: app.passportCompletion >= 80 ? 'text-green-600 bg-green-50' : 'text-yellow-700 bg-yellow/10' },
                  { label: 'Salary ask', value: `R${app.salary.toLocaleString()}/mo`, color: 'text-navy bg-gray-50' },
                  { label: 'Location', value: app.city, color: 'text-navy bg-gray-50' },
                  { label: 'Graduating', value: app.gradDate, color: 'text-navy bg-gray-50' },
                ].map(({ label, value, color }) => (
                  <div key={label} className={`rounded-xl px-3 py-2.5 ${color}`}>
                    <p className="text-[10px] font-medium opacity-60 mb-0.5">{label}</p>
                    <p className="text-sm font-bold">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bio */}
            {app.bio && (
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">About</p>
                <p className="text-sm text-gray-600 leading-relaxed">{app.bio}</p>
              </div>
            )}

            {/* Skills */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Tech stack</p>
              <div className="flex flex-wrap gap-1.5">
                {app.stack.map(s => {
                  const isVerified = app.verifiedSkills?.includes(s)
                  return (
                    <span key={s} className={`text-xs font-medium px-2.5 py-1 rounded-full border ${
                      isVerified ? 'bg-green-50 text-green-700 border-green-200' : 'bg-navy/5 text-navy border-navy/10'
                    }`}>
                      {isVerified ? '✓ ' : ''}{s}
                    </span>
                  )
                })}
              </div>
              {(app.verifiedSkills?.length ?? 0) > 0 && (
                <p className="text-[10px] text-gray-400 mt-1.5">✓ = verified by askJeni assessment</p>
              )}
            </div>

            {/* Assessments */}
            {app.assessments && app.assessments.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Assessment scores</p>
                <div className="flex flex-col gap-2">
                  {app.assessments.map(a => (
                    <div key={a.title} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-navy truncate">{a.title}</p>
                        <div className="mt-1.5 h-1.5 bg-gray-200 rounded-full overflow-hidden w-full">
                          <div className="h-full rounded-full bg-green-500" style={{ width: `${a.score}%` }} />
                        </div>
                      </div>
                      <span className={`text-sm font-bold shrink-0 ${a.score >= 80 ? 'text-green-600' : a.score >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
                        {a.score}/100
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {app.projects && app.projects.length > 0 && (
              <div>
                <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Projects</p>
                <div className="flex flex-col gap-3">
                  {app.projects.map(p => (
                    <div key={p.title} className="border border-border rounded-xl p-3.5">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="text-xs font-bold text-navy">{p.title}</p>
                        {p.githubUrl && (
                          <a href={p.githubUrl} target="_blank" rel="noopener noreferrer"
                            className="text-[10px] font-semibold text-blue hover:underline shrink-0 flex items-center gap-0.5">
                            <Github size={9} /> GitHub
                          </a>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-2">{p.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {p.skills.map(s => (
                          <span key={s} className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-blue/8 text-blue">{s}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Pipeline stage */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Move stage</p>
              <div className="flex flex-wrap gap-1.5">
                {COLUMNS.slice(0, 5).map(c => (
                  <button key={c.stage} onClick={() => onMove(c.stage)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                      app.stage === c.stage ? 'bg-navy text-white border-navy' : 'border-gray-200 text-gray-500 hover:border-navy/40'
                    }`}>
                    {c.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── SCREENING ── */}
        {tab === 'screening' && (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Screening responses</p>
            {app.screeningAnswers.map((qa, i) => (
              <div key={i} className="bg-gray-50 rounded-xl px-3.5 py-3">
                <p className="text-[11px] font-semibold text-gray-500 mb-1.5">{qa.question}</p>
                <p className="text-sm text-navy leading-relaxed">{qa.answer}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── NOTES ── */}
        {tab === 'notes' && (
          <div className="flex flex-col gap-3">
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Internal notes</p>
            <p className="text-xs text-gray-400">Only visible to your team — not shared with the candidate.</p>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add notes about this candidate — impressions, interview prep, concerns..."
              className="w-full border border-border rounded-xl px-3.5 py-3 text-sm text-navy resize-none focus:outline-none focus:border-blue/40 focus:ring-1 focus:ring-blue/20 placeholder:text-gray-300"
              rows={8}
            />
            <button className="w-full bg-navy text-white text-xs font-semibold py-2.5 rounded-btn hover:opacity-90">
              Save notes
            </button>
          </div>
        )}

      </div>

      {/* Action bar */}
      <div className="px-5 py-4 border-t border-border flex flex-col gap-2">
        {nextStage && (
          <button
            onClick={() => app.stage === 'shortlisted' ? onScheduleInterview() : onMove(nextStage)}
            className="w-full bg-navy text-white text-sm font-semibold py-2.5 rounded-btn hover:opacity-90 flex items-center justify-center gap-2">
            {STAGE_NEXT_LABEL[app.stage] || `Move to ${STAGE_LABELS[nextStage]}`}
            <ChevronRight size={14} />
          </button>
        )}
        <button onClick={() => onMove('declined')}
          className="w-full border border-gray-200 text-gray-500 text-xs font-semibold py-2 rounded-btn hover:border-red-200 hover:text-red-500 transition-colors">
          Mark as not progressing
        </button>
      </div>
    </div>
  )
}
