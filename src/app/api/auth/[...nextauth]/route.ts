// Auth deferred — no real auth in mock-data mode
import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({ message: 'Auth not configured in demo mode' }, { status: 503 })
}

export async function POST() {
  return NextResponse.json({ message: 'Auth not configured in demo mode' }, { status: 503 })
}
