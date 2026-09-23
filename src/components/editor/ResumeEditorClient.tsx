'use client'

import * as React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useResumeStore } from '@/lib/store/useResumeStore'
import { Profile, Resume, Folder, TemplateId, WorkExperience, Education, Project, Achievement } from '@/types/resume'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
import dynamic from 'next/dynamic'

import { CraftsmanTemplate } from '@/components/templates/CraftsmanTemplate'
import { ModernMinimalTemplate } from '@/components/templates/ModernMinimalTemplate'
import { TechLinearTemplate } from '@/components/templates/TechLinearTemplate'
import { ExecutiveSerifTemplate } from '@/components/templates/ExecutiveSerifTemplate'
import { InlineAIRewriter } from '@/components/editor/InlineAIRewriter'
import { ResumePDFDocument } from '@/components/templates/ResumePDFDocument'
import { ResumeRibbon } from '@/components/editor/ResumeRibbon'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  Download,
  Save,
  ArrowLeft,
  Plus,
  Trash2,
  FileText,
  User,
  GraduationCap,
  Award,
  Code,
  Sliders,
  Target,
  Loader2,
  FolderIcon,
  Briefcase,
  ArrowUp,
  ArrowDown,
  GripVertical,
} from 'lucide-react'

// Dynamically import PDFDownloadLink to prevent SSR hydration issues
const PDFDownloadLink = dynamic(
  () => import('@react-pdf/renderer').then((mod) => mod.PDFDownloadLink),
  { ssr: false }
)

interface ResumeEditorClientProps {
  resumeId: string
  initialResume: Resume | null
  profiles: Profile[]
  folders: Folder[]
  userId: string
}

