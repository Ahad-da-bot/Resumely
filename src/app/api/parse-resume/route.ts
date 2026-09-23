import { NextRequest, NextResponse } from 'next/server'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { generateObject } from 'ai'
import { z } from 'zod'
import pdfParse from 'pdf-parse-new'

const responseSchema = z.object({
  fullName: z.string().default(''),
  title: z.string().default(''),
  phone: z.string().default(''),
  location: z.string().default(''),
  websiteUrl: z.string().default(''),
  linkedinUrl: z.string().default(''),
  summary: z.string().default(''),
  experiences: z.array(
    z.object({
      company: z.string().default(''),
      role: z.string().default(''),
      location: z.string().default(''),
      start_date: z.string().default(''),
      end_date: z.string().default(''),
      bullets: z.array(z.string()).default([]),
    })
  ).default([]),
  education: z.array(
    z.object({
      school: z.string().default(''),
      degree: z.string().default(''),
      field_of_study: z.string().default(''),
      start_date: z.string().default(''),
      end_date: z.string().default(''),
      bullets: z.array(z.string()).default([]),
    })
  ).default([]),
  skills: z.array(z.string()).default([]),
})

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: 'File size exceeds 8MB' }, { status: 400 })
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDF and JPG are supported.' }, { status: 400 })
    }

    const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 })
    }

    const google = createGoogleGenerativeAI({ apiKey })

    const buffer = Buffer.from(await file.arrayBuffer())

    let aiContent: any[] = [
      { type: 'text', text: 'Extract the resume details into the provided structured schema. Be accurate and pull out all relevant information. For titles, use a clear target job title based on their experience if one is not explicitly stated at the top.' }
    ]

    if (file.type === 'application/pdf') {
      const pdfData = await pdfParse(buffer)
      aiContent.push({ type: 'text', text: `\n\n--- RESUME TEXT ---\n${pdfData.text}` })
    } else {
      aiContent.push({ type: 'image', image: buffer })
    }

    const { object } = await generateObject({
      model: google('gemini-3.5-flash'),
      schema: responseSchema,
      messages: [
        {
          role: 'user',
          content: aiContent
        }
      ]
    })

    return NextResponse.json(object)
  } catch (error: any) {
    console.error('Error parsing resume:', error?.message || error, error?.stack)
    return NextResponse.json({ error: error?.message || 'Failed to parse resume' }, { status: 500 })
  }
}
