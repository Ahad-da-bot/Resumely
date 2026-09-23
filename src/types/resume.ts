export interface WorkExperience {
  id: string
  company: string
  role: string
  location: string
  start_date: string
  end_date: string
  current: boolean
  bullets: string[]
}

export interface Education {
  id: string
  school: string
  degree: string
  field_of_study: string
  start_date: string
  end_date: string
  gpa?: string
  bullets?: string[]
}

export interface Project {
  id: string
  title: string
  link?: string
  description: string
  technologies: string[]
  bullets: string[]
}

export interface Achievement {
  id: string
  title: string
  issuer: string
  date: string
  description?: string
}

export interface Certification {
  id: string
  name: string
  issuer: string
  issue_date: string
  url?: string
}

export interface Profile {
  id: string
  user_id: string
  name: string
  is_master: boolean
  full_name: string
  title: string
  phone: string
  email?: string
  location: string
  website_url?: string | null
  linkedin_url?: string | null
  professional_summary: string
  summary?: string
  years_of_experience: number
  primary_skills: string[]
  skills?: string
  work_experience: WorkExperience[]
  education: Education[]
  projects: Project[]
  achievements?: Achievement[]
  certifications: Certification[]
  created_at?: string
  updated_at?: string
}

export interface Folder {
  id: string
  user_id: string
  name: string
  color: string
  created_at: string
}

export type TemplateId =
  | 'craftsman'
  | 'modern-minimal'
  | 'tech-mono'
  | 'executive-serif'

export type ResumeSectionKey =
  | 'summary'
  | 'experience'
  | 'projects'
  | 'education'
  | 'skills'
  | 'achievements'

export interface StyleConfig {
  font_family: 'serif' | 'sans' | 'mono'
  font_size: 'small' | 'medium' | 'large'
  spacing: 'compact' | 'comfortable'
  accent_color: 'oxblood' | 'sage' | 'mustard' | 'ink' | 'navy'
  show_icons: boolean
  section_order?: ResumeSectionKey[]
  hidden_sections?: ResumeSectionKey[]
}

export interface ResumeContentOverrides {
  full_name?: string
  title?: string
  phone?: string
  email?: string
  location?: string
  website_url?: string
  linkedin_url?: string
  professional_summary?: string
  primary_skills?: string[]
  work_experience?: WorkExperience[]
  education?: Education[]
  projects?: Project[]
  achievements?: Achievement[]
  certifications?: Certification[]
}

export interface Resume {
  id: string
  user_id: string
  profile_id: string | null
  folder_id: string | null
  title: string
  template_id: TemplateId
  target_job_title: string
  target_job_description: string
  ats_score: number
  content_overrides: ResumeContentOverrides
  style_config: StyleConfig
  created_at: string
  updated_at: string
  profile?: Profile
  folder?: Folder
}
