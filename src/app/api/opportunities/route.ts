import { NextResponse } from 'next/server'
import { MOCK_MATCHES } from '@/lib/mock-data'

export async function GET() {
  return NextResponse.json(MOCK_MATCHES)
}

export async function POST() {
  return NextResponse.json({ message: 'Not yet implemented' }, { status: 501 })
}
