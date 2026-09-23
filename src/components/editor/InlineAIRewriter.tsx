'use client'

import * as React from 'react'
import { Sparkles, ArrowRight, Check, Loader2, RefreshCw, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'

interface Suggestion {
  id: string
  text: string
  rationale: string
  impactScore: number
}

interface InlineAIRewriterProps {
  currentText: string
  targetJobDescription?: string
  onApply: (newText: string) => void
  onClose: () => void
}

export function InlineAIRewriter({
  currentText,
  targetJobDescription,
  onApply,
  onClose,
}: InlineAIRewriterProps) {
  const [loading, setLoading] = React.useState(false)
  const [suggestions, setSuggestions] = React.useState<Suggestion[]>([])
  const [customPrompt, setCustomPrompt] = React.useState('')
  const [selectedAction, setSelectedAction] = React.useState<
    'quantify' | 'senior' | 'punchy' | 'ats' | 'custom'
  >('quantify')

  const fetchSuggestions = async (
    action: 'quantify' | 'senior' | 'punchy' | 'ats' | 'custom',
    customP?: string
  ) => {
    setLoading(true)
    setSelectedAction(action)

    try {
      const res = await fetch('/api/ai/rephrase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: currentText,
          action,
          jobDescription: targetJobDescription,
          customPrompt: customP || customPrompt,
        }),
      })

      if (!res.ok) {
        throw new Error('Failed to generate suggestions')
      }

      const data = await res.json()
      if (data.suggestions) {
        setSuggestions(data.suggestions)
      }
    } catch {
      toast.error('AI Rephrase Failed', {
        description: 'Unable to contact AI models. Please try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  React.useEffect(() => {
    fetchSuggestions('quantify')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="p-4 rounded-md bg-card border border-ink/20 shadow-[3px_4px_0_rgba(42,33,25,0.12)] space-y-3.5 text-xs text-ink w-full max-w-xl">
      <div className="flex items-center justify-between pb-2 border-b border-dashed border-ink/15">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-oxblood text-card flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <span className="font-serif font-bold text-sm text-ink">
            AI Bullet Rephraser & ATS Polish
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="text-pencil hover:text-oxblood transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono text-pencil">
          Current Bullet:
        </span>
        <p className="p-2 rounded bg-paper/80 border border-ink/10 text-xs italic text-ink/90 font-serif">
          &ldquo;{currentText}&rdquo;
        </p>
      </div>

      {/* Quick Actions */}
      <div className="space-y-1.5">
        <span className="text-[10px] uppercase font-mono text-pencil">
          Select Rephrasing Lens:
        </span>
        <div className="flex flex-wrap gap-1.5">
          <Button
            type="button"
            size="sm"
            variant={selectedAction === 'quantify' ? 'default' : 'outline'}
            onClick={() => fetchSuggestions('quantify')}
            className={`text-[11px] h-7 px-2.5 ${
              selectedAction === 'quantify'
                ? 'bg-oxblood text-card'
                : 'bg-paper border-ink/15 text-pencil hover:text-ink'
            }`}
          >
            📊 Quantify & Metrics
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selectedAction === 'senior' ? 'default' : 'outline'}
            onClick={() => fetchSuggestions('senior')}
            className={`text-[11px] h-7 px-2.5 ${
              selectedAction === 'senior'
                ? 'bg-oxblood text-card'
                : 'bg-paper border-ink/15 text-pencil hover:text-ink'
            }`}
          >
            👔 Senior Scope
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selectedAction === 'punchy' ? 'default' : 'outline'}
            onClick={() => fetchSuggestions('punchy')}
            className={`text-[11px] h-7 px-2.5 ${
              selectedAction === 'punchy'
                ? 'bg-oxblood text-card'
                : 'bg-paper border-ink/15 text-pencil hover:text-ink'
            }`}
          >
            ⚡ Punchy & Active
          </Button>
          <Button
            type="button"
            size="sm"
            variant={selectedAction === 'ats' ? 'default' : 'outline'}
            onClick={() => fetchSuggestions('ats')}
            className={`text-[11px] h-7 px-2.5 ${
              selectedAction === 'ats'
                ? 'bg-oxblood text-card'
                : 'bg-paper border-ink/15 text-pencil hover:text-ink'
            }`}
          >
            🎯 ATS Boost
          </Button>
        </div>
      </div>

      {/* Custom Prompt */}
      <div className="flex gap-2">
        <Input
          placeholder="Or custom direction (e.g. emphasize cloud migration)"
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              fetchSuggestions('custom', customPrompt)
            }
          }}
          className="h-8 text-xs bg-paper/60 border-ink/15 text-ink placeholder:text-pencil/50"
        />
        <Button
          type="button"
          size="sm"
          onClick={() => fetchSuggestions('custom', customPrompt)}
          className="bg-card hover:bg-paper text-ink border border-ink/20 text-xs h-8 px-3"
        >
          Prompt
        </Button>
      </div>

      {/* Suggestions List */}
      <div className="space-y-2 pt-1">
        {loading ? (
          <div className="p-6 text-center space-y-2">
            <Loader2 className="w-5 h-5 animate-spin mx-auto text-oxblood" />
            <p className="hand text-xs text-pencil">
              Crafting high-impact phrasing with Gemini models...
            </p>
          </div>
        ) : (
          suggestions.map((sug) => (
            <div
              key={sug.id}
              className="p-3 rounded bg-paper border border-ink/15 space-y-2 hover:border-oxblood transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <p className="text-xs text-ink font-serif leading-relaxed flex-1">
                  {sug.text}
                </p>
                <Badge className="bg-sage/20 text-sage border-sage/30 text-[10px] font-mono shrink-0">
                  {sug.impactScore}% Impact
                </Badge>
              </div>

              <div className="flex items-center justify-between pt-1 text-[11px]">
                <span className="text-pencil italic">{sug.rationale}</span>
                <Button
                  type="button"
                  size="sm"
                  onClick={() => onApply(sug.text)}
                  className="h-6 px-2.5 bg-oxblood hover:bg-oxblood/90 text-card text-[11px] font-medium shadow-sm"
                >
                  <Check className="w-3 h-3 mr-1" />
                  Apply Bullet
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
