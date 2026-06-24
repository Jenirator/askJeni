'use client'

import { useState } from 'react'
import { type StoredStudent, saveStudent } from '@/lib/student-store'
import { X, Sparkles, Check, ChevronRight, Loader2 } from 'lucide-react'

interface Props {
  student: StoredStudent
  onClose: () => void
  onSaved: () => void
}

type StepKey = 'bio' | 'project' | 'github' | 'linkedin' | 'salary'

interface Suggestion {
  key: StepKey
  title: string
  why: string
  content: string
  fieldLabel: string
  placeholder: string
}

function buildSuggestions(student: StoredStudent): Suggestion[] {
  const firstName = student.firstName
  const skills = Object.keys(student.skills)
  const topSkills = skills.slice(0, 3).join(', ')
  const institution = student.institution || 'your university'
  const city = student.city || 'South Africa'
  const degree = student.degree || 'your degree'
  const gradDate = student.graduationDate || '2025'

  const suggestions: Suggestion[] = []

  if (!student.bio) {
    suggestions.push({
      key: 'bio',
      title: 'Write your bio',
      why: 'Recruiters read the bio first. A good one doubles your response rate.',
      content: `Final-year ${degree} student at ${institution}${city ? ` based in ${city}` : ''}. I build ${topSkills ? `with ${topSkills}` : 'software solutions'} and love working on products that solve real problems. Looking for a role where I can grow fast and ship things that matter. Available from ${student.availableFrom || gradDate}.`,
      fieldLabel: 'Your bio',
      placeholder: 'Write a short bio…',
    })
  }

  if (!student.githubUsername) {
    suggestions.push({
      key: 'github',
      title: 'Add your GitHub',
      why: 'Recruiters check GitHub to see real code. It signals you build things, not just study them.',
      content: firstName.toLowerCase().replace(/\s+/g, ''),
      fieldLabel: 'GitHub username',
      placeholder: 'your-username',
    })
  }

  if (!student.linkedinUrl) {
    suggestions.push({
      key: 'linkedin',
      title: 'Add your LinkedIn',
      why: 'Companies verify identity via LinkedIn. Missing it creates doubt.',
      content: `${firstName.toLowerCase()}-${(student.lastName || '').toLowerCase()}`.replace(/\s+/g, ''),
      fieldLabel: 'LinkedIn username',
      placeholder: 'your-linkedin-username',
    })
  }

  if (!student.salaryExpectation) {
    const suggested = city?.toLowerCase().includes('cape') ? 20000 : city?.toLowerCase().includes('durban') ? 18000 : 22000
    suggestions.push({
      key: 'salary',
      title: 'Set your salary expectation',
      why: 'Without a number, some employers skip your profile. A range shows confidence.',
      content: String(suggested),
      fieldLabel: 'Monthly salary (R)',
      placeholder: '22000',
    })
  }

  // Always suggest a project if none recorded
  suggestions.push({
    key: 'project',
    title: 'Add a standout project',
    why: 'Profiles with projects get 2× more employer interest. This takes 2 minutes.',
    content: `A ${topSkills ? topSkills.split(',')[0].trim() : 'web'} project I built during my studies — [describe what it does and the problem it solves in 1–2 sentences].`,
    fieldLabel: 'Project description',
    placeholder: 'Describe your project…',
  })

  return suggestions
}

