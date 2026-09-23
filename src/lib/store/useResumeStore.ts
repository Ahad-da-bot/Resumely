import { create } from 'zustand'
import {
  Profile,
  Resume,
  TemplateId,
  StyleConfig,
  ResumeSectionKey,
  WorkExperience,
  Education,
  Project,
  Achievement,
  Certification,
} from '@/types/resume'

interface ResumeStoreState {
  activeProfile: Profile | null
  activeResume: Resume | null
  selectedTemplate: TemplateId
  styleConfig: StyleConfig
  targetJobDescription: string
  atsScore: number
  isSaving: boolean
  isGeneratingAI: boolean

  // Setters
  setActiveProfile: (profile: Profile | null) => void
  setActiveResume: (resume: Resume | null) => void
  setSelectedTemplate: (template: TemplateId) => void
  setStyleConfig: (config: Partial<StyleConfig>) => void
  setSectionOrder: (order: ResumeSectionKey[]) => void
  moveSection: (fromIndex: number, toIndex: number) => void
  toggleSectionVisibility: (section: ResumeSectionKey) => void
  setTargetJobDescription: (desc: string) => void
  setAtsScore: (score: number) => void
  setIsSaving: (saving: boolean) => void
  setIsGeneratingAI: (generating: boolean) => void

  // Basic Info
  updateBasicInfo: (info: {
    full_name?: string
    title?: string
    phone?: string
    location?: string
    website_url?: string
    linkedin_url?: string
    professional_summary?: string
  }) => void

  // Work Experience
  addWorkExperience: (exp: WorkExperience) => void
  updateWorkExperience: (id: string, exp: Partial<WorkExperience>) => void
  removeWorkExperience: (id: string) => void
  updateBulletPoint: (
    experienceId: string,
    bulletIndex: number,
    newText: string
  ) => void
  addBulletPoint: (experienceId: string, text: string) => void
  removeBulletPoint: (experienceId: string, bulletIndex: number) => void

  // Skills
  addSkill: (skill: string) => void
  removeSkill: (skill: string) => void

  // Education
  addEducation: (edu: Education) => void
  updateEducation: (id: string, edu: Partial<Education>) => void
  removeEducation: (id: string) => void
  addEducationBullet: (educationId: string, text: string) => void
  updateEducationBullet: (
    educationId: string,
    bulletIndex: number,
    newText: string
  ) => void
  removeEducationBullet: (educationId: string, bulletIndex: number) => void

  // Projects
  addProject: (proj: Project) => void
  updateProject: (id: string, proj: Partial<Project>) => void
  removeProject: (id: string) => void
  updateProjectBulletPoint: (
    projectId: string,
    bulletIndex: number,
    newText: string
  ) => void

  // Achievements
  addAchievement: (ach: Achievement) => void
  updateAchievement: (id: string, ach: Partial<Achievement>) => void
  removeAchievement: (id: string) => void

  // Certifications
  addCertification: (cert: Certification) => void
  removeCertification: (id: string) => void
}

export const defaultSectionOrder: ResumeSectionKey[] = [
  'summary',
  'experience',
  'projects',
  'education',
  'skills',
  'achievements',
]

const defaultStyleConfig: StyleConfig = {
  font_family: 'serif',
  font_size: 'medium',
  spacing: 'comfortable',
  accent_color: 'oxblood',
  show_icons: true,
  section_order: defaultSectionOrder,
}

