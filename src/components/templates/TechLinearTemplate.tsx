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

export function TechLinearTemplate({ profile, styleConfig }: TemplateProps) {
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
            <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest font-mono">
              {"// OVERVIEW"}
            </div>
            <InlineEditableText
              as="p"
              multiline
              value={profile.professional_summary}
              onSave={(val) => updateBasicInfo({ professional_summary: val })}
              placeholder="Professional summary..."
              className="text-slate-700 text-xs leading-relaxed font-sans bg-white p-3 rounded border border-slate-200 block shadow-2xs"
            />
          </div>
        )

      case 'experience':
        if (!profile.work_experience || profile.work_experience.length === 0) return null
        return (
          <div key="experience" className="space-y-3">
            <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest font-mono">
              {"// WORK_HISTORY"}
            </div>
            <div className="space-y-3.5">
              {profile.work_experience.map((exp) => (
                <div key={exp.id} className="space-y-1 pl-2.5 border-l-2 border-indigo-400">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <InlineEditableText
                        value={exp.role}
                        onSave={(val) => updateWorkExperience(exp.id, { role: val })}
                        className="font-bold text-slate-900 text-xs font-sans"
                      />
                      <span className="text-slate-500 text-xs"> @ </span>
                      <InlineEditableText
                        value={exp.company}
                        onSave={(val) => updateWorkExperience(exp.id, { company: val })}
                        className="text-indigo-800 text-xs font-medium"
                      />
                      {exp.location && (
                        <span className="text-slate-500 text-[10px]"> [{exp.location}]</span>
                      )}
                    </div>
                    <span className="text-[10px] text-indigo-700 font-mono">
                      [{exp.start_date} → {exp.current ? 'NOW' : exp.end_date}]
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="space-y-1 pl-1 text-slate-700 text-xs font-sans">
                      {exp.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-mono select-none font-bold">&gt;</span>
                          <InlineEditableText
                            value={bullet}
                            multiline
                            onSave={(val) => updateBulletPoint(exp.id, bIdx, val)}
                            className="leading-snug flex-1"
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
            <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest font-mono">
              {"// PROJECTS"}
            </div>
            <div className="space-y-2">
              {profile.projects.map((proj) => (
                <div key={proj.id} className="p-2.5 rounded bg-white border border-slate-200 space-y-0.5 shadow-2xs">
                  <InlineEditableText
                    value={proj.title}
                    onSave={(val) => updateProject(proj.id, { title: val })}
                    className="font-bold text-xs text-slate-900 block"
                  />
                  <InlineEditableText
                    value={proj.description}
                    multiline
                    onSave={(val) => updateProject(proj.id, { description: val })}
                    className="text-slate-600 text-[11px] block font-sans"
                  />
                  {proj.technologies && proj.technologies.length > 0 && (
                    <div className="text-[9px] text-indigo-700 font-mono">
                      tech: {proj.technologies.join(', ')}
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
            <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest font-mono">
              {"// EDUCATION"}
            </div>
            <div className="space-y-2">
              {profile.education.map((edu) => (
                <div key={edu.id} className="space-y-1 p-2.5 rounded bg-white border border-slate-200">
                  <div className="flex justify-between items-baseline text-xs text-slate-800">
                    <div>
                      <InlineEditableText
                        value={edu.degree}
                        onSave={(val) => updateEducation(edu.id, { degree: val })}
                        className="font-bold text-slate-900 font-sans"
                      />
                      <span> in </span>
                      <InlineEditableText
                        value={edu.field_of_study}
                        onSave={(val) => updateEducation(edu.id, { field_of_study: val })}
                        className="text-indigo-700 font-semibold"
                      />
                      <span className="text-slate-500"> — </span>
                      <InlineEditableText
                        value={edu.school}
                        onSave={(val) => updateEducation(edu.id, { school: val })}
                        className="text-slate-600"
                      />
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
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
                    <ul className="space-y-0.5 pl-2 text-slate-600 text-[11px] font-sans">
                      {edu.bullets.map((bullet, bIdx) => (
                        <li key={bIdx} className="flex items-start gap-1.5">
                          <span className="text-indigo-600 font-mono select-none font-bold">*</span>
                          <InlineEditableText
                            value={bullet}
                            multiline
                            onSave={(val) => updateEducationBullet(edu.id, bIdx, val)}
                            className="leading-tight flex-1"
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
            <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest font-mono">
              {"// TECH_STACK"}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5">
              {profile.primary_skills.map((skill, sIdx) => (
                <span
                  key={sIdx}
                  className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-800 text-[10px] font-mono border border-indigo-200 font-medium"
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
            <div className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest font-mono">
              {"// HONORS_AND_AWARDS"}
            </div>
            <div className="space-y-1">
              {profile.achievements.map((ach) => (
                <div key={ach.id} className="flex justify-between items-baseline text-xs text-slate-800">
                  <div>
                    <InlineEditableText
                      value={ach.title}
                      onSave={(val) => updateAchievement(ach.id, { title: val })}
                      className="font-bold text-slate-900"
                    />
                    <span className="text-slate-500"> — </span>
                    <InlineEditableText
                      value={ach.issuer}
                      onSave={(val) => updateAchievement(ach.id, { issuer: val })}
                      className="text-slate-600"
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">{ach.date}</span>
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
    <div className="w-full bg-[#F8FAFC] text-slate-900 font-mono p-8 md:p-10 shadow-lg border border-slate-300 rounded-sm space-y-5 text-xs leading-relaxed">
      {/* Header */}
      <div className="border-b border-indigo-200 pb-3 space-y-1">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <div>
            <InlineEditableText
              as="h1"
              value={profile.full_name}
              onSave={(val) => updateBasicInfo({ full_name: val })}
              placeholder="Your Full Name"
              className="text-2xl font-bold tracking-tight text-slate-950 font-sans block"
            />
            <div className="text-xs text-indigo-700 font-mono mt-0.5 flex items-center gap-1 font-semibold">
              <span>&gt;</span>
              <InlineEditableText
                value={profile.title}
                onSave={(val) => updateBasicInfo({ title: val })}
                placeholder="Systems Architect"
              />
            </div>
          </div>
          <div className="text-[10px] text-slate-600 text-left md:text-right space-y-0.5 font-mono">
            <div>
              <InlineEditableText
                value={profile.location}
                onSave={(val) => updateBasicInfo({ location: val })}
                placeholder="Location"
              />
              {' | '}
              <InlineEditableText
                value={profile.phone}
                onSave={(val) => updateBasicInfo({ phone: val })}
                placeholder="Phone"
              />
              {' | '}
              <InlineEditableText
                value={profile.email || ''}
                onSave={(val) => updateBasicInfo({ email: val })}
                placeholder="Email"
              />
            </div>
            {profile.website_url && (
              <div>
                web:{' '}
                <InlineEditableText
                  value={profile.website_url}
                  onSave={(val) => updateBasicInfo({ website_url: val })}
                  placeholder="URL"
                />
              </div>
            )}
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
