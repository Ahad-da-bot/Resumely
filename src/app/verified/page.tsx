import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Email Verified — Resumely',
}

export default function VerifiedPage() {
  return (
    <div className="min-h-screen ruled-bg flex flex-col items-center justify-center p-4">
      {/* Decorative top tape */}
      <div className="absolute top-10 w-32 h-6 bg-[#E8E2D2] opacity-80 rotate-[-2deg] border border-ink/5" style={{ filter: 'drop-shadow(1px 2px 1px rgba(0,0,0,0.05))' }} />

      <div className="bg-card border border-ink/20 shadow-[6px_8px_0_rgba(42,33,25,0.15)] rounded-md max-w-md w-full p-8 text-center space-y-6 relative z-10">
        
        {/* Success Icon */}
        <div className="mx-auto w-16 h-16 rounded-full border border-sage/30 bg-sage/10 flex items-center justify-center text-sage shadow-sm mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        {/* Text content */}
        <div className="space-y-3">
          <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
            Identity Verified
          </h1>
          <p className="lede text-sm leading-relaxed text-pencil max-w-sm mx-auto">
            Your email has been confirmed. You now have full access to your Master Dossier and the Resumely tailored exporting studio.
          </p>
        </div>

        {/* Action */}
        <div className="pt-4 border-t border-dashed border-ink/15">
          <Link href="/dashboard">
            <Button
              className="w-full bg-oxblood hover:bg-oxblood/90 text-card font-medium text-sm h-12 shadow-[3px_3px_0_rgba(42,33,25,0.25)] border border-oxblood transition-all"
            >
              Open Your Desk
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </Link>
        </div>
      </div>

      <p className="hand text-pencil text-sm mt-8 opacity-80">
        — welcome to the studio
      </p>
    </div>
  )
}
