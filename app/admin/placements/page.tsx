"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AdminPlacementsRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/placements")
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div>Redirecting to placements management...</div>
    </div>
  )
} 