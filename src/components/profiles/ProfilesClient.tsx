'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Profile, WorkExperience, Education, Project, Achievement } from '@/types/resume'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import Link from 'next/link'
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
import { Badge } from '@/components/ui/badge'
import { InlineAIRewriter } from '@/components/editor/InlineAIRewriter'
import {
  User,
  Copy,
  Trash2,
  Edit3,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Briefcase,
  Layers,
  Loader2,
  Plus,
  X,
  GraduationCap,
  FolderOpen,
  Award,
} from 'lucide-react'

interface ProfilesClientProps {
  initialProfiles: Profile[]
  userId: string
}

export function ProfilesClient({ initialProfiles, userId }: ProfilesClientProps) {
  const router = useRouter()
  const [profiles, setProfiles] = React.useState<Profile[]>(initialProfiles)
  const [isActionLoading, setIsActionLoading] = React.useState<string | null>(null)
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [editingProfile, setEditingProfile] = React.useState<Profile | null>(null)

  // Form state for creating / editing
  const [formProfileName, setFormProfileName] = React.useState('')
  const [formFullName, setFormFullName] = React.useState('')
  const [formTitle, setFormTitle] = React.useState('')
  const [formPhone, setFormPhone] = React.useState('')
  const [formLocation, setFormLocation] = React.useState('')
  const [formSummary, setFormSummary] = React.useState('')
  const [formSkills, setFormSkills] = React.useState('')
  
  const [formWork, setFormWork] = React.useState<WorkExperience[]>([])
  const [formEducation, setFormEducation] = React.useState<Education[]>([])
  const [formProjects, setFormProjects] = React.useState<Project[]>([])
  const [formAchievements, setFormAchievements] = React.useState<Achievement[]>([])
  
  const [activeAIExperienceId, setActiveAIExperienceId] = React.useState<string | null>(null)
  const [activeAIBulletIndex, setActiveAIBulletIndex] = React.useState<number | null>(null)

  const [isSavingForm, setIsSavingForm] = React.useState(false)
  const supabase = React.useMemo(() => createClient(), [])

  const openCreateModal = () => {
    const master = profiles.find((p) => p.is_master) || profiles[0]
    setFormProfileName('')
    setFormFullName(master?.full_name || '')
    setFormTitle(master?.title || '')
    setFormPhone(master?.phone || '')
    setFormLocation(master?.location || '')
    setFormSummary(master?.professional_summary || master?.summary || '')
    setFormSkills((master?.primary_skills || []).join(', '))
    
    // Copy master arrays
    setFormWork(JSON.parse(JSON.stringify(master?.work_experience || [])))
    setFormEducation(JSON.parse(JSON.stringify(master?.education || [])))
    setFormProjects(JSON.parse(JSON.stringify(master?.projects || [])))
    setFormAchievements(JSON.parse(JSON.stringify(master?.achievements || master?.certifications || [])))
    
    setEditingProfile(null)
    setShowCreateModal(true)
  }

  const openEditModal = (p: Profile) => {
    setEditingProfile(p)
    setFormProfileName(p.name)
    setFormFullName(p.full_name)
    setFormTitle(p.title)
    setFormPhone(p.phone)
    setFormLocation(p.location)
    setFormSummary(p.professional_summary || p.summary || '')
    setFormSkills((p.primary_skills || []).join(', '))
    
    setFormWork(JSON.parse(JSON.stringify(p.work_experience || [])))
    setFormEducation(JSON.parse(JSON.stringify(p.education || [])))
    setFormProjects(JSON.parse(JSON.stringify(p.projects || [])))
    setFormAchievements(JSON.parse(JSON.stringify(p.achievements || p.certifications || [])))

    setShowCreateModal(true)
  }

  const handleSaveProfileForm = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formProfileName.trim() && !editingProfile) {
      toast.error('Profile Name Required')
      return
    }

    setIsSavingForm(true)
    const skillsArray = formSkills.split(',').map((s) => s.trim()).filter(Boolean)

    const payload = {
      name: formProfileName.trim() || (editingProfile ? editingProfile.name : 'New Profile'),
      full_name: formFullName.trim(),
      title: formTitle.trim(),
      phone: formPhone.trim(),
      location: formLocation.trim(),
      professional_summary: formSummary.trim(),
      summary: formSummary.trim(),
      primary_skills: skillsArray,
      skills: skillsArray.join(', '),
      work_experience: formWork,
      education: formEducation,
      projects: formProjects,
      achievements: formAchievements,
      certifications: formAchievements, // maintain backwards compatibility in schema
      updated_at: new Date().toISOString(),
    }

    try {
      if (editingProfile) {
        const { data, error } = await supabase
          .from('profiles')
          .update(payload)
          .eq('id', editingProfile.id)
          .select()
          .single()

        if (error) throw error
        toast.success('Profile Updated!')
        setProfiles((prev) => prev.map((p) => (p.id === editingProfile.id ? (data as Profile) : p)))
      } else {
        const { data, error } = await supabase
          .from('profiles')
          .insert({
            ...payload,
            user_id: userId,
            is_master: false,
          })
          .select()
          .single()

        if (error) throw error
        toast.success('New Profile Created!')
        if (data) {
          setProfiles((prev) => [data as Profile, ...prev])
        }
      }

      setShowCreateModal(false)
      router.refresh()
    } catch (err: unknown) {
      toast.error('Error saving profile', { description: err instanceof Error ? err.message : 'Failed' })
    } finally {
      setIsSavingForm(false)
    }
  }

  const handleDuplicate = async (profile: Profile) => {
    setIsActionLoading(profile.id)
    try {
      const clonedName = `${profile.name} (Copy)`
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          name: clonedName,
          is_master: false,
          full_name: profile.full_name,
          title: profile.title,
          phone: profile.phone,
          location: profile.location,
          website_url: profile.website_url,
          linkedin_url: profile.linkedin_url,
          professional_summary: profile.professional_summary,
          summary: profile.summary,
          years_of_experience: Number(profile.years_of_experience) || 0,
          primary_skills: profile.primary_skills,
          skills: profile.skills,
          work_experience: profile.work_experience,
          education: profile.education,
          projects: profile.projects,
          certifications: profile.certifications || profile.achievements || [],
        })
        .select()
        .single()

      if (error) throw error
      toast.success('Profile Cloned!')
      if (data) {
        setProfiles((prev) => [data as Profile, ...prev])
      }
      router.refresh()
    } catch (err: unknown) {
      toast.error('Error duplicating profile')
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleDelete = async (profileId: string, isMaster: boolean) => {
    if (isMaster) {
      toast.error('Cannot Delete Master Profile')
      return
    }
    if (!confirm('Are you sure you want to delete this profile variant?')) return
    setIsActionLoading(profileId)
    try {
      const { error } = await supabase.from('profiles').delete().eq('id', profileId)
      if (error) throw error
      toast.success('Profile deleted')
      setProfiles((prev) => prev.filter((p) => p.id !== profileId))
      router.refresh()
    } catch (err: unknown) {
      toast.error('Error deleting profile')
    } finally {
      setIsActionLoading(null)
    }
  }

  // Work Experience Helpers
  const addWork = () => setFormWork([{
    id: crypto.randomUUID(), company: 'New Company', role: 'Role', location: '', start_date: '', end_date: '', current: false, bullets: ['Added new role']
  }, ...formWork])
  const removeWork = (id: string) => setFormWork(formWork.filter(w => w.id !== id))
  const updateWork = (id: string, updates: Partial<WorkExperience>) => setFormWork(formWork.map(w => w.id === id ? { ...w, ...updates } : w))
  const addBullet = (id: string) => updateWork(id, { bullets: [...(formWork.find(w => w.id === id)?.bullets || []), 'New achievement'] })
  const updateBullet = (id: string, idx: number, val: string) => {
    const w = formWork.find(x => x.id === id)
    if (w) {
      const b = [...(w.bullets || [])]
      b[idx] = val
      updateWork(id, { bullets: b })
    }
  }
  const removeBullet = (id: string, idx: number) => {
    const w = formWork.find(x => x.id === id)
    if (w) {
      const b = [...(w.bullets || [])]
      b.splice(idx, 1)
      updateWork(id, { bullets: b })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-card p-4 rounded-md border border-ink/15 shadow-sm">
        <div>
          <h2 className="font-serif font-bold text-sm text-ink">
            Your Profiles ({profiles.length})
          </h2>
          <p className="text-xs text-pencil">Maintain distinct resumes tailored for each company or niche.</p>
        </div>
        <Button size="sm" onClick={openCreateModal} className="bg-oxblood hover:bg-oxblood/90 text-card text-xs">
          <Plus className="w-3.5 h-3.5 mr-1" /> Add New Profile
        </Button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {profiles.map((profile) => (
          <Card key={profile.id} className="border border-ink/15 bg-card text-ink shadow-[3px_4px_0_rgba(42,33,25,0.08)] rounded-md flex flex-col justify-between">
            <CardHeader className="pb-3 border-b border-dashed border-ink/15">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <CardTitle className="font-serif text-lg font-bold text-ink">{profile.name}</CardTitle>
                  <CardDescription className="text-oxblood text-xs font-medium mt-0.5">{profile.title || 'Untitled Role'}</CardDescription>
                </div>
                {profile.is_master ? (
                  <Badge className="bg-sage/20 text-sage border-sage/30 text-[10px] font-mono shrink-0">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Master
                  </Badge>
                ) : (
                  <Badge className="bg-paper text-pencil border-ink/15 text-[10px] font-mono shrink-0">
                    Niche Variant
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-3 pt-4 text-xs">
              <div className="space-y-1 text-pencil">
                <p className="font-medium text-ink">{profile.full_name}</p>
                <p className="text-[11px]">{profile.location || 'Location Not Specified'} · {profile.phone || 'No phone'}</p>
              </div>
              {profile.professional_summary && (
                <p className="text-[11px] text-pencil line-clamp-3 italic font-serif bg-paper/60 p-2 rounded border border-ink/10">
                  &ldquo;{profile.professional_summary}&rdquo;
                </p>
              )}
            </CardContent>
            <CardFooter className="flex items-center justify-between border-t border-dashed border-ink/15 pt-3 pb-3">
              <div className="flex items-center gap-1.5">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(profile)} className="h-8 px-2 text-pencil hover:text-ink hover:bg-paper text-xs">
                  <Edit3 className="w-3.5 h-3.5 mr-1" /> Edit
                </Button>
                <Button size="sm" variant="ghost" onClick={() => handleDuplicate(profile)} disabled={isActionLoading === profile.id} className="h-8 px-2 text-pencil hover:text-ink hover:bg-paper text-xs">
                  {isActionLoading === profile.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <><Copy className="w-3.5 h-3.5 mr-1" /> Clone</>}
                </Button>
                {!profile.is_master && (
                  <Button size="sm" variant="ghost" onClick={() => handleDelete(profile.id, profile.is_master)} disabled={isActionLoading === profile.id} className="h-8 px-2 text-pencil hover:text-oxblood hover:bg-paper text-xs">
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
              <Link href={`/resumes/new?profileId=${profile.id}`}>
                <Button size="sm" className="h-8 px-3 bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium border border-oxblood">
                  <Sparkles className="w-3 h-3 mr-1" /> Build
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-ink/20 rounded-md shadow-[6px_8px_0_rgba(42,33,25,0.15)] max-w-2xl w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <button type="button" onClick={() => setShowCreateModal(false)} className="absolute top-4 right-4 text-pencil hover:text-ink">
              <X className="w-4 h-4" />
            </button>
            <div>
              <span className="label-hand text-sm text-oxblood">{editingProfile ? 'Modify Profile Variant' : 'New Career Variant'}</span>
              <h2 className="font-serif text-xl font-bold text-ink">{editingProfile ? `Edit "${editingProfile.name}"` : 'Add New Profile Variant'}</h2>
              <p className="text-xs text-pencil">Customize headlines, skills, and summary for targeted job applications.</p>
            </div>
            
            <form onSubmit={handleSaveProfileForm} className="space-y-6 pt-2">
              
              {/* Basic Info */}
              <div className="space-y-3 p-3 bg-paper/30 border border-ink/10 rounded">
                <h3 className="font-serif font-bold text-sm text-ink border-b border-ink/10 pb-1 flex items-center gap-2"><User className="w-4 h-4" /> Basics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs text-pencil">Profile Name *</Label>
                    <Input value={formProfileName} onChange={(e) => setFormProfileName(e.target.value)} required className="h-8 text-xs bg-card" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-pencil">Target Role</Label>
                    <Input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} className="h-8 text-xs bg-card" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-pencil">Full Name</Label>
                    <Input value={formFullName} onChange={(e) => setFormFullName(e.target.value)} className="h-8 text-xs bg-card" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs text-pencil">Phone</Label>
                    <Input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} className="h-8 text-xs bg-card" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-pencil">Skills (comma-separated)</Label>
                  <Input value={formSkills} onChange={(e) => setFormSkills(e.target.value)} className="h-8 text-xs bg-card" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-pencil">Summary</Label>
                  <Textarea value={formSummary} onChange={(e) => setFormSummary(e.target.value)} className="text-xs bg-card" rows={3} />
                </div>
              </div>

              {/* Work Experience */}
              <div className="space-y-3 p-3 bg-paper/30 border border-ink/10 rounded">
                <div className="flex items-center justify-between border-b border-ink/10 pb-1">
                  <h3 className="font-serif font-bold text-sm text-ink flex items-center gap-2"><Briefcase className="w-4 h-4" /> Work Experience</h3>
                  <Button type="button" size="sm" onClick={addWork} className="h-6 text-[10px] bg-paper text-ink hover:bg-card border border-ink/20"><Plus className="w-3 h-3 mr-1" /> Add</Button>
                </div>
                
                <div className="space-y-4">
                  {formWork.map((exp) => (
                    <div key={exp.id} className="p-2 border border-ink/10 bg-card rounded relative">
                      <button type="button" onClick={() => removeWork(exp.id)} className="absolute top-2 right-2 text-pencil hover:text-oxblood"><Trash2 className="w-3 h-3" /></button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2 pr-6">
                        <Input value={exp.role || ''} onChange={(e) => updateWork(exp.id, { role: e.target.value })} placeholder="Role" className="h-7 text-xs bg-paper/50" />
                        <Input value={exp.company || ''} onChange={(e) => updateWork(exp.id, { company: e.target.value })} placeholder="Company" className="h-7 text-xs bg-paper/50" />
                      </div>
                      
                      <div className="space-y-1.5 pt-1 border-t border-ink/5 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-mono text-pencil">Bullets:</span>
                          <button type="button" onClick={() => addBullet(exp.id)} className="text-[10px] text-oxblood hover:underline">+ Bullet</button>
                        </div>
                        {exp.bullets?.map((bullet, bIdx) => (
                          <div key={bIdx} className="space-y-1">
                            <div className="flex items-start gap-1">
                              <Textarea value={bullet} onChange={(e) => updateBullet(exp.id, bIdx, e.target.value)} rows={2} className="text-xs bg-paper/50 min-h-[40px] p-1.5" />
                              <Button type="button" size="sm" variant="outline" onClick={() => { setActiveAIExperienceId(exp.id); setActiveAIBulletIndex(bIdx); }} className="h-7 px-2 bg-paper text-oxblood text-xs"><Sparkles className="w-3 h-3" /></Button>
                              <button type="button" onClick={() => removeBullet(exp.id, bIdx)} className="text-pencil hover:text-oxblood p-1"><Trash2 className="w-3 h-3" /></button>
                            </div>
                            {activeAIExperienceId === exp.id && activeAIBulletIndex === bIdx && (
                              <InlineAIRewriter 
                                currentText={bullet}
                                onAccept={(t) => { updateBullet(exp.id, bIdx, t); setActiveAIExperienceId(null); setActiveAIBulletIndex(null); }}
                                onCancel={() => { setActiveAIExperienceId(null); setActiveAIBulletIndex(null); }}
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-2 pt-3 border-t border-dashed border-ink/15 sticky bottom-0 bg-card py-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowCreateModal(false)} className="bg-paper border-ink/20 text-xs">Cancel</Button>
                <Button type="submit" size="sm" disabled={isSavingForm} className="bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium border border-oxblood">
                  {isSavingForm ? <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin" /> : 'Save Profile'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
