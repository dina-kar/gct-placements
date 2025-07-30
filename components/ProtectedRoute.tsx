'use client'

import { useAuth } from '@/contexts/AuthContext'
import { UserRole } from '@/lib/appwrite'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAuth?: boolean
  requiredRole?: UserRole
  adminOnly?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  adminOnly = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // Check admin requirement
    if (adminOnly && !isAdmin) {
      router.push('/dashboard') // Redirect non-admins to regular dashboard
      return
    }

    // Check specific role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      router.push('/dashboard') // Redirect to dashboard if role doesn't match
      return
    }
  }, [loading, isAuthenticated, isAdmin, hasRole, requiredRole, adminOnly, requireAuth, router, redirectTo])

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // Check all conditions before rendering
  if (requireAuth && !isAuthenticated) {
    return null
  }

  if (adminOnly && !isAdmin) {
    return null
  }

  if (requiredRole && !hasRole(requiredRole)) {
    return null
  }

  return <>{children}</>
}

// Higher-order component for easy use
export function withProtectedRoute<P extends object>(
  Component: React.ComponentType<P>,
  options?: Omit<ProtectedRouteProps, 'children'>
) {
  return function ProtectedComponent(props: P) {
    return (
      <ProtectedRoute {...options}>
        <Component {...props} />
      </ProtectedRoute>
    )
  }
}

// Specific role-based protection components
export function StudentRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.STUDENT}>
      {children}
    </ProtectedRoute>
  )
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      {children}
    </ProtectedRoute>
  )
}

export function PlacementRepRoute({ children }: { children: React.ReactNode }) {
  const { user, isPlacementRep, isAdmin } = useAuth()
  
  if (!isPlacementRep && !isAdmin) {
    return null
  }
  
  return <>{children}</>
} 