import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'

const requestSchema = z.object({
  resumeContent: z.string().min(1, 'Resume content is required'),
  jobDescription: z.string().min(1, 'Job description is required'),
})

const responseSchema = z.object({
  score: z.number().min(0).max(100),
  missingKeywords: z.array(z.string()),
  matchingKeywords: z.array(z.string()),
  suggestions: z.array(z.string()),
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

    const { resumeContent, jobDescription } = parsed.data

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY

    // Fallback if no API key is set
    if (!apiKey) {
      return NextResponse.json({
        score: 65,
        missingKeywords: ['API key missing', 'Add an API key to .env.local'],
        matchingKeywords: ['Offline mode'],
        suggestions: ['Please provide a Gemini API Key to use this feature.'],
      })
    }

    const google = createGoogleGenerativeAI({
      apiKey,
    })

    const systemPrompt = `You are a world-class executive recruiter and Applicant Tracking System (ATS) algorithm expert. 
Your task is to analyze a candidate's resume content against a provided job description.
Identify the core skills, keywords, and qualifications required by the job.
Evaluate if the resume contains these keywords and concepts.
Return a realistic ATS match score (0-100), a list of missing critical keywords, a list of successfully matched keywords, and 3 actionable suggestions to improve the resume.`

    const { object } = await generateObject({
      model: google('gemini-1.5-flash'),
      schema: responseSchema,
      system: systemPrompt,
      prompt: `==== JOB DESCRIPTION ====\n${jobDescription}\n\n==== RESUME CONTENT ====\n${resumeContent}\n\nPerform the ATS analysis now.`,
    })

    return NextResponse.json(object)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to analyze ATS'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
