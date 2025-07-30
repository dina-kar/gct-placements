import { account, databases, config, UserRole, ID } from './appwrite'
import { AppwriteException } from 'appwrite'

export class AuthService {
  // Validate email domain
  static validateEmailDomain(email: string): boolean {
    const domain = email.split('@')[1]
    return domain === config.allowedEmailDomain
  }

  // Send OTP to email
  static async sendOTP(email: string): Promise<{ success: boolean; message: string; token?: string }> {
    try {
      if (!this.validateEmailDomain(email)) {
        return {
          success: false,
          message: `Please use your official ${config.allowedEmailDomain} email address`
        }
      }

      const token = await account.createEmailToken(ID.unique(), email)
      
      return {
        success: true,
        message: 'OTP sent to your email address',
        token: token.userId
      }
    } catch (error: any) {
      console.error('Send OTP error:', error)
      return {
        success: false,
        message: error.message || 'Failed to send OTP'
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
        userProfile = await databases.getDocument(
          config.databaseId,
          config.collections.users,
          user.$id
        )
      } catch (profileError) {
        // User profile doesn't exist yet, will be created during signup
        console.log('User profile not found, probably first time login')
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
    firstName: string
    lastName: string
    rollNumber?: string
    department?: string
    year?: string
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
          email: userData.email,
          firstName: userData.firstName,
          lastName: userData.lastName,
          rollNumber: userData.rollNumber || '',
          department: userData.department || '',
          year: userData.year || '',
          role: userData.role,
          isPlacementRep: userData.isPlacementRep || false,
          phone: '',
          dateOfBirth: '',
          address: '',
          cgpa: '',
          backlogs: '0',
          skills: '',
          projects: '',
          internships: '',
          achievements: '',
          bio: '',
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

  // Get current user
  static async getCurrentUser(): Promise<any> {
    try {
      const user = await account.get()
      
      // Get user profile
      let userProfile = null
      try {
        userProfile = await databases.getDocument(
          config.databaseId,
          config.collections.users,
          user.$id
        )
      } catch (error) {
        console.log('User profile not found')
      }

      return { ...user, profile: userProfile }
    } catch (error) {
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

  // Check if user has specific role
  static hasRole(user: any, role: UserRole): boolean {
    return user?.profile?.role === role
  }

  // Check if user is admin (based on email address)
  static isAdmin(user: any): boolean {
    if (!user || !user.email) return false
    
    // Get admin emails from environment variable
    const adminEmails = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(',').map(email => email.trim().toLowerCase()) || []
    const userEmail = user.email.toLowerCase().trim()
    
    return adminEmails.includes(userEmail)
  }

  // Check if user is placement rep
  static isPlacementRep(user: any): boolean {
    return user?.profile?.isPlacementRep === true || this.hasRole(user, UserRole.PLACEMENT_REP)
  }
} 