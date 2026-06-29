'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Clock, DollarSign, Tag, X, Check, ChevronRight, Eye, Zap, Users } from 'lucide-react'

type RoleType = 'full-time' | 'part-time' | 'contract' | 'internship'
type WorkPref = 'remote' | 'hybrid' | 'in-office'
type ExpLevel = 'entry' | 'junior' | 'mid' | 'senior'

const ROLE_TYPES: { key: RoleType; label: string }[] = [
  { key: 'full-time',  label: 'Full-time'  },
  { key: 'part-time',  label: 'Part-time'  },
  { key: 'contract',   label: 'Contract'   },
  { key: 'internship', label: 'Internship' },
]

const WORK_PREFS: { key: WorkPref; label: string }[] = [
  { key: 'remote',    label: 'Remote'    },
  { key: 'hybrid',    label: 'Hybrid'    },
  { key: 'in-office', label: 'In-office' },
]

const EXP_LEVELS: { key: ExpLevel; label: string }[] = [
  { key: 'entry',  label: 'Entry level (0 yrs)' },
  { key: 'junior', label: 'Junior (1–2 yrs)'    },
  { key: 'mid',    label: 'Mid (3–5 yrs)'       },
  { key: 'senior', label: 'Senior (5+ yrs)'     },
]

const SUGGESTED_SKILLS = ['React', 'TypeScript', 'Node.js', 'Python', 'SQL', 'Git', 'Docker', 'AWS', 'GraphQL', 'Go', 'Java', 'Kotlin', 'Swift', 'Figma', 'PostgreSQL']

function TagInput({ tags, onChange, placeholder, suggestions }: {
  tags: string[]
  onChange: (tags: string[]) => void
  placeholder?: string
  suggestions?: string[]
}) {
  const [input, setInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function addTag(tag: string) {
    const clean = tag.trim()
    if (clean && !tags.includes(clean)) onChange([...tags, clean])
    setInput('')
  }

  function removeTag(tag: string) {
    onChange(tags.filter(t => t !== tag))
  }

  function handleKey(e: React.KeyboardEvent) {
    if ((e.key === 'Enter' || e.key === ',') && input.trim()) {
      e.preventDefault()
      addTag(input)
    } else if (e.key === 'Backspace' && !input && tags.length) {
      onChange(tags.slice(0, -1))
    }
  }

  const filtered = (suggestions ?? []).filter(s => !tags.includes(s) && s.toLowerCase().startsWith(input.toLowerCase())).slice(0, 5)

  return (
    <div>
      <div
        className="flex flex-wrap gap-1.5 min-h-[44px] border border-border rounded-xl px-3 py-2 cursor-text focus-within:border-blue/40 focus-within:ring-1 focus-within:ring-blue/20"
        onClick={() => inputRef.current?.focus()}
      >
        {tags.map(tag => (
          <span key={tag} className="flex items-center gap-1 bg-blue/10 text-blue text-xs font-semibold px-2.5 py-1 rounded-full">
            {tag}
            <button type="button" onClick={e => { e.stopPropagation(); removeTag(tag) }} className="text-blue/60 hover:text-blue">
              <X size={10} />
            </button>
          </span>
        ))}
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          onBlur={() => { if (input.trim()) addTag(input) }}
          placeholder={tags.length === 0 ? placeholder : ''}
          className="flex-1 min-w-[80px] outline-none text-sm text-navy placeholder:text-gray-400 bg-transparent py-0.5"
        />
      </div>
      {filtered.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {filtered.map(s => (
            <button key={s} type="button" onClick={() => addTag(s)}
              className="text-xs font-medium text-gray-500 border border-border px-2.5 py-1 rounded-full hover:border-blue/40 hover:text-blue transition-colors">
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-border rounded-2xl p-6">
      <h2 className="text-sm font-bold text-navy mb-5">{title}</h2>
      {children}
    </div>
  )
}

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {hint && <p className="text-[11px] text-gray-400 mb-2">{hint}</p>}
      {children}
    </div>
  )
}

function TextInput({ value, onChange, placeholder, className = '' }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className={`w-full border border-border rounded-xl px-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-blue/40 focus:ring-1 focus:ring-blue/20 placeholder:text-gray-400 ${className}`}
    />
  )
}

function Textarea({ value, onChange, placeholder, rows = 4 }: {
  value: string; onChange: (v: string) => void; placeholder?: string; rows?: number
}) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full border border-border rounded-xl px-3.5 py-3 text-sm text-navy focus:outline-none focus:border-blue/40 focus:ring-1 focus:ring-blue/20 placeholder:text-gray-400 resize-none"
    />
  )
}

