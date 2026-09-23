import { z } from 'zod'

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, 'Company name is required'),
  role: z.string().min(1, 'Job title/role is required'),
  location: z.string().default(''),
  start_date: z.string().min(1, 'Start date is required'),
  end_date: z.string().default('Present'),
  current: z.boolean().default(false),
  bullets: z.array(z.string()).default([]),
})

export const educationSchema = z.object({
  id: z.string(),
  school: z.string().min(1, 'School/University is required'),
  degree: z.string().min(1, 'Degree is required'),
  field_of_study: z.string().default(''),
  start_date: z.string().default(''),
  end_date: z.string().default(''),
  gpa: z.string().optional(),
})

export const projectSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Project title is required'),
  link: z.string().url('Invalid URL').or(z.literal('')).optional(),
  description: z.string().default(''),
  technologies: z.array(z.string()).default([]),
  bullets: z.array(z.string()).default([]),
})

export const certificationSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Certification name is required'),
  issuer: z.string().min(1, 'Issuer organization is required'),
  issue_date: z.string().default(''),
  url: z.string().url('Invalid URL').or(z.literal('')).optional(),
})

export const profileSchema = z.object({
  name: z.string().min(1, 'Profile name is required (e.g. Master Profile, DevOps Specialist)'),
  is_master: z.boolean().default(false),
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  title: z.string().min(1, 'Target job title is required'),
  phone: z.string().min(1, 'Phone number is required'),
  location: z.string().min(1, 'Location is required'),
  website_url: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  linkedin_url: z.string().url('Invalid URL').or(z.literal('')).optional().nullable(),
  professional_summary: z.string().min(20, 'Summary must be at least 20 characters'),
  years_of_experience: z.coerce.number().min(0),
  primary_skills: z.array(z.string().min(1)).min(1, 'At least one skill is required'),
  work_experience: z.array(workExperienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  certifications: z.array(certificationSchema).default([]),
})

export type ProfileInput = z.infer<typeof profileSchema>
