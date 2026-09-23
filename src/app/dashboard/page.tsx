import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  FileText,
  UserCheck,
  LogOut,
  Sparkles,
} from 'lucide-react'
import { DashboardClient } from '@/components/dashboard/DashboardClient'
import { Profile, Resume, Folder } from '@/types/resume'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Fetch Master Profile
  const { data: masterProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_master', true)
    .single()

  // Fetch all user profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('is_master', { ascending: false })

  // Fetch all user folders
  const { data: folders } = await supabase
    .from('folders')
    .select('*')
    .eq('user_id', user.id)
    .order('name', { ascending: true })

  // Fetch all user resumes
  const { data: resumes } = await supabase
    .from('resumes')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  const handleSignOut = async () => {
    'use server'
    const serverSupabase = await createClient()
    await serverSupabase.auth.signOut()
    redirect('/auth')
  }

  return (
    <div className="min-h-screen ruled-bg text-ink flex flex-col selection:bg-mustard/40 selection:text-ink">
      {/* Top Header */}
      <header className="border-b border-ink/10 bg-card/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-ink/20 bg-oxblood text-card flex items-center justify-center font-serif font-bold text-sm shadow-[1px_2px_0_rgba(42,33,25,0.2)]">
              R
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-ink">
                Resumely
              </span>
              <span className="hand text-xs text-pencil -mt-1">
                studio desk · {user.email}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/profiles">
              <Button
                variant="outline"
                size="sm"
                className="bg-paper border-ink/20 text-pencil hover:text-ink text-xs font-medium"
              >
                <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                Profiles ({profiles?.length || 0})
              </Button>
            </Link>

            <form action={handleSignOut}>
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="text-pencil hover:text-oxblood hover:bg-paper text-xs"
              >
                <LogOut className="w-3.5 h-3.5 mr-1.5" />
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        {/* Welcome Header */}
        <div className="torn-card relative bg-card p-6 md:p-8 space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="label-hand text-base">studio desk · folders & tailored resumes</span>
            <div className="flex items-center gap-2">
              <div className="pin" />
              <span className="hand text-xs text-pencil">cloud-synced & offline-safe</span>
            </div>
          </div>

          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">
            Welcome, {masterProfile?.full_name || user.email?.split('@')[0]}.
          </h1>
          <p className="lede text-xs sm:text-sm text-pencil max-w-2xl">
            Organize tailored resumes into company or cohort folders, leverage in-line AI rephrasing, and export tactile PDFs.
          </p>
        </div>

        {/* Dynamic Folders & Resumes Client */}
        <DashboardClient
          initialResumes={(resumes as Resume[]) || []}
          initialFolders={(folders as Folder[]) || []}
          profiles={(profiles as Profile[]) || []}
          userId={user.id}
        />
      </main>
    </div>
  )
}