function ToggleGroup<T extends string>({ options, value, onChange }: {
  options: { key: T; label: string }[]
  value: T
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map(opt => (
        <button key={opt.key} type="button" onClick={() => onChange(opt.key)}
          className={`text-xs font-semibold px-3.5 py-2 rounded-xl border transition-all ${
            value === opt.key ? 'bg-navy border-navy text-white' : 'border-border text-gray-500 hover:border-navy/40'
          }`}>
          {opt.label}
        </button>
      ))}
    </div>
  )
}

export default function PostRolePage() {
  const router = useRouter()
  const [published, setPublished] = useState(false)

  // Basics
  const [title, setTitle]             = useState('')
  const [department, setDepartment]   = useState('')
  const [city, setCity]               = useState('')
  const [roleType, setRoleType]       = useState<RoleType>('full-time')
  const [workPref, setWorkPref]       = useState<WorkPref>('hybrid')
  const [salaryMin, setSalaryMin]     = useState('')
  const [salaryMax, setSalaryMax]     = useState('')
  const [availableFrom, setAvailableFrom] = useState('')
  const [deadline, setDeadline]       = useState('')

  // Description
  const [about, setAbout]             = useState('')
  const [responsibilities, setResp]   = useState('')
  const [requirements, setReqs]       = useState('')

  // Skills & level
  const [mustHave, setMustHave]       = useState<string[]>([])
  const [niceToHave, setNiceToHave]   = useState<string[]>([])
  const [expLevel, setExpLevel]       = useState<ExpLevel>('junior')

  // Settings
  const [requirePassport, setRequirePassport] = useState(true)
  const [requireVideo, setRequireVideo]       = useState(false)
  const [minPassport, setMinPassport]         = useState('70')

  function handlePublish() {
    setPublished(true)
    setTimeout(() => router.push('/employer-dashboard'), 1400)
  }

  const canPublish = title.trim().length > 0 && about.trim().length > 0 && mustHave.length > 0

  const salaryDisplay = salaryMin && salaryMax
    ? `R${Number(salaryMin).toLocaleString()} – R${Number(salaryMax).toLocaleString()}/mo`
    : salaryMin ? `From R${Number(salaryMin).toLocaleString()}/mo` : 'Not specified'

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 52px)' }}>
      {/* Page header */}
      <div className="px-6 py-4 border-b border-border bg-white flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold">Post a role</h1>
          <p className="text-xs text-gray-400 mt-0.5">Peach Payments · Fill in the details below and publish when ready</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => router.back()}
            className="text-xs font-semibold text-gray-500 border border-border px-4 py-2 rounded-btn hover:border-navy/40 transition-colors">
            Cancel
          </button>
          <button
            onClick={handlePublish}
            disabled={!canPublish || published}
            className={`flex items-center gap-2 text-xs font-bold px-5 py-2 rounded-btn transition-all ${
              published ? 'bg-green-500 text-white' :
              canPublish ? 'bg-navy text-white hover:opacity-90' :
              'bg-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {published ? <><Check size={13} /> Published!</> : <>Publish role <ChevronRight size={13} /></>}
          </button>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: form */}
        <div className="flex-1 overflow-y-auto bg-[#F1F4F8]">
          <div className="max-w-[640px] mx-auto py-6 px-6 flex flex-col gap-4">

            <Section title="Role basics">
              <Field label="Job title" hint="Be specific — 'Junior React Developer' gets better matches than 'Developer'">
                <TextInput value={title} onChange={setTitle} placeholder="e.g. Junior Software Engineer" />
              </Field>
              <Field label="Department">
                <TextInput value={department} onChange={setDepartment} placeholder="e.g. Engineering" />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <Field label="City">
                  <TextInput value={city} onChange={setCity} placeholder="e.g. Cape Town" />
                </Field>
                <Field label="Available from">
                  <TextInput value={availableFrom} onChange={setAvailableFrom} placeholder="e.g. Jan 2026" />
                </Field>
              </div>
              <Field label="Role type">
                <ToggleGroup options={ROLE_TYPES} value={roleType} onChange={setRoleType} />
              </Field>
              <Field label="Work preference">
                <ToggleGroup options={WORK_PREFS} value={workPref} onChange={setWorkPref} />
              </Field>
              <Field label="Salary range (per month)">
                <div className="flex items-center gap-3">
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R</span>
                    <input
                      type="number"
                      value={salaryMin}
                      onChange={e => setSalaryMin(e.target.value)}
                      placeholder="20 000"
                      className="w-full border border-border rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-blue/40 focus:ring-1 focus:ring-blue/20"
                    />
                  </div>
                  <span className="text-gray-400 text-sm">to</span>
                  <div className="relative flex-1">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 font-medium">R</span>
                    <input
                      type="number"
                      value={salaryMax}
                      onChange={e => setSalaryMax(e.target.value)}
                      placeholder="30 000"
                      className="w-full border border-border rounded-xl pl-7 pr-3.5 py-2.5 text-sm text-navy focus:outline-none focus:border-blue/40 focus:ring-1 focus:ring-blue/20"
                    />
                  </div>
                </div>
              </Field>
              <Field label="Application deadline">
                <TextInput value={deadline} onChange={setDeadline} placeholder="e.g. 31 Jul 2026" />
              </Field>
            </Section>

            <Section title="Role description">
              <Field label="About the role" hint="2–4 sentences summarising what this role is and why it matters">
                <Textarea value={about} onChange={setAbout} placeholder="We're looking for a curious, motivated graduate to join our payments engineering team…" rows={4} />
              </Field>
              <Field label="What you'll be doing" hint="Paste bullet points, one per line">
                <Textarea value={responsibilities} onChange={setResp}
                  placeholder={"- Build and maintain our checkout integration\n- Write clean, tested code reviewed by senior engineers\n- Participate in on-call rotation after 3 months"} rows={5} />
              </Field>
              <Field label="What we're looking for" hint="Soft skills, mindset, or context that matters beyond the technical requirements">
                <Textarea value={requirements} onChange={setReqs}
                  placeholder={"- Comfortable working in a fast-paced startup environment\n- Strong communicator — you document your decisions\n- Curious about financial systems and payments infrastructure"} rows={5} />
              </Field>
            </Section>

            <Section title="Skills & experience">
              <Field label="Must-have skills" hint="Candidates will be matched and ranked on these">
                <TagInput tags={mustHave} onChange={setMustHave} placeholder="Type a skill and press Enter…" suggestions={SUGGESTED_SKILLS} />
              </Field>
              <Field label="Nice-to-have skills">
                <TagInput tags={niceToHave} onChange={setNiceToHave} placeholder="Type a skill and press Enter…" suggestions={SUGGESTED_SKILLS.filter(s => !mustHave.includes(s))} />
              </Field>
              <Field label="Experience level">
                <ToggleGroup options={EXP_LEVELS} value={expLevel} onChange={setExpLevel} />
              </Field>
            </Section>

            <Section title="Application settings">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-navy">Require Skills Passport</p>
                    <p className="text-xs text-gray-400 mt-0.5">Candidates without a verified passport won't be able to apply</p>
                  </div>
                  <button type="button" onClick={() => setRequirePassport(v => !v)}
                    className={`shrink-0 w-11 h-6 rounded-full transition-colors ${requirePassport ? 'bg-blue' : 'bg-gray-200'}`}>
                    <span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${requirePassport ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
                {requirePassport && (
                  <div className="pl-4 border-l-2 border-blue/20">
                    <label className="text-xs font-semibold text-gray-600 mb-1.5 block">Minimum passport score</label>
                    <div className="flex items-center gap-3">
                      <input type="range" min={40} max={90} step={5} value={minPassport} onChange={e => setMinPassport(e.target.value)}
                        className="flex-1 accent-blue" />
                      <span className="text-sm font-bold text-navy w-10 text-right">{minPassport}%</span>
                    </div>
                  </div>
                )}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-navy">Require video intro</p>
                    <p className="text-xs text-gray-400 mt-0.5">Candidates upload a 60-second video as part of their application</p>
                  </div>
                  <button type="button" onClick={() => setRequireVideo(v => !v)}
                    className={`shrink-0 w-11 h-6 rounded-full transition-colors ${requireVideo ? 'bg-blue' : 'bg-gray-200'}`}>
                    <span className={`block w-5 h-5 rounded-full bg-white shadow-sm transition-transform mt-0.5 ${requireVideo ? 'translate-x-5' : 'translate-x-0.5'}`} />
                  </button>
                </div>
              </div>
            </Section>

            {/* Bottom publish bar */}
            <div className="bg-white border border-border rounded-2xl px-6 py-4 flex items-center justify-between">
              <div>
                {!canPublish && <p className="text-xs text-gray-400">Add a job title, description, and at least one skill to publish.</p>}
                {canPublish && <p className="text-xs text-green-600 font-medium flex items-center gap-1.5"><Check size={12} /> Ready to publish</p>}
              </div>
              <button onClick={handlePublish} disabled={!canPublish || published}
                className={`flex items-center gap-2 text-sm font-bold px-6 py-2.5 rounded-btn transition-all ${
                  published ? 'bg-green-500 text-white' :
                  canPublish ? 'bg-navy text-white hover:opacity-90' :
                  'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}>
                {published ? <><Check size={14} /> Published!</> : <>Publish role <ChevronRight size={14} /></>}
              </button>
            </div>

          </div>
        </div>

        {/* Right: live preview */}
        <div className="w-[340px] shrink-0 border-l border-border bg-white overflow-y-auto">
          <div className="px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500">
              <Eye size={13} />
              Live preview
            </div>
            <p className="text-[11px] text-gray-400 mt-1">This is how your role appears to candidates</p>
          </div>

          <div className="p-5">
            {/* Company card */}
            <div className="bg-navy rounded-2xl p-5 text-white mb-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center text-sm font-bold">PP</div>
                <div>
                  <p className="text-xs text-white/60">Peach Payments</p>
                  <p className="font-bold text-sm">{title || 'Role title'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-0.5">Location</p>
                  <p className="font-semibold">{city || '—'} · {WORK_PREFS.find(w => w.key === workPref)?.label}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-0.5">Salary</p>
                  <p className="font-semibold">{salaryDisplay}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-0.5">Type</p>
                  <p className="font-semibold">{ROLE_TYPES.find(r => r.key === roleType)?.label}</p>
                </div>
                <div className="bg-white/10 rounded-lg px-3 py-2">
                  <p className="text-white/50 text-[10px] mb-0.5">Available from</p>
                  <p className="font-semibold">{availableFrom || '—'}</p>
                </div>
              </div>
            </div>

            {/* About */}
            {about && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">About the role</p>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{about}</p>
              </div>
            )}

            {/* Skills */}
            {mustHave.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Skills</p>
                <div className="flex flex-wrap gap-1.5">
                  {mustHave.map(s => (
                    <span key={s} className="text-[11px] font-semibold bg-blue/10 text-blue px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                  {niceToHave.map(s => (
                    <span key={s} className="text-[11px] font-semibold bg-gray-100 text-gray-500 px-2.5 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Requirements */}
            {requirePassport && (
              <div className="flex items-center gap-2 bg-yellow/10 rounded-xl px-3 py-2.5 mb-4">
                <Zap size={13} className="text-yellow shrink-0" />
                <p className="text-xs font-medium text-navy">Skills Passport required · min {minPassport}% score</p>
              </div>
            )}
            {requireVideo && (
              <div className="flex items-center gap-2 bg-purple-50 rounded-xl px-3 py-2.5 mb-4">
                <Users size={13} className="text-purple-500 shrink-0" />
                <p className="text-xs font-medium text-navy">60-second video intro required</p>
              </div>
            )}

            {/* Apply CTA (preview) */}
            <div className="border border-border rounded-xl p-4 text-center">
              <p className="text-xs text-gray-400 mb-3">Apply button (preview only)</p>
              <div className="w-full bg-navy text-white text-sm font-bold py-2.5 rounded-btn opacity-50 cursor-not-allowed">
                Apply with Skills Passport →
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
