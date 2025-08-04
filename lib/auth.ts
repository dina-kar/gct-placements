import { account, databases, config, UserRole, ID, Query } from './appwrite'
import { AppwriteException } from 'appwrite'
import { DatabaseService } from './database'
import type { AdminRole } from './appwrite'

export class AuthService {
  // Validate email domain
  static validateEmailDomain(email: string): boolean {
    const domain = email.split('@')[1]
    return domain === config.allowedEmailDomain
  }

  // Send OTP to email
  static async sendOTP(email: string): Promise<{ success: boolean; message: string; token?: string }> {
    try {
      // Check if email exists in our users collection
      let userExistsInCollection = false
      
      try {
        const existingUsers = await databases.listDocuments(
          config.databaseId,
          config.collections.users,
          [Query.equal('collegeEmail', email)]
        )
        
        if (existingUsers.documents.length > 0) {
          userExistsInCollection = true
        }
      } catch (dbError) {
        console.error('Database check failed:', dbError)
        return {
          success: false,
          message: 'Unable to verify email. Please try again later.'
        }
      }
      
      // If email exists in users collection, proceed with OTP
      if (userExistsInCollection) {
        try {
          const token = await account.createEmailToken(ID.unique(), email)
          return {
            success: true,
            message: 'OTP sent to your email address',
            token: token.userId
          }
        } catch (authError: any) {
          console.error('OTP send error for existing user:', authError)
          return {
            success: false,
            message: 'Failed to send OTP. Please try again or contact the placement office.'
          }
        }
      }
      
      // Email not found in users collection
      if (this.validateEmailDomain(email)) {
        return {
          success: false,
          message: 'Email not found. Please sign up first using the registration page.'
        }
      } else {
        return {
          success: false,
          message: 'Email not found in our system. Please contact the placement office to add your email.'
        }
      }
      
    } catch (error: any) {
      console.error('Send OTP error:', error)
      
      // Handle rate limiting
      if (error.code === 429) {
        return {
          success: false,
          message: 'Too many requests. Please wait a moment and try again.'
        }
      }
      
      return {
        success: false,
        message: error.message || 'Failed to send OTP. Please try again.'
      }
    }
  }

  // Verify OTP and login
  static async verifyOTP(userId: string, otp: string): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const session = await account.createSession(userId, otp)
      const user = await account.get()
      
