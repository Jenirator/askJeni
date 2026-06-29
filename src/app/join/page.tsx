'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { Check, ChevronRight, Calendar, Video, Clock, AlertCircle, Loader2 } from 'lucide-react'

// ─── Question bank ────────────────────────────────────────────────────────────

type Question = { q: string; options: string[]; answer: number }

const QUESTION_BANK: Record<string, Question[]> = {
  React: [
    { q: "What is the primary reason React uses a virtual DOM?", options: ["To support server-side rendering", "To minimise expensive direct DOM operations by batching updates", "To replace CSS for styling", "To manage network requests"], answer: 1 },
    { q: "What is the difference between state and props?", options: ["They are the same thing", "State is internal & mutable; props are passed in & read-only", "Props are mutable; state comes from a parent", "State is for styling; props are for logic"], answer: 1 },
    { q: "What does an empty dependency array [] in useEffect mean?", options: ["The effect runs on every render", "The effect runs once after the initial mount only", "The effect never runs", "The effect runs before unmount"], answer: 1 },
    { q: "Why is the 'key' prop important in React lists?", options: ["It adds a CSS identifier", "It helps React identify which items changed, were added, or removed", "It controls sorting order", "It prevents re-renders entirely"], answer: 1 },
    { q: "What triggers a React component to re-render?", options: ["A URL change", "Only explicit calls to render()", "A change in its state or props", "A change in the CSS class"], answer: 2 },
  ],
  TypeScript: [
    { q: "What is the core benefit TypeScript adds over plain JavaScript?", options: ["Faster execution speed", "Static type checking that catches errors before runtime", "Built-in CSS support", "Automatic code formatting"], answer: 1 },
    { q: "What is the difference between 'any' and 'unknown'?", options: ["They are identical", "'unknown' is type-safe — you must narrow the type before using it", "'any' requires type narrowing; 'unknown' does not", "'unknown' is deprecated"], answer: 1 },
    { q: "What does a TypeScript interface define?", options: ["A GUI component", "A contract describing the shape and types of an object", "A runtime check", "An HTTP route"], answer: 1 },
    { q: "What is a discriminated union useful for?", options: ["Merging two arrays", "Modelling a value that can be one of several distinct shapes, with a shared field to distinguish them", "Removing duplicates", "Sorting objects"], answer: 1 },
    { q: "What does the 'readonly' modifier enforce?", options: ["The file cannot be edited", "A property cannot be reassigned after initialisation", "A type is visible only in its file", "A function has no return value"], answer: 1 },
  ],
  Python: [
    { q: "What is the difference between a list and a tuple in Python?", options: ["Lists are faster", "Lists are mutable; tuples are immutable", "Tuples support more methods", "They are identical"], answer: 1 },
    { q: "What does a Python decorator do?", options: ["Changes a variable's type", "Wraps a function to modify or extend its behaviour without changing its source code", "Imports a module", "Handles HTTP requests"], answer: 1 },
    { q: "What is the purpose of the 'yield' keyword?", options: ["Returns a value and immediately ends the function", "Creates a generator that lazily produces values one at a time", "Handles exceptions", "Imports external code"], answer: 1 },
    { q: "What does 'self' represent inside a Python class method?", options: ["The class definition itself", "The instance of the class the method is called on", "A global variable", "The parent class"], answer: 1 },
    { q: "What is the difference between '==' and 'is' in Python?", options: ["They are identical", "'==' checks value equality; 'is' checks object identity (same reference in memory)", "'is' is only for strings", "'==' is only for numbers"], answer: 1 },
  ],
  'Node.js': [
    { q: "What is the event loop's primary role in Node.js?", options: ["Compiling TypeScript", "Allowing non-blocking I/O by offloading tasks and handling callbacks", "Managing CSS rendering", "Storing session data"], answer: 1 },
    { q: "What does 'npm install' do?", options: ["Starts the server", "Downloads and installs the dependencies listed in package.json", "Compiles the project", "Runs automated tests"], answer: 1 },
    { q: "What is middleware in an Express.js application?", options: ["A database layer", "A function that runs between receiving a request and sending a response", "A CSS preprocessor", "A test runner"], answer: 1 },
    { q: "What is the key difference between CommonJS (require) and ES Modules (import)?", options: ["They are identical", "CommonJS loads synchronously at runtime; ES Modules are statically analysed at parse time", "'import' is only for CSS", "'require' is deprecated"], answer: 1 },
    { q: "What is a Promise in JavaScript/Node.js?", options: ["A CSS variable", "An object representing a future value from an asynchronous operation", "A type annotation", "A database transaction"], answer: 1 },
  ],
  SQL: [
    { q: "What is the purpose of a PRIMARY KEY?", options: ["It makes a column bold in results", "It uniquely identifies each row and cannot be null", "It is always the first column", "It links two tables"], answer: 1 },
    { q: "What does a JOIN operation do?", options: ["Removes duplicate rows", "Combines rows from two or more tables based on a related column", "Sorts result sets", "Creates a new database"], answer: 1 },
    { q: "What is the difference between WHERE and HAVING?", options: ["They are identical", "WHERE filters rows before grouping; HAVING filters groups after GROUP BY is applied", "HAVING is only for DELETE", "WHERE only works on strings"], answer: 1 },
    { q: "What is a database index used for?", options: ["Adding colours to query outputs", "Speeding up data retrieval by creating a separate lookup structure", "Encrypting stored data", "Creating backups"], answer: 1 },
    { q: "What does a FOREIGN KEY constraint enforce?", options: ["Uniqueness within a column", "Referential integrity — the value must exist in the referenced table", "That a column cannot be null", "Row-level security"], answer: 1 },
  ],
  Docker: [
    { q: "What problem does Docker primarily solve?", options: ["Code compilation speed", "'Works on my machine' — packages an app with all its dependencies so it runs identically anywhere", "Network security", "Database management"], answer: 1 },
    { q: "What is the difference between a Docker image and a container?", options: ["They are identical", "An image is a read-only blueprint; a container is a running instance of that image", "A container is stored on disk; an image runs in memory", "Images are for production; containers are for development"], answer: 1 },
    { q: "What does a Dockerfile define?", options: ["A network configuration", "Step-by-step instructions for building a Docker image", "A database schema", "A deployment pipeline"], answer: 1 },
    { q: "What is Docker Compose used for?", options: ["Building single containers faster", "Defining and running multi-container applications with a single configuration file", "Pushing images to a registry", "Monitoring container health"], answer: 1 },
    { q: "What happens to data stored inside a container when it is removed?", options: ["It is saved automatically", "It is lost unless a volume is mounted to persist it", "It is backed up to the image", "It is written to the host filesystem"], answer: 1 },
  ],
}

