import Link from 'next/link'

export default function PublicNav() {
  return (
    <nav className="h-16 bg-navy flex items-center justify-between px-8">
      <span className="text-white font-bold text-lg">askJeni</span>
      <div className="flex items-center gap-4">
        <Link href="/login" className="text-white/70 text-sm hover:text-white">
          Sign in
        </Link>
        <Link
          href="/register"
          className="bg-blue text-white text-sm px-4 py-2 rounded-btn hover:opacity-90"
        >
          Create passport →
        </Link>
      </div>
    </nav>
  )
}
