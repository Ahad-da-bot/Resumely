'use client'

import * as React from 'react'
import Link from 'next/link'
import { TemplateId, Profile, StyleConfig } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  FileCheck,
  LayoutTemplate,
} from 'lucide-react'

const sampleShowcaseProfile: Profile = {
  id: 'sample-preview',
  user_id: 'preview-user',
  name: 'Showcase Profile',
  is_master: true,
  full_name: 'Elena Rostova',
  title: 'Principal Distributed Systems Engineer',
  phone: '+1 (555) 392-1049',
  location: 'Seattle, WA',
  website_url: 'https://elenarostova.dev',
  linkedin_url: 'https://linkedin.com/in/elena-rostova',
  professional_summary:
    'Staff-level systems architect with 9+ years engineering fault-tolerant microservices, high-throughput message brokers, and leading distributed infrastructure scaling initiatives for Fortune 100 platforms.',
  years_of_experience: 9,
  primary_skills: [
    'Go',
    'Rust',
    'TypeScript',
    'Distributed Systems',
    'Kafka',
    'Kubernetes',
    'PostgreSQL',
    'gRPC',
  ],
  work_experience: [
    {
      id: 'exp-1',
      company: 'Apex Cloud Systems',
      role: 'Staff Infrastructure Architect',
      location: 'Seattle, WA',
      start_date: '2022',
      end_date: 'Present',
      current: true,
      bullets: [
        'Architected real-time streaming pipeline processing 18M+ transactions/sec with 99.999% SLA.',
        'Spearheaded migration of 140+ microservices to Kubernetes, slashing compute spend by $1.4M annually.',
      ],
    },
    {
      id: 'exp-2',
      company: 'Nexus Scale Labs',
      role: 'Senior Backend Engineer',
      location: 'San Francisco, CA',
      start_date: '2019',
      end_date: '2022',
      current: false,
      bullets: [
        'Designed asynchronous consensus engine that reduced inter-region synchronization latency by 45%.',
      ],
    },
  ],
  education: [
    {
      id: 'edu-1',
      school: 'University of Washington',
      degree: 'Master of Science',
      field_of_study: 'Computer Science & Distributed Systems',
      start_date: '2017',
      end_date: '2019',
      bullets: ["Thesis on Byzantine Fault Tolerance in High-Frequency Trading, Dean's Honors List"],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'VortexKV: In-Memory LSM-Tree Storage Engine',
      description: 'Ultra-low latency key-value storage engine engineered in Rust with zero-copy I/O.',
      technologies: ['Rust', 'io_uring', 'Raft'],
      bullets: [],
    },
  ],
  achievements: [
    {
      id: 'ach-1',
      title: 'ACM Distributed Systems Excellence Award',
      issuer: 'ACM SIGOPS',
      date: '2023',
    },
  ],
  certifications: [],
}

const templatesMetadata: {
  id: TemplateId
  name: string
  tagline: string
  badge: string
  accent: string
  description: string
}[] = [
  {
    id: 'craftsman',
    name: 'Craftsman Editorial',
    tagline: 'Warm Paper & Bookmaker Serif',
    badge: 'Editorial Standard',
    accent: '#A5392A',
    description: 'A tactile, bookmaker aesthetic designed for senior professionals and craft-led roles.',
  },
  {
    id: 'modern-minimal',
    name: 'Modern Minimalist',
    tagline: 'Crisp Swiss Sans Typography',
    badge: 'Recruiter Favorite',
    accent: '#0F172A',
    description: 'Ultra-clean sans typography with precise visual hierarchy. Highly ATS compatible.',
  },
  {
    id: 'tech-mono',
    name: 'Technical Linear',
    tagline: 'Light Terminal & Indigo Details',
    badge: 'Light Theme',
    accent: '#4F46E5',
    description: 'Structured command-line inspired layout tailored for engineers, data scientists, and architects.',
  },
  {
    id: 'executive-serif',
    name: 'Executive Classic',
    tagline: 'Formal Headers & Centered Authority',
    badge: 'Leadership Ready',
    accent: '#1E293B',
    description: 'Authoritative centered typography with horizontal dividers tailored for Directors and VPs.',
  },
]