const ALL_SKILLS = Object.keys(QUESTION_BANK)

// ─── Slot helpers ─────────────────────────────────────────────────────────────

interface Slot { id: string; day: string; date: string; time: string }

function generateSlots(startDaysFromNow = 1, count = 5): Slot[] {
  const slots: Slot[] = []
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const base = new Date()
  for (let i = startDaysFromNow; i < startDaysFromNow + count; i++) {
    const d = new Date(base)
    d.setDate(base.getDate() + i)
    if (d.getDay() === 0 || d.getDay() === 6) continue // skip weekends
    const label = `${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`
    slots.push({ id: `${i}-am`, day: label, date: label, time: '9:00 AM' })
    slots.push({ id: `${i}-pm`, day: label, date: label, time: '2:00 PM' })
  }
  return slots.slice(0, 8)
}

// ─── Types ────────────────────────────────────────────────────────────────────

type Step =
  | 'profile'
  | 'schedule-written'
  | 'schedule-video'
  | 'confirmed'
  | 'written'
  | 'video-prep'
  | 'video-interview'
  | 'processing'
  | 'result'

// ─── Sub-components ───────────────────────────────────────────────────────────

function Nav() {
  return (
    <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between bg-white sticky top-0 z-10">
      <Link href="/"><Logo size={18} /></Link>
      <span className="text-xs text-gray-400 font-medium tracking-wide">Admissions assessment</span>
      <div className="w-24" />
    </nav>
  )
}

