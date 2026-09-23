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

export function ModernMinimalTemplate({ profile, styleConfig }: TemplateProps) {
  const {
    updateBasicInfo,
    updateWorkExperience,
    updateBulletPoint,
    updateEducation,
    updateEducationBullet,
    updateProject,
    updateAchievement,
  } = useResumeStore()

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
          <div key="summary" className="space-y-1">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Professional Summary
            </h2>
            <InlineEditableText
              as="p"
              multiline
              value={profile.professional_summary}
              onSave={(val) => updateBasicInfo({ professional_summary: val })}
              placeholder="Enter a brief, impactful professional summary here..."
              className="text-slate-700 leading-relaxed text-xs block"
            />
          </div>
        )

      case 'experience':
        if (!profile.work_experience || profile.work_experience.length === 0) return null
        return (
          <div key="experience" className="space-y-3">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Experience
            </h2>
            <div className="space-y-3.5">
              {profile.work_experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <InlineEditableText
                        value={exp.role}
                        onSave={(val) => updateWorkExperience(exp.id, { role: val })}
                        placeholder="Role / Title"
                        className="font-bold text-slate-900 text-xs"
                      />
                      <span className="text-slate-600 text-xs"> · </span>
                      <InlineEditableText
                        value={exp.company}
                        onSave={(val) => updateWorkExperience(exp.id, { company: val })}
                        placeholder="Company"
                        className="text-slate-600 text-xs font-medium"
                      />
                      {exp.location && (
                        <span className="text-slate-400 text-[10px]"> ({exp.location})</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-500">
                      {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 pt-0.5 text-slate-700 text-xs">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-snug">
                          <InlineEditableText
                            value={bullet}
                            multiline
                            onSave={(val) => updateBulletPoint(exp.id, bIdx, val)}
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
          <div key="projects" className="space-y-2">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Projects
            </h2>
            <div className="space-y-2">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="space-y-0.5">
                  <InlineEditableText
                    value={proj.title}
                    onSave={(val) => updateProject(proj.id, { title: val })}
                    className="font-bold text-xs text-slate-900 block"
                  />
                  <InlineEditableText
                    value={proj.description}
                    multiline
                    onSave={(val) => updateProject(proj.id, { description: val })}
                    className="text-slate-600 text-[11px] block"
                  />
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[10px] text-slate-500 font-mono">
                      {proj.technologies.join(', ')}
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Education & Honors
            </h2>
            <div className="space-y-2">
              {profile.education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <InlineEditableText
                        value={edu.degree}
                        onSave={(val) => updateEducation(edu.id, { degree: val })}
                        className="font-bold text-slate-900"
                      />
                      <span> in </span>
                      <InlineEditableText
                        value={edu.field_of_study}
                        onSave={(val) => updateEducation(edu.id, { field_of_study: val })}
                        className="font-medium text-slate-900"
                      />
                      <span className="text-slate-600 text-xs"> · </span>
                      <InlineEditableText
                        value={edu.school}
                        onSave={(val) => updateEducation(edu.id, { school: val })}
                        className="text-slate-600 text-xs"
                      />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-1">
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
                    <ul className="list-disc space-y-0.5 pl-4 text-slate-600 text-[11px]">
                      {edu.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="leading-tight">
                          <InlineEditableText
                            value={bullet}
                            multiline
                            onSave={(val) => updateEducationBullet(edu.id, bIdx, val)}
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
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Skills
            </h2>
            <div className="flex flex-wrap gap-1">
              {profile.primary_skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[11px] font-medium border border-slate-200"
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
          <div key="achievements" className="space-y-1.5">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-0.5">
              Achievements
            </h2>
            <div className="space-y-1">
              {profile.achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-baseline text-xs">
                  <div>
                    <InlineEditableText
                      value={ach.title}
                      onSave={(val) => updateAchievement(ach.id, { title: val })}
                      className="font-bold text-slate-900"
                    />
                    <span className="text-slate-600 text-xs"> · </span>
                    <InlineEditableText
                      value={ach.issuer}
                      onSave={(val) => updateAchievement(ach.id, { issuer: val })}
                      className="text-slate-600 text-xs"
                    />
                  </div>
                  <span className="text-[11px] text-slate-500">{ach.date}</span>
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
    <div className="w-full bg-white text-slate-900 font-sans p-8 md:p-10 shadow-lg border border-slate-200 rounded-sm space-y-5 text-xs leading-relaxed">
      {/* Header */}
      <div className="space-y-1 pb-4 border-b border-slate-200">
        <InlineEditableText
          as="h1"
          value={profile.full_name}
          onSave={(val) => updateBasicInfo({ full_name: val })}
          placeholder="Your Full Name"
          className="text-3xl font-extrabold tracking-tight text-slate-950 block"
        />
        <InlineEditableText
          as="p"
          value={profile.title}
          onSave={(val) => updateBasicInfo({ title: val })}
          placeholder="Target Job Title"
          className="text-sm font-semibold text-slate-600 block"
        />
        <div className="flex flex-wrap gap-x-2 gap-y-1 text-slate-500 text-[11px] pt-1">
          <InlineEditableText
            value={profile.location}
            onSave={(val) => updateBasicInfo({ location: val })}
            placeholder="City, Country"
          />
          <span>•</span>
          <InlineEditableText
            value={profile.phone}
            onSave={(val) => updateBasicInfo({ phone: val })}
            placeholder="Phone"
          />
          <span>•</span>
          <InlineEditableText
            value={profile.email || ''}
            onSave={(val) => updateBasicInfo({ email: val })}
            placeholder="Email"
          />
          {profile.website_url && (
            <>
              <span>•</span>
              <InlineEditableText
                value={profile.website_url}
                onSave={(val) => updateBasicInfo({ website_url: val })}
                placeholder="Portfolio"
              />
            </>
          )}
          {profile.linkedin_url && (
            <>
              <span>•</span>
              <InlineEditableText
                value={profile.linkedin_url}
                onSave={(val) => updateBasicInfo({ linkedin_url: val })}
                placeholder="LinkedIn"
              />
            </>
          )}
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
