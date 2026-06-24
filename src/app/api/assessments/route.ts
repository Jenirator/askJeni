import { NextResponse } from 'next/server'
import { MOCK_ASSESSMENTS_AVAILABLE, MOCK_ASSESSMENTS_COMPLETED } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json({ completed: MOCK_ASSESSMENTS_COMPLETED, available: MOCK_ASSESSMENTS_AVAILABLE })
}