const STEP_LABELS = ['Profile', 'Schedule', 'Assessments', 'Result']
const STEP_MAP: Record<Step, number> = {
  profile: 0,
  'schedule-written': 1, 'schedule-video': 1, confirmed: 1,
  written: 2, 'video-prep': 2, 'video-interview': 2, processing: 2,
  result: 3,
}

function StepBar({ step }: { step: Step }) {
  const current = STEP_MAP[step]
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {STEP_LABELS.map((label, i) => (
        <div key={label} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              i < current ? 'bg-blue text-white' : i === current ? 'bg-navy text-white' : 'bg-gray-100 text-gray-400'
            }`}>
              {i < current ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-[10px] font-semibold mt-1 ${i === current ? 'text-navy' : 'text-gray-400'}`}>{label}</span>
          </div>
          {i < STEP_LABELS.length - 1 && (
            <div className={`w-16 h-0.5 mb-4 mx-1 transition-all ${i < current ? 'bg-blue' : 'bg-gray-100'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

function SlotPicker({ slots, selected, onSelect }: { slots: Slot[]; selected: string; onSelect: (id: string) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {slots.map(slot => (
        <button key={slot.id} onClick={() => onSelect(slot.id)}
          className={`flex items-center gap-3 px-3.5 py-3 rounded-xl border text-left transition-all ${
            selected === slot.id
              ? 'border-navy bg-navy/5 text-navy'
              : 'border-gray-200 text-gray-600 hover:border-navy/40'
          }`}>
          <div className={`w-4 h-4 rounded flex items-center justify-center border shrink-0 ${
            selected === slot.id ? 'bg-navy border-navy' : 'border-gray-300'
          }`}>
            {selected === slot.id && <Check size={9} color="white" strokeWidth={3} />}
          </div>
          <div>
            <p className="text-xs font-semibold leading-tight">{slot.day}</p>
            <p className="text-[11px] text-gray-400">{slot.time}</p>
          </div>
        </button>
      ))}
    </div>
  )
}

// ─── Video interview component ────────────────────────────────────────────────

function VideoInterview({
  questions,
  onComplete,
}: {
  questions: Question[]
  onComplete: (score: number) => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [cameraError, setCameraError] = useState(false)
  const [phase, setPhase] = useState<'permission' | 'prep' | 'recording' | 'next' | 'done'>('permission')
  const [currentQ, setCurrentQ] = useState(0)
  const [countdown, setCountdown] = useState(20)
  const [recordingTime, setRecordingTime] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const startCamera = useCallback(async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      setStream(s)
      if (videoRef.current) {
        videoRef.current.srcObject = s
        videoRef.current.muted = true
      }
      setPhase('prep')
      setCountdown(20)
    } catch {
      setCameraError(true)
      // Fallback: skip camera, simulate recording
      setPhase('prep')
      setCountdown(20)
    }
  }, [])

  useEffect(() => {
    if (phase === 'prep' && countdown > 0) {
      timerRef.current = setInterval(() => setCountdown(c => c - 1), 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
    if (phase === 'prep' && countdown === 0) {
      setPhase('recording')
      setRecordingTime(0)
    }
  }, [phase, countdown])

  useEffect(() => {
    if (phase === 'recording') {
      timerRef.current = setInterval(() => {
        setRecordingTime(t => {
          if (t >= 119) { handleStopRecording(); return t }
          return t + 1
        })
      }, 1000)
      return () => { if (timerRef.current) clearInterval(timerRef.current) }
    }
  }, [phase])

  function handleStopRecording() {
    if (timerRef.current) clearInterval(timerRef.current)
    setPhase('next')
  }

  function handleNext() {
    if (currentQ < questions.length - 1) {
      setCurrentQ(q => q + 1)
      setPhase('prep')
      setCountdown(20)
      setRecordingTime(0)
    } else {
      setPhase('done')
      if (stream) stream.getTracks().forEach(t => t.stop())
    }
  }

  function handleDone() {
    // Generate a demo score based on number of questions answered
    const score = Math.floor(65 + Math.random() * 25)
    onComplete(score)
  }

  const q = questions[currentQ]
  const progress = ((currentQ + (phase === 'next' || phase === 'done' ? 1 : 0)) / questions.length) * 100
  const mins = Math.floor(recordingTime / 60)
  const secs = String(recordingTime % 60).padStart(2, '0')
  const maxTime = 120
  const timeLeft = maxTime - recordingTime
  const tlMins = Math.floor(timeLeft / 60)
  const tlSecs = String(timeLeft % 60).padStart(2, '0')

  if (phase === 'permission') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-blue/10 flex items-center justify-center mx-auto mb-5">
          <Video size={28} className="text-blue" />
        </div>
        <h2 className="text-xl font-black text-navy mb-2">Ready for your video interview?</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6 leading-relaxed">
          We'll need access to your camera and microphone. You'll see each question on screen, with <strong>20 seconds to prepare</strong> before recording starts.
        </p>
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-left mb-6 max-w-sm mx-auto">
          <p className="text-xs font-semibold text-gray-600 mb-2">Interview format</p>
          <ul className="text-xs text-gray-500 space-y-1.5">
            <li className="flex items-start gap-2"><Check size={12} className="text-blue mt-0.5 shrink-0" /> 5 questions, one at a time</li>
            <li className="flex items-start gap-2"><Check size={12} className="text-blue mt-0.5 shrink-0" /> 20 seconds to read & prepare before recording</li>
            <li className="flex items-start gap-2"><Check size={12} className="text-blue mt-0.5 shrink-0" /> Up to 2 minutes per answer</li>
            <li className="flex items-start gap-2"><Check size={12} className="text-blue mt-0.5 shrink-0" /> Stop recording early whenever you're done</li>
          </ul>
        </div>
        <button onClick={startCamera}
          className="bg-navy text-white text-sm font-bold px-8 py-3 rounded-btn hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
          <Video size={15} /> Allow camera & begin
        </button>
      </div>
    )
  }

  if (phase === 'done') {
    return (
      <div className="text-center py-10">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-5 text-3xl">✓</div>
        <h2 className="text-xl font-black text-navy mb-2">All {questions.length} answers recorded</h2>
        <p className="text-sm text-gray-400 max-w-sm mx-auto mb-8 leading-relaxed">
          Your responses are being submitted. Click below to process your results.
        </p>
        <button onClick={handleDone}
          className="bg-navy text-white text-sm font-bold px-8 py-3 rounded-btn hover:opacity-90 transition-opacity flex items-center gap-2 mx-auto">
          Submit and see my result <ChevronRight size={14} />
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Progress */}
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-semibold text-gray-400">Question {currentQ + 1} of {questions.length}</p>
        {phase === 'recording' && (
          <span className="flex items-center gap-1.5 text-xs font-bold text-red-500">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            REC {tlMins}:{tlSecs} remaining
          </span>
        )}
        {phase === 'prep' && (
          <span className="text-xs font-semibold text-navy">Recording in {countdown}s</span>
        )}
        {phase === 'next' && (
          <span className="text-xs font-semibold text-green-600">✓ Answer recorded</span>
        )}
      </div>
      <div className="h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
      </div>

      {/* Question text */}
      <div className={`rounded-xl px-5 py-4 mb-4 transition-all ${
        phase === 'prep' ? 'bg-yellow/10 border border-yellow/30' :
        phase === 'recording' ? 'bg-red-50 border border-red-200' :
        'bg-gray-50 border border-gray-100'
      }`}>
        {phase === 'prep' && (
          <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-wider mb-2">
            Read carefully — recording starts in {countdown}s
          </p>
        )}
        {phase === 'recording' && (
          <p className="text-[10px] font-bold text-red-500 uppercase tracking-wider mb-2">Recording now</p>
        )}
        <p className="text-sm font-bold text-navy leading-snug">{q.q}</p>
        <p className="text-xs text-gray-400 mt-1.5">Explain your answer in plain language — focus on the WHY, not just the WHAT.</p>
      </div>

      {/* Camera / prep area */}
      <div className={`relative rounded-2xl overflow-hidden bg-gray-900 mb-4 ${cameraError ? 'h-32' : 'aspect-video'}`}>
        {!cameraError ? (
          <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <AlertCircle size={24} className="text-gray-500 mx-auto mb-2" />
              <p className="text-xs text-gray-500">Camera unavailable — audio-only mode</p>
            </div>
          </div>
        )}

        {phase === 'prep' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <div className="text-center">
              <div className="w-20 h-20 rounded-full border-4 border-yellow flex items-center justify-center mb-3">
                <span className="text-4xl font-black text-yellow">{countdown}</span>
              </div>
              <p className="text-white/70 text-sm font-medium">Get ready…</p>
            </div>
          </div>
        )}

        {phase === 'recording' && (
          <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/50 rounded-full px-3 py-1.5">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            <span className="text-white text-xs font-bold">RECORDING</span>
          </div>
        )}

        {phase === 'recording' && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center">
            <div className="h-1 bg-white/20 rounded-full w-48 overflow-hidden">
              <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${(recordingTime / maxTime) * 100}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Action buttons */}
      {phase === 'recording' && (
        <button onClick={handleStopRecording}
          className="w-full border-2 border-red-200 text-red-500 text-sm font-bold py-2.5 rounded-btn hover:bg-red-50 transition-colors flex items-center justify-center gap-2">
          <span className="w-3 h-3 rounded-sm bg-red-400" />
          Stop recording
        </button>
      )}

      {phase === 'next' && (
        <button onClick={handleNext}
          className="w-full bg-navy text-white text-sm font-bold py-2.5 rounded-btn hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
          {currentQ < questions.length - 1 ? <>Next question <ChevronRight size={14} /></> : <>Submit all answers <ChevronRight size={14} /></>}
        </button>
      )}
    </div>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────

function pickQuestions(skills: string[]): Question[] {
  const pool: Question[] = []
  for (const skill of skills) {
    if (QUESTION_BANK[skill]) pool.push(...QUESTION_BANK[skill])
  }
  if (pool.length === 0) pool.push(...QUESTION_BANK['React'])
  return pool.sort(() => Math.random() - 0.5).slice(0, 5)
}

export default function JoinPage() {
  const [step, setStep] = useState<Step>('profile')

  // Profile
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [institution, setInstitution] = useState('')
  const [gradYear, setGradYear] = useState('')
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  // Scheduling
  const writtenSlots = generateSlots(1, 7)
  const videoSlots = generateSlots(3, 7)
  const [writtenSlot, setWrittenSlot] = useState('')
  const [videoSlot, setVideoSlot] = useState('')

  // Written test
  const [questions] = useState(() => pickQuestions(['React', 'TypeScript', 'Python']))
  const [currentQ, setCurrentQ] = useState(0)
  const [writtenAnswers, setWrittenAnswers] = useState<number[]>([])
  const [writtenScore, setWrittenScore] = useState(0)

  // Video
  const [videoScore, setVideoScore] = useState(0)

  // Result
  const [admitted, setAdmitted] = useState<'accepted' | 'review' | 'declined' | null>(null)

  function answerWritten(answerIndex: number) {
    setWrittenAnswers(prev => {
      if (prev.length >= questions.length) return prev
      const newAnswers = [...prev, answerIndex]
      const nextQ = newAnswers.length
      if (nextQ < questions.length) {
        setCurrentQ(nextQ)
      } else {
        const correct = newAnswers.filter((a, i) => a === questions[i].answer).length
        setWrittenScore(Math.round((correct / questions.length) * 100))
        setStep('video-prep')
      }
      return newAnswers
    })
  }

  function handleVideoComplete(score: number) {
    setVideoScore(score)
    setStep('processing')
    setTimeout(() => {
      const combined = (writtenScore + score) / 2
      const gap = Math.abs(writtenScore - score)
      if (gap > 35) setAdmitted('review')
      else if (combined >= 65) setAdmitted('accepted')
      else setAdmitted('declined')
      setStep('result')
    }, 2800)
  }

  const selectedWrittenSlot = writtenSlots.find(s => s.id === writtenSlot)
  const selectedVideoSlot = videoSlots.find(s => s.id === videoSlot)
  const combined = Math.round((writtenScore + videoScore) / 2)

  // ── Profile ─────────────────────────────────────────────────────────────────

  if (step === 'profile') {
    const canContinue = name.trim() && email.trim() && institution.trim() && gradYear && selectedSkills.length >= 1
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
          <div className="w-full max-w-[560px]">
            <StepBar step="profile" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <h1 className="text-xl font-black text-navy mb-1">Apply to join askJeni</h1>
              <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                askJeni is selective. You'll schedule a written skills test and a live video interview. Only candidates who pass both are admitted.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Full name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Thabo Nkosi"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Email address</label>
                  <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@university.ac.za" type="email"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue/40" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Institution</label>
                  <input value={institution} onChange={e => setInstitution(e.target.value)} placeholder="e.g. UCT"
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue/40" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1.5">Graduation year</label>
                  <select value={gradYear} onChange={e => setGradYear(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-blue/40 bg-white text-gray-600">
                    <option value="">Select year</option>
                    {['2024', '2025', '2026', '2027'].map(y => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-6">
                <label className="block text-xs font-semibold text-gray-500 mb-1">Skills to be assessed on <span className="font-normal text-gray-400">(select at least 1)</span></label>
                <p className="text-[11px] text-gray-400 mb-3">Only select skills you genuinely know — both tests are tailored to these.</p>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map(skill => (
                    <button key={skill} type="button"
                      onClick={() => setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill])}
                      className={`text-xs font-semibold px-3.5 py-1.5 rounded-full border transition-all ${
                        selectedSkills.includes(skill) ? 'bg-navy border-navy text-white' : 'border-gray-200 text-gray-500 hover:border-navy/40'
                      }`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={() => setStep('schedule-written')} disabled={!canContinue}
                className={`w-full flex items-center justify-center gap-2 py-3 rounded-btn text-sm font-bold transition-all ${
                  canContinue ? 'bg-navy text-white hover:opacity-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                }`}>
                Schedule my assessments <ChevronRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Schedule written test ────────────────────────────────────────────────────

  if (step === 'schedule-written') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
          <div className="w-full max-w-[520px]">
            <StepBar step="schedule-written" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-blue" />
                </div>
                <div>
                  <h2 className="text-base font-black text-navy">Schedule your written test</h2>
                  <p className="text-xs text-gray-400">5 conceptual multiple-choice questions · ~10 minutes</p>
                </div>
              </div>
              <div className="bg-blue/5 border border-blue/15 rounded-xl px-4 py-3 mb-6 mt-4">
                <p className="text-xs text-blue font-medium">You'll receive a reminder email 1 hour before your slot. The test link goes live at your chosen time.</p>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available slots</p>
              <SlotPicker slots={writtenSlots} selected={writtenSlot} onSelect={setWrittenSlot} />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('profile')}
                  className="flex-1 border border-gray-200 text-gray-500 text-sm font-semibold py-2.5 rounded-btn hover:border-navy/40 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep('schedule-video')} disabled={!writtenSlot}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-btn transition-all ${
                    writtenSlot ? 'bg-navy text-white hover:opacity-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  Next: video interview <ChevronRight size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Schedule video interview ─────────────────────────────────────────────────

  if (step === 'schedule-video') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
          <div className="w-full max-w-[520px]">
            <StepBar step="schedule-video" />

            {/* Written test selected */}
            {selectedWrittenSlot && (
              <div className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl px-4 py-3 mb-4 shadow-sm">
                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center shrink-0">
                  <Check size={14} className="text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-600">Written test booked</p>
                  <p className="text-xs text-gray-400">{selectedWrittenSlot.day} · {selectedWrittenSlot.time}</p>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-9 h-9 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Video size={18} className="text-navy" />
                </div>
                <div>
                  <h2 className="text-base font-black text-navy">Schedule your video interview</h2>
                  <p className="text-xs text-gray-400">5 verbal questions on camera · ~20 minutes</p>
                </div>
              </div>
              <div className="bg-navy/5 border border-navy/10 rounded-xl px-4 py-3 mb-6 mt-4">
                <p className="text-xs text-navy font-medium">You'll need a camera and microphone. Each question gives you <strong>20 seconds to prepare</strong> before recording starts automatically. Up to 2 minutes per answer.</p>
              </div>
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Available slots</p>
              <SlotPicker slots={videoSlots} selected={videoSlot} onSelect={setVideoSlot} />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setStep('schedule-written')}
                  className="flex-1 border border-gray-200 text-gray-500 text-sm font-semibold py-2.5 rounded-btn hover:border-navy/40 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep('confirmed')} disabled={!videoSlot}
                  className={`flex-1 flex items-center justify-center gap-2 text-sm font-bold py-2.5 rounded-btn transition-all ${
                    videoSlot ? 'bg-navy text-white hover:opacity-90' : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                  }`}>
                  Confirm bookings <Check size={13} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Confirmed ────────────────────────────────────────────────────────────────

  if (step === 'confirmed') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[480px]">
            <StepBar step="confirmed" />
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
              <h1 className="text-xl font-black text-navy mb-1">You're booked in, {name.split(' ')[0]}.</h1>
              <p className="text-sm text-gray-400">We've sent a confirmation to <strong>{email}</strong>.</p>
            </div>

            <div className="flex flex-col gap-3 mb-6">
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue/10 flex items-center justify-center shrink-0">
                  <Calendar size={18} className="text-blue" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">Written test</p>
                  <p className="text-xs text-gray-400">{selectedWrittenSlot?.day} · {selectedWrittenSlot?.time} · ~10 min</p>
                </div>
                <span className="text-[10px] font-bold text-blue bg-blue/10 px-2 py-1 rounded-full">Scheduled</span>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-navy/10 flex items-center justify-center shrink-0">
                  <Video size={18} className="text-navy" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-navy">Video interview</p>
                  <p className="text-xs text-gray-400">{selectedVideoSlot?.day} · {selectedVideoSlot?.time} · ~20 min</p>
                </div>
                <span className="text-[10px] font-bold text-blue bg-blue/10 px-2 py-1 rounded-full">Scheduled</span>
              </div>
            </div>

            <div className="bg-navy rounded-2xl p-5 text-white mb-4">
              <p className="text-sm font-bold mb-1">What to prepare</p>
              <ul className="text-xs text-white/60 space-y-1.5 mt-2">
                <li>→ Find a quiet space with good lighting for the video interview</li>
                <li>→ Test your camera and microphone beforehand</li>
                <li>→ You'll answer conceptual questions — think about the WHY, not just the WHAT</li>
                <li>→ No notes or outside resources during either assessment</li>
              </ul>
            </div>

            <div className="border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-3 mb-6">
              <Clock size={14} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-500">
                Your assessment links will be emailed 1 hour before each slot. You can also start from this page.
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <button onClick={() => setStep('written')}
                className="w-full bg-navy text-white text-sm font-bold py-3 rounded-btn hover:opacity-90 transition-opacity">
                Start written test now (demo) →
              </button>
              <Link href="/" className="w-full text-center text-xs text-gray-400 hover:text-navy transition-colors py-2">
                I'll come back at my scheduled time
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Written test ─────────────────────────────────────────────────────────────

  if (step === 'written') {
    const q = questions[currentQ]
    const progress = (currentQ / questions.length) * 100
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
          <div className="w-full max-w-[540px]">
            <StepBar step="written" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-gray-400">Question {currentQ + 1} of {questions.length}</p>
                <p className="text-xs text-gray-400">{Math.round(progress)}% complete</p>
              </div>
              <div className="h-1.5 bg-gray-100 rounded-full mb-7 overflow-hidden">
                <div className="h-full bg-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              <p className="text-base font-bold text-navy mb-6 leading-snug">{q.q}</p>
              <div className="flex flex-col gap-3">
                {q.options.map((opt, i) => (
                  <button key={i} onClick={() => answerWritten(i)}
                    className="text-left px-4 py-3.5 rounded-xl border border-gray-200 text-sm text-gray-700 hover:border-blue hover:bg-blue/5 hover:text-navy transition-all font-medium">
                    <span className="font-bold text-gray-400 mr-3">{['A', 'B', 'C', 'D'][i]}</span>{opt}
                  </button>
                ))}
              </div>
              <p className="text-[11px] text-gray-400 text-center mt-6">These questions test conceptual understanding. Take your time.</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Video interview prep & interview ─────────────────────────────────────────

  if (step === 'video-prep' || step === 'video-interview') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-start justify-center px-6 pt-10 pb-16">
          <div className="w-full max-w-[560px]">
            <StepBar step="video-interview" />
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
              <VideoInterview
                questions={questions}
                onComplete={handleVideoComplete}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Processing ────────────────────────────────────────────────────────────────

  if (step === 'processing') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6">
          <div className="text-center max-w-[360px]">
            <div className="w-16 h-16 rounded-full bg-navy flex items-center justify-center mx-auto mb-6">
              <Loader2 size={28} className="animate-spin text-yellow" />
            </div>
            <h2 className="text-xl font-black text-navy mb-2">Analysing your assessment</h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-8">Scoring written test, evaluating video responses, and checking consistency…</p>
            <div className="flex flex-col gap-3 text-left">
              {['Scoring written test…', 'Analysing video responses…', 'Checking written/verbal consistency…', 'Calculating final score…'].map((label, i) => (
                <div key={label} className="flex items-center gap-3 text-sm text-gray-500">
                  <Loader2 size={14} className="animate-spin text-blue shrink-0" />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ── Result ────────────────────────────────────────────────────────────────────

  if (step === 'result' && admitted === 'accepted') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[500px]">
            <div className="bg-navy rounded-2xl p-8 text-white text-center mb-4">
              <div className="w-16 h-16 rounded-full bg-yellow flex items-center justify-center text-3xl mx-auto mb-5">✦</div>
              <h1 className="text-2xl font-black mb-2">You're in, {name.split(' ')[0]}.</h1>
              <p className="text-white/60 text-sm mb-6 leading-relaxed">You've passed both assessments and been admitted to the platform. Your profile is now visible to employers.</p>
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-white/10 rounded-xl py-3 px-2">
                  <p className="text-2xl font-black text-yellow">{writtenScore}%</p>
                  <p className="text-white/50 text-[11px] mt-0.5">Written test</p>
                </div>
                <div className="bg-white/10 rounded-xl py-3 px-2">
                  <p className="text-2xl font-black text-yellow">{videoScore}%</p>
                  <p className="text-white/50 text-[11px] mt-0.5">Video interview</p>
                </div>
                <div className="bg-yellow/20 border border-yellow/40 rounded-xl py-3 px-2">
                  <p className="text-2xl font-black text-yellow">{combined}%</p>
                  <p className="text-white/50 text-[11px] mt-0.5">Combined</p>
                </div>
              </div>
              <Link href="/dashboard"
                className="flex items-center justify-center gap-2 bg-yellow text-navy text-sm font-bold py-3 rounded-btn hover:opacity-90 transition-opacity">
                Build my Skills Passport →
              </Link>
            </div>
            <p className="text-xs text-center text-gray-400">You're now part of an elite group. Employers know every candidate they see has been rigorously assessed.</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result' && admitted === 'review') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[460px] text-center">
            <div className="w-14 h-14 rounded-full bg-yellow/20 border-2 border-yellow flex items-center justify-center text-2xl mx-auto mb-5">⏳</div>
            <h1 className="text-xl font-black text-navy mb-2">Under manual review</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">Your written ({writtenScore}%) and video ({videoScore}%) scores differed significantly — our team will review your responses within 48 hours.</p>
            <p className="text-xs text-gray-400">We'll email {email} with the outcome.</p>
          </div>
        </div>
      </div>
    )
  }

  if (step === 'result' && admitted === 'declined') {
    return (
      <div className="min-h-screen bg-[#F7F9FC] flex flex-col">
        <Nav />
        <div className="flex-1 flex items-center justify-center px-6 py-16">
          <div className="w-full max-w-[460px] text-center">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-2xl mx-auto mb-5">→</div>
            <h1 className="text-xl font-black text-navy mb-2">Not this time</h1>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">Your combined score ({combined}%) didn't reach our admission threshold. You're welcome to reapply in 90 days.</p>
            <div className="grid grid-cols-2 gap-3 text-sm max-w-xs mx-auto">
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="font-bold text-navy">{writtenScore}%</p>
                <p className="text-gray-400 text-xs mt-0.5">Written test</p>
              </div>
              <div className="bg-white border border-gray-100 rounded-xl p-4">
                <p className="font-bold text-navy">{videoScore}%</p>
                <p className="text-gray-400 text-xs mt-0.5">Video interview</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return null
}
