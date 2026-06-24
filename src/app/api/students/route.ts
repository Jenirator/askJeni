import { NextResponse } from 'next/server'
import { MOCK_STUDENT, MOCK_SKILLS, MOCK_CANDIDATES } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({ student: MOCK_STUDENT, skills: MOCK_SKILLS, candidates: MOCK_CANDIDATES })
}
