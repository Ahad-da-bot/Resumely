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

export function ExecutiveSerifTemplate({ profile, styleConfig }: TemplateProps) {
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
              Executive Summary
            </h2>
            <InlineEditableText
              as="p"
              multiline
              value={profile.professional_summary}
              onSave={(val) => updateBasicInfo({ professional_summary: val })}
              placeholder="Executive summary..."
              className="text-xs leading-relaxed text-slate-800 block text-justify"
            />
          </div>
        )

      case 'experience':
        if (!profile.work_experience || profile.work_experience.length === 0) return null
        return (
          <div key="experience" className="space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
              Professional Experience
            </h2>
            <div className="space-y-3.5">
              {profile.work_experience.map((exp) => (
                <div key={exp.id} className="space-y-1">
                  <div className="flex justify-between items-baseline">
                    <div>
                      <InlineEditableText
                        value={exp.company}
                        onSave={(val) => updateWorkExperience(exp.id, { company: val })}
                        className="font-bold text-slate-900 text-xs"
                      />
                      <span className="italic text-slate-700 text-xs"> — </span>
                      <InlineEditableText
                        value={exp.role}
                        onSave={(val) => updateWorkExperience(exp.id, { role: val })}
                        className="italic text-slate-700 text-xs"
                      />
                      {exp.location && (
                        <span className="text-slate-500 font-sans text-[10px]"> ({exp.location})</span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-600 font-sans">
                      {exp.start_date} – {exp.current ? 'Present' : exp.end_date}
                    </span>
                  </div>
                  {exp.bullets && exp.bullets.length > 0 && (
                    <ul className="list-disc space-y-1 pl-4 pt-0.5 text-slate-800 text-xs text-justify">
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
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
              Strategic Initiatives & Projects
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
                    className="text-slate-700 text-xs block"
                  />
                </div>
              ))}
            </div>
          </div>
        )

      case 'education':
        if (!profile.education || profile.education.length === 0) return null
        return (
          <div key="education" className="space-y-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
              Education & Academic Honors
            </h2>
            <div className="space-y-1.5">
              {profile.education.map((edu) => (
                <div key={edu.id} className="space-y-0.5">
                  <div className="flex justify-between items-baseline text-xs">
                    <div>
                      <InlineEditableText
                        value={edu.school}
                        onSave={(val) => updateEducation(edu.id, { school: val })}
                        className="font-bold text-slate-900"
                      />
                      <span className="italic text-slate-700"> — </span>
                      <InlineEditableText
                        value={edu.degree}
                        onSave={(val) => updateEducation(edu.id, { degree: val })}
                        className="italic text-slate-700"
                      />
                      <span> in </span>
                      <InlineEditableText
                        value={edu.field_of_study}
                        onSave={(val) => updateEducation(edu.id, { field_of_study: val })}
                        className="italic text-slate-700"
                      />
                    </div>
                    <div className="text-[11px] text-slate-600 font-sans flex items-center gap-1">
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
                    <ul className="list-disc space-y-0.5 pl-4 text-slate-700 text-[11px]">
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
          <div key="skills" className="space-y-1">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
              Core Competencies & Leadership
            </h2>
            <p className="text-xs text-slate-800 font-sans leading-relaxed">
              {profile.primary_skills.join(' • ')}
            </p>
          </div>
        )

      case 'achievements':
        if (!profile.achievements || profile.achievements.length === 0) return null
        return (
          <div key="achievements" className="space-y-1.5">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5">
              Executive Honors & Recognition
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
                    <span className="text-slate-700"> — </span>
                    <InlineEditableText
                      value={ach.issuer}
                      onSave={(val) => updateAchievement(ach.id, { issuer: val })}
                      className="text-slate-700"
                    />
                  </div>
                  <span className="text-[11px] text-slate-600 font-sans">{ach.date}</span>
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
    <div className="w-full bg-[#FFFFFF] text-[#1E293B] font-serif p-8 md:p-10 shadow-lg border border-slate-300 rounded-none space-y-5 text-xs leading-relaxed">
      {/* Centered Classic Header */}
      <div className="text-center pb-3 border-b-2 border-slate-800 space-y-1">
        <InlineEditableText
          as="h1"
          value={profile.full_name}
          onSave={(val) => updateBasicInfo({ full_name: val })}
          placeholder="Your Full Name"
          className="text-3xl font-bold tracking-normal uppercase text-slate-900 block"
        />
        <InlineEditableText
          as="p"
          value={profile.title}
          onSave={(val) => updateBasicInfo({ title: val })}
          placeholder="Executive Leadership & Strategy"
          className="text-xs font-semibold uppercase tracking-widest text-slate-700 block"
        />
        <div className="text-[11px] text-slate-600 font-sans pt-1 flex justify-center flex-wrap gap-x-2">
          <InlineEditableText
            value={profile.location}
            onSave={(val) => updateBasicInfo({ location: val })}
            placeholder="Location"
          />
          <span>|</span>
          <InlineEditableText
            value={profile.phone}
            onSave={(val) => updateBasicInfo({ phone: val })}
            placeholder="Phone"
          />
          <span>|</span>
          <InlineEditableText
            value={profile.email || ''}
            onSave={(val) => updateBasicInfo({ email: val })}
            placeholder="Email"
          />
          {profile.website_url && (
            <>
              <span>|</span>
              <InlineEditableText
                value={profile.website_url}
                onSave={(val) => updateBasicInfo({ website_url: val })}
                placeholder="Portfolio"
              />
            </>
          )}
          {profile.linkedin_url && (
            <>
              <span>|</span>
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
