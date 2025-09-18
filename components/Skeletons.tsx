import React from "react"
import { cn } from "@/lib/utils"

export const SkeletonBase = ({ className }: { className?: string }) => (
  <div className={cn("animate-pulse rounded-md bg-muted/40", className)} />
)

export const SkeletonText = ({ lines = 3, className }: { lines?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: lines }).map((_, i) => (
      <SkeletonBase key={i} className="h-3 w-full" />
    ))}
  </div>
)

export const CardSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="p-4 border rounded-xl bg-card/40 backdrop-blur-sm">
        <SkeletonBase className="h-6 w-1/2 mb-4" />
        <SkeletonText lines={4} />
        <div className="mt-4 flex gap-2">
          <SkeletonBase className="h-8 w-20" />
          <SkeletonBase className="h-8 w-24" />
        </div>
      </div>
    ))}
  </div>
)

export const ListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 rounded-lg bg-muted/30 animate-pulse" />
    ))}
  </div>
)

export const ProfileHeaderSkeleton = () => (
  <div className="flex items-center gap-4">
    <SkeletonBase className="h-16 w-16 rounded-full" />
    <div className="flex-1 space-y-3">
      <SkeletonBase className="h-5 w-48" />
      <SkeletonBase className="h-4 w-72" />
    </div>
  </div>
)
