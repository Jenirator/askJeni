import { MOCK_STUDENT, MOCK_SKILLS, MOCK_PROJECTS, MOCK_MATCHES, MOCK_ASSESSMENTS_COMPLETED } from '@/lib/mock-data'
import Link from 'next/link'

export const metadata = { title: 'Learning Path' }

export default function LearningPathPage() {
  const score = MOCK_STUDENT.passportCompletion
  const verifiedSkills = MOCK_SKILLS.filter(s => s.level === 'VERIFIED')

  const milestones = [
    {
      id: 'm1',
      title: 'Complete your profile',
      done: true,
      tasks: [
        { label: 'Add institution, degree, and year', done: true },
        { label: 'Set salary expectation and availability', done: true },
        { label: 'Add location and work type preferences', done: true },
        { label: 'Connect GitHub profile', done: true },
      ],
    },
    {
      id: 'm2',
      title: 'Add your tech stack',
      done: true,
      tasks: [
        { label: 'Select at least 4 confident skills', done: true },
        { label: 'Select learning skills (in progress)', done: true },
      ],
    },
    {
      id: 'm3',
      title: 'Add your projects',
      done: MOCK_PROJECTS.length >= 2,
      tasks: [
        { label: 'Add your first project with description and tech stack', done: MOCK_PROJECTS.length >= 1 },
        { label: 'Add a second project or link GitHub repos', done: MOCK_PROJECTS.length >= 2 },
      ],
    },
    {
      id: 'm4',
      title: 'Verify your skills',
      done: verifiedSkills.length >= 2,
      active: verifiedSkills.length < 2,
      tasks: [
        {
          label: `Complete first skill assessment${MOCK_ASSESSMENTS_COMPLETED[0] ? ` (${MOCK_ASSESSMENTS_COMPLETED[0].title} — ${MOCK_ASSESSMENTS_COMPLETED[0].score}/100)` : ''}`,
          done: MOCK_ASSESSMENTS_COMPLETED.length >= 1,
          cta: MOCK_ASSESSMENTS_COMPLETED.length === 0 ? { label: 'Start →', href: '/passport' } : null,
        },
        {
          label: 'Verify a second skill (React recommended)',
          done: verifiedSkills.length >= 2,
          cta: verifiedSkills.length < 2 ? { label: 'Start →', href: '/passport' } : null,
        },
        { label: 'Reach 90%+ passport completion', done: score >= 90, cta: null },
      ],
    },
    {
      id: 'm5',
      title: 'Apply to your first match',
      done: false,
      locked: verifiedSkills.length < 2,
      tasks: [
        { label: 'Review your top 3 matched roles', done: false, cta: null },
        { label: 'Complete interview prep module for your top match', done: false, cta: null },
        { label: 'Express interest in at least one role', done: false, cta: null },
      ],
    },
  ]

  const doneMilestones = milestones.filter(m => m.done).length
  const progressPct = Math.round((doneMilestones / milestones.length) * 100)
  const activeMilestone = milestones.find(m => m.active)

  return (
    <div className="p-8 max-w-[880px]">

      {/* JENI NUDGE */}
      {activeMilestone && (
        <div className="flex items-center gap-4 bg-blue/5 border border-blue/20 rounded-card px-5 py-4 mb-6">
          <div className="w-9 h-9 bg-blue rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0">✦</div>
          <div className="flex-1">
            <p className="text-sm font-semibold mb-0.5">Verify a second skill to unlock your first matches</p>
            <p className="text-sm text-gray-500">
              {verifiedSkills.length === 1
                ? "You've completed one assessment. One more verified skill pushes your passport to 91% and makes you visible to more companies."
                : "Take your first assessment to verify a skill and start matching with companies."}
            </p>
          </div>
          <Link href="/passport" className="text-sm font-semibold text-blue whitespace-nowrap hover:underline">
            {verifiedSkills.length === 0 ? 'Start assessment →' : 'Verify React →'}
          </Link>
        </div>
      )}

      {/* OVERALL STATS */}
      <div className="bg-navy rounded-card px-7 py-6 mb-6 flex items-center gap-6">
        {[
          { value: doneMilestones, label: 'Milestones done' },
          { value: milestones.length - doneMilestones, label: 'Remaining' },
          { value: MOCK_MATCHES.length, label: 'Matched roles' },
        ].map(({ value, label }, i, arr) => (
          <div key={label} className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-white tracking-tight">{value}</div>
              <div className="text-xs text-white/40 mt-0.5">{label}</div>
            </div>
            {i < arr.length - 1 && <div className="w-px h-10 bg-white/10" />}
          </div>
        ))}
        <div className="flex-1 ml-2">
          <p className="text-xs text-white/40 mb-2">Overall progress to first application</p>
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-yellow rounded-full" style={{ width: `${progressPct}%` }} />
          </div>
          <p className="text-[11px] text-white/30 mt-1.5">{progressPct}% complete</p>
        </div>
      </div>

      {/* TIMELINE */}
      <div>
        {milestones.map((milestone, idx) => {
          const isLast = idx === milestones.length - 1
          return (
            <div key={milestone.id} className="flex gap-0">
              <div className="flex flex-col items-center w-12 shrink-0">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-base font-bold z-10 border-2 border-[#F7F9FC] ${milestone.done ? 'bg-green-500 text-white' : milestone.active ? 'bg-blue text-white' : 'bg-white border-border text-gray-400'}`}>
                  {milestone.done ? '✓' : idx + 1}
                </div>
                {!isLast && (
                  <div className={`w-0.5 flex-1 min-h-6 ${milestone.done ? 'bg-green-400' : 'bg-border'}`} />
                )}
              </div>

              <div className={`flex-1 pl-4 ${isLast ? 'pb-0' : 'pb-8'}`}>
                <div className="flex items-center justify-between pt-2 mb-3">
                  <div>
                    <h3 className={`text-[15px] font-semibold ${milestone.done ? 'text-gray-400' : milestone.locked ? 'text-gray-300' : 'text-navy'}`}>
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-gray-400">
                      {milestone.done ? 'Completed' : milestone.active ? `${milestone.tasks.filter(t => t.done).length} of ${milestone.tasks.length} tasks complete · You're here` : milestone.locked ? `Unlocks after milestone ${idx}` : ''}
                    </p>
                  </div>
                  <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${milestone.done ? 'bg-green-100 text-green-700' : milestone.active ? 'bg-blue/10 text-blue' : 'bg-gray-100 text-gray-400 border border-border'}`}>
                    {milestone.done ? 'Done' : milestone.active ? 'In progress' : 'Locked'}
                  </span>
                </div>

                {(milestone.active || (!milestone.done && !milestone.locked)) && (
                  <div className="bg-white border border-border rounded-xl p-4">
                    {milestone.tasks.map((task, ti) => (
                      <div key={ti} className={`flex items-center gap-2.5 py-2 text-sm ${ti < milestone.tasks.length - 1 ? 'border-b border-border' : ''}`}>
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] shrink-0 ${task.done ? 'bg-green-100 text-green-600' : 'bg-gray-100 border border-border text-gray-400'}`}>
                          {task.done ? '✓' : '○'}
                        </div>
                        <span className={`flex-1 ${task.done ? 'line-through text-gray-400' : ''}`}>{task.label}</span>
                        {task.cta && !task.done && (
                          <Link href={task.cta.href} className="text-xs font-semibold text-blue hover:underline shrink-0">{task.cta.label}</Link>
                        )}
                        {task.done && <span className="text-xs text-gray-400 shrink-0">Done</span>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
