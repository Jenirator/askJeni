import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'

export const metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const student = await prisma.studentProfile.findFirst({
    where: { userId: session.user.id },
    include: {
      skills: { include: { skill: true } },
      projects: true,
      assessmentAttempts: { include: { assessment: { include: { skill: true } } } },
    },
  })

  if (!student) redirect('/register')

  return (
    <div className="p-8 max-w-[880px]">
      <h1 className="text-2xl font-bold mb-2">
        Good morning, {student.firstName} 👋
      </h1>
      <p className="text-gray-500 text-sm mb-8">
        {student.degree} · {student.institution} · Graduating {student.graduationMonth} {student.graduationYear}
      </p>
      {/* TODO: build out dashboard cards */}
      <pre className="text-xs bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify({ passportCompletion: student.passportCompletion, skills: student.skills.length }, null, 2)}
      </pre>
    </div>
  )
}
