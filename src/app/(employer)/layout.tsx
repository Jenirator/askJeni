import Link from 'next/link'

export default function EmployerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#F7F9FC]">
      <nav className="bg-navy h-[52px] flex items-center justify-between px-8 sticky top-0 z-50">
        <Link href="/" className="text-white font-bold text-lg tracking-tight">askJeni</Link>
        <div className="flex items-center gap-4">
          <span className="text-[11px] font-semibold bg-yellow/15 border border-yellow/30 text-yellow px-2.5 py-0.5 rounded-full">Employer view</span>
          <Link href="/" className="text-sm text-white/50 hover:text-white">For students</Link>
          <Link href="#" className="text-sm text-white/50 hover:text-white">How it works</Link>
          <Link href="#" className="bg-blue text-white text-sm font-semibold px-4 py-2 rounded-btn hover:opacity-90">Post a role</Link>
        </div>
      </nav>
      {children}
    </div>
  )
}
