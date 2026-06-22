import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/students — employer browse (authenticated employers only)
export async function GET(request: Request) {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const { searchParams } = new URL(request.url)
  const city = searchParams.get('city')
  const salaryMax = searchParams.get('salaryMax')
  const graduationYear = searchParams.get('graduationYear')

  const students = await prisma.studentProfile.findMany({
    where: {
      ...(city ? { city: { contains: city, mode: 'insensitive' } } : {}),
      ...(salaryMax ? { salaryExpectation: { lte: parseInt(salaryMax) } } : {}),
      ...(graduationYear ? { graduationYear: parseInt(graduationYear) } : {}),
    },
    include: {
      skills: { include: { skill: true } },
      _count: { select: { profileViews: true } },
    },
    orderBy: { passportCompletion: 'desc' },
    take: 50,
  })

  return NextResponse.json(students)
}
