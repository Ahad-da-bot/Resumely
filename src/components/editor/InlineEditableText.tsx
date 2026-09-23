'use client'

import * as React from 'react'

interface InlineEditableTextProps {
  value: string
  onSave: (newValue: string) => void
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span' | 'div'
  className?: string
  placeholder?: string
  multiline?: boolean
}

export function InlineEditableText({
  value,
  onSave,
  as: Component = 'span',
  className = '',
  placeholder = 'Click to edit...',
  multiline = false,
}: InlineEditableTextProps) {
  const [isFocused, setIsFocused] = React.useState(false)
  const elementRef = React.useRef<HTMLElement>(null)

  // Sync external value updates if not focused
  React.useEffect(() => {
    if (elementRef.current && !isFocused) {
      if (elementRef.current.innerHTML !== (value || '')) {
        elementRef.current.innerHTML = value || ''
      }
    }
  }, [value, isFocused])

  const handleBlur = (e: React.FocusEvent<HTMLElement>) => {
    setIsFocused(false)
    const newHtml = e.currentTarget.innerHTML.trim()
    // Don't save if it's just an empty br
    if (newHtml === '<br>') {
      onSave('')
    } else if (newHtml !== value) {
      onSave(newHtml)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      if (elementRef.current) {
        elementRef.current.innerHTML = value || ''
      }
      e.currentTarget.blur()
    } else if (e.ctrlKey || e.metaKey) {
      // Basic keyboard shortcuts
      if (e.key === 'b') {
        e.preventDefault()
        document.execCommand('bold', false)
      } else if (e.key === 'i') {
        e.preventDefault()
        document.execCommand('italic', false)
      } else if (e.key === 'u') {
        e.preventDefault()
        document.execCommand('underline', false)
      }
    }
  }

  return (
    <>
      <Component
        ref={elementRef as unknown as React.Ref<never>}
        contentEditable
        suppressContentEditableWarning
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        title="Double click or click to edit text directly. Highlight for formatting."
        className={`outline-none transition-all cursor-text rounded-sm ${
          isFocused
            ? 'ring-1 ring-oxblood bg-oxblood/5 px-0.5'
            : 'hover:ring-1 hover:ring-dashed hover:ring-oxblood/40 hover:bg-oxblood/5'
        } ${className}`}
        data-placeholder={placeholder}
        dangerouslySetInnerHTML={{ __html: value || (isFocused ? '' : placeholder) }}
      />
    </>
  )
}
