// npm run db:seed
// Seeds the database with skills master list and the Thabo demo student.

import { PrismaClient, SkillCategory, SkillLevel, WorkType, WorkLocation, GraduationMonth } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱  Seeding askJeni database...')

  // -------------------------------------------------------------------------
  // SKILLS MASTER LIST
  // -------------------------------------------------------------------------
  const skills = [
    // Languages
    { name: 'JavaScript', category: SkillCategory.LANGUAGE },
    { name: 'TypeScript', category: SkillCategory.LANGUAGE },
    { name: 'Python', category: SkillCategory.LANGUAGE },
    { name: 'Java', category: SkillCategory.LANGUAGE },
    { name: 'C++', category: SkillCategory.LANGUAGE },
    { name: 'C#', category: SkillCategory.LANGUAGE },
    { name: 'Go', category: SkillCategory.LANGUAGE },
    { name: 'Rust', category: SkillCategory.LANGUAGE },
    { name: 'PHP', category: SkillCategory.LANGUAGE },
    { name: 'Kotlin', category: SkillCategory.LANGUAGE },
    { name: 'R', category: SkillCategory.LANGUAGE },
    // Frontend
    { name: 'React', category: SkillCategory.FRONTEND },
    { name: 'Next.js', category: SkillCategory.FRONTEND },
    { name: 'Vue.js', category: SkillCategory.FRONTEND },
    { name: 'Angular', category: SkillCategory.FRONTEND },
    { name: 'Tailwind CSS', category: SkillCategory.FRONTEND },
    { name: 'HTML/CSS', category: SkillCategory.FRONTEND },
    { name: 'React Native', category: SkillCategory.MOBILE },
    // Backend
    { name: 'Node.js', category: SkillCategory.BACKEND },
    { name: 'Express.js', category: SkillCategory.BACKEND },
    { name: 'FastAPI', category: SkillCategory.BACKEND },
    { name: 'Django', category: SkillCategory.BACKEND },
    { name: 'Spring Boot', category: SkillCategory.BACKEND },
    { name: 'GraphQL', category: SkillCategory.BACKEND },
    { name: 'REST APIs', category: SkillCategory.BACKEND },
    // Databases
    { name: 'PostgreSQL', category: SkillCategory.DATABASE },
    { name: 'MySQL', category: SkillCategory.DATABASE },
    { name: 'MongoDB', category: SkillCategory.DATABASE },
    { name: 'Redis', category: SkillCategory.DATABASE },
    { name: 'SQL', category: SkillCategory.DATABASE },
    // Infrastructure
    { name: 'Docker', category: SkillCategory.INFRASTRUCTURE },
    { name: 'Git', category: SkillCategory.INFRASTRUCTURE },
    { name: 'Linux', category: SkillCategory.INFRASTRUCTURE },
    { name: 'AWS', category: SkillCategory.INFRASTRUCTURE },
    { name: 'GCP', category: SkillCategory.INFRASTRUCTURE },
    { name: 'CI/CD', category: SkillCategory.INFRASTRUCTURE },
    // Data & ML
    { name: 'Pandas', category: SkillCategory.DATA_ML },
    { name: 'TensorFlow', category: SkillCategory.DATA_ML },
    { name: 'Machine Learning', category: SkillCategory.DATA_ML },
  ]

  for (const skill of skills) {
    await prisma.skill.upsert({
      where: { name: skill.name },
      update: {},
      create: skill,
    })
  }
  console.log(`✓  ${skills.length} skills upserted`)

  // -------------------------------------------------------------------------
  // DEMO STUDENT: Thabo Nkosi
  // -------------------------------------------------------------------------
  const hashedPassword = await bcrypt.hash('demo1234', 12)

  const thaboUser = await prisma.user.upsert({
    where: { email: 'thabo@students.wits.ac.za' },
    update: {},
    create: {
      email: 'thabo@students.wits.ac.za',
      name: 'Thabo Nkosi',
      role: 'STUDENT',
      accounts: {
        create: {
          type: 'credentials',
          provider: 'credentials',
          providerAccountId: 'thabo@students.wits.ac.za',
        },
      },
    },
  })

  const reactSkill = await prisma.skill.findUnique({ where: { name: 'React' } })
  const pythonSkill = await prisma.skill.findUnique({ where: { name: 'Python' } })
  const jsSkill = await prisma.skill.findUnique({ where: { name: 'JavaScript' } })
  const nodeSkill = await prisma.skill.findUnique({ where: { name: 'Node.js' } })
  const tsSkill = await prisma.skill.findUnique({ where: { name: 'TypeScript' } })
  const pgSkill = await prisma.skill.findUnique({ where: { name: 'PostgreSQL' } })
  const dockerSkill = await prisma.skill.findUnique({ where: { name: 'Docker' } })
  const fastapiSkill = await prisma.skill.findUnique({ where: { name: 'FastAPI' } })

  const thabo = await prisma.studentProfile.upsert({
    where: { slug: 'thabo-nkosi' },
    update: {},
    create: {
      userId: thaboUser.id,
      slug: 'thabo-nkosi',
      firstName: 'Thabo',
      lastName: 'Nkosi',
      bio: 'Final-year CS student at Wits with a background in full-stack development. I build tools that solve real South African problems.',
      institution: 'University of the Witwatersrand',
      degree: 'BSc Computer Science',
      yearOfStudy: 3,
      graduationMonth: GraduationMonth.NOVEMBER,
      graduationYear: 2025,
      city: 'Johannesburg',
      province: 'Gauteng',
      salaryExpectation: 22000,
      availableFrom: new Date('2026-01-01'),
      willingToRelocate: true,
      workTypePreferences: [WorkType.FULL_TIME, WorkType.INTERNSHIP, WorkType.CONTRACT],
      workLocationPrefs: [WorkLocation.HYBRID, WorkLocation.REMOTE],
      githubUrl: 'https://github.com/thabonkosi',
      passportCompletion: 83,
    },
  })

  // Skills
  const studentSkills = [
    { skillId: reactSkill!.id, level: SkillLevel.VERIFIED },
    { skillId: pythonSkill!.id, level: SkillLevel.VERIFIED },
    { skillId: jsSkill!.id, level: SkillLevel.VERIFIED },
    { skillId: nodeSkill!.id, level: SkillLevel.VERIFIED },
    { skillId: tsSkill!.id, level: SkillLevel.LEARNING },
    { skillId: pgSkill!.id, level: SkillLevel.LEARNING },
    { skillId: dockerSkill!.id, level: SkillLevel.LEARNING },
    { skillId: fastapiSkill!.id, level: SkillLevel.LEARNING },
  ]

  for (const s of studentSkills) {
    await prisma.studentSkill.upsert({
      where: { studentId_skillId: { studentId: thabo.id, skillId: s.skillId } },
      update: { level: s.level },
      create: { studentId: thabo.id, ...s },
    })
  }

  // Projects
  await prisma.project.upsert({
    where: { id: 'proj-loadshedding' },
    update: {},
    create: {
      id: 'proj-loadshedding',
      studentId: thabo.id,
      name: 'SA Load Shedding Tracker',
      description:
        'Real-time Eskom load shedding schedule tracker with push notifications and area-based search. 1 200+ GitHub stars.',
      githubUrl: 'https://github.com/thabonkosi/sa-loadshedding-tracker',
      starCount: 1243,
    },
  })

  await prisma.project.upsert({
    where: { id: 'proj-studysync' },
    update: {},
    create: {
      id: 'proj-studysync',
      studentId: thabo.id,
      name: 'StudySync',
      description:
        'Real-time collaborative study platform. Students create shared study rooms, sync notes, and track progress together.',
      githubUrl: 'https://github.com/thabonkosi/studysync',
    },
  })

  console.log('✓  Demo student Thabo Nkosi created (thabo@students.wits.ac.za / demo1234)')
  console.log('\n✅  Seed complete')
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