export function ResumeEditorClient({
  resumeId,
  initialResume,
  profiles,
  folders,
  userId,
}: ResumeEditorClientProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const profileIdQuery = searchParams.get('profileId')

  const {
    activeProfile,
    activeResume,
    selectedTemplate,
    styleConfig,
    targetJobDescription,
    atsScore,
    isSaving,
    setActiveProfile,
    setActiveResume,
    setSelectedTemplate,
    setStyleConfig,
    setSectionOrder,
    moveSection,
    toggleSectionVisibility,
    setTargetJobDescription,
    setAtsScore,
    setIsSaving,
    updateBasicInfo,
    addWorkExperience,
    updateWorkExperience,
    removeWorkExperience,
    updateBulletPoint,
    addBulletPoint,
    removeBulletPoint,
    addEducation,
    updateEducation,
    removeEducation,
    addEducationBullet,
    updateEducationBullet,
    removeEducationBullet,
    addProject,
    updateProject,
    removeProject,
    addAchievement,
    updateAchievement,
    removeAchievement,
    addSkill,
    removeSkill,
  } = useResumeStore()

  const [activeTab, setActiveTab] = React.useState<'content' | 'ats' | 'design'>('content')
  const [selectedFolderId, setSelectedFolderId] = React.useState<string | null>(
    initialResume?.folder_id || null
  )
  const [resumeTitle, setResumeTitle] = React.useState<string>(
    initialResume?.title || 'Tailored Resume'
  )
  const [skillInput, setSkillInput] = React.useState('')
  const [activeAIExperienceId, setActiveAIExperienceId] = React.useState<string | null>(null)
  const [activeAIBulletIndex, setActiveAIBulletIndex] = React.useState<number | null>(null)
  const [isClientReady, setIsClientReady] = React.useState(false)
  const [isRibbonVisible, setIsRibbonVisible] = React.useState(false)
  const [deepAtsLoading, setDeepAtsLoading] = React.useState(false)
  const [deepAtsReport, setDeepAtsReport] = React.useState<{score: number, missingKeywords: string[], matchingKeywords: string[], suggestions: string[]} | null>(null)

  const supabase = React.useMemo(() => createClient(), [])

  React.useEffect(() => {
    setIsClientReady(true)

    if (initialResume) {
      setActiveResume(initialResume)
      if (initialResume.profile) {
        setActiveProfile(initialResume.profile)
      } else if (profiles.length > 0) {
        const found = profiles.find((p) => p.id === initialResume.profile_id) || profiles[0]
        setActiveProfile(found)
      }
    } else {
      const targetProfile =
        profiles.find((p) => p.id === profileIdQuery) ||
        profiles.find((p) => p.is_master) ||
        profiles[0] ||
        null

      if (targetProfile) {
        setActiveProfile(targetProfile)
        setResumeTitle(`${targetProfile.name || 'Master'} - Tailored`)
      } else {
        // Create an in-memory starter profile if no profiles exist
        const starterProfile: Profile = {
          id: '',
          user_id: userId,
          name: 'Master Profile',
          is_master: true,
          full_name: 'Alex Morgan',
          title: 'Software Engineer',
          phone: '+1 (555) 019-2834',
          location: 'San Francisco, CA',
          professional_summary:
            'Results-driven software engineer with 5+ years of experience architecting scalable distributed systems and leading high-velocity frontend initiatives.',
          years_of_experience: 5,
          primary_skills: ['TypeScript', 'React', 'Next.js', 'Node.js', 'Tailwind CSS'],
          work_experience: [
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
          ],
          education: [
            {
              id: '1',
              school: 'University of California, Berkeley',
              degree: 'Bachelor of Science',
              field_of_study: 'Computer Science',
              start_date: '2016',
              end_date: '2020',
              bullets: ["Dean's Honor List, Cum Laude graduate"],
            },
          ],
          projects: [
            {
              id: '1',
              title: 'CloudSync Distributed Storage',
              description: 'Zero-downtime offline-first synchronization engine.',
              technologies: ['TypeScript', 'Next.js', 'Supabase'],
              bullets: [],
            },
          ],
          achievements: [
            {
              id: '1',
              title: 'Global Hackathon 1st Place Winner',
              issuer: 'TechCrunch Disrupt',
              date: '2023',
            },
          ],
          certifications: [],
        }
        setActiveProfile(starterProfile)
        setResumeTitle('Master Profile - Tailored')
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const calculateATS = React.useCallback(
    (jobDesc: string, profile: Profile | null) => {
      if (!jobDesc || !profile) return 75
      const words = jobDesc.toLowerCase().match(/\b[a-z]{4,}\b/g) || []
      
      const stopWords = ['with', 'that', 'this', 'from', 'have', 'will', 'your', 'about', 'they', 'their', 'what', 'which', 'when', 'where', 'also', 'some', 'any', 'could', 'should', 'would', 'the', 'and', 'for', 'are', 'not', 'you']
      const filteredWords = words.filter(w => !stopWords.includes(w))
      
      if (filteredWords.length === 0) return 75

      const profileContent = [
        profile.title,
        profile.professional_summary,
        ...(profile.primary_skills || []),
        ...(profile.work_experience || []).flatMap((e) => [e.role, ...(e.bullets || [])]),
      ]
        .join(' ')
        .toLowerCase()

      let matchCount = 0
      const uniqueWords = Array.from(new Set(filteredWords))
      uniqueWords.forEach((word) => {
        if (profileContent.includes(word)) matchCount++
      })

      const score = Math.min(
        98,
        Math.max(45, Math.round((matchCount / Math.min(uniqueWords.length, 30)) * 100))
      )
      return score
    },
    []
  )

  React.useEffect(() => {
    if (activeProfile && targetJobDescription) {
      setAtsScore(calculateATS(targetJobDescription, activeProfile))
    }
  }, [activeProfile, targetJobDescription, calculateATS, setAtsScore])

  const runDeepAtsAnalysis = async () => {
    if (!activeProfile || !targetJobDescription) {
      toast.error('Missing job description or profile')
      return
    }
    setDeepAtsLoading(true)
    try {
      const profileContent = [
        activeProfile.title,
        activeProfile.professional_summary,
        ...(activeProfile.primary_skills || []),
        ...(activeProfile.work_experience || []).flatMap((e) => [e.role, ...(e.bullets || [])]),
      ].join(' ')

      const res = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeContent: profileContent, jobDescription: targetJobDescription }),
      })
      if (!res.ok) throw new Error('Failed ATS analysis')
      const data = await res.json()
      setDeepAtsReport(data)
      setAtsScore(data.score)
    } catch (err) {
      toast.error('Deep ATS failed')
    } finally {
      setDeepAtsLoading(false)
    }
  }

  const handleJobDescChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setTargetJobDescription(e.target.value)
  }

  const isValidUUID = (str?: string | null): boolean => {
    if (!str) return false
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str.trim())
  }

  const handleSaveResume = async () => {
    if (!activeProfile) {
      toast.error('No profile selected')
      return
    }

    setIsSaving(true)

    try {
      // 0. Always save a local backup copy to localStorage
      try {
        if (typeof window !== 'undefined') {
          localStorage.setItem(
            'resumely_local_draft',
            JSON.stringify({
              profile: activeProfile,
              title: resumeTitle,
              template: selectedTemplate,
              styleConfig,
              targetJobDescription,
              savedAt: new Date().toISOString(),
            })
          )
        }
      } catch (localErr) {
        console.warn('Local draft backup failed:', localErr)
      }

      // 1. Verify active authentication session for Cloud persistence
      const {
        data: { user },
      } = await supabase.auth.getUser()

      const currentUserId = user?.id || (isValidUUID(userId) ? userId : null)

      if (!currentUserId) {
        toast.success('Dossier Saved to Device!', {
          description: 'Local backup preserved. Sign in to sync with the Supabase cloud.',
        })
        setIsSaving(false)
        return
      }

      // 2. Ensure Profile is persisted / updated in Supabase
      let profileIdToSave: string | null = isValidUUID(activeProfile.id) ? activeProfile.id : null

      // Clean payload adhering strictly to Supabase profiles schema
      const profilePayload = {
        user_id: currentUserId,
        name: activeProfile.name || 'Master Profile',
        is_master: activeProfile.is_master ?? true,
        full_name: activeProfile.full_name || '',
        title: activeProfile.title || '',
        phone: activeProfile.phone || '',
        location: activeProfile.location || '',
        website_url: activeProfile.website_url || null,
        linkedin_url: activeProfile.linkedin_url || null,
        professional_summary: activeProfile.professional_summary || '',
        summary: activeProfile.summary || activeProfile.professional_summary || '',
        years_of_experience: Number(activeProfile.years_of_experience) || 0,
        primary_skills: Array.isArray(activeProfile.primary_skills)
          ? activeProfile.primary_skills
          : [],
        skills: Array.isArray(activeProfile.primary_skills)
          ? activeProfile.primary_skills.join(', ')
          : activeProfile.skills || '',
        work_experience: Array.isArray(activeProfile.work_experience)
          ? activeProfile.work_experience
          : [],
        education: Array.isArray(activeProfile.education)
          ? activeProfile.education
          : [],
        projects: Array.isArray(activeProfile.projects)
          ? activeProfile.projects
          : [],
        certifications:
          Array.isArray(activeProfile.certifications) && activeProfile.certifications.length > 0
            ? activeProfile.certifications
            : Array.isArray(activeProfile.achievements)
            ? activeProfile.achievements
            : [],
        updated_at: new Date().toISOString(),
      }

      if (profileIdToSave) {
        // Try updating existing profile
        const { error: pError } = await supabase
          .from('profiles')
          .update(profilePayload)
          .eq('id', profileIdToSave)
          .eq('user_id', currentUserId)

        if (pError) {
          console.warn('Profile update fallback to insert:', pError)
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .insert(profilePayload)
            .select()
            .single()

          if (insertError) throw insertError
          profileIdToSave = newProfile.id
          setActiveProfile({
            ...(newProfile as Profile),
            achievements: (newProfile as any).achievements || (newProfile as any).certifications || [],
          })
        }
      } else {
        // Insert new profile
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert(profilePayload)
          .select()
          .single()

        if (insertError) throw insertError
        profileIdToSave = newProfile.id
        setActiveProfile({
          ...(newProfile as Profile),
          achievements: (newProfile as any).achievements || (newProfile as any).certifications || [],
        })
      }

      // 3. Persist Resume in Supabase
      const cleanFolderId = isValidUUID(selectedFolderId) ? selectedFolderId : null
      const cleanProfileId = isValidUUID(profileIdToSave) ? profileIdToSave : null

      const resumePayload = {
        user_id: currentUserId,
        profile_id: cleanProfileId,
        folder_id: cleanFolderId,
        title: resumeTitle.trim() || 'Untitled Resume',
        template_id: selectedTemplate,
        target_job_title: activeProfile.title || '',
        target_job_description: targetJobDescription || '',
        ats_score: atsScore || 0,
        content_overrides: {},
        style_config: styleConfig,
        updated_at: new Date().toISOString(),
      }

      const validResumeId = isValidUUID(resumeId) ? resumeId : null

      if (validResumeId) {
        const { error: rError } = await supabase
          .from('resumes')
          .update(resumePayload)
          .eq('id', validResumeId)
          .eq('user_id', currentUserId)

        if (rError) throw rError
        toast.success('Resume & Profile Saved!', { description: 'All changes synced to cloud.' })
      } else {
        const { data: newRes, error: rInsertError } = await supabase
          .from('resumes')
          .insert(resumePayload)
          .select()
          .single()

        if (rInsertError) throw rInsertError
        toast.success('Resume Created & Saved!')
        if (newRes) {
          router.push(`/resumes/${newRes.id}`)
        }
      }
    } catch (err: unknown) {
      const pErr = err as Record<string, any>
      const message =
        pErr?.message ||
        pErr?.error_description ||
        pErr?.details ||
        (err instanceof Error ? err.message : 'Save completed with local backup.')

      console.error('Save resume notice:', {
        message,
        details: pErr?.details,
        hint: pErr?.hint,
        code: pErr?.code,
      })
      toast.info('Saved locally', { description: message })
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddExperience = () => {
    const newExp: WorkExperience = {
      id: crypto.randomUUID(),
      company: 'Company Name',
      role: 'Position Title',
      location: 'City, State',
      start_date: '',
      end_date: 'Present',
      current: true,
      bullets: ['Spearheaded core feature delivery and boosted engagement by 30%.'],
    }
    addWorkExperience(newExp)
  }

  const handleAddEducation = () => {
    const newEdu: Education = {
      id: crypto.randomUUID(),
      school: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      bullets: [],
    }
    addEducation(newEdu)
  }

  const handleAddProject = () => {
    const newProj: Project = {
      id: crypto.randomUUID(),
      title: 'New High-Impact Project',
      description: 'Engineered a scalable distributed system with real-time analytics.',
      technologies: ['TypeScript', 'Next.js'],
      bullets: [],
    }
    addProject(newProj)
  }

  const handleAddAchievement = () => {
    const newAch: Achievement = {
      id: crypto.randomUUID(),
      title: 'Honor or Certification Title',
      issuer: 'Organization / Issuer',
      date: '2024',
    }
    addAchievement(newAch)
  }

  const handleAddSkillKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (skillInput.trim()) {
        addSkill(skillInput.trim())
        setSkillInput('')
      }
    }
  }

  if (!activeProfile) {
    return (
      <div className="min-h-screen ruled-bg flex items-center justify-center text-ink">
        <div className="text-center space-y-3">
          <Loader2 className="w-6 h-6 animate-spin text-oxblood mx-auto" />
          <p className="hand text-base text-pencil">Opening WYSIWYG studio workspace...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen ruled-bg text-ink flex flex-col selection:bg-mustard/40 selection:text-ink">
      {/* Top Action Header */}
      <header className="border-b border-ink/10 bg-card/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-pencil hover:text-ink text-xs font-serif">
              <ArrowLeft className="w-3.5 h-3.5" />
              Desk
            </Link>
            <div className="h-4 w-px bg-ink/15" />
            <Input
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
              className="font-serif font-bold text-sm bg-transparent border-transparent hover:border-ink/20 focus:border-oxblood text-ink h-8 px-2 max-w-[220px] sm:max-w-xs"
              placeholder="Resume Title"
            />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded bg-paper border border-ink/15 shadow-sm">
              <Target className="w-3.5 h-3.5 text-sage" />
              <span className="text-[11px] font-mono text-pencil">ATS Score:</span>
              <span className="font-mono font-bold text-xs text-sage">{atsScore}%</span>
            </div>

            {folders.length > 0 && (
              <select
                value={selectedFolderId || ''}
                onChange={(e) => setSelectedFolderId(e.target.value || null)}
                aria-label="Select Folder"
                className="bg-paper border border-ink/15 text-pencil text-xs h-8 px-2 rounded focus:outline-none focus:border-oxblood font-serif hidden md:block"
              >
                <option value="">📁 General (No Folder)</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    📁 {f.name}
                  </option>
                ))}
              </select>
            )}

            <Button
              size="sm"
              onClick={handleSaveResume}
              disabled={isSaving}
              className="bg-card hover:bg-paper text-ink border border-ink/20 text-xs font-medium h-8 shadow-sm"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
              ) : (
                <Save className="w-3.5 h-3.5 mr-1.5 text-oxblood" />
              )}
              Save
            </Button>

            {isClientReady && (
              <PDFDownloadLink
                document={
                  <ResumePDFDocument
                    profile={activeProfile}
                    templateId={selectedTemplate}
                    styleConfig={styleConfig}
                  />
                }
                fileName={`${resumeTitle.replace(/\s+/g, '_')}_Resumely.pdf`}
              >
                {({ loading }) => (
                  <Button
                    size="sm"
                    disabled={loading}
                    className="bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium h-8 shadow-sm border border-oxblood"
                  >
                    {loading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                    ) : (
                      <Download className="w-3.5 h-3.5 mr-1.5" />
                    )}
                    Export PDF
                  </Button>
                )}
              </PDFDownloadLink>
            )}
          </div>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 grid lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: MULTI-SECTION EDITOR (5.5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Tabs
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as 'content' | 'ats' | 'design')}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 bg-card border border-ink/15 p-1 rounded shadow-sm">
              <TabsTrigger
                value="content"
                className="data-[state=active]:bg-paper data-[state=active]:text-ink font-serif text-xs font-medium"
              >
                <FileText className="w-3.5 h-3.5 mr-1 text-oxblood" />
                Dossier
              </TabsTrigger>
              <TabsTrigger
                value="ats"
                className="data-[state=active]:bg-paper data-[state=active]:text-ink font-serif text-xs font-medium"
              >
                <Target className="w-3.5 h-3.5 mr-1 text-sage" />
                ATS
              </TabsTrigger>
              <TabsTrigger
                value="design"
                className="data-[state=active]:bg-paper data-[state=active]:text-ink font-serif text-xs font-medium"
              >
                <Sliders className="w-3.5 h-3.5 mr-1 text-mustard" />
                Styles
              </TabsTrigger>
            </TabsList>

            {/* TAB 1: CONTENT SECTIONS */}
            <TabsContent value="content" className="space-y-4 pt-2">
              {/* Header & Basic Info */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center gap-2 pb-2 border-b border-dashed border-ink/15">
                  <User className="w-4 h-4 text-oxblood" />
                  <h3 className="font-serif font-bold text-sm text-ink">Personal Coordinates</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-pencil">Full Name</Label>
                    <Input
                      value={activeProfile.full_name || ''}
                      onChange={(e) => updateBasicInfo({ full_name: e.target.value })}
                      className="h-8 text-xs bg-paper/60 border-ink/15"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-pencil">Target Headline</Label>
                    <Input
                      value={activeProfile.title || ''}
                      onChange={(e) => updateBasicInfo({ title: e.target.value })}
                      className="h-8 text-xs bg-paper/60 border-ink/15"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <Label className="text-[11px] text-pencil">Location</Label>
                    <Input
                      value={activeProfile.location || ''}
                      onChange={(e) => updateBasicInfo({ location: e.target.value })}
                      className="h-8 text-xs bg-paper/60 border-ink/15"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-[11px] text-pencil">Phone</Label>
                    <Input
                      value={activeProfile.phone || ''}
                      onChange={(e) => updateBasicInfo({ phone: e.target.value })}
                      className="h-8 text-xs bg-paper/60 border-ink/15"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <Label className="text-[11px] text-pencil">Professional Summary</Label>
                  <Textarea
                    rows={3}
                    value={activeProfile.professional_summary || activeProfile.summary || ''}
                    onChange={(e) => updateBasicInfo({ professional_summary: e.target.value })}
                    className="text-xs bg-paper/60 border-ink/15 leading-relaxed"
                  />
                </div>
              </Card>

              {/* Work Experience */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-oxblood" />
                    <h3 className="font-serif font-bold text-sm text-ink">Work Experience</h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddExperience}
                    className="h-7 px-2.5 bg-paper border border-ink/20 text-ink hover:bg-card text-[11px] font-medium"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Role
                  </Button>
                </div>

                <div className="space-y-4">
                  {(activeProfile.work_experience || []).map((exp) => (
                    <div key={exp.id} className="p-3 rounded bg-paper/60 border border-ink/15 space-y-2.5 relative">
                      <button
                        type="button"
                        onClick={() => removeWorkExperience(exp.id)}
                        className="absolute top-2 right-2 text-pencil hover:text-oxblood"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                        <Input
                          value={exp.role || ''}
                          onChange={(e) => updateWorkExperience(exp.id, { role: e.target.value })}
                          placeholder="Job Title"
                          className="h-7 text-xs font-bold bg-card border-ink/15"
                        />
                        <Input
                          value={exp.company || ''}
                          onChange={(e) => updateWorkExperience(exp.id, { company: e.target.value })}
                          placeholder="Company"
                          className="h-7 text-xs bg-card border-ink/15"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        <Input
                          value={exp.location || ''}
                          onChange={(e) => updateWorkExperience(exp.id, { location: e.target.value })}
                          placeholder="Location (SF, CA)"
                          className="h-7 text-xs bg-card border-ink/15"
                        />
                        <Input
                          value={exp.start_date || ''}
                          onChange={(e) => updateWorkExperience(exp.id, { start_date: e.target.value })}
                          placeholder="Start (2022)"
                          className="h-7 text-xs bg-card border-ink/15"
                        />
                        <Input
                          value={exp.end_date || ''}
                          onChange={(e) => updateWorkExperience(exp.id, { end_date: e.target.value })}
                          placeholder="End (Present)"
                          className="h-7 text-xs bg-card border-ink/15"
                        />
                      </div>

                      {/* Bullets with AI Rephrase */}
                      <div className="space-y-1.5 pt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-pencil">Bullets:</span>
                          <button
                            type="button"
                            onClick={() => addBulletPoint(exp.id, 'Spearheaded key milestone delivery.')}
                            className="text-[10px] font-mono text-oxblood hover:underline"
                          >
                            + Bullet
                          </button>
                        </div>

                        {(exp.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="space-y-1.5">
                            <div className="flex items-start gap-1">
                              <Textarea
                                rows={2}
                                value={bullet || ''}
                                onChange={(e) => updateBulletPoint(exp.id, bIdx, e.target.value)}
                                className="text-xs bg-card border-ink/15 flex-1"
                              />
                              <Button
                                type="button"
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setActiveAIExperienceId(exp.id)
                                  setActiveAIBulletIndex(bIdx)
                                }}
                                className="h-7 px-2 bg-paper text-oxblood text-xs"
                                title="AI Rephrase"
                              >
                                <Sparkles className="w-3 h-3" />
                              </Button>
                              <button
                                type="button"
                                onClick={() => removeBulletPoint(exp.id, bIdx)}
                                className="text-pencil hover:text-oxblood p-1"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>

                            {activeAIExperienceId === exp.id && activeAIBulletIndex === bIdx && (
                              <InlineAIRewriter
                                currentText={bullet}
                                targetJobDescription={targetJobDescription}
                                onApply={(newText) => {
                                  updateBulletPoint(exp.id, bIdx, newText)
                                  setActiveAIExperienceId(null)
                                  setActiveAIBulletIndex(null)
                                  toast.success('Bullet Rephrased!')
                                }}
                                onClose={() => {
                                  setActiveAIExperienceId(null)
                                  setActiveAIBulletIndex(null)
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Education */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-oxblood" />
                    <h3 className="font-serif font-bold text-sm text-ink">Education & Academic Honors</h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddEducation}
                    className="h-7 px-2.5 bg-paper border border-ink/20 text-ink hover:bg-card text-[11px]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Degree
                  </Button>
                </div>

                <div className="space-y-3">
                  {(activeProfile.education || []).map((edu) => (
                    <div key={edu.id} className="p-3 rounded bg-paper/60 border border-ink/15 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => removeEducation(edu.id)}
                        className="absolute top-2 right-2 text-pencil hover:text-oxblood"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                        <Input
                          value={edu.degree || ''}
                          onChange={(e) => updateEducation(edu.id, { degree: e.target.value })}
                          placeholder="Degree (e.g. B.S.)"
                          className="h-7 text-xs bg-card"
                        />
                        <Input
                          value={edu.field_of_study || ''}
                          onChange={(e) => updateEducation(edu.id, { field_of_study: e.target.value })}
                          placeholder="Field (e.g. Computer Science)"
                          className="h-7 text-xs bg-card"
                        />
                      </div>
                      <Input
                        value={edu.school || ''}
                        onChange={(e) => updateEducation(edu.id, { school: e.target.value })}
                        placeholder="University / School"
                        className="h-7 text-xs bg-card"
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <Input
                          value={edu.start_date || ''}
                          onChange={(e) => updateEducation(edu.id, { start_date: e.target.value })}
                          placeholder="Start (e.g. 2019)"
                          className="h-7 text-xs bg-card"
                        />
                        <Input
                          value={edu.end_date || ''}
                          onChange={(e) => updateEducation(edu.id, { end_date: e.target.value })}
                          placeholder="Graduation (e.g. 2023)"
                          className="h-7 text-xs bg-card"
                        />
                      </div>

                      {/* Academic Highlights & Bullets */}
                      <div className="space-y-1.5 pt-1 border-t border-dashed border-ink/10">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-mono text-pencil">Academic Highlights:</span>
                          <button
                            type="button"
                            onClick={() => addEducationBullet(edu.id, "Dean's Honor List, Cum Laude")}
                            className="text-[10px] font-mono text-oxblood hover:underline"
                          >
                            + Highlight
                          </button>
                        </div>
                        {(edu.bullets || []).map((bullet, bIdx) => (
                          <div key={bIdx} className="flex items-center gap-1">
                            <Input
                              value={bullet || ''}
                              onChange={(e) => updateEducationBullet(edu.id, bIdx, e.target.value)}
                              placeholder="e.g. Published thesis, GPA 3.9/4.0"
                              className="text-xs bg-card border-ink/15 h-7 flex-1"
                            />
                            <button
                              type="button"
                              onClick={() => removeEducationBullet(edu.id, bIdx)}
                              className="text-pencil hover:text-oxblood p-1"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Projects */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-sage" />
                    <h3 className="font-serif font-bold text-sm text-ink">Projects</h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddProject}
                    className="h-7 px-2.5 bg-paper border border-ink/20 text-ink hover:bg-card text-[11px]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Project
                  </Button>
                </div>

                <div className="space-y-3">
                  {(activeProfile.projects || []).map((proj) => (
                    <div key={proj.id} className="p-3 rounded bg-paper/60 border border-ink/15 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => removeProject(proj.id)}
                        className="absolute top-2 right-2 text-pencil hover:text-oxblood"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <Input
                        value={proj.title || ''}
                        onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                        placeholder="Project Title"
                        className="h-7 text-xs bg-card font-bold pr-6"
                      />
                      <Textarea
                        rows={2}
                        value={proj.description || ''}
                        onChange={(e) => updateProject(proj.id, { description: e.target.value })}
                        placeholder="Project impact description..."
                        className="text-xs bg-card"
                      />
                    </div>
                  ))}
                </div>
              </Card>

              {/* Achievements & Honors */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-mustard" />
                    <h3 className="font-serif font-bold text-sm text-ink">Honors & Certifications</h3>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleAddAchievement}
                    className="h-7 px-2.5 bg-paper border border-ink/20 text-ink hover:bg-card text-[11px]"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Honor
                  </Button>
                </div>

                <div className="space-y-3">
                  {(activeProfile.achievements || []).map((ach) => (
                    <div key={ach.id} className="p-3 rounded bg-paper/60 border border-ink/15 space-y-2 relative">
                      <button
                        type="button"
                        onClick={() => removeAchievement(ach.id)}
                        className="absolute top-2 right-2 text-pencil hover:text-oxblood"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pr-6">
                        <Input
                          value={ach.title || ''}
                          onChange={(e) => updateAchievement(ach.id, { title: e.target.value })}
                          placeholder="Honor Title"
                          className="h-7 text-xs bg-card font-bold"
                        />
                        <Input
                          value={ach.issuer || ''}
                          onChange={(e) => updateAchievement(ach.id, { issuer: e.target.value })}
                          placeholder="Organization"
                          className="h-7 text-xs bg-card"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Skills */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <Code className="w-4 h-4 text-sage" />
                    <h3 className="font-serif font-bold text-sm text-ink">Skills</h3>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Input
                    placeholder="Add skill (e.g. Next.js, Supabase)"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={handleAddSkillKey}
                    className="h-8 text-xs bg-paper/60 border-ink/15 text-ink"
                  />
                  <Button
                    type="button"
                    size="sm"
                    onClick={() => {
                      if (skillInput.trim()) {
                        addSkill(skillInput.trim())
                        setSkillInput('')
                      }
                    }}
                    className="bg-paper border-ink/20 text-ink hover:bg-card text-xs h-8"
                  >
                    Add
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {(activeProfile.primary_skills || []).map((skill, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-paper border border-ink/15 text-xs font-mono"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="text-pencil hover:text-oxblood"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </Card>
            </TabsContent>

            {/* TAB 2: ATS */}
            <TabsContent value="ats" className="space-y-4 pt-2">
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <Target className="w-4 h-4 text-sage" />
                    <h3 className="font-serif font-bold text-sm text-ink">ATS Match Engine</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-sage/20 text-sage border-sage/30 text-xs font-mono font-bold">
                      {atsScore}% Match
                    </Badge>
                    <Button 
                      size="sm" 
                      onClick={runDeepAtsAnalysis} 
                      disabled={deepAtsLoading || !targetJobDescription}
                      className="h-6 px-2 text-[10px] bg-oxblood text-card border border-oxblood shadow-sm"
                    >
                      {deepAtsLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3 mr-1" />}
                      Deep Scan
                    </Button>
                  </div>
                </div>

                <Textarea
                  rows={4}
                  value={targetJobDescription}
                  onChange={handleJobDescChange}
                  placeholder="Paste the target job description here..."
                  className="text-xs bg-paper/60 border-ink/15 text-ink font-mono"
                />

                {deepAtsReport && (
                  <div className="mt-4 space-y-3 p-3 bg-paper border border-ink/15 rounded text-xs animate-in fade-in zoom-in-95 duration-200">
                    <div>
                      <span className="font-bold text-oxblood block mb-1">Missing Critical Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {deepAtsReport.missingKeywords.map(k => (
                          <Badge key={k} variant="outline" className="text-[10px] border-oxblood/50 text-oxblood bg-card font-mono">{k}</Badge>
                        ))}
                        {deepAtsReport.missingKeywords.length === 0 && <span className="text-[10px] text-pencil">None detected!</span>}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-sage block mb-1">Matching Keywords</span>
                      <div className="flex flex-wrap gap-1">
                        {deepAtsReport.matchingKeywords.map(k => (
                          <Badge key={k} variant="outline" className="text-[10px] border-sage/50 text-sage bg-card font-mono">{k}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="font-bold text-ink block mb-1">Expert Suggestions</span>
                      <ul className="list-disc pl-4 space-y-1 text-pencil text-[11px]">
                        {deepAtsReport.suggestions.map((s, i) => (
                          <li key={i}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </Card>
            </TabsContent>

            {/* TAB 3: DESIGN & SECTION ORDER */}
            <TabsContent value="design" className="space-y-4 pt-2">
              <Card className="border border-ink/15 bg-card p-4 space-y-4 shadow-sm rounded-md">
                <h3 className="font-serif font-bold text-sm text-ink pb-2 border-b border-dashed border-ink/15">
                  Visual Template Selector
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div
                    onClick={() => setSelectedTemplate('craftsman')}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedTemplate === 'craftsman'
                        ? 'border-oxblood bg-paper shadow-sm'
                        : 'border-ink/15 bg-card'
                    }`}
                  >
                    <span className="font-serif font-bold text-xs text-ink block">
                      📜 Craftsman Editorial
                    </span>
                    <span className="text-[10px] text-pencil">Warm paper, classic serif</span>
                  </div>

                  <div
                    onClick={() => setSelectedTemplate('modern-minimal')}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedTemplate === 'modern-minimal'
                        ? 'border-oxblood bg-paper shadow-sm'
                        : 'border-ink/15 bg-card'
                    }`}
                  >
                    <span className="font-sans font-bold text-xs text-ink block">
                      💼 Modern Minimalist
                    </span>
                    <span className="text-[10px] text-pencil">Clean sans, Swiss typography</span>
                  </div>

                  <div
                    onClick={() => setSelectedTemplate('tech-mono')}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedTemplate === 'tech-mono'
                        ? 'border-oxblood bg-paper shadow-sm'
                        : 'border-ink/15 bg-card'
                    }`}
                  >
                    <span className="font-mono font-bold text-xs text-ink block">
                      ⚡ Technical Linear
                    </span>
                    <span className="text-[10px] text-pencil">Light terminal, indigo accents</span>
                  </div>

                  <div
                    onClick={() => setSelectedTemplate('executive-serif')}
                    className={`p-3 rounded border cursor-pointer transition-all ${
                      selectedTemplate === 'executive-serif'
                        ? 'border-oxblood bg-paper shadow-sm'
                        : 'border-ink/15 bg-card'
                    }`}
                  >
                    <span className="font-serif font-bold text-xs text-ink block uppercase">
                      🏛️ Executive Classic
                    </span>
                    <span className="text-[10px] text-pencil">Formal header, divider lines</span>
                  </div>
                </div>
              </Card>

              {/* Section Order & Layout Manager */}
              <Card className="border border-ink/15 bg-card p-4 space-y-3 shadow-sm rounded-md">
                <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-oxblood" />
                    <h3 className="font-serif font-bold text-sm text-ink">
                      Section Order & Layout Structure
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono text-pencil">Reorderable</span>
                </div>

                <p className="text-xs text-pencil">
                  Reorder resume sections to prioritize experience, education, or projects according to your target role:
                </p>

                <div className="space-y-1.5 pt-1">
                  {(
                    styleConfig.section_order || [
                      'summary',
                      'experience',
                      'projects',
                      'education',
                      'skills',
                      'achievements',
                    ]
                  ).map((sectionKey, idx, arr) => {
                    const sectionLabels: Record<string, string> = {
                      summary: 'Professional Summary',
                      experience: 'Work Experience',
                      projects: 'Featured Projects',
                      education: 'Education & Academics',
                      skills: 'Skills & Competencies',
                      achievements: 'Honors & Certifications',
                    }

                    return (
                      <div
                        key={sectionKey}
                        className={`flex items-center justify-between px-3 py-2 bg-paper/60 rounded border border-ink/15 text-xs font-medium text-ink transition-opacity ${
                          (styleConfig.hidden_sections || []).includes(sectionKey) ? 'opacity-50' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => toggleSectionVisibility(sectionKey)}
                            className={`h-5 w-5 p-0 hover:text-oxblood ${(styleConfig.hidden_sections || []).includes(sectionKey) ? 'text-oxblood' : 'text-pencil'}`}
                            title="Toggle Visibility"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>{(styleConfig.hidden_sections || []).includes(sectionKey) && <line x1="2" y1="2" x2="22" y2="22" stroke="currentColor" strokeWidth="2" />}</svg>
                          </Button>
                          <GripVertical className="w-3.5 h-3.5 text-pencil/60 cursor-grab" />
                          <span className={`font-serif ${(styleConfig.hidden_sections || []).includes(sectionKey) ? 'line-through' : ''}`}>
                            {idx + 1}. {sectionLabels[sectionKey] || sectionKey}
                          </span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={idx === 0}
                            onClick={() => moveSection(idx, idx - 1)}
                            className="h-6 w-6 p-0 text-pencil hover:text-ink disabled:opacity-30"
                            title="Move Up"
                          >
                            <ArrowUp className="w-3.5 h-3.5" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled={idx === arr.length - 1}
                            onClick={() => moveSection(idx, idx + 1)}
                            className="h-6 w-6 p-0 text-pencil hover:text-ink disabled:opacity-30"
                            title="Move Down"
                          >
                            <ArrowDown className="w-3.5 h-3.5" />
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* RIGHT COLUMN: LIVE WYSIWYG PREVIEW (7 Cols) */}
        <div className="lg:col-span-7 sticky top-20 space-y-2">
          <div className="flex items-center justify-between text-xs text-pencil px-1">
            <span className="hand text-sm text-ink">
              WYSIWYG Mode · <span className="text-oxblood font-bold">Double-click any text on the page to edit directly</span>
            </span>
            <span className="font-mono text-[10px]">A4 Live Canvas</span>
          </div>
          
          <ResumeRibbon 
            isVisible={isRibbonVisible} 
            onClose={() => setIsRibbonVisible(false)} 
          />

          {/* Render Active Template with In-Place Editable text */}
          <div 
            className="max-h-[calc(100vh-140px)] overflow-y-auto p-1 border border-ink/20 rounded shadow-2xl bg-paper/60"
            onDoubleClick={(e) => {
              // Ensure we only toggle if they clicked on the resume area, and maybe avoid toggling if they double click to highlight text. 
              // Actually, double clicking to highlight text is standard, so we shouldn't constantly toggle it off.
              // Let's just set it to true when they double click anywhere in the preview.
              setIsRibbonVisible(true)
            }}
          >
            {selectedTemplate === 'craftsman' && (
              <CraftsmanTemplate profile={activeProfile} styleConfig={styleConfig} />
            )}
            {selectedTemplate === 'modern-minimal' && (
              <ModernMinimalTemplate profile={activeProfile} styleConfig={styleConfig} />
            )}
            {selectedTemplate === 'tech-mono' && (
              <TechLinearTemplate profile={activeProfile} styleConfig={styleConfig} />
            )}
            {selectedTemplate === 'executive-serif' && (
              <ExecutiveSerifTemplate profile={activeProfile} styleConfig={styleConfig} />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