export function TemplateShowcase() {
  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateId>('craftsman')

  const activeMeta = templatesMetadata.find((t) => t.id === selectedTemplate) || templatesMetadata[0]

  return (
    <div className="space-y-6 pt-6">
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <span className="label-hand text-base text-oxblood">live interactive gallery</span>
        <h2 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-ink">
          Crafted for Light Paper & High Legibility
        </h2>
        <p className="text-pencil text-xs sm:text-sm">
          All templates are strictly light-themed, screener-tested, and fully customizable in our live WYSIWYG studio.
        </p>
      </div>

      {/* Template Selection Tabs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-4xl mx-auto">
        {templatesMetadata.map((t) => {
          const isSelected = t.id === selectedTemplate
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => setSelectedTemplate(t.id)}
              className={`p-3.5 text-left rounded-md border transition-all relative ${
                isSelected
                  ? 'bg-card border-oxblood shadow-[3px_3px_0_rgba(165,57,42,0.25)] ring-1 ring-oxblood'
                  : 'bg-card/70 border-ink/15 hover:border-ink/30 hover:bg-card shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: t.accent }}
                />
                <span className="text-[10px] font-mono text-pencil uppercase">{t.badge}</span>
              </div>
              <h3 className="font-serif font-bold text-xs text-ink">{t.name}</h3>
              <p className="text-[11px] text-pencil font-sans leading-tight mt-0.5">{t.tagline}</p>
            </button>
          )
        })}
      </div>

      {/* Live Preview Canvas Container */}
      <div className="max-w-4xl mx-auto bg-card rounded-md border border-ink/20 shadow-[6px_8px_0_rgba(42,33,25,0.1)] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-dashed border-ink/15">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm text-ink">{activeMeta.name}</span>
              <Badge className="bg-sage/20 text-sage border-sage/30 text-[10px] font-mono">
                100% Light Themed
              </Badge>
            </div>
            <p className="text-xs text-pencil">{activeMeta.description}</p>
          </div>

          <Link href={`/auth?tab=signup`}>
            <Button
              size="sm"
              className="bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium border border-oxblood shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Build With This Template
            </Button>
          </Link>
        </div>

        {/* Rendered Template Sandbox */}
        <div className="border border-ink/15 rounded bg-paper/40 p-3 sm:p-4 max-h-[520px] overflow-y-auto shadow-inner">
          {selectedTemplate === 'craftsman' && (
            <div className="bg-[#FAF6EC] text-[#2A2119] font-serif p-6 rounded border border-[#DED4B4] space-y-4 text-xs">
              <div className="border-b-2 border-[#2A2119]/20 pb-3 flex justify-between items-baseline">
                <div>
                  <h1 className="text-2xl font-bold text-[#2A2119]">{sampleShowcaseProfile.full_name}</h1>
                  <p className="text-xs font-semibold text-oxblood">{sampleShowcaseProfile.title}</p>
                </div>
                <div className="text-[10px] text-[#6E6355] text-right font-sans">
                  <p>{sampleShowcaseProfile.location} · {sampleShowcaseProfile.phone}</p>
                  <p>{sampleShowcaseProfile.website_url}</p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E6355] font-bold">Executive Summary</span>
                <p className="italic text-[#2A2119]/90 text-[11px] leading-relaxed">{sampleShowcaseProfile.professional_summary}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#6E6355] font-bold">Experience</span>
                {sampleShowcaseProfile.work_experience.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold">{exp.role} <span className="font-normal text-pencil">— {exp.company}</span></span>
                      <span className="text-[10px] font-mono text-pencil">{exp.start_date} – {exp.end_date}</span>
                    </div>
                    <ul className="list-disc pl-4 text-[11px] text-[#2A2119]/80 space-y-0.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTemplate === 'modern-minimal' && (
            <div className="bg-white text-slate-900 font-sans p-6 rounded border border-slate-200 space-y-4 text-xs">
              <div className="border-b border-slate-200 pb-3">
                <h1 className="text-2xl font-extrabold text-slate-950">{sampleShowcaseProfile.full_name}</h1>
                <p className="text-xs font-semibold text-slate-600">{sampleShowcaseProfile.title}</p>
                <p className="text-[10px] text-slate-500 pt-0.5">{sampleShowcaseProfile.location} • {sampleShowcaseProfile.phone} • {sampleShowcaseProfile.website_url}</p>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Summary</span>
                <p className="text-slate-700 text-[11px] leading-relaxed">{sampleShowcaseProfile.professional_summary}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-900">Experience</span>
                {sampleShowcaseProfile.work_experience.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">{exp.role} · <span className="text-slate-600 font-normal">{exp.company}</span></span>
                      <span className="text-[10px] text-slate-500">{exp.start_date} – {exp.end_date}</span>
                    </div>
                    <ul className="list-disc pl-4 text-[11px] text-slate-700 space-y-0.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTemplate === 'tech-mono' && (
            <div className="bg-[#F8FAFC] text-slate-900 font-mono p-6 rounded border border-slate-300 space-y-4 text-xs">
              <div className="border-b border-indigo-200 pb-3 flex justify-between items-baseline">
                <div>
                  <h1 className="text-xl font-bold text-slate-950 font-sans">{sampleShowcaseProfile.full_name}</h1>
                  <p className="text-xs text-indigo-700 font-semibold">&gt; {sampleShowcaseProfile.title}</p>
                </div>
                <div className="text-[10px] text-slate-600 text-right">
                  <p>{sampleShowcaseProfile.location} | {sampleShowcaseProfile.phone}</p>
                  <p>web: {sampleShowcaseProfile.website_url}</p>
                </div>
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest">{"// OVERVIEW"}</span>
                <p className="text-slate-700 text-[11px] bg-white p-2.5 rounded border border-slate-200 leading-relaxed font-sans">{sampleShowcaseProfile.professional_summary}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] uppercase text-indigo-700 font-bold tracking-widest">{"// WORK_HISTORY"}</span>
                {sampleShowcaseProfile.work_experience.map((exp) => (
                  <div key={exp.id} className="space-y-1 pl-2 border-l-2 border-indigo-400">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900 font-sans">{exp.role} <span className="text-indigo-800 font-normal">@ {exp.company}</span></span>
                      <span className="text-[10px] text-indigo-700 font-mono">[{exp.start_date} → {exp.end_date}]</span>
                    </div>
                    <ul className="space-y-0.5 text-[11px] text-slate-700 font-sans">
                      {exp.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-1"><span className="text-indigo-600 font-mono">&gt;</span> {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedTemplate === 'executive-serif' && (
            <div className="bg-white text-[#1E293B] font-serif p-6 rounded border border-slate-300 space-y-4 text-xs">
              <div className="text-center pb-3 border-b-2 border-slate-800 space-y-0.5">
                <h1 className="text-2xl font-bold uppercase text-slate-900 tracking-wide">{sampleShowcaseProfile.full_name}</h1>
                <p className="text-xs uppercase tracking-widest text-slate-700 font-semibold">{sampleShowcaseProfile.title}</p>
                <p className="text-[10px] text-slate-600 font-sans pt-0.5">{sampleShowcaseProfile.location} | {sampleShowcaseProfile.phone} | {sampleShowcaseProfile.website_url}</p>
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 block">Executive Summary</span>
                <p className="text-slate-800 text-[11px] leading-relaxed text-justify">{sampleShowcaseProfile.professional_summary}</p>
              </div>
              <div className="space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 border-b border-slate-400 pb-0.5 block">Professional Experience</span>
                {sampleShowcaseProfile.work_experience.map((exp) => (
                  <div key={exp.id} className="space-y-0.5">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-slate-900">{exp.company} — <span className="italic font-normal text-slate-700">{exp.role}</span></span>
                      <span className="text-[10px] text-slate-600 font-sans">{exp.start_date} – {exp.end_date}</span>
                    </div>
                    <ul className="list-disc pl-4 text-[11px] text-slate-800 space-y-0.5">
                      {exp.bullets.map((b, i) => (
                        <li key={i}>{b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
