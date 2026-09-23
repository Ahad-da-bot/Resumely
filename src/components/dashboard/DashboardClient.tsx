'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Resume, Folder, Profile } from '@/types/resume'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Folder as FolderIcon,
  Plus,
  FileText,
  Trash2,
  Copy,
  ExternalLink,
  Target,
  Sparkles,
  Layers,
  Clock,
  User,
  Filter,
  MoveRight,
  X,
  Upload,
  Loader2,
} from 'lucide-react'

interface DashboardClientProps {
  initialResumes: Resume[]
  initialFolders: Folder[]
  profiles: Profile[]
  userId: string
}

export function DashboardClient({
  initialResumes,
  initialFolders,
  profiles,
  userId,
}: DashboardClientProps) {
  const router = useRouter()
  const [resumes, setResumes] = React.useState<Resume[]>(initialResumes)
  const [folders, setFolders] = React.useState<Folder[]>(initialFolders)
  const [selectedFolderFilter, setSelectedFolderFilter] = React.useState<string | 'all'>('all')
  const [newFolderName, setNewFolderName] = React.useState('')
  const [isCreatingFolder, setIsCreatingFolder] = React.useState(false)
  const [showImportModal, setShowImportModal] = React.useState(false)
  const [showCreatorNoteModal, setShowCreatorNoteModal] = React.useState(false)
  const [creatorNote, setCreatorNote] = React.useState('')
  const [isSubmittingNote, setIsSubmittingNote] = React.useState(false)
  const [isUploading, setIsUploading] = React.useState(false)

  const supabase = React.useMemo(() => createClient(), [])

  // Create Folder
  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newFolderName.trim()) return

    try {
      const { data, error } = await supabase
        .from('folders')
        .insert({
          user_id: userId,
          name: newFolderName.trim(),
          color: 'oxblood',
        })
        .select()
        .single()

      if (error) throw error

      toast.success('Folder created!', { description: `Folder "${newFolderName}" ready.` })
      if (data) {
        setFolders((prev) => [...prev, data as Folder])
      }
      setNewFolderName('')
      setIsCreatingFolder(false)
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create folder'
      toast.error('Error creating folder', { description: message })
    }
  }

  // Delete Resume
  const handleDeleteResume = async (resumeId: string) => {
    if (!confirm('Are you sure you want to delete this resume?')) return

    try {
      const { error } = await supabase.from('resumes').delete().eq('id', resumeId)
      if (error) throw error
      toast.success('Resume deleted')
      setResumes((prev) => prev.filter((r) => r.id !== resumeId))
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete resume'
      toast.error('Error deleting resume', { description: message })
    }
  }

  // Duplicate Resume
  const handleDuplicateResume = async (resume: Resume) => {
    try {
      const { data, error } = await supabase
        .from('resumes')
        .insert({
          user_id: userId,
          profile_id: resume.profile_id,
          folder_id: resume.folder_id,
          title: `${resume.title} (Copy)`,
          template_id: resume.template_id,
          target_job_title: resume.target_job_title,
          target_job_description: resume.target_job_description,
          ats_score: resume.ats_score,
          content_overrides: resume.content_overrides,
          style_config: resume.style_config,
        })
        .select()
        .single()

      if (error) throw error
      toast.success('Resume duplicated')
      if (data) {
        setResumes((prev) => [data as Resume, ...prev])
      }
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to duplicate resume'
      toast.error('Error duplicating resume', { description: message })
    }
  }

  const handleMoveToFolder = async (resumeId: string, folderId: string | null) => {
    try {
      const { error } = await supabase
        .from('resumes')
        .update({ folder_id: folderId })
        .eq('id', resumeId)

      if (error) throw error
      toast.success('Resume moved')
      setResumes((prev) =>
        prev.map((r) => (r.id === resumeId ? { ...r, folder_id: folderId } : r))
      )
      router.refresh()
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to move resume'
      toast.error('Error moving resume', { description: message })
    }
  }

  const handleSubmitCreatorNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!creatorNote.trim()) return

    setIsSubmittingNote(true)
    try {
      const res = await fetch('/api/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: creatorNote }),
      })
      if (!res.ok) throw new Error('Failed to submit note')
      
      toast.success('Note sent!', { description: 'Thank you for your feedback.' })
      setCreatorNote('')
      setShowCreatorNoteModal(false)
    } catch (err: unknown) {
      toast.error('Failed to send note', { description: 'Please try again later.' })
    } finally {
      setIsSubmittingNote(false)
    }
  }

  const handleDashboardUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
      localStorage.setItem('resumeUploadCache', JSON.stringify(data))
      router.push('/onboarding?step=1')
    } catch (error) {
      console.error('Error uploading resume:', error)
      toast.error('Parse Error', { description: 'Failed to extract details.' })
    } finally {
      setIsUploading(false)
      if (e.target) e.target.value = ''
    }
  }

  const filteredResumes =
    selectedFolderFilter === 'all'
      ? resumes
      : resumes.filter((r) => r.folder_id === selectedFolderFilter)

  const resumesNotInCurrentFolder = resumes.filter(r => r.folder_id !== selectedFolderFilter)

  return (
    <div className="grid lg:grid-cols-12 gap-8 relative">
      {/* Left Sidebar: Folders & Categories (4 Cols) */}
      <div className="lg:col-span-4 space-y-5">
        <Card className="border border-ink/15 bg-card text-ink shadow-[3px_4px_0_rgba(42,33,25,0.08)] rounded-md">
          <CardHeader className="pb-3 border-b border-dashed border-ink/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderIcon className="w-4 h-4 text-oxblood" />
                <CardTitle className="font-serif text-base font-bold text-ink">
                  Folders & Categories
                </CardTitle>
              </div>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => setIsCreatingFolder(!isCreatingFolder)}
                className="h-7 px-2 text-pencil hover:text-ink text-xs"
              >
                <Plus className="w-3.5 h-3.5" />
              </Button>
            </div>
            <CardDescription className="text-pencil text-xs font-normal">
              Organize your tailored documents by company, niche, or cohort
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-3 pt-3">
            {/* Create Folder Form */}
            {isCreatingFolder && (
              <form onSubmit={handleCreateFolder} className="p-2.5 rounded bg-paper border border-ink/15 space-y-2">
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name (e.g. Remote Startups)"
                  className="h-7 text-xs bg-card border-ink/15 text-ink"
                  autoFocus
                />
                <div className="flex justify-end gap-1.5">
                  <Button
                    type="button"
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsCreatingFolder(false)}
                    className="h-6 text-[11px] px-2 text-pencil"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    size="sm"
                    className="h-6 text-[11px] px-2 bg-oxblood text-card"
                  >
                    Create
                  </Button>
                </div>
              </form>
            )}

            {/* Folder List Items */}
            <div className="space-y-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedFolderFilter('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                  selectedFolderFilter === 'all'
                    ? 'bg-paper text-ink font-bold border border-ink/15'
                    : 'text-pencil hover:bg-paper/50'
                }`}
              >
                <span className="flex items-center gap-2">
                  <Layers className="w-3.5 h-3.5 text-oxblood" />
                  All Documents
                </span>
                <span className="font-mono text-[10px] text-pencil">{resumes.length}</span>
              </button>

              {folders.map((folder) => {
                const count = resumes.filter((r) => r.folder_id === folder.id).length
                return (
                  <button
                    key={folder.id}
                    type="button"
                    onClick={() => setSelectedFolderFilter(folder.id)}
                    className={`w-full text-left px-2.5 py-1.5 rounded flex items-center justify-between transition-colors ${
                      selectedFolderFilter === folder.id
                        ? 'bg-paper text-ink font-bold border border-ink/15'
                        : 'text-pencil hover:bg-paper/50'
                    }`}
                  >
                    <span className="flex items-center gap-2 truncate">
                      <FolderIcon className="w-3.5 h-3.5 text-sage" />
                      <span className="truncate">{folder.name}</span>
                    </span>
                    <span className="font-mono text-[10px] text-pencil">{count}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Quick Profiles Widget */}
        <Card className="border border-ink/15 bg-card text-ink shadow-[3px_4px_0_rgba(42,33,25,0.08)] rounded-md">
          <CardHeader className="pb-2 border-b border-dashed border-ink/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-oxblood" />
                <CardTitle className="font-serif text-sm font-bold text-ink">
                  Profile Variants
                </CardTitle>
              </div>
              <Link href="/profiles" className="hand text-xs text-oxblood hover:underline font-bold">
                Manage ({profiles.length})
              </Link>
            </div>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            {profiles.slice(0, 3).map((p) => (
              <div key={p.id} className="flex items-center justify-between py-1 border-b border-ink/5 last:border-0">
                <span className="truncate font-medium text-ink">{p.name}</span>
                {p.is_master ? (
                  <span className="text-[10px] font-mono text-sage font-bold">Master</span>
                ) : (
                  <span className="text-[10px] font-mono text-pencil">Variant</span>
                )}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Contact Creator Widget */}
        <Card className="border border-ink/15 bg-card text-ink shadow-[3px_4px_0_rgba(42,33,25,0.08)] rounded-md">
          <CardHeader className="pb-2 border-b border-dashed border-ink/15">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-oxblood" />
                <CardTitle className="font-serif text-sm font-bold text-ink">
                  Feedback for Creator
                </CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-3 text-xs">
             <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreatorNoteModal(true)}
                className="w-full bg-paper border-ink/20 text-ink hover:text-oxblood text-xs font-medium"
              >
                Leave a Note
              </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Resumes Gallery (8 Cols) */}
      <div className="lg:col-span-8 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <h2 className="font-serif text-lg font-bold text-ink">
              {selectedFolderFilter === 'all'
                ? 'All Resumes'
                : folders.find((f) => f.id === selectedFolderFilter)?.name || 'Resumes'}
            </h2>
            <span className="font-mono text-xs text-pencil">({filteredResumes.length})</span>
          </div>

          <div className="flex items-center gap-2">
            {selectedFolderFilter !== 'all' && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowImportModal(true)}
                className="bg-card hover:bg-paper text-ink font-medium text-xs shadow-sm border border-ink/20"
              >
                <MoveRight className="w-3.5 h-3.5 mr-1" />
                Import Existing
              </Button>
            )}
            
            <div className="relative">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg"
                onChange={handleDashboardUpload}
                disabled={isUploading}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                title="Upload Resume to create a new Profile"
              />
              <Button
                size="sm"
                variant="outline"
                disabled={isUploading}
                className="bg-card hover:bg-paper text-ink font-medium text-xs shadow-sm border border-ink/20 pointer-events-none"
              >
                {isUploading ? (
                  <Loader2 className="w-3.5 h-3.5 mr-1 animate-spin text-oxblood" />
                ) : (
                  <Upload className="w-3.5 h-3.5 mr-1 text-oxblood" />
                )}
                {isUploading ? 'Parsing...' : 'Upload Resume'}
              </Button>
            </div>

            <Link href="/resumes/new">
              <Button
                size="sm"
                className="bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-[2px_2px_0_rgba(42,33,25,0.2)] border border-oxblood"
              >
                <Plus className="w-3.5 h-3.5 mr-1" />
                New Tailored Resume
              </Button>
            </Link>
          </div>
        </div>

        {filteredResumes.length === 0 ? (
          <Card className="border border-dashed border-ink/20 bg-card/60 p-12 text-center space-y-3 rounded-md">
            <div className="w-10 h-10 rounded border border-ink/20 bg-paper flex items-center justify-center text-pencil mx-auto shadow-sm">
              <FileText className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif text-sm font-bold text-ink">
                No resumes in this view
              </h3>
              <p className="text-xs text-pencil max-w-sm mx-auto leading-relaxed">
                Create a new tailored resume from your Master Dossier to begin customizing and exporting.
              </p>
            </div>
            <Link href="/resumes/new">
              <Button
                size="sm"
                className="bg-card hover:bg-paper text-ink border border-ink/20 text-xs font-medium shadow-sm"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-mustard" />
                Draft First Resume
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {filteredResumes.map((resume) => (
              <Card
                key={resume.id}
                className="border border-ink/15 bg-card text-ink shadow-[2px_3px_0_rgba(42,33,25,0.08)] rounded-md flex flex-col justify-between hover:shadow-[3px_4px_0_rgba(42,33,25,0.12)] transition-shadow"
              >
                <CardHeader className="pb-2 border-b border-dashed border-ink/10">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <CardTitle className="font-serif text-base font-bold text-ink leading-snug">
                        {resume.title}
                      </CardTitle>
                      <CardDescription className="text-oxblood text-xs font-medium mt-0.5">
                        {resume.target_job_title || 'General Purpose'}
                      </CardDescription>
                    </div>

                    <Badge className="bg-sage/15 text-sage border-sage/30 text-[10px] font-mono shrink-0">
                      <Target className="w-3 h-3 mr-1" />
                      {resume.ats_score || 80}% ATS
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-2 pt-3 text-xs">
                  <div className="flex items-center gap-2 text-pencil text-[11px]">
                    <span className="font-mono uppercase bg-paper px-1.5 py-0.5 rounded border border-ink/10">
                      {resume.template_id}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(resume.updated_at).toLocaleDateString()}
                    </span>
                  </div>

                  {resume.target_job_description && (
                    <p className="text-[11px] text-pencil line-clamp-2 italic font-serif bg-paper/50 p-1.5 rounded">
                      Job target: {resume.target_job_description}
                    </p>
                  )}
                </CardContent>

                <CardFooter className="flex items-center justify-between border-t border-dashed border-ink/10 pt-2.5 pb-2.5">
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDuplicateResume(resume)}
                      className="h-7 px-1.5 text-pencil hover:text-ink text-xs"
                      title="Duplicate resume"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDeleteResume(resume.id)}
                      className="h-7 px-1.5 text-pencil hover:text-oxblood text-xs"
                      title="Delete resume"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>

                    <select
                      value={resume.folder_id || ''}
                      onChange={(e) => handleMoveToFolder(resume.id, e.target.value || null)}
                      className="ml-1 h-7 text-[10px] bg-paper border border-ink/15 rounded text-pencil hover:text-ink focus:outline-none max-w-[80px]"
                      title="Move to Folder"
                    >
                      <option value="">No Folder</option>
                      {folders.map(f => (
                        <option key={f.id} value={f.id}>{f.name}</option>
                      ))}
                    </select>

                  </div>

                  <Link href={`/resumes/${resume.id}`}>
                    <Button
                      size="sm"
                      className="h-7 px-3 bg-oxblood hover:bg-oxblood/90 text-card text-xs font-medium shadow-sm border border-oxblood"
                    >
                      Open in Studio
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Import Resume Modal */}
      {showImportModal && selectedFolderFilter !== 'all' && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-ink/20 rounded-md shadow-[6px_8px_0_rgba(42,33,25,0.15)] max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowImportModal(false)}
              className="absolute top-4 right-4 text-pencil hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-serif text-lg font-bold text-ink">Import Existing Resume</h2>
              <p className="text-xs text-pencil mt-1">Select a resume to move it into this folder.</p>
            </div>
            
            <div className="space-y-2 mt-4">
              {resumesNotInCurrentFolder.length === 0 ? (
                <p className="text-xs text-pencil italic">All resumes are already in this folder.</p>
              ) : (
                resumesNotInCurrentFolder.map(r => (
                  <div key={r.id} className="flex items-center justify-between p-2 border border-ink/15 rounded bg-paper/50 hover:bg-paper transition-colors">
                    <div>
                      <p className="text-sm font-bold text-ink">{r.title}</p>
                      <p className="text-[10px] text-pencil">{r.target_job_title || 'General'}</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        handleMoveToFolder(r.id, selectedFolderFilter);
                        setShowImportModal(false);
                      }}
                      className="h-6 text-[10px] bg-oxblood text-card px-2"
                    >
                      Move Here
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Creator Note Modal */}
      {showCreatorNoteModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-ink/20 rounded-md shadow-[6px_8px_0_rgba(42,33,25,0.15)] max-w-md w-full p-6 space-y-4 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setShowCreatorNoteModal(false)}
              className="absolute top-4 right-4 text-pencil hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
            <div>
              <h2 className="font-serif text-lg font-bold text-ink flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-oxblood" /> Note for the Creator
              </h2>
              <p className="text-xs text-pencil mt-1 leading-relaxed">
                Send feedback, feature requests, or just a quick hello directly to the developer of this studio.
              </p>
            </div>
            
            <form onSubmit={handleSubmitCreatorNote} className="space-y-3 mt-4">
              <textarea
                value={creatorNote}
                onChange={(e) => setCreatorNote(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full h-32 p-3 text-xs bg-paper border border-ink/15 rounded focus:outline-none focus:border-oxblood focus:ring-1 focus:ring-oxblood resize-none"
                required
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setShowCreatorNoteModal(false)}
                  className="h-8 text-xs px-3 text-pencil hover:text-ink"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmittingNote}
                  className="h-8 text-xs px-4 bg-oxblood hover:bg-oxblood/90 text-card"
                >
                  {isSubmittingNote ? 'Sending...' : 'Send Note'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  )
}
