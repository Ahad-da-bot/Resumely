import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Profile } from '@/types/resume'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  Plus,
  Copy,
  Trash2,
  Edit3,
  User,
  Sparkles,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react'
import { ProfilesClient } from '@/components/profiles/ProfilesClient'

export const dynamic = 'force-dynamic'

export default async function ProfilesPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth')
  }

  // Fetch all user profiles
  const { data: profiles } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', user.id)
    .order('is_master', { ascending: false })
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen ruled-bg text-ink flex flex-col selection:bg-mustard/40 selection:text-ink">
      {/* Top Header */}
      <header className="border-b border-ink/10 bg-card/85 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="flex items-center gap-2 text-pencil hover:text-ink text-xs font-serif mr-2">
              <ArrowLeft className="w-3.5 h-3.5" />
              Studio Desk
            </Link>
            <div className="h-4 w-px bg-ink/15" />
            <div className="w-8 h-8 rounded border border-ink/20 bg-oxblood text-card flex items-center justify-center font-serif font-bold text-sm shadow-[1px_2px_0_rgba(42,33,25,0.2)]">
              R
            </div>
            <span className="font-serif font-bold text-lg leading-tight tracking-tight text-ink">
              Profile Management
            </span>
          </div>

          <Link href="/onboarding">
            <Button
              size="sm"
              className="bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-[2px_2px_0_rgba(42,33,25,0.2)] border border-oxblood"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Profile Variant
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 space-y-8">
        <div className="torn-card relative bg-card p-6 md:p-8 space-y-2">
          <span className="label-hand text-base">canonical records & niche duplicates</span>
          <h1 className="font-serif text-2xl md:text-3xl font-bold tracking-tight text-ink">
            Master & Niche Career Profiles
          </h1>
          <p className="lede text-xs sm:text-sm text-pencil max-w-2xl">
            Maintain your primary career record or duplicate variants optimized for distinct domains (e.g. Engineering Lead, Developer Relations, Solutions Architect).
          </p>
        </div>

        {/* Client Interactive Profiles Grid */}
        <ProfilesClient initialProfiles={(profiles as Profile[]) || []} userId={user.id} />
      </main>
    </div>
  )
}
