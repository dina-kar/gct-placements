"use client"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import React from "react"

interface LoadingScreenProps {
  message?: string
  fullscreen?: boolean
  subtle?: boolean
  className?: string
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({
  message = "Loading...",
  fullscreen = true,
  subtle = false,
  className
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 animate-in fade-in duration-300",
        fullscreen && "min-h-[60vh] sm:min-h-[70vh]",
        subtle
          ? "bg-transparent"
          : "bg-gradient-to-br from-background via-background/95 to-background/90 backdrop-blur-sm",
        className
      )}
    >
      <div className="relative">
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-primary/20 via-primary/10 to-primary/5 animate-pulse" />
        <Loader2 className="w-8 h-8 absolute inset-0 m-auto text-primary animate-spin" />
      </div>
      <p className="text-sm text-muted-foreground tracking-wide flex items-center gap-2">
        {message}
        <span className="inline-flex -space-x-1">
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1.5 h-1.5 bg-primary/60 rounded-full animate-bounce" />
        </span>
      </p>
    </div>
  )
}

export const InlineLoader: React.FC<{ size?: number; className?: string }> = ({ size = 16, className }) => (
  <Loader2
    className={cn("animate-spin text-primary", className)}
    style={{ width: size, height: size }}
  />
)
