'use client'

import { useState } from 'react'
import { Video, CheckCircle, RotateCcw, ChevronRight, Clock, Lightbulb, Play, StopCircle } from 'lucide-react'

const QUESTIONS = [
  {
    id: 1,
    theme: 'Problem-solving',
    color: 'bg-blue/10 text-blue border-blue/20',
    iconBg: 'bg-blue/15',
    iconColor: 'text-blue',
    question: 'Tell us about a project where your first approach didn\'t work. What did you do differently?',
    hint: 'Be specific — name the project, what broke, and the pivot you made. A debugging story or architecture rethink both work well.',
  },
  {
    id: 2,
    theme: 'Technical thinking',
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    iconBg: 'bg-purple-500/15',
    iconColor: 'text-purple-600',
    question: 'Walk us through one piece of code you\'ve written that you\'re proud of. What makes it good?',
    hint: 'Pick something concrete — a function, a component, a script. Talk about why the design decision matters, not just what it does.',
  },
  {
    id: 3,
    theme: 'Learning ability',
    color: 'bg-teal-500/10 text-teal-600 border-teal-200',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-600',
    question: 'Describe a time you had to figure out an unfamiliar tool, library, or framework quickly. How did you go about it?',
    hint: 'Recruiters want to see your process — docs, tutorials, trial and error, asking for help. The tool itself doesn\'t matter much.',
  },
  {
    id: 4,
    theme: 'Teamwork',
    color: 'bg-yellow/10 text-yellow-700 border-yellow/30',
    iconBg: 'bg-yellow/15',
    iconColor: 'text-yellow-700',
    question: 'Tell us about a disagreement you had with a teammate on a project. How did you handle it?',
    hint: 'Be honest — this isn\'t a trick question. Employers want to know you can navigate conflict, not that you always agree.',
  },
  {
    id: 5,
    theme: 'Ethics & judgement',
    color: 'bg-orange-500/10 text-orange-600 border-orange-200',
    iconBg: 'bg-orange-500/15',
    iconColor: 'text-orange-600',
    question: 'If you discovered that a teammate had used AI-generated or copied code without checking the licence on a project that was about to be submitted or shipped — what would you do?',
    hint: 'There\'s no single right answer. Think about the stakes (submission vs production), and how you\'d balance honesty with pragmatism.',
  },
]

type QuestionState = 'idle' | 'recording' | 'done' | 'retake'

