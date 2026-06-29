import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <Logo size={20} />
        <div className="flex items-center gap-6">
          <a href="#how-it-works" className="text-sm text-gray-500 hover:text-navy transition-colors">How it works</a>
          <a href="#for-employers" className="text-sm text-gray-500 hover:text-navy transition-colors">For employers</a>
          <a href="#for-grads" className="text-sm text-gray-500 hover:text-navy transition-colors">For grads</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="text-sm font-semibold text-gray-600 hover:text-navy transition-colors">
            Student login
          </Link>
          <Link href="/employer-dashboard"
            className="bg-navy text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90 transition-opacity">
            Employer portal →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 bg-[#F7F9FC]">
        <div className="inline-flex items-center gap-2 bg-blue/10 text-blue text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue" />
          Built for the South African graduate market
        </div>
        <h1 className="text-5xl font-black text-navy leading-tight max-w-[720px] mb-5">
          Stop screening CVs.<br />Start hiring graduates<br />
          <span className="text-blue">who can actually do the job.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-[540px] leading-relaxed mb-10">
          askJeni replaces the CV inbox with verified skills profiles. Candidates prove their abilities — you see structured, comparable data instead of a pile of PDFs.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/employer-dashboard"
            className="bg-navy text-white font-bold px-7 py-3.5 rounded-btn hover:opacity-90 transition-opacity text-sm">
            I'm hiring → See the employer portal
          </Link>
          <Link href="/join"
            className="border border-gray-200 text-navy font-bold px-7 py-3.5 rounded-btn hover:border-blue/40 transition-colors text-sm">
            I'm a grad → Apply to join askJeni
          </Link>
        </div>
        <p className="text-xs text-gray-400 mt-5">Demo mode · No signup needed · Explore both portals freely</p>
      </section>

      {/* Problem strip */}
      <section className="border-y border-gray-100 bg-white px-8 py-10">
        <div className="max-w-[900px] mx-auto grid grid-cols-3 gap-8">
          {[
            { stat: '78%', label: 'of SA grads say their CV doesn\'t reflect their actual skills' },
            { stat: '4.2×', label: 'longer to fill graduate roles when screening unstructured CVs' },
            { stat: '1 in 3', label: 'qualified candidates rejected before the first human sees them' },
          ].map(({ stat, label }) => (
            <div key={stat} className="text-center">
              <p className="text-4xl font-black text-navy mb-2">{stat}</p>
              <p className="text-sm text-gray-400 leading-relaxed">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="px-8 py-20 bg-[#F7F9FC]">
        <div className="max-w-[900px] mx-auto">
          <p className="text-xs font-bold text-blue uppercase tracking-widest text-center mb-3">How it works</p>
          <h2 className="text-3xl font-black text-navy text-center mb-14">One platform. Two portals. Zero CVs.</h2>

          <div className="grid grid-cols-2 gap-6">

            {/* Employer side */}
            <div id="for-employers" className="bg-navy rounded-2xl p-8 text-white">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-sm">🏢</span>
                <p className="text-sm font-bold text-white/60 uppercase tracking-wider">For employers</p>
              </div>
              <div className="flex flex-col gap-6">
                {[
                  { n: '1', title: 'Post a role in minutes', body: 'Describe the role, pick the skills you need, set a minimum passport score. Your unique apply link goes live instantly.' },
                  { n: '2', title: 'Candidates apply via Skills Passport', body: 'No CVs. Each applicant\'s verified skills, assessments, and projects arrive in your pipeline as a structured profile.' },
                  { n: '3', title: 'Review, rank, and hire', body: 'The pipeline auto-ranks New applicants by passport score. Open any profile to compare side-by-side, then move them through stages or schedule an interview.' },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-yellow flex items-center justify-center text-navy text-xs font-black shrink-0 mt-0.5">{n}</div>
                    <div>
                      <p className="font-bold text-sm mb-1">{title}</p>
                      <p className="text-white/50 text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/employer-dashboard"
                className="mt-8 flex items-center justify-center gap-2 bg-yellow text-navy text-sm font-bold py-3 rounded-btn hover:opacity-90 transition-opacity">
                Open employer portal →
              </Link>
            </div>

            {/* Grad side */}
            <div id="for-grads" className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="w-7 h-7 rounded-lg bg-blue/10 flex items-center justify-center text-sm">🎓</span>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-wider">For graduates</p>
              </div>
              <div className="flex flex-col gap-6">
                {[
                  { n: '1', title: 'Build your Skills Passport', body: 'List your stack, take short skill assessments, add your projects and GitHub links. Your passport score is a verified signal of your actual ability.' },
                  { n: '2', title: 'Get matched to roles', body: 'Your passport is automatically matched against open roles in the Opportunities tab. The higher your score, the higher you rank.' },
                  { n: '3', title: 'Apply in one tap', body: 'Your passport pre-fills every application. Answer a few screening questions and submit — no cover letter, no CV formatting.' },
                ].map(({ n, title, body }) => (
                  <div key={n} className="flex gap-4">
                    <div className="w-7 h-7 rounded-full bg-blue flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5">{n}</div>
                    <div>
                      <p className="font-bold text-sm text-navy mb-1">{title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/join"
                className="mt-8 flex items-center justify-center gap-2 bg-blue text-white text-sm font-bold py-3 rounded-btn hover:opacity-90 transition-opacity">
                Apply to join askJeni →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Demo CTA */}
      <section className="px-8 py-20 bg-white border-t border-gray-100">
        <div className="max-w-[640px] mx-auto text-center">
          <h2 className="text-3xl font-black text-navy mb-4">Try the full demo</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            No signup needed. Explore the employer pipeline, post a role, or apply as a student and watch your application land in the pipeline in real time.
          </p>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/employer-dashboard"
              className="bg-navy text-white font-bold px-6 py-4 rounded-2xl hover:opacity-90 transition-opacity text-sm flex flex-col items-center gap-1">
              <span>Employer demo</span>
              <span className="text-white/50 font-normal text-xs">Post roles · Review pipeline · Schedule interviews</span>
            </Link>
            <Link href="/join"
              className="border border-gray-200 text-navy font-bold px-6 py-4 rounded-2xl hover:border-blue/40 transition-colors text-sm flex flex-col items-center gap-1">
              <span>Grad admissions demo</span>
              <span className="text-gray-400 font-normal text-xs">Written test · AI verbal interview · Instant result</span>
            </Link>
          </div>
          <p className="text-xs text-gray-300 mt-6">
            Or go to{' '}
            <Link href="/apply/peach-payments/junior-software-engineer" className="hover:text-blue transition-colors underline underline-offset-2">
              a live apply portal
            </Link>
            {' '}to see the candidate experience
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 flex items-center justify-between text-xs text-gray-400">
        <Logo size={14} />
        <p>South Africa's graduate hiring platform · Demo build</p>
        <div className="flex items-center gap-4">
          <Link href="/employer-dashboard" className="hover:text-navy transition-colors">Employers</Link>
          <Link href="/dashboard" className="hover:text-navy transition-colors">Students</Link>
          <Link href="/apply/peach-payments/junior-software-engineer" className="hover:text-navy transition-colors">Apply portal</Link>
        </div>
      </footer>

    </div>
  )
}
