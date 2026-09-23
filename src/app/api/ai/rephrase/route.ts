import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

const requestSchema = z.object({
  text: z.string().min(1, 'Text is required'),
  action: z.enum(['quantify', 'senior', 'punchy', 'ats', 'custom']),
  jobDescription: z.string().optional(),
  customPrompt: z.string().optional(),
})

const responseSchema = z.object({
  suggestions: z.array(
    z.object({
      id: z.string(),
      text: z.string(),
      rationale: z.string(),
      impactScore: z.number().min(1).max(100),
    })
  ),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = requestSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid request data', details: parsed.error.format() },
        { status: 400 }
      )
    }

    const { text, action, jobDescription, customPrompt } = parsed.data

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY

    // Fallback if no API key is set yet in offline dev mode
    if (!apiKey) {
      return NextResponse.json({
        suggestions: [
          {
            id: '1',
            text: `Spearheaded ${text.toLowerCase()} resulting in a 34% increase in throughput and reduced latency by 120ms.`,
            rationale: 'Added quantifiable metrics and active action verbs.',
            impactScore: 94,
          },
          {
            id: '2',
            text: `Architected and scaled ${text.toLowerCase()} across multi-region infrastructure, driving high availability for 250k+ daily users.`,
            rationale: 'Elevated scope to senior architectural leadership.',
            impactScore: 91,
          },
          {
            id: '3',
            text: `Optimized ${text.toLowerCase()} to accelerate delivery cycles and streamline cross-functional workflows.`,
            rationale: 'Concise, high-impact phrasing suitable for ATS parsing.',
            impactScore: 88,
          },
        ],
      })
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    })

    let instruction = ''
    switch (action) {
      case 'quantify':
        instruction =
          'Rewrite the resume bullet point by embedding realistic, high-impact quantifiable metrics, percentages, latency drops, revenue gains, or user scale.'
        break
      case 'senior':
        instruction =
          'Elevate the tone to a Staff/Principal/Senior leader level. Focus on architectural decision-making, team empowerment, and business outcomes.'
        break
      case 'punchy':
        instruction =
          'Make the bullet point concise, punchy, and direct. Begin with an assertive past-tense action verb (e.g. Spearheaded, Engineered, Orchestrated).'
        break
      case 'ats':
        instruction = `Optimize this bullet point to pass automated ATS screening algorithms. Seamlessly weave in relevant keywords.`
        break
      case 'custom':
        instruction = `Follow this custom user direction carefully: "${customPrompt || ''}".`
        break
    }

    if (jobDescription) {
      instruction += `\nCRITICAL CONTEXT: Subtly align the phrasing and keywords with this target job description: "${jobDescription}"`
    }

    const systemPrompt = `You are a world-class executive resume writer and ATS optimization specialist. 
Your goal is to rephrase resume bullet points into punchy, metric-driven achievements that wow hiring managers and pass ATS screeners.
Always provide exactly 3 distinct, compelling options with a brief rationale and estimated impact score.`

    const { object } = await generateObject({
      model: google('gemini-3.5-flash'),
      schema: responseSchema,
      system: systemPrompt,
      prompt: `Original Bullet Point: "${text}"\n\nTask: ${instruction}`,
    })

    return NextResponse.json(object)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to rephrase bullet point'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
