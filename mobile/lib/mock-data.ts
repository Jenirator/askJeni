export const MOCK_STUDENT = {
  name: 'Thabo Nkosi',
  degree: 'BSc Computer Science',
  institution: 'University of the Witwatersrand',
  passportCompletion: 83,
  city: 'Johannesburg',
  salaryExpectation: 'R22,000–R26,000',
  availableFrom: 'Jan 2025',
}

export const MOCK_SKILLS = [
  { id: '1', name: 'React',       level: 'VERIFIED' },
  { id: '2', name: 'Python',      level: 'VERIFIED' },
  { id: '3', name: 'JavaScript',  level: 'VERIFIED' },
  { id: '4', name: 'Node.js',     level: 'VERIFIED' },
  { id: '5', name: 'TypeScript',  level: 'LEARNING' },
  { id: '6', name: 'SQL',         level: 'LEARNING' },
]

export const MOCK_MATCHES = [
  { id: '1', role: 'Junior Software Engineer',  company: 'Peach Payments',  city: 'Cape Town',     score: 94 },
  { id: '2', role: 'Graduate Developer',        company: 'Takealot',        city: 'Johannesburg',  score: 88 },
  { id: '3', role: 'Software Engineer Intern',  company: 'FNB Tech',        city: 'Johannesburg',  score: 82 },
  { id: '4', role: 'Frontend Developer',        company: 'Yoco',            city: 'Cape Town',     score: 78 },
  { id: '5', role: 'React Developer',           company: 'Discovery',       city: 'Johannesburg',  score: 75 },
  { id: '6', role: 'Full Stack Intern',         company: 'Naspers',         city: 'Cape Town',     score: 71 },
]

export const MOCK_ASSESSMENTS = [
  { id: '1', title: 'Python & Data Structures', score: 91, completed: true,  minutes: 20 },
  { id: '2', title: 'React & Frontend Fundamentals', score: null, completed: false, minutes: 18 },
  { id: '3', title: 'SQL & Database Design',    score: null, completed: false, minutes: 15 },
  { id: '4', title: 'System Design Basics',     score: null, completed: false, minutes: 25 },
]

export const CHECKLIST = [
  { label: 'Add your institution & degree', done: true  },
  { label: 'Select your tech stack',        done: true  },
  { label: 'Add your first project',        done: false },
  { label: 'Set salary & availability',     done: true  },
  { label: 'Verify at least one skill',     done: false },
  { label: 'Add a second project',          done: false },
]
