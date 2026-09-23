import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { ResumeEditorClient } from '@/components/editor/ResumeEditorClient'
import { Profile, Resume } from '@/types/resume'

export const dynamic = 'force-dynamic'

interface ResumePageProps {
  params: Promise<{ id: string }>
}

export default async function ResumePage({ params }: ResumePageProps) {
  const { id } = await params
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Fetch resume if existing
  let existingResume: Resume | null = null
  if (id !== 'new') {
    const { data } = await supabase
      .from('resumes')
      .select('*, profile:profiles(*)')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    existingResume = data as Resume | null
  }

  // Fetch all user profiles for selection
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('is_master', { ascending: false })

  const userProfiles = (profiles as Profile[]) || []

  // Fetch all folders
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  return (
    <ResumeEditorClient
      resumeId={id}
      initialResume={existingResume}
      profiles={userProfiles}
      folders={folders || []}
      userId={user.id}
    />
  )
}
