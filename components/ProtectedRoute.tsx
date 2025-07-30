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
  studentAccessOnly?: boolean
  redirectTo?: string
}

export function ProtectedRoute({
  children,
  requireAuth = true,
  requiredRole,
  adminOnly = false,
  studentAccessOnly = false,
  redirectTo = '/login'
}: ProtectedRouteProps) {
  const { user, loading, isAuthenticated, isAdmin, hasStudentAccess, hasAdminOnlyAccess, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return

    // Check authentication requirement
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo)
      return
    }

    // Check admin requirement - placement reps can access both admin and student routes
    if (adminOnly && !isAdmin) {
      // Redirect non-admins to appropriate dashboard
      if (hasStudentAccess) {
        router.push('/dashboard') // Student dashboard for students/placement reps
      } else {
        router.push('/login') // No access
      }
      return
    }

    // Check student access requirement - only students and placement reps
    if (studentAccessOnly && !hasStudentAccess) {
      // Redirect admin-only users to admin dashboard
      if (hasAdminOnlyAccess) {
        router.push('/admin/dashboard')
      } else {
        router.push('/login') // No access
      }
      return
    }

    // Check specific role requirement
    if (requiredRole && !hasRole(requiredRole)) {
      // Intelligent redirect based on user's access
      if (hasAdminOnlyAccess) {
        router.push('/admin/dashboard')
      } else if (hasStudentAccess) {
        router.push('/dashboard')
      } else {
        router.push('/login')
      }
      return
    }
  }, [loading, isAuthenticated, isAdmin, hasStudentAccess, hasAdminOnlyAccess, hasRole, requiredRole, adminOnly, studentAccessOnly, requireAuth, router, redirectTo])

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

  if (studentAccessOnly && !hasStudentAccess) {
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
    <ProtectedRoute studentAccessOnly>
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
  return (
    <ProtectedRoute requiredRole={UserRole.PLACEMENT_REP}>
      {children}
    </ProtectedRoute>
  )
}

export function PlacementOfficerRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.PLACEMENT_OFFICER}>
      {children}
    </ProtectedRoute>
  )
}

export function PlacementCoordinatorRoute({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute requiredRole={UserRole.PLACEMENT_COORDINATOR}>
      {children}
    </ProtectedRoute>
  )
} 