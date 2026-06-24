import Link from 'next/link'
import Logo from '@/components/Logo'

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] flex flex-col items-center justify-center px-6">

      {/* Logo */}
      <div className="mb-12 text-center">
        <h1><Logo size={36} /></h1>
        <p className="text-gray-400 text-sm mt-2">South Africa's graduate hiring platform</p>
      </div>

      {/* Portal cards */}
      <div className="grid grid-cols-2 gap-5 w-full max-w-[560px]">

        {/* Student */}
        <Link
          href="/dashboard"
          className="group bg-white border border-border rounded-2xl p-7 hover:border-blue/40 hover:shadow-md transition-all flex flex-col"
        >
          <div className="w-12 h-12 rounded-2xl bg-blue/10 flex items-center justify-center text-2xl mb-5">
            🎓
          </div>
          <h2 className="text-lg font-bold text-navy mb-1">I'm a student</h2>
          <p className="text-sm text-gray-400 leading-relaxed flex-1">
            Build your Skills Passport, take assessments, and get matched to graduate roles.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-blue text-sm font-semibold">
            Go to student dashboard
            <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </div>
        </Link>

        {/* Employer */}
        <Link
          href="/employer-dashboard"
          className="group bg-navy border border-transparent rounded-2xl p-7 hover:opacity-95 transition-all flex flex-col"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl mb-5">
            🏢
          </div>
          <h2 className="text-lg font-bold text-white mb-1">I'm an employer</h2>
          <p className="text-sm text-white/50 leading-relaxed flex-1">
            Replace your CV inbox. Post a role, generate an apply link, review structured applications.
          </p>
          <div className="mt-5 flex items-center gap-1.5 text-yellow text-sm font-semibold">
            Go to employer dashboard
            <span className="group-hover:translate-x-0.5 transition-transform inline-block">→</span>
          </div>
        </Link>
      </div>

      {/* Demo note */}
      <p className="text-xs text-gray-300 mt-10">
        Demo mode · No account needed
      </p>

    </main>
  )
}
