import Link from 'next/link'
import Logo from '@/components/Logo'

export default function AskJeniAgainPage() {
  return (
    <div className="min-h-screen bg-white flex flex-col">

      {/* Nav */}
      <nav className="border-b border-gray-100 px-8 py-4 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
        <Logo size={20} />
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-navy transition-colors">
            ← Back home
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center text-center px-6 pt-20 pb-16 bg-[#F7F9FC] flex-1 justify-center">
        <div className="inline-flex items-center gap-2 bg-blue/10 text-blue text-xs font-semibold px-3 py-1.5 rounded-full mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-blue" />
          askJeniAgain
        </div>
        <h1 className="text-5xl font-black text-navy leading-tight max-w-[720px] mb-5">
          Ask Jeni.<br /><span className="text-blue">Then ask again.</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-[540px] leading-relaxed mb-10">
          A fresh askJeni page — ready to build on. Drop your content here and wire it into the rest of the platform.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/employer-dashboard"
            className="bg-navy text-white font-bold px-7 py-3.5 rounded-btn hover:opacity-90 transition-opacity text-sm">
            Employer portal →
          </Link>
          <Link href="/join"
            className="border border-gray-200 text-navy font-bold px-7 py-3.5 rounded-btn hover:border-blue/40 transition-colors text-sm">
            Apply to join askJeni
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 px-8 py-6 flex items-center justify-between text-xs text-gray-400">
        <Logo size={14} />
        <p>South Africa's graduate hiring platform · Demo build</p>
        <Link href="/" className="hover:text-navy transition-colors">Home</Link>
      </footer>

    </div>
  )
}
