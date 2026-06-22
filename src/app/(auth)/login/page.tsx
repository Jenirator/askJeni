export const metadata = { title: 'Sign in' }

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0D1B2A]">
      <div className="bg-white rounded-card p-8 w-full max-w-sm shadow-modal">
        <h1 className="text-xl font-bold mb-6">Sign in to askJeni</h1>
        {/* TODO: wire up NextAuth signIn */}
        <form className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue"
          />
          <input
            type="password"
            placeholder="Password"
            className="h-10 px-3 border border-border rounded-btn text-sm outline-none focus:border-blue"
          />
          <button
            type="submit"
            className="h-10 bg-blue text-white rounded-btn text-sm font-semibold"
          >
            Sign in
          </button>
        </form>
        <p className="text-xs text-gray-400 mt-4 text-center">
          No account? <a href="/register" className="text-blue">Create your passport →</a>
        </p>
      </div>
    </div>
  )
}