      // Get user profile from database
      let userProfile = null
      try {
        // First try to get by document ID (for users created through auth)
        userProfile = await databases.getDocument(
          config.databaseId,
          config.collections.users,
          user.$id
        )
      } catch (profileError) {
        // If not found by ID, try to find by email (for manually added users)
        try {
          const profileResult = await databases.listDocuments(
            config.databaseId,
            config.collections.users,
            [Query.equal('collegeEmail', user.email)]
          )
          
          if (profileResult.documents.length > 0) {
            userProfile = profileResult.documents[0]
          }
        } catch (emailSearchError) {
          console.log('Email search also failed, user truly not in collection')
        }
        
        // If still no profile found, create one for manually added emails
        if (!userProfile) {
          console.log('User profile not found, creating basic profile for manually added email')
          
          try {
            // Create a basic user profile for manually added emails
            userProfile = await databases.createDocument(
              config.databaseId,
              config.collections.users,
              user.$id,
              {
                userId: user.$id,
                collegeEmail: user.email,
                fullName: user.name || 'User', // Use the name from Appwrite or default
                rollNo: '', // Will be filled later by the user
                department: '',
                batch: '',
                role: UserRole.STUDENT, // Default role for manually added students
                isPlacementRep: false,
                country: 'India',
                historyOfArrear: 'No',
                activeBacklog: 'No',
                noOfBacklogs: '0',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            )
            console.log('Created basic user profile for manually added email')
          } catch (createError) {
            console.error('Failed to create user profile:', createError)
            // Continue without profile - the user can complete it later
          }
        }
      }

      return {
        success: true,
        message: 'Login successful',
        user: { ...user, profile: userProfile }
      }
    } catch (error: any) {
      console.error('Verify OTP error:', error)
      return {
        success: false,
        message: error.message || 'Invalid OTP'
      }
    }
  }

  // Create user account and profile
  static async createUser(data: {
    email: string
    fullName: string
    rollNo?: string
    department?: string
    batch?: string
    role: UserRole
    isPlacementRep?: boolean
  }): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      if (!this.validateEmailDomain(data.email)) {
        return {
          success: false,
          message: `Please use your official ${config.allowedEmailDomain} email address`
        }
      }

      // First, send OTP for email verification
      const otpResult = await this.sendOTP(data.email)
      if (!otpResult.success) {
        return otpResult
      }

      // The user will need to verify OTP, then we'll create their profile
      // For now, return the token for OTP verification
      return {
        success: true,
        message: 'Verification email sent. Please check your email and verify with OTP.',
        user: { token: otpResult.token, signupData: data }
      }
    } catch (error: any) {
      console.error('Create user error:', error)
      return {
        success: false,
        message: error.message || 'Failed to create user'
      }
    }
  }

  // Complete user registration after OTP verification
  static async completeRegistration(userData: any): Promise<{ success: boolean; message: string; user?: any }> {
    try {
      const user = await account.get()
      
      // Create user profile in database
      const userProfile = await databases.createDocument(
        config.databaseId,
        config.collections.users,
        user.$id,
        {
          userId: user.$id,
          collegeEmail: userData.email,
          fullName: userData.fullName,
          rollNo: userData.rollNo || '',
          department: userData.department || '',
          batch: userData.batch || '',
          role: userData.role,
          isPlacementRep: userData.isPlacementRep || false,
          country: 'India',
          historyOfArrear: 'No',
          activeBacklog: 'No',
          noOfBacklogs: '0',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      )

      return {
        success: true,
        message: 'Registration completed successfully',
        user: { ...user, profile: userProfile }
      }
    } catch (error: any) {
      console.error('Complete registration error:', error)
      return {
        success: false,
        message: error.message || 'Failed to complete registration'
      }
    }
  }

  // Get current user with profile and admin role
  static async getCurrentUser(): Promise<any> {
    try {
      const user = await account.get()
      
      // Get user profile
      let userProfile = null
      try {
        const profileResult = await databases.listDocuments(
          config.databaseId,
          config.collections.users,
          [Query.equal('collegeEmail', user.email)]
        )
        
        if (profileResult.documents.length > 0) {
          userProfile = profileResult.documents[0]
        } else {
          // No profile found by email, this might be a manually added user who needs a profile
          // For manually added users (non-GCT emails), create a basic profile
          if (!this.validateEmailDomain(user.email)) {
            try {
              userProfile = await databases.createDocument(
                config.databaseId,
                config.collections.users,
                user.$id,
                {
                  userId: user.$id,
                  collegeEmail: user.email,
                  fullName: user.name || 'User',
                  rollNo: '',
                  department: '',
                  batch: '',
                  role: UserRole.STUDENT,
                  isPlacementRep: false,
                  country: 'India',
                  historyOfArrear: 'No',
                  activeBacklog: 'No',
                  noOfBacklogs: '0',
                  createdAt: new Date().toISOString(),
                  updatedAt: new Date().toISOString()
                }
              )
            } catch (createError) {
              console.error('Failed to create profile in getCurrentUser:', createError)
            }
          }
        }
      } catch (error) {
        console.error('User profile lookup failed:', error)
      }

      // Check for admin role
      const adminRole = await DatabaseService.getAdminRole(user.email)

      return { 
        ...user, 
        profile: userProfile,
        adminRole,
        name: user.name || (userProfile ? userProfile.fullName : 'User')
      }
    } catch (error) {
      console.error('getCurrentUser failed:', error)
      return null
    }
  }

  // Logout
  static async logout(): Promise<void> {
    try {
      await account.deleteSession('current')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  // Check if user has specific role (from profile or admin role)
  static hasRole(user: any, role: UserRole): boolean {
    if (!user) return false
    
    // Check admin role first
    if (user.adminRole && user.adminRole.role === role && user.adminRole.isActive) {
      return true
    }
    
    // Check profile role for students
    if (user.profile && user.profile.role === role) {
      return true
    }
    
    return false
  }

  // Check if user is admin (has any admin role)
  static isAdmin(user: any): boolean {
    if (!user || !user.adminRole) return false
    
    const adminRoles = [UserRole.PLACEMENT_REP, UserRole.PLACEMENT_OFFICER, UserRole.PLACEMENT_COORDINATOR]
    return adminRoles.includes(user.adminRole.role) && user.adminRole.isActive
  }

  // Check if user is placement rep (can have both admin and student access)
  static isPlacementRep(user: any): boolean {
    if (!user) return false
    
    // Check admin role
    if (user.adminRole && user.adminRole.role === UserRole.PLACEMENT_REP && user.adminRole.isActive) {
      return true
    }
    
    // Check profile flag for students who are placement reps
    if (user.profile && user.profile.isPlacementRep === true) {
      return true
    }
    
    return false
  }

  // Check if user is placement officer
  static isPlacementOfficer(user: any): boolean {
    return this.hasRole(user, UserRole.PLACEMENT_OFFICER)
  }

  // Check if user is placement coordinator  
  static isPlacementCoordinator(user: any): boolean {
    return this.hasRole(user, UserRole.PLACEMENT_COORDINATOR)
  }

  // Check if user should have student access (students and placement reps)
  static hasStudentAccess(user: any): boolean {
    if (!user) return false
    
    // Students always have student access
    if (user.profile && user.profile.role === UserRole.STUDENT) {
      return true
    }
    
    // Placement reps have both admin and student access
    if (this.isPlacementRep(user)) {
      return true
    }
    
    // For authenticated users without a complete profile (manually added emails)
    // Grant student access by default if they don't have an admin role
    if (!user.profile && !user.adminRole) {
      return true
    }
    
    return false
  }

  // Check if user profile needs completion (for manually added emails)
  static isProfileIncomplete(user: any): boolean {
    if (!user || !user.profile) return true
    
    const profile = user.profile
    return !profile.rollNo || 
           !profile.department || 
           !profile.batch || 
           !profile.fullName || 
           profile.fullName === 'User'
  }

  // Check if user should have admin-only access (officers and coordinators)
  static hasAdminOnlyAccess(user: any): boolean {
    if (!user || !user.adminRole || !user.adminRole.isActive) return false
    
    return user.adminRole.role === UserRole.PLACEMENT_OFFICER || 
           user.adminRole.role === UserRole.PLACEMENT_COORDINATOR
  }
} 