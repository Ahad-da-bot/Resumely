'use client'

import * as React from 'react'
import { Profile, StyleConfig, ResumeSectionKey } from '@/types/resume'
import { InlineEditableText } from '@/components/editor/InlineEditableText'
import { useResumeStore } from '@/lib/store/useResumeStore'

interface TemplateProps {
  profile: Profile
  styleConfig: StyleConfig
  isEditable?: boolean
}

export function CraftsmanTemplate({
  profile,
  styleConfig,
  isEditable = true,
}: TemplateProps) {
  const {
    updateBasicInfo,
    updateWorkExperience,
    updateBulletPoint,
    updateEducation,
    updateEducationBullet,
    updateProject,
    updateAchievement,
  } = useResumeStore()

  const accentColorClass =
    styleConfig.accent_color === 'oxblood'
      ? 'text-oxblood'
      : styleConfig.accent_color === 'sage'
      ? 'text-sage'
      : styleConfig.accent_color === 'mustard'
      ? 'text-mustard'
      : 'text-ink'

  const sectionOrder: ResumeSectionKey[] = styleConfig.section_order || [
    'summary',
    'experience',
    'projects',
    'education',
    'skills',
    'achievements',
  ]

  const renderSection = (key: ResumeSectionKey) => {
    switch (key) {
      case 'summary':
        return (
          <div key="summary" className="space-y-1.5">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6E6355] border-b border-dashed border-[#2A2119]/20 pb-0.5 font-bold">
              Executive Summary
            </h2>
            <InlineEditableText
              as="p"
              multiline
              value={profile.professional_summary}
              onSave={(val) => updateBasicInfo({ professional_summary: val })}
              placeholder="Enter a brief, impactful professional summary here..."
              className="text-xs leading-relaxed text-[#2A2119]/90 italic block"
            />
          </div>
        )

      case 'experience':
        if (!profile.work_experience || profile.work_experience.length === 0) return null
        return (
          <div key="experience" className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6E6355] border-b border-dashed border-[#2A2119]/20 pb-0.5 font-bold">
              Professional Experience
            </h2>
            <div className="space-y-4">
              {profile.work_experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <InlineEditableText
                        value={exp.role}
                        onSave={(val) => updateWorkExperience(exp.id, { role: val })}
                        placeholder="Role / Title"
                        className="font-bold text-sm text-[#2A2119]"
                      />
                      <span className="text-[#6E6355] font-sans text-xs"> — </span>
                      <InlineEditableText
                        value={exp.company}
                        onSave={(val) => updateWorkExperience(exp.id, { company: val })}
                        placeholder="Company"
                        className="text-[#6E6355] font-sans text-xs font-medium"
                      />
                    </div>
                    <div className="text-[10px] font-mono text-[#6E6355] flex items-center gap-1">
                      <InlineEditableText
                        value={exp.start_date}
                        onSave={(val) => updateWorkExperience(exp.id, { start_date: val })}
                        placeholder="Start"
                      />
                      <span>–</span>
                      <InlineEditableText
                        value={exp.current ? 'Present' : exp.end_date}
                        onSave={(val) => updateWorkExperience(exp.id, { end_date: val })}
                        placeholder="End"
                      />
                    </div>
                  </div>

                  {exp.location && (
                    <div className="text-[10px] font-sans text-[#6E6355] -mt-0.5">
                      <InlineEditableText
                        value={exp.location}
                        onSave={(val) => updateWorkExperience(exp.id, { location: val })}
                        placeholder="Location (e.g. San Francisco, CA)"
                      />
                    </div>
                  )}

                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-none space-y-1 pl-1 pt-0.5 text-xs text-[#2A2119]/90">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-2">
                          <span className="text-oxblood font-bold select-none">✎</span>
                          <InlineEditableText
                            value={bullet}
                            multiline
                            onSave={(val) => updateBulletPoint(exp.id, bIdx, val)}
                            className="flex-1 leading-snug"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'projects':
        if (!profile.projects || profile.projects.length === 0) return null
        return (
          <div key="projects" className="space-y-3">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6E6355] border-b border-dashed border-[#2A2119]/20 pb-0.5 font-bold">
              Key Projects & Systems
            </h2>
            <div className="grid md:grid-cols-2 gap-3">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="p-2.5 bg-[#FAF6EC] border border-[#2A2119]/15 rounded-sm space-y-1">
                  <InlineEditableText
                    value={proj.title}
                    onSave={(val) => updateProject(proj.id, { title: val })}
                    className="font-bold text-xs text-[#2A2119] block"
                  />
                  <InlineEditableText
                    value={proj.description}
                    multiline
                    onSave={(val) => updateProject(proj.id, { description: val })}
                    className="text-[11px] text-[#6E6355] leading-tight block"
                  />
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9px] font-mono text-[#5E6E4F]">
                      {proj.technologies.join(' · ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'education':
        if (!profile.education || profile.education.length === 0) return null
        return (
          <div key="education" className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6E6355] border-b border-dashed border-[#2A2119]/20 pb-0.5 font-bold">
              Education & Academic Honors
            </h2>
            <div className="space-y-2.5">
              {profile.education.map((edu) => (
                <div key={edu.id} className="space-y-1">
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <InlineEditableText
                        value={edu.degree}
                        onSave={(val) => updateEducation(edu.id, { degree: val })}
                        className="font-bold text-[#2A2119]"
                      />
                      <span> in </span>
                      <InlineEditableText
                        value={edu.field_of_study}
                        onSave={(val) => updateEducation(edu.id, { field_of_study: val })}
                        className="font-medium text-[#2A2119]"
                      />
                      <span className="text-[#6E6355] text-xs"> — </span>
                      <InlineEditableText
                        value={edu.school}
                        onSave={(val) => updateEducation(edu.id, { school: val })}
                        className="text-[#6E6355] text-xs"
                      />
                    </div>
                    <div className="text-[10px] font-mono text-[#6E6355] flex items-center gap-1">
                      <InlineEditableText
                        value={edu.start_date}
                        onSave={(val) => updateEducation(edu.id, { start_date: val })}
                        placeholder="Start"
                      />
                      <span>–</span>
                      <InlineEditableText
                        value={edu.end_date}
                        onSave={(val) => updateEducation(edu.id, { end_date: val })}
                        placeholder="End"
                      />
                    </div>
                  </div>

                  {edu.bullets && edu.bullets.length > 0 && (
                    <ul className="list-none space-y-0.5 pl-3 text-[11px] text-[#6E6355] italic">
                      {edu.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-oxblood select-none">•</span>
                          <InlineEditableText
                            value={bullet}
                            multiline
                            onSave={(val) => updateEducationBullet(edu.id, bIdx, val)}
                            className="flex-1 leading-tight"
                          />
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </div>
        )

      case 'skills':
        if (!profile.primary_skills || profile.primary_skills.length === 0) return null
        return (
          <div key="skills" className="space-y-1.5">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6E6355] border-b border-dashed border-[#2A2119]/20 pb-0.5 font-bold">
              Core Competencies
            </h2>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {profile.primary_skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded-sm bg-[#EFE8D6] text-[#2A2119] text-[10px] font-mono border border-[#DED4B4]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )

      case 'achievements':
        if (!profile.achievements || profile.achievements.length === 0) return null
        return (
          <div key="achievements" className="space-y-2">
            <h2 className="text-xs font-mono uppercase tracking-widest text-[#6E6355] border-b border-dashed border-[#2A2119]/20 pb-0.5 font-bold">
              Honors & Achievements
            </h2>
            <div className="space-y-1.5">
              {profile.achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <InlineEditableText
                      value={ach.title}
                      onSave={(val) => updateAchievement(ach.id, { title: val })}
                      className="font-bold text-[#2A2119]"
                    />
                    <span className="text-[#6E6355] text-xs"> — </span>
                    <InlineEditableText
                      value={ach.issuer}
                      onSave={(val) => updateAchievement(ach.id, { issuer: val })}
                      className="text-[#6E6355] text-xs"
                    />
                  </div>
                  <InlineEditableText
                    value={ach.date}
                    onSave={(val) => updateAchievement(ach.id, { date: val })}
                    className="text-[10px] font-mono text-[#6E6355]"
                  />
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="w-full bg-[#FAF6EC] text-[#2A2119] font-serif p-8 md:p-10 shadow-lg border border-[#DED4B4] rounded-sm space-y-6 text-xs leading-relaxed">
      {/* Header */}
      <div className="border-b-2 border-[#2A2119]/20 pb-4 flex flex-col md:flex-row md:items-end justify-between gap-3">
        <div className="space-y-0.5">
          <InlineEditableText
            as="h1"
            value={profile.full_name}
            onSave={(val) => updateBasicInfo({ full_name: val })}
            placeholder="Your Full Name"
            className="text-2xl md:text-3xl font-bold tracking-tight text-[#2A2119] block"
          />
          <InlineEditableText
            as="p"
            value={profile.title}
            onSave={(val) => updateBasicInfo({ title: val })}
            placeholder="Target Job Title"
            className={`text-sm font-semibold tracking-wide block ${accentColorClass}`}
          />
        </div>

        <div className="text-[11px] text-[#6E6355] font-sans space-y-0.5 text-left md:text-right">
          <div>
            <InlineEditableText
              value={profile.location}
              onSave={(val) => updateBasicInfo({ location: val })}
              placeholder="City, Country"
            />
            {' · '}
            <InlineEditableText
              value={profile.phone}
              onSave={(val) => updateBasicInfo({ phone: val })}
              placeholder="Phone Number"
            />
            {' · '}
            <InlineEditableText
              value={profile.email || ''}
              onSave={(val) => updateBasicInfo({ email: val })}
              placeholder="Email Address"
            />
          </div>
          <div className="flex gap-2 justify-start md:justify-end">
            <InlineEditableText
              value={profile.website_url || ''}
              onSave={(val) => updateBasicInfo({ website_url: val })}
              placeholder="Portfolio URL"
            />
            {' · '}
            <InlineEditableText
              value={profile.linkedin_url || ''}
              onSave={(val) => updateBasicInfo({ linkedin_url: val })}
              placeholder="LinkedIn URL"
            />
          </div>
        </div>
      </div>

      {/* Dynamic Ordered Sections */}
      {sectionOrder.map((sectionKey) => {
        if ((styleConfig.hidden_sections || []).includes(sectionKey)) return null
        return renderSection(sectionKey)
      })}
    </div>
  )
}
