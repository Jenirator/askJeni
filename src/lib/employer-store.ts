'use client'

// Stores employer "Express Interest" actions in localStorage.
// In production this would be a DB record that triggers a student notification.

export type InterestRecord = {
  id: string
  candidateSlug: string
  candidateName: string
  companyName: string
  roleName: string
  message: string
  sentAt: string
  status: 'pending' | 'accepted' | 'declined'
}

const KEY = 'askjeni_interests'

export function getInterests(): InterestRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as InterestRecord[]) : []
  } catch {
    return []
  }
}

export function saveInterest(record: Omit<InterestRecord, 'id' | 'sentAt' | 'status'>): InterestRecord {
  const interests = getInterests()
  const newRecord: InterestRecord = {
    ...record,
    id: `int-${Date.now()}`,
    sentAt: new Date().toISOString(),
    status: 'pending',
  }
  localStorage.setItem(KEY, JSON.stringify([...interests, newRecord]))
  return newRecord
}

export function hasExpressedInterest(candidateSlug: string): boolean {
  return getInterests().some(i => i.candidateSlug === candidateSlug)
}

export function acceptInterest(id: string): void {
  const interests = getInterests()
  const updated = interests.map(i => i.id === id ? { ...i, status: 'accepted' as const } : i)
  localStorage.setItem(KEY, JSON.stringify(updated))
}

export function declineInterest(id: string): void {
  const interests = getInterests()
  const updated = interests.map(i => i.id === id ? { ...i, status: 'declined' as const } : i)
  localStorage.setItem(KEY, JSON.stringify(updated))
}
