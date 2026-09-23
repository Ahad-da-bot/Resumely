import { z } from 'zod'

export const contactInfoSchema = z.object({
  full_name: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(100, 'Full name is too long'),
  title: z
    .string()
    .min(1, 'Job title is required')
    .max(100, 'Title is too long'),
  phone: z
    .string()
    .min(1, 'Phone number is required')
    .max(25, 'Phone number is too long'),
  location: z
    .string()
    .min(1, 'Location (city/country) is required')
    .max(100, 'Location is too long'),
  website_url: z
    .string()
    .url('Please enter a valid website URL')
    .or(z.literal(''))
    .optional(),
  linkedin_url: z
    .string()
    .url('Please enter a valid LinkedIn URL')
    .or(z.literal(''))
    .optional(),
})

export type ContactInfoInput = z.infer<typeof contactInfoSchema>

export const summarySchema = z.object({
  professional_summary: z
    .string()
    .min(20, 'Professional summary must be at least 20 characters long')
    .max(1000, 'Professional summary cannot exceed 1000 characters'),
  years_of_experience: z.coerce
    .number({
      invalid_type_error: 'Years of experience must be a valid number',
    })
    .min(0, 'Years of experience must be 0 or greater'),
  primary_skills: z
    .array(z.string().min(1, 'Skill name cannot be empty'))
    .min(1, 'Please provide at least one primary skill'),
})

export type SummaryInput = z.infer<typeof summarySchema>

export const onboardingSchema = contactInfoSchema.merge(summarySchema)

export type OnboardingInput = z.infer<typeof onboardingSchema>