export default function ProfileBoostPanel({ student, onClose, onSaved }: Props) {
  const suggestions = buildSuggestions(student)
  const [step, setStep] = useState(0)
  const [values, setValues] = useState<Record<StepKey, string>>(
    Object.fromEntries(suggestions.map(s => [s.key, s.content])) as Record<StepKey, string>
  )
  const [accepted, setAccepted] = useState<Set<StepKey>>(new Set())
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  const current = suggestions[step]
  const isLast = step === suggestions.length - 1

  function accept() {
    setAccepted(prev => new Set([...prev, current.key]))
    if (!isLast) {
      setStep(s => s + 1)
    }
  }

  function skip() {
    if (!isLast) setStep(s => s + 1)
  }

  async function finish() {
    setSaving(true)

    const updates: Partial<StoredStudent> = {}
    if (accepted.has('bio')) updates.bio = values.bio
    if (accepted.has('github')) updates.githubUsername = values.github
    if (accepted.has('linkedin')) updates.linkedinUrl = `https://linkedin.com/in/${values.linkedin}`
    if (accepted.has('salary')) updates.salaryExpectation = Number(values.salary)

    const updated: StoredStudent = {
      ...student,
      ...updates,
      passportCompletion: Math.min(100, student.passportCompletion + accepted.size * 8),
    }

    saveStudent(updated)
    setSaving(false)
    setDone(true)
    setTimeout(() => {
      onSaved()
      onClose()
    }, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-navy/60 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-[520px] shadow-2xl overflow-hidden mx-auto">

        {/* Header */}
        <div className="bg-navy px-6 pt-6 pb-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-yellow/20 flex items-center justify-center text-base">✦</div>
              <div>
                <p className="text-white font-semibold text-sm">Jeni is boosting your profile</p>
                <p className="text-white/50 text-xs">{suggestions.length} improvements ready · takes ~3 minutes</p>
              </div>
            </div>
            <button onClick={onClose} className="text-white/40 hover:text-white mt-0.5">
              <X size={18} />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex gap-1.5 mt-1">
            {suggestions.map((s, i) => (
              <div
                key={s.key}
                className={`h-1 rounded-full flex-1 transition-all ${
                  accepted.has(s.key) ? 'bg-green-400' : i === step ? 'bg-yellow' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>

        {done ? (
          <div className="px-6 py-12 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center text-3xl mx-auto mb-4">✓</div>
            <p className="text-lg font-bold mb-1">Profile updated!</p>
            <p className="text-sm text-gray-500">
              {accepted.size} improvement{accepted.size !== 1 ? 's' : ''} applied. Recruiters will notice.
            </p>
          </div>
        ) : (
          <div className="px-6 py-6">
            {/* Step indicator */}
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">
              Step {step + 1} of {suggestions.length}
            </p>

            <h2 className="text-[18px] font-bold mb-1">{current.title}</h2>
            <p className="text-sm text-gray-500 mb-5 leading-relaxed">{current.why}</p>

            {/* Generated content */}
            <div className="mb-5">
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles size={12} className="text-yellow" />
                <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">Jeni's suggestion</span>
              </div>
              <textarea
                value={values[current.key]}
                onChange={e => setValues(v => ({ ...v, [current.key]: e.target.value }))}
                rows={current.key === 'bio' || current.key === 'project' ? 4 : 2}
                className="w-full px-3 py-2.5 border border-border rounded-xl text-sm outline-none focus:border-blue resize-none leading-relaxed"
                placeholder={current.placeholder}
              />
              <p className="text-[11px] text-gray-400 mt-1">Edit this to make it yours — or just accept as-is.</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={accept}
                className="flex-1 flex items-center justify-center gap-2 bg-blue text-white text-sm font-semibold py-2.5 rounded-btn hover:opacity-90"
              >
                <Check size={14} />
                {isLast && accepted.size > 0 ? 'Accept & save all' : 'Accept this →'}
              </button>
              <button
                onClick={isLast ? finish : skip}
                className="px-4 py-2.5 border border-border text-sm font-semibold text-gray-500 rounded-btn hover:border-navy transition-colors"
              >
                {isLast ? (
                  saving ? <Loader2 size={14} className="animate-spin" /> : 'Save & finish'
                ) : 'Skip'}
              </button>
            </div>

            {/* Nav to go back */}
            {step > 0 && (
              <button onClick={() => setStep(s => s - 1)} className="text-xs text-gray-400 hover:text-navy mt-3 w-full text-center">
                ← Back
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
