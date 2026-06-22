import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/assessments — list available assessments for the student
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const assessments = await prisma.assessment.findMany({
    where: { isPublished: true },
    include: { skill: true, _count: { select: { questions: true } } },
    orderBy: { title: 'asc' },
  })

  return NextResponse.json(assessments)
}
