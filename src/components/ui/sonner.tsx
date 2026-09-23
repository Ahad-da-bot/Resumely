"use client"

import { useTheme } from "next-themes"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CircleCheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      icons={{
        success: (
          <CircleCheckIcon className="size-4" />
        ),
        info: (
          <InfoIcon className="size-4" />
        ),
        warning: (
          <TriangleAlertIcon className="size-4" />
        ),
        error: (
          <OctagonXIcon className="size-4" />
        ),
        loading: (
          <Loader2Icon className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          toast: "group toast group-[.toaster]:bg-paper group-[.toaster]:text-ink group-[.toaster]:border group-[.toaster]:border-ink/20 group-[.toaster]:shadow-[4px_4px_0_rgba(42,33,25,0.12)] font-serif rounded text-sm px-4 py-3",
          title: "font-serif font-bold text-sm text-ink",
          description: "group-[.toast]:!text-ink/80 font-sans text-xs mt-1",
          actionButton: "group-[.toast]:bg-oxblood group-[.toast]:text-card font-sans text-xs font-bold px-3 py-1.5 rounded-sm",
          cancelButton: "group-[.toast]:bg-card group-[.toast]:text-ink font-sans text-xs border border-ink/20 px-3 py-1.5 rounded-sm",
          success: "group-[.toaster]:border-sage/40 group-[.toaster]:!text-sage",
          error: "group-[.toaster]:border-oxblood/40 group-[.toaster]:!text-oxblood",
          info: "group-[.toaster]:border-navy/40 group-[.toaster]:!text-navy",
          warning: "group-[.toaster]:border-mustard/40 group-[.toaster]:!text-mustard",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
