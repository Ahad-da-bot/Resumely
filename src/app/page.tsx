import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  FileText,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Check,
  Layout,
} from 'lucide-react'
import { TemplateShowcase } from '@/components/home/TemplateShowcase'

export default function Home() {
  return (
    <div className="min-h-screen ruled-bg text-ink flex flex-col selection:bg-mustard/40 selection:text-ink">
      {/* Top Header */}
      <header className="border-b border-ink/10 bg-card/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded border border-ink/20 overflow-hidden shadow-[1px_2px_0_rgba(42,33,25,0.2)] flex items-center justify-center bg-card">
              <img src="/logo.jpg" alt="Resumely Logo" className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg leading-tight tracking-tight text-ink">
                Resumely
              </span>
              <span className="hand text-xs text-pencil -mt-1">
                the bespoke career studio
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/auth">
              <Button
                variant="ghost"
                size="sm"
                className="text-pencil hover:text-ink hover:bg-paper text-xs font-medium"
              >
                Sign In
              </Button>
            </Link>
            <Link href="/auth?tab=signup">
              <Button
                size="sm"
                className="bg-oxblood hover:bg-oxblood/90 text-card font-medium text-xs shadow-[2px_2px_0_rgba(42,33,25,0.2)] border border-oxblood"
              >
                Start Your Dossier
                <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-16">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-block">
              <span className="label-hand text-lg md:text-xl">
                an editorial system for real careers
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-semibold leading-[1.08] tracking-tight text-ink">
              The resume was ready. The layout didn&apos;t hold up.
            </h1>

            <p className="lede max-w-xl text-base sm:text-lg">
              Most resume generators trap you in rigid templates that break the moment you export. Resumely keeps a single <strong>Master Profile</strong>, uses contextual AI to adapt every bullet for the job in front of you, and outputs clean, tactile PDFs built to pass any screener.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/auth?tab=signup">
                <Button
                  size="lg"
                  className="bg-oxblood hover:bg-oxblood/90 text-card font-semibold text-sm px-6 h-12 shadow-[3px_3px_0_rgba(42,33,25,0.25)] border border-oxblood"
                >
                  Create Master Profile
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-card hover:bg-paper text-ink border-ink/20 font-medium text-sm px-6 h-12 shadow-[2px_2px_0_rgba(42,33,25,0.08)]"
                >
                  Sign In to Studio
                </Button>
              </Link>
            </div>

            <div className="pt-4 flex items-center gap-3">
              <div className="pin" />
              <span className="hand text-pencil text-base">
                — offline-ready sync, zero cookie breakage, Powered by Supabase & Next.js
              </span>
            </div>
          </div>

          {/* Right Column: Polaroid & Stamp Cluster */}
          <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col items-center justify-center gap-6 relative">
            {/* Stamp */}
            <div className="absolute -top-6 -right-2 z-20">
              <div className="stamp">
                ATS<br />OPTIMIZED<br />100%
              </div>
            </div>

            {/* Polaroid 1 */}
            <div className="polaroid rotate-[-3deg] w-full max-w-[280px]">
              <div className="tape" />
              <div className="art p-4 bg-[#EFE8D4] text-xs font-serif leading-relaxed text-ink space-y-2 border border-ink/10">
                <div className="border-b border-ink/20 pb-1 font-bold text-oxblood">
                  Alex Morgan
                </div>
                <p className="text-[11px] text-pencil line-clamp-3">
                  Staff Systems Architect with 8+ years designing fault-tolerant distributed platforms...
                </p>
                <div className="flex gap-1 flex-wrap pt-1">
                  <span className="px-1 py-0.5 text-[9px] bg-card text-sage font-mono border border-sage/30">
                    TypeScript
                  </span>
                  <span className="px-1 py-0.5 text-[9px] bg-card text-sage font-mono border border-sage/30">
                    Supabase
                  </span>
                  <span className="px-1 py-0.5 text-[9px] bg-card text-sage font-mono border border-sage/30">
                    Next.js
                  </span>
                </div>
              </div>
              <figcaption className="hand text-ink text-sm mt-2 text-center">
                live tailored resume export
              </figcaption>
            </div>

            {/* Note Card */}
            <div className="torn-card rotate-[2deg] max-w-[260px] self-end sm:self-auto">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-mustard" />
                <h3 className="font-serif text-xs font-bold text-sage m-0">
                  Instant Targeting
                </h3>
              </div>
              <p className="text-[11px] text-pencil leading-relaxed m-0">
                Paste any job description and let AI adapt your master bullet points in real-time.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Live Template Showcase */}
        <TemplateShowcase />

        {/* 3 Pillars / Torn Cards */}
        <div className="space-y-6 pt-8 border-t border-dashed border-ink/20">
          <div className="flex items-center justify-between">
            <span className="label-hand text-base">how the studio is organized</span>
            <span className="hand text-pencil text-sm">3 steps from draft to hire</span>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="torn-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="hand text-oxblood text-base font-bold">01</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-paper text-pencil border border-ink/10">
                  Single Source
                </span>
              </div>
              <h3 className="font-serif text-lg text-ink font-semibold">
                The Master Dossier
              </h3>
              <p className="text-pencil text-xs leading-relaxed">
                Keep every project, skill, publication, and role in one canonical profile. Never rewrite your history from scratch.
              </p>
            </div>

            <div className="torn-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="hand text-oxblood text-base font-bold">02</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-paper text-pencil border border-ink/10">
                  Smart Adaptation
                </span>
              </div>
              <h3 className="font-serif text-lg text-ink font-semibold">
                Targeted Rewriting
              </h3>
              <p className="text-pencil text-xs leading-relaxed">
                Generate tailored resumes for specific job requisitions while keeping your voice authentic and metric-driven.
              </p>
            </div>

            <div className="torn-card space-y-2">
              <div className="flex items-center justify-between">
                <span className="hand text-oxblood text-base font-bold">03</span>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-paper text-pencil border border-ink/10">
                  Tactile Output
                </span>
              </div>
              <h3 className="font-serif text-lg text-ink font-semibold">
                Crisp PDF Printing
              </h3>
              <p className="text-pencil text-xs leading-relaxed">
                Direct client-side PDF compilation with zero template distortion or awkward page breaks.
              </p>
            </div>
          </div>
        </div>

        {/* Quote Motif */}
        <div className="border-l-4 border-mustard pl-6 py-2">
          <p className="font-serif italic text-lg md:text-xl text-ink max-w-2xl leading-relaxed">
            &ldquo;A resume shouldn&apos;t fight its own formatting to reach the person waiting to interview you.&rdquo;
          </p>
          <p className="hand text-pencil text-base mt-2">
            — Resumely Studio Principles
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-ink/10 bg-card/50 py-6 text-center text-xs text-pencil">
        <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span className="hand text-sm text-ink">
            Resumely · Built with Next.js, Supabase, & Shadcn UI
          </span>
          <span className="text-[11px] text-pencil">
            Handcrafted with paper, ink, & editorial care
          </span>
        </div>
      </footer>
    </div>
  )
}
