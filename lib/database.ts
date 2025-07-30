import { databases, storage, config } from './appwrite'
import { ID, Query } from 'appwrite'
import type { Job, Application, UserProfile } from './appwrite'

export class DatabaseService {
  // Helper function to convert departments array to string for storage
  private static departmentsToString(departments: string[]): string {
    return departments.join(',')
  }

  // Helper function to convert departments string to array for display
  private static departmentsToArray(departments: string): string[] {
    return departments ? departments.split(',').map(d => d.trim()) : []
  }

  // Job Management
  static async createJob(jobData: Omit<Job, '$id' | 'createdAt' | 'updatedAt'>) {
    try {
      const now = new Date().toISOString()
      const job = await databases.createDocument(
        config.databaseId,
        config.collections.jobs,
        ID.unique(),
        {
          ...jobData,
          departments: this.departmentsToString(jobData.departments),
          createdAt: now,
          updatedAt: now,
        }
      )
      const result = job as unknown as any
      // Convert departments back to array for the returned object
      return {
        ...result,
        departments: this.departmentsToArray(result.departments)
      } as Job
    } catch (error) {
      console.error('Error creating job:', error)
      throw error
    }
  }

  static async getJobs() {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.jobs,
        [
          Query.limit(100)
        ]
      )
      const jobs = response.documents as unknown as any[]
      // Convert departments strings back to arrays
      return jobs.map(job => ({
        ...job,
        departments: this.departmentsToArray(job.departments || '')
      })) as Job[]
    } catch (error) {
      console.error('Error fetching jobs:', error)
      throw error
    }
  }

  static async getJob(jobId: string) {
    try {
      const job = await databases.getDocument(
        config.databaseId,
        config.collections.jobs,
        jobId
      )
      const result = job as unknown as any
      // Convert departments string back to array
      return {
        ...result,
        departments: this.departmentsToArray(result.departments || '')
      } as Job
    } catch (error) {
      console.error('Error fetching job:', error)
      throw error
    }
  }

  static async updateJob(jobId: string, updates: Omit<Partial<Job>, '$id' | 'createdAt'>) {
    try {
      const job = await databases.updateDocument(
        config.databaseId,
        config.collections.jobs,
        jobId,
        {
          ...updates,
          updatedAt: new Date().toISOString(),
        }
      )
      return job as unknown as Job
    } catch (error) {
      console.error('Error updating job:', error)
      throw error
    }
  }

  // Application Management
  static async createApplication(applicationData: Omit<Application, '$id' | 'createdAt' | 'updatedAt'>) {
    try {
      const now = new Date().toISOString()
      const application = await databases.createDocument(
        config.databaseId,
        config.collections.applications,
        ID.unique(),
        {
          ...applicationData,
          createdAt: now,
          updatedAt: now,
        }
      )
      return application as unknown as Application
    } catch (error) {
      console.error('Error creating application:', error)
      throw error
    }
  }

  static async getUserApplications(userId: string) {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.applications,
        [
          Query.equal('userId', userId)
        ]
      )
      return response.documents as unknown as Application[]
    } catch (error) {
      console.error('Error fetching user applications:', error)
      throw error
    }
  }

  static async getJobApplications(jobId: string) {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.applications,
        [
          Query.equal('jobId', jobId)
        ]
      )
      return response.documents as unknown as Application[]
    } catch (error) {
      console.error('Error fetching job applications:', error)
      throw error
    }
  }

  static async updateApplicationStatus(applicationId: string, status: string) {
    try {
      const application = await databases.updateDocument(
        config.databaseId,
        config.collections.applications,
        applicationId,
        {
          status,
          updatedAt: new Date().toISOString(),
        }
      )
      return application as unknown as Application
    } catch (error) {
      console.error('Error updating application status:', error)
      throw error
    }
  }

  // User Profile Management
  static async updateUserProfile(userId: string, profileData: Omit<Partial<UserProfile>, '$id' | 'createdAt'>) {
    try {
      const profile = await databases.updateDocument(
        config.databaseId,
        config.collections.users,
        userId,
        {
          ...profileData,
          updatedAt: new Date().toISOString(),
        }
      )
      return profile as unknown as UserProfile
    } catch (error) {
      console.error('Error updating profile:', error)
      throw error
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const profile = await databases.getDocument(
        config.databaseId,
        config.collections.users,
        userId
      )
      return profile as unknown as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw error
    }
  }

  static async getAllUsers() {
    try {
      const response = await databases.listDocuments(
        config.databaseId,
        config.collections.users,
        [
          Query.limit(1000)
        ]
      )
      return response.documents as unknown as UserProfile[]
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  }

  // File Management
  static async uploadFile(file: File, bucketId: string = config.storageId) {
    try {
      const fileId = ID.unique()
      const uploadedFile = await storage.createFile(bucketId, fileId, file)
      return uploadedFile
    } catch (error) {
      console.error('Error uploading file:', error)
      throw error
    }
  }

  static async getFilePreview(fileId: string, bucketId: string = config.storageId) {
    try {
      const result = storage.getFilePreview(bucketId, fileId)
      return result
    } catch (error) {
      console.error('Error getting file preview:', error)
      throw error
    }
  }

  static async getFileDownload(fileId: string, bucketId: string = config.storageId) {
    try {
      const result = storage.getFileDownload(bucketId, fileId)
      return result
    } catch (error) {
      console.error('Error getting file download:', error)
      throw error
    }
  }

  static async deleteFile(fileId: string, bucketId: string = config.storageId) {
    try {
      await storage.deleteFile(bucketId, fileId)
    } catch (error) {
      console.error('Error deleting file:', error)
      throw error
    }
  }
} 