export const useResumeStore = create<ResumeStoreState>((set) => ({
  activeProfile: null,
  activeResume: null,
  selectedTemplate: 'craftsman',
  styleConfig: defaultStyleConfig,
  targetJobDescription: '',
  atsScore: 82,
  isSaving: false,
  isGeneratingAI: false,

  setActiveProfile: (profile) => set({ activeProfile: profile }),
  setActiveResume: (resume) =>
    set({
      activeResume: resume,
      selectedTemplate: resume?.template_id || 'craftsman',
      styleConfig: resume?.style_config || defaultStyleConfig,
      targetJobDescription: resume?.target_job_description || '',
      atsScore: resume?.ats_score || 0,
    }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  setStyleConfig: (config) =>
    set((state) => ({
      styleConfig: { ...state.styleConfig, ...config },
    })),
  setSectionOrder: (order) =>
    set((state) => ({
      styleConfig: { ...state.styleConfig, section_order: order },
    })),
  moveSection: (fromIndex, toIndex) =>
    set((state) => {
      const currentOrder = [
        ...(state.styleConfig.section_order || defaultSectionOrder),
      ]
      if (
        fromIndex < 0 ||
        fromIndex >= currentOrder.length ||
        toIndex < 0 ||
        toIndex >= currentOrder.length
      ) {
        return state
      }
      const [moved] = currentOrder.splice(fromIndex, 1)
      currentOrder.splice(toIndex, 0, moved)
      return {
        styleConfig: {
          ...state.styleConfig,
          section_order: currentOrder,
        },
      }
    }),
  toggleSectionVisibility: (section) =>
    set((state) => {
      const hidden = state.styleConfig.hidden_sections || []
      const newHidden = hidden.includes(section)
        ? hidden.filter((s) => s !== section)
        : [...hidden, section]
      return {
        styleConfig: {
          ...state.styleConfig,
          hidden_sections: newHidden,
        },
      }
    }),
  setTargetJobDescription: (desc) => set({ targetJobDescription: desc }),
  setAtsScore: (score) => set({ atsScore: score }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setIsGeneratingAI: (generating) => set({ isGeneratingAI: generating }),

  updateBasicInfo: (info) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          ...info,
        },
      }
    }),

  addWorkExperience: (exp) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          work_experience: [exp, ...(state.activeProfile.work_experience || [])],
        },
      }
    }),

  updateWorkExperience: (id, updatedFields) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          work_experience: (state.activeProfile.work_experience || []).map((exp) =>
            exp.id === id ? { ...exp, ...updatedFields } : exp
          ),
        },
      }
    }),

  removeWorkExperience: (id) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          work_experience: (state.activeProfile.work_experience || []).filter(
            (exp) => exp.id !== id
          ),
        },
      }
    }),

  updateBulletPoint: (experienceId, bulletIndex, newText) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          work_experience: (state.activeProfile.work_experience || []).map((exp) => {
            if (exp.id !== experienceId) return exp
            const updatedBullets = [...(exp.bullets || [])]
            updatedBullets[bulletIndex] = newText
            return { ...exp, bullets: updatedBullets }
          }),
        },
      }
    }),

  addBulletPoint: (experienceId, text) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          work_experience: (state.activeProfile.work_experience || []).map((exp) => {
            if (exp.id !== experienceId) return exp
            return { ...exp, bullets: [...(exp.bullets || []), text] }
          }),
        },
      }
    }),

  removeBulletPoint: (experienceId, bulletIndex) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          work_experience: (state.activeProfile.work_experience || []).map((exp) => {
            if (exp.id !== experienceId) return exp
            const updatedBullets = (exp.bullets || []).filter(
              (_, idx) => idx !== bulletIndex
            )
            return { ...exp, bullets: updatedBullets }
          }),
        },
      }
    }),

  addSkill: (skill) =>
    set((state) => {
      if (!state.activeProfile) return state
      if ((state.activeProfile.primary_skills || []).includes(skill)) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          primary_skills: [...(state.activeProfile.primary_skills || []), skill],
        },
      }
    }),

  removeSkill: (skill) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          primary_skills: (state.activeProfile.primary_skills || []).filter(
            (s) => s !== skill
          ),
        },
      }
    }),

  addEducation: (edu) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          education: [edu, ...(state.activeProfile.education || [])],
        },
      }
    }),

  updateEducation: (id, updatedFields) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          education: (state.activeProfile.education || []).map((edu) =>
            edu.id === id ? { ...edu, ...updatedFields } : edu
          ),
        },
      }
    }),

  removeEducation: (id) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          education: (state.activeProfile.education || []).filter(
            (edu) => edu.id !== id
          ),
        },
      }
    }),

  addEducationBullet: (educationId, text) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          education: (state.activeProfile.education || []).map((edu) => {
            if (edu.id !== educationId) return edu
            return { ...edu, bullets: [...(edu.bullets || []), text] }
          }),
        },
      }
    }),

  updateEducationBullet: (educationId, bulletIndex, newText) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          education: (state.activeProfile.education || []).map((edu) => {
            if (edu.id !== educationId) return edu
            const updatedBullets = [...(edu.bullets || [])]
            updatedBullets[bulletIndex] = newText
            return { ...edu, bullets: updatedBullets }
          }),
        },
      }
    }),

  removeEducationBullet: (educationId, bulletIndex) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          education: (state.activeProfile.education || []).map((edu) => {
            if (edu.id !== educationId) return edu
            const updatedBullets = (edu.bullets || []).filter(
              (_, idx) => idx !== bulletIndex
            )
            return { ...edu, bullets: updatedBullets }
          }),
        },
      }
    }),

  addProject: (proj) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          projects: [proj, ...(state.activeProfile.projects || [])],
        },
      }
    }),

  updateProject: (id, updatedFields) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          projects: (state.activeProfile.projects || []).map((proj) =>
            proj.id === id ? { ...proj, ...updatedFields } : proj
          ),
        },
      }
    }),

  removeProject: (id) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          projects: (state.activeProfile.projects || []).filter(
            (proj) => proj.id !== id
          ),
        },
      }
    }),

  updateProjectBulletPoint: (projectId, bulletIndex, newText) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          projects: (state.activeProfile.projects || []).map((proj) => {
            if (proj.id !== projectId) return proj
            const updatedBullets = [...(proj.bullets || [])]
            updatedBullets[bulletIndex] = newText
            return { ...proj, bullets: updatedBullets }
          }),
        },
      }
    }),

  addAchievement: (ach) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          achievements: [ach, ...(state.activeProfile.achievements || [])],
        },
      }
    }),

  updateAchievement: (id, updatedFields) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          achievements: (state.activeProfile.achievements || []).map((ach) =>
            ach.id === id ? { ...ach, ...updatedFields } : ach
          ),
        },
      }
    }),

  removeAchievement: (id) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          achievements: (state.activeProfile.achievements || []).filter(
            (ach) => ach.id !== id
          ),
        },
      }
    }),

  addCertification: (cert) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          certifications: [cert, ...(state.activeProfile.certifications || [])],
        },
      }
    }),

  removeCertification: (id) =>
    set((state) => {
      if (!state.activeProfile) return state
      return {
        activeProfile: {
          ...state.activeProfile,
          certifications: (state.activeProfile.certifications || []).filter(
            (cert) => cert.id !== id
          ),
        },
      }
    }),
}))
