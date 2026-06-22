import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Interview Prep' }

const TRACKS = [
  {
    id: 'technical',
    icon: '💻',
    title: 'Technical Fundamentals',
    desc: 'React, Node.js, Python, data structures, system design basics. Covers the core technical questions asked at SA tech companies hiring graduates.',
    questions: 24,
    minutes: 40,
    color: 'bg-blue/10',
    barColor: 'bg-blue',
    primary: true,
  },
  {
    id: 'behavioural',
    icon: '🗣️',
    title: 'Behavioural Questions',
    desc: 'STAR-method answers for teamwork, problem-solving, failure, and leadership. SA employers expect contextual answers — generic responses land poorly.',
    questions: 18,
    minutes: 30,
    color: 'bg-yellow/10',
    barColor: 'bg-yellow',
    primary: false,
  },
  {
    id: 'sa',
    icon: '🇿🇦',
    title: 'SA-Specific Prep',
    desc: 'Load shedding resilience, EE considerations, B-BBEE context, local market knowledge. Questions that only come up in SA interviews — and catch candidates off guard.',
    questions: 12,
    minutes: 20,
    color: 'bg-green-50',
    barColor: 'bg-green-500',
    primary: false,
  },
]

const SAMPLE_QUESTIONS = [
  {
    track: 'Technical Fundamentals',
    category: 'React',
    difficulty: 'Medium',
    question: 'Explain the difference between useEffect with an empty dependency array, a dependency array with values, and no dependency array at all. When would you use each?',
  },
  {
    track: 'Behavioural Questions',
    category: 'Behavioural',
    difficulty: 'Standard',
    question: 'Tell me about a time you disagreed with a teammate about a technical approach. How did you handle it and what was the outcome?',
  },
  {
    track: 'SA-Specific Prep',
    category: 'SA Context',
    difficulty: 'Important',
    question: 'How would you design a South African web application to remain functional during Stage 4 load shedding, where users may lose connectivity for 4+ hours at a time?',
  },
]

export default async function InterviewPrepPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const profile = await prisma.studentProfile.findUnique({
    where: { userId: session.user.id },
    include: { matches: { include: { opportunity: true }, take: 3, orderBy: { score: 'desc' } } },
  })

  if (!profile) redirect('/register')

  const topCompanies = profile.matches.map(m => m.opportunity.companyName).filter(Boolean).slice(0, 3).join(', ')

  return (
    <div className="p-8 max-w-[880px]">

      {/* HERO */}
      <div className="bg-navy rounded-card px-8 py-7 mb-6 flex items-center gap-6">
        <div className="flex-1">
          <h1 className="text-[22px] font-bold text-white mb-2 tracking-tight">Prep smart, not just hard</h1>
          <p className="text-sm text-white/50 leading-relaxed max-w-lg">
            {topCompanies
              ? `Your interview prep is tailored to the roles you've matched with. ${topCompanies} all ask React and Python questions — that's where we focus.`
              : 'Complete your passport to get prep tailored to your matched companies.'}
          </p>
        </div>
        <div className="flex gap-6 shrink-0">
          {[
            { value: '0', label: 'Questions done' },
            { value: TRACKS.length.toString(), label: 'Tracks available' },
            { value: '~90', label: 'Min to complete' },
          ].map(({ value, label }) => (
            <div key={label} className="text-center">
              <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
              <div className="text-[11px] text-white/40 mt-0.5">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* JENI NUDGE */}
      <div className="flex items-center gap-4 bg-blue/5 border border-blue/20 rounded-card px-5 py-4 mb-6">
        <div className="w-9 h-9 bg-blue rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">✦</div>
        <div className="flex-1">
          <p className="text-sm font-semibold mb-0.5">Start with Technical Fundamentals — it covers 80% of what top SA tech companies will ask</p>
          <p className="text-sm text-gray-500">Graduate roles focus heavily on React state management and REST API design. Both are in the Technical track.</p>
        </div>
        <a href="#technical" className="text-sm font-semibold text-blue whitespace-nowrap hover:underline">Start prep →</a>
      </div>

      {/* THREE TRACKS */}
      <div id="technical" className="grid grid-cols-3 gap-4 mb-6">
        {TRACKS.map(track => (
          <div key={track.id} className="bg-white border border-border rounded-card p-5 flex flex-col">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-2xl ${track.color} mb-4 shrink-0`}>
              {track.icon}
            </div>
            <h3 className="text-[15px] font-semibold mb-1">{track.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{track.desc}</p>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden mb-1.5">
              <div className={`h-full rounded-full w-0 ${track.barColor}`} />
            </div>
            <div className="flex justify-between text-xs text-gray-400 mb-4">
              <span>0 / {track.questions} questions</span>
              <span>~{track.minutes} min</span>
            </div>
            <button className={`w-full py-2.5 rounded-btn text-sm font-semibold ${track.primary ? 'bg-blue text-white' : 'bg-blue/10 text-blue'}`}>
              {track.primary ? 'Start track →' : 'Start track'}
            </button>
          </div>
        ))}
      </div>

      {/* SAMPLE QUESTIONS */}
      <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">Sample questions from your prep</p>

      <div className="flex flex-col gap-3 mb-6">
        {SAMPLE_QUESTIONS.map((q, i) => (
          <div key={i} className="bg-white border border-border rounded-card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3.5 border-b border-border">
              <span className="text-sm font-semibold">{q.track}</span>
              <span className="text-xs text-gray-400">{q.category} · {q.difficulty}</span>
            </div>
            <div className="px-5 py-4">
              <span className="text-[11px] font-semibold text-blue bg-blue/10 px-2 py-0.5 rounded inline-block mb-2">{q.category}</span>
              <p className="text-sm text-navy leading-relaxed">{q.question}</p>
            </div>
            <div className="flex gap-2 px-5 py-3 bg-gray-50 border-t border-border">
              <button className="px-3 py-1.5 text-xs font-semibold border border-border rounded-btn bg-white text-gray-600 hover:border-blue hover:text-blue transition-colors">
                See model answer
              </button>
              <button className="px-3 py-1.5 text-xs font-semibold border border-border rounded-btn bg-white text-gray-600 hover:border-blue hover:text-blue transition-colors">
                Practice with Jeni →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PRACTICE WITH JENI */}
      <div className="bg-navy rounded-card p-6 flex items-center gap-5">
        <div className="w-[52px] h-[52px] rounded-[14px] bg-yellow/15 border border-yellow/30 flex items-center justify-center text-2xl shrink-0">✦</div>
        <div className="flex-1">
          <h3 className="text-[17px] font-bold text-white mb-1">Practice live with Jeni</h3>
          <p className="text-sm text-white/50 leading-relaxed">
            Jeni will ask you questions, listen to your answers, and give you specific feedback on what's strong, what's vague, and what to sharpen before the real interview. Like a mock interview, but available at 2am before your big day.
          </p>
        </div>
        <button className="bg-blue text-white text-sm font-semibold px-5 py-2.5 rounded-btn whitespace-nowrap hover:opacity-90 shrink-0">
          Start mock interview →
        </button>
      </div>

    </div>
  )
}
