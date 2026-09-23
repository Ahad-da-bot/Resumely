'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { TemplateId, WorkExperience, Education, Project, Achievement } from '@/types/resume'

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import {
  User,
  Briefcase,
  Phone,
  MapPin,
  Link2,
  Globe,
  FileText,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Clock,
  Layers,
  GraduationCap,
  Award,
  Code,
  Plus,
  Trash2,
  FastForward,
} from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = React.useState<0 | 1 | 2 | 3 | 4 | 5>(0)
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)
  const [isLoadingProfile, setIsLoadingProfile] = React.useState(true)
  const [userId, setUserId] = React.useState<string | null>(null)

  // Form State
  const [fullName, setFullName] = React.useState('')
  const [title, setTitle] = React.useState('')
  const [phone, setPhone] = React.useState('')
  const [location, setLocation] = React.useState('')
  const [websiteUrl, setWebsiteUrl] = React.useState('')
  const [linkedinUrl, setLinkedinUrl] = React.useState('')
  const [summary, setSummary] = React.useState(
    'Results-driven software engineer with 5+ years of experience architecting scalable distributed systems and leading high-velocity frontend initiatives.'
  )

  // Experience
  const [experiences, setExperiences] = React.useState<WorkExperience[]>([
    {
      id: '1',
      company: 'Acme Corp',
      role: 'Senior Software Engineer',
      location: 'San Francisco, CA',
      start_date: '2022',
      end_date: 'Present',
      current: true,
      bullets: [
        'Architected real-time event streaming pipeline processing 10M+ daily events.',
        'Spearheaded frontend performance optimizations, reducing page load latency by 35%.',
      ],
    },
  ])

  // Education
  const [educationList, setEducationList] = React.useState<Education[]>([
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field_of_study: 'Computer Science',
      start_date: '2016',
      end_date: '2020',
    },
  ])

  // Projects
  const [projects, setProjects] = React.useState<Project[]>([
    {
      id: '1',
      title: 'CloudSync Distributed Storage',
      link: 'https://github.com/alex/cloudsync',
      description: 'Zero-downtime offline-first synchronization engine.',
      technologies: ['TypeScript', 'Next.js', 'Supabase'],
      bullets: [],
    },
  ])

  // Skills & Achievements
  const [skills, setSkills] = React.useState<string[]>([
    'TypeScript',
    'Next.js',
    'React',
    'Supabase',
    'Tailwind CSS',
    'Node.js',
  ])
  const [skillInput, setSkillInput] = React.useState('')

  const [achievements, setAchievements] = React.useState<Achievement[]>([
    {
      id: '1',
      title: 'Global Hackathon 1st Place Winner',
      issuer: 'TechCrunch Disrupt',
      date: '2023',
    },
  ])

  // Template Picker Selection
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateId>('craftsman')

  const supabase = React.useMemo(() => createClient(), [])

  // Load existing profile if available
  React.useEffect(() => {
    async function loadUserData() {
      try {
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError || !user) {
          router.push('/auth')
          return
        }

        setUserId(user.id)
        if (user.user_metadata?.phone_number) {
          setPhone(user.user_metadata.phone_number)
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .eq('is_master', true)
          .single()

        if (profile) {
          if (profile.full_name) setFullName(profile.full_name)
          if (profile.title) setTitle(profile.title)
          if (profile.phone) setPhone(profile.phone)
          if (profile.location) setLocation(profile.location)
          if (profile.website_url) setWebsiteUrl(profile.website_url)
          if (profile.linkedin_url) setLinkedinUrl(profile.linkedin_url)
          if (profile.professional_summary || profile.summary) {
            setSummary(profile.professional_summary || profile.summary)
          }
          if (Array.isArray(profile.work_experience) && profile.work_experience.length > 0) {
            setExperiences(profile.work_experience)
          }
          if (Array.isArray(profile.education) && profile.education.length > 0) {
            setEducationList(profile.education)
          }
          if (Array.isArray(profile.projects) && profile.projects.length > 0) {
            setProjects(profile.projects)
          }
          if (Array.isArray(profile.primary_skills) && profile.primary_skills.length > 0) {
            setSkills(profile.primary_skills)
          }
        }

        // Check for dashboard upload cache
        const cached = localStorage.getItem('resumeUploadCache')
        if (cached) {
          try {
            const data = JSON.parse(cached)
            if (data.fullName) setFullName(data.fullName)
            if (data.title) setTitle(data.title)
            if (data.phone) setPhone(data.phone)
            if (data.location) setLocation(data.location)
            if (data.websiteUrl) setWebsiteUrl(data.websiteUrl)
            if (data.linkedinUrl) setLinkedinUrl(data.linkedinUrl)
            if (data.summary) setSummary(data.summary)
            if (data.experiences && data.experiences.length > 0) {
              setExperiences(data.experiences.map((exp: any, i: number) => ({
                id: String(Date.now() + i),
                company: exp.company || '',
                role: exp.role || '',
                location: exp.location || '',
                start_date: exp.start_date || '',
                end_date: exp.end_date || '',
                current: exp.end_date?.toLowerCase() === 'present',
                bullets: exp.bullets || [],
              })))
            }
            if (data.education && data.education.length > 0) {
              setEducationList(data.education.map((edu: any, i: number) => ({
                id: String(Date.now() + i),
                school: edu.school || '',
                degree: edu.degree || '',
                field_of_study: edu.field_of_study || '',
                start_date: edu.start_date || '',
                end_date: edu.end_date || '',
                bullets: edu.bullets || [],
              })))
            }
            if (data.skills && data.skills.length > 0) {
              setSkills(data.skills)
            }
            localStorage.removeItem('resumeUploadCache')
            setCurrentStep(1) // Jump straight to step 1
            toast.success('Resume Parsed', { description: 'Please review your extracted details.' })
          } catch (e) {}
        }
      } catch {
        // Fallback
      } finally {
        setIsLoadingProfile(false)
      }
    }

    loadUserData()
  }, [supabase, router])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 8 * 1024 * 1024) {
      toast.error('File too large', { description: 'Please upload a file smaller than 8MB.' })
      return
    }

    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg']
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid format', { description: 'Please upload a PDF or JPG file.' })
      return
    }

    setIsUploading(true)
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/parse-resume', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        let errMsg = 'Failed to parse resume'
        try {
          const errData = await response.json()
          if (errData.error) errMsg = errData.error
        } catch (e) {}
        throw new Error(errMsg)
      }

      const data = await response.json()

      // Populate state
      if (data.fullName) setFullName(data.fullName)
      if (data.title) setTitle(data.title)
      if (data.phone) setPhone(data.phone)
      if (data.location) setLocation(data.location)
      if (data.websiteUrl) setWebsiteUrl(data.websiteUrl)
      if (data.linkedinUrl) setLinkedinUrl(data.linkedinUrl)
      if (data.summary) setSummary(data.summary)
      
      if (data.experiences && data.experiences.length > 0) {
        setExperiences(data.experiences.map((exp: any, i: number) => ({
          id: String(Date.now() + i),
          company: exp.company || '',
          role: exp.role || '',
          location: exp.location || '',
          start_date: exp.start_date || '',
          end_date: exp.end_date || '',
          current: exp.end_date?.toLowerCase() === 'present',
          bullets: exp.bullets || [],
        })))
      }

      if (data.education && data.education.length > 0) {
        setEducationList(data.education.map((edu: any, i: number) => ({
          id: String(Date.now() + i),
          school: edu.school || '',
          degree: edu.degree || '',
          field_of_study: edu.field_of_study || '',
          start_date: edu.start_date || '',
          end_date: edu.end_date || '',
          bullets: edu.bullets || [],
        })))
      }

      if (data.skills && data.skills.length > 0) {
        setSkills(data.skills)
      }

      toast.success('Resume Parsed', { description: 'Please review your extracted details.' })
      setCurrentStep(1)
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast.error('Parse Error', { description: 'Failed to extract details. You can continue manually.' })
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = '' // reset input
    }
  }

  const handleAddSkill = () => {
    if (!skillInput.trim()) return
    if (!skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()])
    }
    setSkillInput('')
  }

  const handleRemoveSkill = (toRemove: string) => {
    setSkills(skills.filter((s) => s !== toRemove))
  }

  // Step 1 Validation
  const handleProceedFromStep1 = () => {
    if (!fullName.trim() || !title.trim()) {
      toast.error('Required Fields Missing', {
        description: 'Please enter your Full Name and Target Headline.',
      })
      return
    }
    setCurrentStep(2)
  }

  // Final Commit & Launch Studio
  const handleCompleteAndLaunch = async () => {
    if (!userId) {
      toast.error('Session Expired')
      router.push('/auth')
      return
    }

    setIsSubmitting(true)

    try {
      const profilePayload = {
        user_id: userId,
        name: 'Master Profile',
        is_master: true,
        full_name: fullName.trim() || 'Alex Morgan',
        title: title.trim() || 'Software Engineer',
        phone: phone.trim() || '+1 (555) 019-2834',
        location: location.trim() || 'San Francisco, CA',
        website_url: websiteUrl.trim() || null,
        linkedin_url: linkedinUrl.trim() || null,
        professional_summary: summary.trim(),
        summary: summary.trim(),
        years_of_experience: 4,
        primary_skills: skills,
        skills: skills.join(', '),
        work_experience: experiences,
        education: educationList,
        projects: projects,
        certifications: achievements || [],
        updated_at: new Date().toISOString(),
      }

      // Check if Master Profile already exists for this user
      const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('user_id', userId)
        .eq('is_master', true)
        .maybeSingle()

      let finalProfileId: string | null = null

      if (existingProfile?.id) {
        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', existingProfile.id)
          .select()
          .single()

        if (updateError) {
          console.error('Error updating profile:', updateError)
          throw updateError
        }
        finalProfileId = updatedProfile?.id || existingProfile.id
      } else {
        const { data: insertedProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(profilePayload)
          .select()
          .single()

        if (insertError) {
          console.error('Error inserting profile:', insertError)
          throw insertError
        }
        finalProfileId = insertedProfile?.id || null
      }

      // Create initial resume document with chosen template
      const { data: newResume, error: resumeError } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          profile_id: finalProfileId,
          title: `${title || 'Master'} - Tailored`,
          template_id: selectedTemplate,
          target_job_title: title || '',
          ats_score: 85,
          style_config: {
            font_family: selectedTemplate === 'craftsman' ? 'serif' : 'sans',
            font_size: 'medium',
            spacing: 'comfortable',
            accent_color: 'oxblood',
            show_icons: true,
          },
        })
        .select()
        .single()

      if (resumeError) {
        console.error('Error creating resume:', resumeError)
      }

      toast.success('Dossier Saved & Studio Ready!', {
        description: 'Launching live WYSIWYG editor...',
      })

      if (newResume) {
        router.push(`/resumes/${newResume.id}`)
      } else {
        router.push('/dashboard')
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to launch'
      toast.error('Error starting studio', { description: message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const progressPercentage = (currentStep / 5) * 100

  if (isLoadingProfile) {
    return (
      <main className="min-h-screen ruled-bg flex items-center justify-center text-ink">
        <div className="text-center space-y-2">
          <Loader2 className="w-6 h-6 animate-spin text-oxblood mx-auto" />
          <p className="hand text-base text-pencil">Preparing onboarding questionnaire...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen w-full py-10 px-4 md:px-8 ruled-bg text-ink relative">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header and Quick Jump */}
        <div className="space-y-2 text-center">
          <div className="flex items-center justify-center gap-2">
            <span className="label-hand text-base">
              Phase {currentStep} of 5 · {currentStep === 5 ? 'Select Template' : 'Dossier Setup'}
            </span>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">
            {currentStep === 5
              ? 'Choose Your Visual Template'
              : 'Build Your Master Career Profile'}
          </h1>

          <div className="max-w-md mx-auto space-y-2 pt-1">
            <Progress value={progressPercentage} className="h-1.5 bg-paper border border-ink/10" />
            <div className="flex justify-between items-center text-[11px] font-serif text-pencil">
              <span>Coordinates</span>
              <span>Experience</span>
              <span>Education</span>
              <span>Skills</span>
              <span>Template</span>
            </div>
          </div>

          {/* Quick Skip to Templates banner (if on phases 2, 3, or 4) */}
          {currentStep >= 2 && currentStep <= 4 && (
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setCurrentStep(5)}
                className="inline-flex items-center gap-1 text-xs text-oxblood hover:underline font-serif font-semibold bg-card px-3 py-1 rounded border border-ink/15 shadow-sm"
              >
                <FastForward className="w-3.5 h-3.5" />
                Skip remaining questions & jump straight to Template Picker (edit in WYSIWYG)
              </button>
            </div>
          )}
        </div>

        {/* Card Form Body */}
        <div className="relative">
          <div className="tape" />

          <Card className="border border-ink/15 bg-card text-ink shadow-[4px_6px_0_rgba(42,33,25,0.1)] rounded-md">
            {/* PHASE 0: UPLOAD OR MANUAL */}
            {currentStep === 0 && (
              <>
                <CardHeader className="pb-3 border-b border-dashed border-ink/10">
                  <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-ink">
                    <Sparkles className="w-4 h-4 text-oxblood" />
                    Welcome to Studio
                  </CardTitle>
                  <CardDescription className="text-pencil text-xs font-normal">
                    How would you like to build your master profile?
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-6 pt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div 
                      className="border-2 border-dashed border-ink/20 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 hover:border-oxblood/50 hover:bg-oxblood/5 transition-colors cursor-pointer relative"
                    >
                      <input 
                        type="file" 
                        accept=".pdf,.jpg,.jpeg"
                        onChange={handleFileUpload}
                        disabled={isUploading}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                      />
                      {isUploading ? (
                        <>
                          <Loader2 className="w-8 h-8 text-oxblood animate-spin" />
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-ink">Analyzing Resume...</p>
                            <p className="text-xs text-pencil">Extracting your career data with AI</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-paper rounded-full flex items-center justify-center border border-ink/10 shadow-sm">
                            <FileText className="w-6 h-6 text-oxblood" />
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm font-bold text-ink">Upload Existing Resume</p>
                            <p className="text-xs text-pencil">PDF or JPG (Max 8MB)</p>
                          </div>
                          <Badge variant="secondary" className="bg-oxblood/10 text-oxblood hover:bg-oxblood/20 border-none font-serif text-[10px]">
                            AI Powered
                          </Badge>
                        </>
                      )}
                    </div>

                    <div 
                      onClick={() => !isUploading && setCurrentStep(1)}
                      className={`border border-ink/15 rounded-lg p-6 flex flex-col items-center justify-center text-center space-y-3 bg-paper/50 hover:bg-paper transition-colors ${isUploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                      <div className="w-12 h-12 bg-card rounded-full flex items-center justify-center border border-ink/10 shadow-sm">
                        <User className="w-6 h-6 text-pencil" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-ink">Start from Scratch</p>
                        <p className="text-xs text-pencil">Fill out your profile manually</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </>
            )}

            {/* PHASE 1: COORDINATES */}
            {currentStep === 1 && (
              <>
                <CardHeader className="pb-3 border-b border-dashed border-ink/10">
                  <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-ink">
                    <User className="w-4 h-4 text-oxblood" />
                    Phase 1: Basic Information & Target Role
                  </CardTitle>
                  <CardDescription className="text-pencil text-xs font-normal">
                    Your key identity details. You can always edit or format these later on the preview.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-pencil font-medium">
                        Full Name <span className="text-oxblood">*</span>
                      </Label>
                      <Input
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Alex Morgan"
                        className="bg-paper/60 border-ink/15 text-ink text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-pencil font-medium">
                        Target Headline / Role <span className="text-oxblood">*</span>
                      </Label>
                      <Input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="e.g. Senior Software Architect"
                        className="bg-paper/60 border-ink/15 text-ink text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label className="text-xs text-pencil font-medium">Phone Number</Label>
                      <Input
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+1 (555) 019-2834"
                        className="bg-paper/60 border-ink/15 text-ink text-xs h-9"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs text-pencil font-medium">Location</Label>
                      <Input
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        placeholder="e.g. San Francisco, CA"
                        className="bg-paper/60 border-ink/15 text-ink text-xs h-9"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs text-pencil font-medium">Professional Summary</Label>
                    <Textarea
                      rows={3}
                      value={summary}
                      onChange={(e) => setSummary(e.target.value)}
                      className="bg-paper/60 border-ink/15 text-ink text-xs leading-relaxed"
                    />
                  </div>
                </CardContent>

                <CardFooter className="flex justify-end border-t border-dashed border-ink/15 pt-3">
                  <Button
                    type="button"
                    onClick={handleProceedFromStep1}
                    className="bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-sm border border-oxblood"
                  >
                    Next: Work Experience
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* PHASE 2: WORK EXPERIENCE (SKIPPABLE) */}
            {currentStep === 2 && (
              <>
                <CardHeader className="pb-3 border-b border-dashed border-ink/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-ink">
                      <Briefcase className="w-4 h-4 text-oxblood" />
                      Phase 2: Work Experience (Roles & Dates)
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(3)}
                      className="text-oxblood hover:text-oxblood/80 text-xs font-serif"
                    >
                      Skip this section →
                    </Button>
                  </div>
                  <CardDescription className="text-pencil text-xs font-normal">
                    Add your previous positions with company, location, and durations.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {experiences.map((exp, idx) => (
                    <div key={exp.id} className="p-3.5 rounded bg-paper/60 border border-ink/15 space-y-3">
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={exp.role}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].role = e.target.value
                            setExperiences(updated)
                          }}
                          placeholder="Job Title"
                          className="bg-card border-ink/15 text-xs font-bold"
                        />
                        <Input
                          value={exp.company}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].company = e.target.value
                            setExperiences(updated)
                          }}
                          placeholder="Company"
                          className="bg-card border-ink/15 text-xs"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        <Input
                          value={exp.location}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].location = e.target.value
                            setExperiences(updated)
                          }}
                          placeholder="Location (e.g. SF, CA)"
                          className="bg-card border-ink/15 text-xs"
                        />
                        <Input
                          value={exp.start_date}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].start_date = e.target.value
                            setExperiences(updated)
                          }}
                          placeholder="Start Year (2022)"
                          className="bg-card border-ink/15 text-xs"
                        />
                        <Input
                          value={exp.end_date}
                          onChange={(e) => {
                            const updated = [...experiences]
                            updated[idx].end_date = e.target.value
                            setExperiences(updated)
                          }}
                          placeholder="End Year (Present)"
                          className="bg-card border-ink/15 text-xs"
                        />
                      </div>
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setExperiences([
                        ...experiences,
                        {
                          id: String(Date.now()),
                          company: 'Previous Company',
                          role: 'Software Engineer',
                          location: 'Remote',
                          start_date: '2020',
                          end_date: '2022',
                          current: false,
                          bullets: ['Built high-throughput backend services.'],
                        },
                      ])
                    }
                    className="bg-paper border-ink/20 text-xs text-pencil hover:text-ink"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add Another Experience
                  </Button>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-dashed border-ink/15 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="bg-paper border-ink/20 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium"
                  >
                    Next: Education & Projects
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* PHASE 3: EDUCATION & PROJECTS (SKIPPABLE) */}
            {currentStep === 3 && (
              <>
                <CardHeader className="pb-3 border-b border-dashed border-ink/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-ink">
                      <GraduationCap className="w-4 h-4 text-oxblood" />
                      Phase 3: Education & Projects
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(4)}
                      className="text-oxblood hover:text-oxblood/80 text-xs font-serif"
                    >
                      Skip this section →
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {/* Education */}
                  <div className="space-y-3">
                    <Label className="text-xs font-bold text-ink">Education & Academic Achievements</Label>
                    {educationList.map((edu, idx) => (
                      <div key={edu.id} className="p-3.5 rounded bg-paper/60 border border-ink/15 space-y-2.5">
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...educationList]
                              updated[idx].degree = e.target.value
                              setEducationList(updated)
                            }}
                            placeholder="Degree (e.g. BS)"
                            className="bg-card border-ink/15 text-xs font-bold"
                          />
                          <Input
                            value={edu.field_of_study}
                            onChange={(e) => {
                              const updated = [...educationList]
                              updated[idx].field_of_study = e.target.value
                              setEducationList(updated)
                            }}
                            placeholder="Field (e.g. Computer Science)"
                            className="bg-card border-ink/15 text-xs"
                          />
                        </div>
                        <Input
                          value={edu.school}
                          onChange={(e) => {
                            const updated = [...educationList]
                            updated[idx].school = e.target.value
                            setEducationList(updated)
                          }}
                          placeholder="University / Institute"
                          className="bg-card border-ink/15 text-xs"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <Input
                            value={edu.start_date || ''}
                            onChange={(e) => {
                              const updated = [...educationList]
                              updated[idx].start_date = e.target.value
                              setEducationList(updated)
                            }}
                            placeholder="Start (e.g. 2019)"
                            className="bg-card border-ink/15 text-xs"
                          />
                          <Input
                            value={edu.end_date || ''}
                            onChange={(e) => {
                              const updated = [...educationList]
                              updated[idx].end_date = e.target.value
                              setEducationList(updated)
                            }}
                            placeholder="Graduation (e.g. 2023)"
                            className="bg-card border-ink/15 text-xs"
                          />
                        </div>

                        {/* Optional Academic Achievements Bullets */}
                        <div className="pt-1 space-y-1.5">
                          <span className="text-[11px] font-medium text-pencil flex items-center gap-1">
                            Academic Highlights & Honors (Optional)
                          </span>
                          {(edu.bullets || []).map((bullet, bIdx) => (
                            <div key={bIdx} className="flex gap-1.5 items-center">
                              <Input
                                value={bullet}
                                onChange={(e) => {
                                  const updated = [...educationList]
                                  const updatedBullets = [...(updated[idx].bullets || [])]
                                  updatedBullets[bIdx] = e.target.value
                                  updated[idx].bullets = updatedBullets
                                  setEducationList(updated)
                                }}
                                placeholder="e.g. Dean's Honor List, Summa Cum Laude, GPA 3.9/4.0"
                                className="bg-card border-ink/15 text-xs h-7 flex-1"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const updated = [...educationList]
                                  updated[idx].bullets = (updated[idx].bullets || []).filter(
                                    (_, i) => i !== bIdx
                                  )
                                  setEducationList(updated)
                                }}
                                className="h-7 w-7 p-0 text-pencil hover:text-oxblood"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updated = [...educationList]
                              updated[idx].bullets = [
                                ...(updated[idx].bullets || []),
                                '',
                              ]
                              setEducationList(updated)
                            }}
                            className="h-6 px-2 text-[10px] bg-paper border-ink/20 text-pencil hover:text-ink"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add Academic Bullet
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Projects */}
                  <div className="space-y-2 pt-2">
                    <Label className="text-xs font-bold text-ink">Featured Projects</Label>
                    {projects.map((proj, idx) => (
                      <div key={proj.id} className="p-3 rounded bg-paper/60 border border-ink/15 space-y-2">
                        <Input
                          value={proj.title}
                          onChange={(e) => {
                            const updated = [...projects]
                            updated[idx].title = e.target.value
                            setProjects(updated)
                          }}
                          placeholder="Project Title"
                          className="bg-card border-ink/15 text-xs font-bold"
                        />
                        <Input
                          value={proj.description}
                          onChange={(e) => {
                            const updated = [...projects]
                            updated[idx].description = e.target.value
                            setProjects(updated)
                          }}
                          placeholder="Short description..."
                          className="bg-card border-ink/15 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-dashed border-ink/15 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(2)}
                    className="bg-paper border-ink/20 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(4)}
                    className="bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium"
                  >
                    Next: Skills & Honors
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* PHASE 4: SKILLS & ACHIEVEMENTS (SKIPPABLE) */}
            {currentStep === 4 && (
              <>
                <CardHeader className="pb-3 border-b border-dashed border-ink/10">
                  <div className="flex items-center justify-between">
                    <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-ink">
                      <Code className="w-4 h-4 text-oxblood" />
                      Phase 4: Skills & Achievements
                    </CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setCurrentStep(5)}
                      className="text-oxblood hover:text-oxblood/80 text-xs font-serif"
                    >
                      Skip to Template Picker →
                    </Button>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  {/* Skills */}
                  <div className="space-y-2">
                    <Label className="text-xs font-bold text-ink">Primary Skills</Label>
                    <div className="flex gap-2">
                      <Input
                        value={skillInput}
                        onChange={(e) => setSkillInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault()
                            handleAddSkill()
                          }
                        }}
                        placeholder="Type skill & press Enter"
                        className="bg-paper/60 border-ink/15 text-xs h-8"
                      />
                      <Button
                        type="button"
                        size="sm"
                        onClick={handleAddSkill}
                        className="bg-paper border-ink/20 text-ink hover:bg-card text-xs h-8"
                      >
                        Add
                      </Button>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-2.5 py-0.5 rounded bg-paper border border-ink/15 text-xs font-mono font-medium flex items-center gap-1.5"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => handleRemoveSkill(skill)}
                            className="text-pencil hover:text-oxblood"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Achievements */}
                  <div className="space-y-2 pt-2">
                    <Label className="text-xs font-bold text-ink">Honors & Certifications</Label>
                    {achievements.map((ach, idx) => (
                      <div key={ach.id} className="p-3 rounded bg-paper/60 border border-ink/15 grid grid-cols-2 gap-2">
                        <Input
                          value={ach.title}
                          onChange={(e) => {
                            const updated = [...achievements]
                            updated[idx].title = e.target.value
                            setAchievements(updated)
                          }}
                          placeholder="Honor / Award Title"
                          className="bg-card border-ink/15 text-xs font-bold"
                        />
                        <Input
                          value={ach.issuer}
                          onChange={(e) => {
                            const updated = [...achievements]
                            updated[idx].issuer = e.target.value
                            setAchievements(updated)
                          }}
                          placeholder="Awarding Organization"
                          className="bg-card border-ink/15 text-xs"
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-dashed border-ink/15 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(3)}
                    className="bg-paper border-ink/20 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(5)}
                    className="bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium"
                  >
                    Next: Choose Template
                    <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </CardFooter>
              </>
            )}

            {/* PHASE 5: TEMPLATE PICKER & LAUNCH */}
            {currentStep === 5 && (
              <>
                <CardHeader className="pb-3 border-b border-dashed border-ink/10">
                  <CardTitle className="font-serif text-lg font-bold flex items-center gap-2 text-ink">
                    <Sparkles className="w-4 h-4 text-mustard" />
                    Phase 5: Pick Your Resume Aesthetic
                  </CardTitle>
                  <CardDescription className="text-pencil text-xs font-normal">
                    Select a template to immediately open in the WYSIWYG studio with double-click in-place editing.
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4 pt-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Craftsman */}
                    <div
                      onClick={() => setSelectedTemplate('craftsman')}
                      className={`p-4 rounded border cursor-pointer transition-all space-y-1.5 ${
                        selectedTemplate === 'craftsman'
                          ? 'border-oxblood bg-paper shadow-md ring-2 ring-oxblood/30'
                          : 'border-ink/15 bg-card hover:border-ink/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-ink">
                          📜 Craftsman Editorial
                        </span>
                        {selectedTemplate === 'craftsman' && (
                          <Badge className="bg-oxblood text-card text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-pencil leading-snug">
                        Warm parchment background, Fraunces serif typography, editorial pen accents.
                      </p>
                    </div>

                    {/* Modern Minimal */}
                    <div
                      onClick={() => setSelectedTemplate('modern-minimal')}
                      className={`p-4 rounded border cursor-pointer transition-all space-y-1.5 ${
                        selectedTemplate === 'modern-minimal'
                          ? 'border-oxblood bg-paper shadow-md ring-2 ring-oxblood/30'
                          : 'border-ink/15 bg-card hover:border-ink/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-sans font-bold text-sm text-ink">
                          💼 Modern Minimalist
                        </span>
                        {selectedTemplate === 'modern-minimal' && (
                          <Badge className="bg-oxblood text-card text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-pencil leading-snug">
                        High-density, crisp sans-serif grid, optimized for tech & modern recruiters.
                      </p>
                    </div>

                    {/* Tech Linear */}
                    <div
                      onClick={() => setSelectedTemplate('tech-mono')}
                      className={`p-4 rounded border cursor-pointer transition-all space-y-1.5 ${
                        selectedTemplate === 'tech-mono'
                          ? 'border-oxblood bg-paper shadow-md ring-2 ring-oxblood/30'
                          : 'border-ink/15 bg-card hover:border-ink/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-sm text-ink">
                          ⚡ Technical Linear
                        </span>
                        {selectedTemplate === 'tech-mono' && (
                          <Badge className="bg-oxblood text-card text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-pencil leading-snug">
                        Monospace headers, syntax-inspired tags, engineered for developers.
                      </p>
                    </div>

                    {/* Executive Serif */}
                    <div
                      onClick={() => setSelectedTemplate('executive-serif')}
                      className={`p-4 rounded border cursor-pointer transition-all space-y-1.5 ${
                        selectedTemplate === 'executive-serif'
                          ? 'border-oxblood bg-paper shadow-md ring-2 ring-oxblood/30'
                          : 'border-ink/15 bg-card hover:border-ink/30'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-serif font-bold text-sm text-ink uppercase">
                          🏛️ Executive Classic
                        </span>
                        {selectedTemplate === 'executive-serif' && (
                          <Badge className="bg-oxblood text-card text-[10px]">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-pencil leading-snug">
                        Formal centered headers and traditional rules for corporate leadership.
                      </p>
                    </div>
                  </div>
                </CardContent>

                <CardFooter className="flex justify-between border-t border-dashed border-ink/15 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(1)}
                    className="bg-paper border-ink/20 text-xs"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 mr-1" />
                    Back
                  </Button>
                  <Button
                    type="button"
                    disabled={isSubmitting}
                    onClick={handleCompleteAndLaunch}
                    className="bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-md border border-oxblood h-9 px-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                        Launching WYSIWYG Editor...
                      </>
                    ) : (
                      <>
                        Open WYSIWYG Editor with Selected Template
                        <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                      </>
                    )}
                  </Button>
                </CardFooter>
              </>
            )}
          </Card>
        </div>
      </div>
    </main>
  )
}
