'use client'

import * as React from 'react'
import { Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight, AlignJustify, X } from 'lucide-react'
import { useResumeStore } from '@/lib/store/useResumeStore'

interface ResumeRibbonProps {
  isVisible: boolean
  onClose: () => void
}

export function ResumeRibbon({ isVisible, onClose }: ResumeRibbonProps) {
  const { styleConfig, setStyleConfig } = useResumeStore()

  if (!isVisible) return null

  const formatText = (command: string, e: React.MouseEvent) => {
    e.preventDefault() // prevent losing focus from the active contentEditable
    document.execCommand(command, false)
  }

  const handleFontChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyleConfig({ ...styleConfig, font_family: e.target.value as 'sans' | 'serif' | 'mono' })
  }

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStyleConfig({ ...styleConfig, font_size: e.target.value as 'small' | 'medium' | 'large' })
  }

  return (
    <div 
      className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm px-4 py-2.5 flex flex-wrap items-center gap-4 mb-4 rounded-md animate-in slide-in-from-top-4 fade-in duration-200"
      onMouseDown={(e) => {
        // Prevent clicking anywhere in the ribbon from stealing focus
        if ((e.target as HTMLElement).tagName !== 'SELECT' && (e.target as HTMLElement).tagName !== 'OPTION') {
          e.preventDefault()
        }
      }}
    >
      <div className="flex items-center gap-2 border-r border-slate-200 pr-4">
        <select 
          value={styleConfig.font_family}
          onChange={handleFontChange}
          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-oxblood"
        >
          <option value="sans">Helvetica (Sans)</option>
          <option value="serif">Times (Serif)</option>
          <option value="mono">Courier (Mono)</option>
        </select>

        <select 
          value={styleConfig.font_size}
          onChange={handleSizeChange}
          className="text-xs border border-slate-200 rounded px-2 py-1 bg-white hover:bg-slate-50 focus:outline-none focus:ring-1 focus:ring-oxblood"
        >
          <option value="small">Small</option>
          <option value="medium">Medium</option>
          <option value="large">Large</option>
        </select>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
        <button
          onClick={(e) => formatText('bold', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Bold (Ctrl+B)"
        >
          <Bold size={16} />
        </button>
        <button
          onClick={(e) => formatText('italic', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Italic (Ctrl+I)"
        >
          <Italic size={16} />
        </button>
        <button
          onClick={(e) => formatText('underline', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Underline (Ctrl+U)"
        >
          <Underline size={16} />
        </button>
      </div>

      <div className="flex items-center gap-1 border-r border-slate-200 pr-4">
        <button
          onClick={(e) => formatText('justifyLeft', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Align Left"
        >
          <AlignLeft size={16} />
        </button>
        <button
          onClick={(e) => formatText('justifyCenter', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Align Center"
        >
          <AlignCenter size={16} />
        </button>
        <button
          onClick={(e) => formatText('justifyRight', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Align Right"
        >
          <AlignRight size={16} />
        </button>
        <button
          onClick={(e) => formatText('justifyFull', e)}
          className="p-1.5 hover:bg-slate-100 rounded text-slate-700 transition-colors"
          title="Justify"
        >
          <AlignJustify size={16} />
        </button>
      </div>

      <div className="ml-auto">
        <button 
          onClick={onClose}
          className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Close Ribbon"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
