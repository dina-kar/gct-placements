"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { 
  User, 
  FileText, 
  Upload, 
  Edit, 
  Save, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Building2, 
  ArrowLeft,
  Download,
  Eye,
  Trash2
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DatabaseService } from "@/lib/database"
import { StudentRoute } from "@/components/ProtectedRoute"

function ProfilePageContent() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showResumePreview, setShowResumePreview] = useState(false)
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    personalEmail: "",
    rollNumber: "",
    department: "",
    year: "",
    dateOfBirth: "",
    address: "",
    cgpa: "",
    backlogs: "",
    historyOfArrear: "No",
    activeBacklog: "No",
    skills: "",
    projects: "",
    internships: "",
    achievements: "",
    bio: "",
    profilePicture: "",
    resume: "",
  })

  const departments = [
    "Computer Science and Engineering",
    "Information Technology", 
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Electronics and Instrumentation Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Production Engineering",
    "Industrial Biotechnology",
  ]

  const years = ["2025", "2026", "2027", "2028"]

  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
        email: user.profile.email || "",
        phone: user.profile.phone || "",
        personalEmail: user.profile.personalEmail || "",
        rollNumber: user.profile.rollNumber || "",
        department: user.profile.department || "",
        year: user.profile.year || "",
        dateOfBirth: user.profile.dateOfBirth || "",
        address: user.profile.address || "",
        cgpa: user.profile.cgpa || "",
        backlogs: user.profile.backlogs || "0",
        historyOfArrear: user.profile.historyOfArrear || "No",
        activeBacklog: user.profile.activeBacklog || "No",
        skills: user.profile.skills || "",
        projects: user.profile.projects || "",
        internships: user.profile.internships || "",
        achievements: user.profile.achievements || "",
        bio: user.profile.bio || "",
        profilePicture: user.profile.profilePicture || "",
        resume: user.profile.resume || "",
      })
    }
  }, [user])

  // Get file preview URL for images
  const getFilePreviewUrl = (fileId: string) => {
    if (!fileId) return "/placeholder-user.jpg"
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  }

  // Get file view URL for documents (better for document preview)
  const getFileViewUrl = (fileId: string) => {
    if (!fileId) return ""
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  }

  // Get file download URL
  const getFileDownloadUrl = (fileId: string) => {
    if (!fileId) return ""
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/download?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
  }

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await DatabaseService.updateUserProfile(user.$id, profileData)
      
      setMessage({ 
        type: "success", 
        text: "Profile updated successfully!" 
      })
      setIsEditing(false)
    } catch (error: any) {
      setMessage({ 
        type: "error", 
        text: error.message || "Failed to update profile. Please try again." 
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleFileUpload = async (type: 'resume' | 'profilePicture') => {
    const input = document.createElement("input")
    input.type = "file"
    input.accept = type === "resume" ? ".pdf,.doc,.docx" : "image/*"
    
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return

      // Validate file size (5MB for resume, 2MB for profile picture)
      const maxSize = type === "resume" ? 5 * 1024 * 1024 : 2 * 1024 * 1024
      if (file.size > maxSize) {
        setMessage({ 
          type: "error", 
          text: `File size too large. Maximum ${type === "resume" ? "5MB" : "2MB"} allowed.` 
        })
        return
      }

      setIsUploading(true)
      setMessage({ type: "", text: "" })

      try {
        const uploadResult = await DatabaseService.uploadFile(file)
        
        // Update profile data with new file ID
        const updatedData = { [type]: uploadResult.$id }
        await DatabaseService.updateUserProfile(user.$id, updatedData)
        
        setProfileData(prev => ({ ...prev, [type]: uploadResult.$id }))
        setMessage({
          type: "success",
          text: `${type === "resume" ? "Resume" : "Profile picture"} uploaded successfully!`,
        })
        
        // Refresh user data
        window.location.reload()
      } catch (error: any) {
        setMessage({ type: "error", text: error.message || "Failed to upload file" })
      } finally {
        setIsUploading(false)
      }
    }
    
    input.click()
  }

  const handleFileDelete = async (type: 'resume' | 'profilePicture') => {
    try {
      const fileId = profileData[type]
      if (fileId) {
        await DatabaseService.deleteFile(fileId)
        
        // Update profile to remove file reference
        const updatedData = { [type]: "" }
        await DatabaseService.updateUserProfile(user.$id, updatedData)
        
        setProfileData(prev => ({ ...prev, [type]: "" }))
        setMessage({
          type: "success",
          text: `${type === "resume" ? "Resume" : "Profile picture"} deleted successfully!`,
        })
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to delete file" })
    }
  }

  const downloadFile = async (fileId: string, filename: string) => {
    try {
      const downloadUrl = await DatabaseService.getFileDownload(fileId)
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error('Error downloading file:', error)
    }
  }

  const calculateProfileCompletion = () => {
    const fields = [
      'firstName', 'lastName', 'email', 'phone', 'personalEmail', 'rollNumber', 
      'department', 'year', 'cgpa', 'historyOfArrear', 'activeBacklog', 'skills', 'profilePicture', 'resume'
    ]
    
    const completed = fields.filter(field => {
      const value = profileData[field as keyof typeof profileData]
      return value && value.toString().trim() !== ''
    }).length
    
    return Math.round((completed / fields.length) * 100)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Profile Management</h1>
                <p className="text-sm text-gray-600">Update your information</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {message.text && (
          <Alert
            className={`mb-6 ${message.type === "success" ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"}`}
          >
            {message.type === "success" ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={message.type === "success" ? "text-green-700" : "text-red-700"}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Picture and Basic Info */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage 
                      src={profileData.profilePicture ? getFilePreviewUrl(profileData.profilePicture) : "/placeholder-user.jpg"} 
                      alt="Profile Picture"
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-4xl font-semibold">
                      {profileData.firstName[0] || "U"}
                      {profileData.lastName[0] || ""}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">
                  {profileData.firstName} {profileData.lastName}
                </CardTitle>
                <CardDescription className="text-lg">{profileData.department}</CardDescription>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="secondary">{profileData.year}</Badge>
                  <Badge variant="outline">CGPA: {profileData.cgpa || "N/A"}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Profile Picture Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Profile Picture</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleFileUpload("profilePicture")}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                    {profileData.profilePicture && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleFileDelete("profilePicture")}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">JPG, PNG up to 2MB</p>
                </div>

                {/* Resume Upload */}
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Resume</Label>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleFileUpload("resume")}
                      disabled={isUploading}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {isUploading ? "Uploading..." : "Upload"}
                    </Button>
                    {profileData.resume && (
                      <>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[80vh]">
                            <DialogHeader>
                              <DialogTitle>Resume Preview</DialogTitle>
                              <DialogDescription>
                                Preview of your uploaded resume - {profileData.firstName} {profileData.lastName}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="flex-1 min-h-[500px]">
                              <div className="w-full h-[500px] border rounded bg-gray-50 relative">
                                {/* Loading indicator */}
                                <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded" id="loading-indicator">
                                  <div className="flex flex-col items-center">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
                                    <p className="text-sm text-gray-600">Loading preview...</p>
                                  </div>
                                </div>

                                {/* Primary preview attempt */}
                                <iframe
                                  src={`${getFileViewUrl(profileData.resume)}`}
                                  className="w-full h-full rounded"
                                  title="Resume Preview"
                                  onLoad={(e) => {
                                    // Hide loading and fallbacks if iframe loads successfully
                                    const loading = document.getElementById('loading-indicator')
                                    if (loading) loading.style.display = 'none'
                                    
                                    const siblings = e.currentTarget.parentElement?.children
                                    if (siblings) {
                                      Array.from(siblings).forEach((sibling, index) => {
                                        if (index > 1) { // Skip loading (0) and current iframe (1)
                                          (sibling as HTMLElement).style.display = 'none'
                                        }
                                      })
                                    }
                                  }}
                                  onError={(e) => {
                                    // Try Google Docs Viewer as fallback
                                    const loading = document.getElementById('loading-indicator')
                                    if (loading) loading.style.display = 'none'
                                    
                                    e.currentTarget.style.display = 'none'
                                    const googleViewer = e.currentTarget.nextElementSibling as HTMLIFrameElement
                                    if (googleViewer && googleViewer.tagName === 'IFRAME') {
                                      googleViewer.style.display = 'block'
                                    }
                                  }}
                                />
                                
                                {/* Google Docs Viewer fallback */}
                                <iframe
                                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(getFileViewUrl(profileData.resume))}&embedded=true`}
                                  className="w-full h-full rounded"
                                  title="Resume Preview (Google Viewer)"
                                  style={{ display: 'none' }}
                                  onLoad={(e) => {
                                    // Hide loading if Google Viewer loads successfully
                                    const loading = document.getElementById('loading-indicator')
                                    if (loading) loading.style.display = 'none'
                                  }}
                                  onError={(e) => {
                                    // If Google Viewer also fails, show final fallback
                                    e.currentTarget.style.display = 'none'
                                    const fallback = e.currentTarget.nextElementSibling as HTMLElement
                                    if (fallback) fallback.style.display = 'flex'
                                  }}
                                />
                                
                                {/* Final fallback content */}
                                <div 
                                  className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center bg-gray-50 rounded"
                                  style={{ display: 'none' }}
                                >
                                  <FileText className="w-16 h-16 text-gray-400 mb-4" />
                                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                                    Preview not available
                                  </h3>
                                  <p className="text-gray-500 mb-6 max-w-md">
                                    Your resume cannot be previewed directly in the browser. 
                                    This might be due to the file format or browser security settings.
                                  </p>
                                  <div className="flex gap-3">
                                    <Button
                                      onClick={() => downloadFile(profileData.resume, `${profileData.firstName}-${profileData.lastName}-resume.pdf`)}
                                      variant="outline"
                                    >
                                      <Download className="w-4 h-4 mr-2" />
                                      Download Resume
                                    </Button>
                                    <Button
                                      onClick={() => window.open(getFileViewUrl(profileData.resume), '_blank')}
                                      variant="outline"
                                    >
                                      <Eye className="w-4 h-4 mr-2" />
                                      Open in New Tab
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2 pt-4">
                              <Button
                                onClick={() => downloadFile(profileData.resume, `${profileData.firstName}-${profileData.lastName}-resume.pdf`)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => window.open(getFileViewUrl(profileData.resume), '_blank')}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                Open in New Tab
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => downloadFile(profileData.resume, `${profileData.firstName}-${profileData.lastName}-resume.pdf`)}
                        >
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleFileDelete("resume")}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX up to 5MB</p>
                  {profileData.resume && (
                    <div className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Resume uploaded successfully
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Profile Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Completion</span>
                  <Badge variant={calculateProfileCompletion() >= 80 ? "default" : "secondary"}>
                    {calculateProfileCompletion()}%
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Resume</span>
                  <Badge variant={profileData.resume ? "default" : "destructive"}>
                    {profileData.resume ? "Uploaded" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Picture</span>
                  <Badge variant={profileData.profilePicture ? "default" : "secondary"}>
                    {profileData.profilePicture ? "Uploaded" : "Default"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your basic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="personalEmail">Personal Email</Label>
                    <Input
                      id="personalEmail"
                      type="email"
                      value={profileData.personalEmail}
                      onChange={(e) => setProfileData({ ...profileData, personalEmail: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="historyOfArrear">History of Arrear</Label>
                    <Select
                      value={profileData.historyOfArrear}
                      onValueChange={(value) => setProfileData({ ...profileData, historyOfArrear: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activeBacklog">Active Backlog</Label>
                    <Select
                      value={profileData.activeBacklog}
                      onValueChange={(value) => setProfileData({ ...profileData, activeBacklog: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={profileData.address}
                    onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle>Academic Information</CardTitle>
                <CardDescription>Your college and academic details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rollNumber">Roll Number *</Label>
                    <Input
                      id="rollNumber"
                      value={profileData.rollNumber}
                      onChange={(e) => setProfileData({ ...profileData, rollNumber: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={profileData.department}
                      onValueChange={(value) => setProfileData({ ...profileData, department: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="year">Academic Year *</Label>
                    <Select
                      value={profileData.year}
                      onValueChange={(value) => setProfileData({ ...profileData, year: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select year" />
                      </SelectTrigger>
                      <SelectContent>
                        {years.map((year) => (
                          <SelectItem key={year} value={year}>
                            {year}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cgpa">CGPA *</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={profileData.cgpa}
                      onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="backlogs">Active Backlogs</Label>
                    <Input
                      id="backlogs"
                      type="number"
                      min="0"
                      value={profileData.backlogs}
                      onChange={(e) => setProfileData({ ...profileData, backlogs: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Professional Information */}
            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
                <CardDescription>Skills, projects, and experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical and soft skills (e.g., Python, React, Communication, Leadership)"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="projects">Projects</Label>
                  <Textarea
                    id="projects"
                    placeholder="Describe your academic and personal projects"
                    value={profileData.projects}
                    onChange={(e) => setProfileData({ ...profileData, projects: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internships">Internships</Label>
                  <Textarea
                    id="internships"
                    placeholder="List your internship experiences"
                    value={profileData.internships}
                    onChange={(e) => setProfileData({ ...profileData, internships: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    placeholder="List your achievements, awards, and certifications"
                    value={profileData.achievements}
                    onChange={(e) => setProfileData({ ...profileData, achievements: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    placeholder="Write a brief bio about yourself"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    disabled={!isEditing}
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <StudentRoute>
      <ProfilePageContent />
    </StudentRoute>
  )
}
