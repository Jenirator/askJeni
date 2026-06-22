import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

// GET /api/opportunities — student matched opportunities
export async function GET() {
  const session = await auth()
  if (!session) return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })

  const opportunities = await prisma.opportunity.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      employer: true,
      skills: { include: { skill: true } },
      _count: { select: { matches: true } },
    },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(opportunities)
}

// POST /api/opportunities — employer creates a role
export async function POST(request: Request) {
  const session = await auth()
  if (!session || session.user.role !== 'EMPLOYER') {
    return NextResponse.json({ error: 'Unauthorised' }, { status: 401 })
  }

  const body = await request.json()
  // TODO: validate with zod, create opportunity
  return NextResponse.json({ message: 'Not yet implemented' }, { status: 501 })
}