export default function VideoIntroPage() {
  const [activeQuestion, setActiveQuestion] = useState<number | null>(null)
  const [questionStates, setQuestionStates] = useState<Record<number, QuestionState>>({})
  const [retakesUsed, setRetakesUsed] = useState<Record<number, number>>({})

  const completedCount = Object.values(questionStates).filter(s => s === 'done').length
  const allDone = completedCount === QUESTIONS.length

  function startRecording(id: number) {
    setQuestionStates(s => ({ ...s, [id]: 'recording' }))
  }

  function stopRecording(id: number) {
    setQuestionStates(s => ({ ...s, [id]: 'done' }))
  }

  function retake(id: number) {
    const used = retakesUsed[id] ?? 0
    if (used >= 1) return
    setRetakesUsed(r => ({ ...r, [id]: used + 1 }))
    setQuestionStates(s => ({ ...s, [id]: 'recording' }))
  }

  const activeQ = activeQuestion !== null ? QUESTIONS.find(q => q.id === activeQuestion) : null
  const activeState = activeQuestion !== null ? (questionStates[activeQuestion] ?? 'idle') : null

  return (
    <div className="p-8 max-w-[860px]">

      {/* Header */}
      <div className="mb-7">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center">
            <Video size={18} className="text-blue" />
          </div>
          <h1 className="text-[22px] font-bold tracking-tight">Video introduction</h1>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed max-w-xl">
          5 short questions · 60 seconds each · 1 retake per question. Recruiters score on how you think, not how polished you sound.
        </p>
      </div>

      {/* Progress bar */}
      <div className="bg-white border border-border rounded-card p-4 mb-6 flex items-center gap-4">
        <div className="flex-1">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-sm font-semibold">{completedCount} of 5 questions recorded</span>
            {allDone && (
              <span className="text-xs font-semibold text-green-600 bg-green-50 px-2.5 py-0.5 rounded-full">✓ Ready to submit</span>
            )}
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue rounded-full transition-all duration-500"
              style={{ width: `${(completedCount / 5) * 100}%` }}
            />
          </div>
        </div>
        {allDone && (
          <button className="bg-blue text-white text-sm font-semibold px-5 py-2 rounded-btn hover:opacity-90 shrink-0">
            Submit intro →
          </button>
        )}
      </div>

      {/* Tips */}
      <div className="bg-blue/5 border border-blue/15 rounded-card px-5 py-4 mb-6 flex gap-3">
        <Lightbulb size={16} className="text-blue shrink-0 mt-0.5" />
        <div className="flex flex-wrap gap-x-6 gap-y-1">
          {[
            'Find a quiet spot with decent lighting',
            'Your face should be clearly visible',
            'Varsity projects, hackathons, personal work all count',
            'Be yourself — not rehearsed',
          ].map(tip => (
            <span key={tip} className="text-xs text-gray-600">{tip}</span>
          ))}
        </div>
      </div>

      {/* Questions list */}
      <div className="flex flex-col gap-3">
        {QUESTIONS.map(q => {
          const state = questionStates[q.id] ?? 'idle'
          const isActive = activeQuestion === q.id
          const retakesLeft = 1 - (retakesUsed[q.id] ?? 0)

          return (
            <div
              key={q.id}
              className={`bg-white border rounded-card overflow-hidden transition-all ${
                isActive ? 'border-blue shadow-sm' : 'border-border hover:border-blue/40'
              }`}
            >
              {/* Question row */}
              <button
                className="w-full px-5 py-4 flex items-start gap-4 text-left"
                onClick={() => setActiveQuestion(isActive ? null : q.id)}
              >
                {/* Status circle */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                  state === 'done'
                    ? 'bg-green-100'
                    : state === 'recording'
                    ? 'bg-red-100 animate-pulse'
                    : 'bg-gray-100'
                }`}>
                  {state === 'done'
                    ? <CheckCircle size={16} className="text-green-600" />
                    : state === 'recording'
                    ? <div className="w-3 h-3 rounded-full bg-red-500" />
                    : <span className="text-xs font-bold text-gray-400">{q.id}</span>
                  }
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${q.color}`}>
                      {q.theme}
                    </span>
                    <span className="text-[11px] text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> 60s max
                    </span>
                    {state === 'done' && retakesLeft > 0 && (
                      <span className="text-[11px] text-gray-400">{retakesLeft} retake left</span>
                    )}
                    {state === 'done' && retakesLeft === 0 && (
                      <span className="text-[11px] text-orange-500">No retakes left</span>
                    )}
                  </div>
                  <p className="text-sm font-medium text-navy leading-snug">{q.question}</p>
                </div>

                <ChevronRight
                  size={16}
                  className={`text-gray-300 shrink-0 mt-1 transition-transform ${isActive ? 'rotate-90' : ''}`}
                />
              </button>

              {/* Expanded panel */}
              {isActive && (
                <div className="border-t border-border px-5 py-5">
                  {/* Hint */}
                  <div className="bg-gray-50 border border-border rounded-xl px-4 py-3 mb-5">
                    <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Coaching tip</p>
                    <p className="text-sm text-gray-600 leading-relaxed">{q.hint}</p>
                  </div>

                  {/* Recording area */}
                  <div className="bg-gray-900 rounded-xl aspect-video flex flex-col items-center justify-center mb-4 relative overflow-hidden">
                    {state === 'recording' ? (
                      <>
                        {/* Simulated camera feed */}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center">
                            <Video size={32} className="text-white/40" />
                          </div>
                        </div>
                        {/* REC badge */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-600 px-2.5 py-1 rounded-full">
                          <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                          <span className="text-xs font-bold text-white">REC</span>
                        </div>
                        {/* Timer placeholder */}
                        <div className="absolute top-3 right-3 bg-black/50 px-2.5 py-1 rounded-full">
                          <span className="text-xs font-mono text-white">0:00 / 1:00</span>
                        </div>
                      </>
                    ) : state === 'done' ? (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                          <CheckCircle size={28} className="text-green-400" />
                        </div>
                        <p className="text-sm text-white/60">Answer recorded</p>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
                          <Video size={28} className="text-white/30" />
                        </div>
                        <p className="text-sm text-white/40">Camera preview will appear here</p>
                      </div>
                    )}
                  </div>

                  {/* Controls */}
                  <div className="flex gap-3">
                    {state === 'idle' && (
                      <button
                        onClick={() => startRecording(q.id)}
                        className="flex items-center gap-2 bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-90"
                      >
                        <Play size={14} /> Start recording
                      </button>
                    )}
                    {state === 'recording' && (
                      <button
                        onClick={() => stopRecording(q.id)}
                        className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-90"
                      >
                        <StopCircle size={14} /> Stop recording
                      </button>
                    )}
                    {state === 'done' && (
                      <>
                        <button
                          onClick={() => {
                            const next = QUESTIONS.find(nq => (questionStates[nq.id] ?? 'idle') !== 'done' && nq.id !== q.id)
                            setActiveQuestion(next?.id ?? null)
                          }}
                          className="flex items-center gap-2 bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-90"
                        >
                          Next question <ChevronRight size={14} />
                        </button>
                        {retakesLeft > 0 && (
                          <button
                            onClick={() => retake(q.id)}
                            className="flex items-center gap-2 border border-border text-sm font-semibold px-4 py-2.5 rounded-btn text-gray-600 hover:border-navy"
                          >
                            <RotateCcw size={13} /> Retake ({retakesLeft} left)
                          </button>
                        )}
                      </>
                    )}
                    {state === 'retake' && (
                      <button
                        onClick={() => stopRecording(q.id)}
                        className="flex items-center gap-2 bg-red-600 text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-90"
                      >
                        <StopCircle size={14} /> Stop recording
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Bottom CTA when all done */}
      {allDone && (
        <div className="mt-6 bg-green-50 border border-green-200 rounded-card px-6 py-5 flex items-center gap-4">
          <CheckCircle size={24} className="text-green-600 shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-semibold text-green-800 mb-0.5">All 5 answers recorded</p>
            <p className="text-sm text-green-700">Your intro will be visible to employers who view your profile. You can re-record before submitting.</p>
          </div>
          <button className="bg-green-600 text-white text-sm font-semibold px-5 py-2.5 rounded-btn hover:opacity-90 shrink-0">
            Submit intro →
          </button>
        </div>
      )}
    </div>
  )
}
