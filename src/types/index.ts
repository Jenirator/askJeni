// Central type exports for askJeni (mock-data mode — no Prisma)

export type SkillLevel = 'LEARNING' | 'CONFIDENT' | 'VERIFIED'
export type WorkType = 'FULL_TIME' | 'PART_TIME' | 'INTERNSHIP' | 'CONTRACT'
export type WorkLocation = 'REMOTE' | 'IN_OFFICE' | 'HYBRID'

export type SignalBand = {
  location: { city: string; province: string }
  salary: number
  graduation: { month: string; year: number; institution: string }
  topSkills: { name: string; verified: boolean }[]
  availability: { from: string; workLocations: string[] }
}
