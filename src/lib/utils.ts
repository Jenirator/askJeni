import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Merge Tailwind classes safely (handles conflicts)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format Rand amounts: 22000 → "R22 000"
export function formatRand(amount: number): string {
  return 'R' + amount.toLocaleString('en-ZA').replace(/,/g, ' ')
}

// Passport completion: compute from StudentProfile data
export function computePassportCompletion(profile: {
  institution: string
  degree: string
  salaryExpectation: number
  availableFrom: Date | null
  skills: { level: string }[]
  projects: unknown[]
}): number {
  let score = 0
  if (profile.institution && profile.degree) score += 10
  if (profile.salaryExpectation && profile.availableFrom) score += 15
  if (profile.skills.length >= 4) score += 15
  if (profile.projects.length >= 1) score += 20
  const verified = profile.skills.filter((s) => s.level === 'VERIFIED')
  if (verified.length >= 1) score += 15
  if (profile.projects.length >= 2) score += 10
  if (verified.length >= 2) score += 15
  return Math.min(score, 100)
}

// Match score between student and opportunity (simplified)
export function computeMatchScore(params: {
  studentSkills: { skillId: string; level: string }[]
  requiredSkills: { skillId: string; isRequired: boolean }[]
  studentSalary: number
  opportunitySalaryMin: number
  opportunitySalaryMax: number
  studentAvailableFrom: Date
  opportunityStartDate: Date
  studentWorkLocations: string[]
  opportunityWorkLocation: string
}): number {
  let score = 0

  // Salary match (25 points)
  if (
    params.studentSalary >= params.opportunitySalaryMin &&
    params.studentSalary <= params.opportunitySalaryMax
  ) {
    score += 25
  } else if (params.studentSalary <= params.opportunitySalaryMax * 1.1) {
    score += 12
  }

  // Skills match (50 points)
  const required = params.requiredSkills.filter((s) => s.isRequired)
  const studentSkillIds = new Set(params.studentSkills.map((s) => s.skillId))
  const matched = required.filter((s) => studentSkillIds.has(s.skillId))
  score += required.length > 0 ? Math.round((matched.length / required.length) * 50) : 25

  // Availability (15 points)
  if (params.studentAvailableFrom <= params.opportunityStartDate) score += 15

  // Work location (10 points)
  if (params.studentWorkLocations.includes(params.opportunityWorkLocation)) score += 10

  return Math.min(score, 100)
}

// Slugify a name for public profiles
export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}
