// Central type exports for askJeni
// These extend or re-export Prisma-generated types with UI-friendly shapes.

import type {
  User,
  StudentProfile,
  EmployerProfile,
  Skill,
  StudentSkill,
  Project,
  Assessment,
  AssessmentAttempt,
  Opportunity,
  Match,
  SkillLevel,
  WorkType,
  WorkLocation,
  SkillCategory,
} from '@prisma/client'

export type {
  User,
  StudentProfile,
  EmployerProfile,
  Skill,
  StudentSkill,
  Project,
  Assessment,
  AssessmentAttempt,
  Opportunity,
  Match,
  SkillLevel,
  WorkType,
  WorkLocation,
  SkillCategory,
}

// Student profile with all relations loaded (used in passport, public profile)
export type StudentProfileFull = StudentProfile & {
  user: Pick<User, 'email' | 'name'>
  skills: (StudentSkill & { skill: Skill })[]
  projects: Project[]
  assessmentAttempts: (AssessmentAttempt & { assessment: Assessment & { skill: Skill } })[]
  _count: { profileViews: number }
}

// Opportunity with employer and skills
export type OpportunityFull = Opportunity & {
  employer: EmployerProfile
  skills: { skill: Skill; isRequired: boolean }[]
  _count: { matches: number }
}

// Match with opportunity
export type MatchWithOpportunity = Match & {
  opportunity: OpportunityFull
}

// Candidate card data (employer browse view)
export type CandidateCard = Pick<
  StudentProfile,
  | 'id'
  | 'slug'
  | 'firstName'
  | 'lastName'
  | 'institution'
  | 'degree'
  | 'graduationMonth'
  | 'graduationYear'
  | 'city'
  | 'province'
  | 'salaryExpectation'
  | 'availableFrom'
  | 'workTypePreferences'
  | 'workLocationPrefs'
  | 'passportCompletion'
  | 'avatarColor'
> & {
  skills: (StudentSkill & { skill: Pick<Skill, 'id' | 'name' | 'category'> })[]
  _count: { profileViews: number }
}

// Five recruiter scan signals (used in signal band component)
export type SignalBand = {
  location: { city: string; province: string }
  salary: number
  graduation: { month: string; year: number; institution: string }
  topSkills: { name: string; verified: boolean }[]
  availability: { from: Date; workLocations: WorkLocation[] }
}
