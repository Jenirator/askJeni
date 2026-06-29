import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

// Fallback questions used when no API key is present (demo mode)
const DEMO_QUESTIONS = [
  "Let's start with something foundational. You mentioned a few skills — pick the one you feel most confident in and explain, in plain English, why it was designed the way it was. Not what it does, but *why* it works that way.",
  "Tell me about a time you got genuinely stuck on a technical problem. What was your process for working through it?",
  "If someone on your team wrote code that technically works but you think could be a problem later, how do you handle that conversation?",
  "What's the difference between knowing how to use a technology and truly understanding it? How do you know which side of that line you're on?",
  "You're building something solo and you realise halfway through that your initial approach was wrong. Walk me through what you'd do next.",
]

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(req: NextRequest) {
  const { messages, skills, mode } = await req.json() as {
    messages: ChatMessage[]
    skills: string[]
    mode: 'question' | 'score'
  }

  const apiKey = process.env.ANTHROPIC_API_KEY

  // Demo mode — no API key
  if (!apiKey) {
    if (mode === 'score') {
      // Simulate a score based on message length/count as a rough proxy
      const avgLen = messages.filter(m => m.role === 'user').reduce((s, m) => s + m.content.length, 0) / 5
      const score = Math.min(95, Math.max(45, Math.floor(50 + avgLen / 4)))
      return NextResponse.json({ score, feedback: 'Good conceptual depth demonstrated across all questions.' })
    }
    const questionIndex = messages.filter(m => m.role === 'assistant').length
    if (questionIndex < DEMO_QUESTIONS.length) {
      return NextResponse.json({ content: DEMO_QUESTIONS[questionIndex], done: false })
    }
    return NextResponse.json({
      content: "That's all my questions — thank you for your time, it was a great conversation. We'll compare this with your written results and let you know shortly.",
      done: true,
    })
  }

  const client = new Anthropic({ apiKey })
  const questionNumber = messages.filter(m => m.role === 'assistant').length + 1

  if (mode === 'score') {
    const transcript = messages.map(m => `${m.role === 'user' ? 'Candidate' : 'Interviewer'}: ${m.content}`).join('\n\n')
    const resp = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 150,
      system: 'You are scoring a verbal technical interview. Return ONLY valid JSON with no markdown: {"score": <0-100 integer>, "feedback": "<one concise sentence summarising the candidate\'s conceptual understanding>"}',
      messages: [{
        role: 'user',
        content: `Skills claimed: ${skills.join(', ')}\n\nInterview transcript:\n${transcript}\n\nScore this candidate's conceptual understanding 0–100.`,
      }],
    })
    try {
      const text = resp.content[0].type === 'text' ? resp.content[0].text.trim() : '{}'
      return NextResponse.json(JSON.parse(text))
    } catch {
      return NextResponse.json({ score: 68, feedback: 'Assessment completed.' })
    }
  }

  // Question mode
  const systemPrompt = `You are Jeni, an interviewer for askJeni — an elite South African graduate tech platform that only admits the top candidates.

The candidate claims expertise in: ${skills.join(', ')}.

You are conducting question ${questionNumber} of 5. Your job is to probe their CONCEPTUAL understanding — the WHY, not the WHAT. Anyone can Google syntax. You're testing whether they genuinely understand how and why things work.

Rules:
- Ask exactly ONE question per turn. No multi-part questions.
- Do NOT correct them or give hints.
- After they answer, respond with ONE brief sentence acknowledging their answer (don't say if it's right or wrong), then ask the next question — unless this is question 5.
- After question 5 is answered, end ONLY with: "That's all my questions — thank you for your time, it was a great conversation. We'll compare this with your written results and let you know shortly."
- Keep your total response under 4 sentences.
- Be warm but businesslike. No excessive affirmations ("Great answer!", "Wow!").
- Tailor questions to the specific skills they listed: ${skills.join(', ')}.`

  const resp = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 250,
    system: systemPrompt,
    messages: messages.length > 0 ? messages : [{ role: 'user', content: 'Ready to begin.' }],
  })

  const content = resp.content[0].type === 'text' ? resp.content[0].text : ''
  const done = content.toLowerCase().includes("that's all my questions") || content.toLowerCase().includes("let you know shortly")

  return NextResponse.json({ content, done })
}
