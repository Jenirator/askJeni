'use client'

// Local persistence for the student profile.
// Stored in localStorage under the key "askjeni_student".
// Replace with a real DB call when the backend is ready.

export type StoredStudent = {
  firstName: string
  lastName: string
  email: string
  institution: string
  degree: string
  yearOfStudy: string
  graduationDate: string
  city: string
  githubUsername: string
  salaryExpectation: number
  availableFrom: string
  workTypes: string[]
  workLocations: string[]
  skills: Record<string, 'learning' | 'confident'>
  passportCompletion: number
  createdAt: string
}

const KEY = 'askjeni_student'

export function saveStudent(data: StoredStudent): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(KEY, JSON.stringify(data))
}

export function loadStudent(): StoredStudent | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as StoredStudent) : null
  } catch {
    return null
  }
}

export function clearStudent(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEY)
}

export function computeCompletion(data: Partial<StoredStudent>): number {
  let score = 0
  if (data.institution && data.degree) score += 10
  if (data.salaryExpectation && data.availableFrom) score += 15
  const skillCount = Object.keys(data.skills ?? {}).length
  if (skillCount >= 4) score += 15
  // Projects come later — award 0 for now
  const verified = Object.values(data.skills ?? {}).filter(v => v === 'confident').length
  if (verified >= 1) score += 15
  return Math.min(score, 100)
}
