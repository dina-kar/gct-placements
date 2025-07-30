"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, GraduationCap, Upload, FileText, Save, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DatabaseService } from "@/lib/database"
import { ProtectedRoute } from "@/components/ProtectedRoute"

function ProfilePageContent() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  const [profileData, setProfileData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    rollNumber: "",
    department: "",
    year: "",
    dateOfBirth: "",
    address: "",
    cgpa: "",
    backlogs: "",
    skills: "",
    projects: "",
    internships: "",
    achievements: "",
    bio: "",
    profilePicture: "",
    resume: "",
  })

  useEffect(() => {
    if (user?.profile) {
      setProfileData({
        firstName: user.profile.firstName || "",
        lastName: user.profile.lastName || "",
        email: user.profile.email || "",
        phone: user.profile.phone || "",
        rollNumber: user.profile.rollNumber || "",
        department: user.profile.department || "",
        year: user.profile.year || "",
        dateOfBirth: user.profile.dateOfBirth || "",
        address: user.profile.address || "",
        cgpa: user.profile.cgpa || "",
        backlogs: user.profile.backlogs || "0",
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

  const handleSave = async () => {
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      const result = await DatabaseService.updateUserProfile(user.$id, profileData)
      
      if (result.success) {
        setMessage({ type: "success", text: result.message })
        setIsEditing(false)
      } else {
        setMessage({ type: "error", text: result.message })
      }
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to update profile. Please try again." })
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

      setIsUploading(true)
      setMessage({ type: "", text: "" })

      try {
        const uploadResult = await DatabaseService.uploadFile(file)
        
        if (uploadResult.success && uploadResult.fileId) {
          // Update profile data with new file ID
          const updatedData = { [type]: uploadResult.fileId }
          const updateResult = await DatabaseService.updateUserProfile(user.$id, updatedData)
          
          if (updateResult.success) {
            setProfileData(prev => ({ ...prev, [type]: uploadResult.fileId! }))
            setMessage({
              type: "success",
              text: `${type === "resume" ? "Resume" : "Profile picture"} uploaded successfully!`,
            })
          } else {
            setMessage({ type: "error", text: updateResult.message })
          }
        } else {
          setMessage({ type: "error", text: uploadResult.message })
        }
      } catch (error: any) {
        setMessage({ type: "error", text: error.message || "Failed to upload file" })
      } finally {
        setIsUploading(false)
      }
    }
    
    input.click()
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
            <div>
              <h1 className="text-xl font-bold text-gray-900">Student Profile</h1>
              <p className="text-sm text-gray-600">Manage your personal information</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <User className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
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
                    <AvatarImage src="/placeholder.svg?height=128&width=128" />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-4xl font-semibold">
                      {profileData.firstName[0]}
                      {profileData.lastName[0]}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle className="text-2xl">
                  {profileData.firstName} {profileData.lastName}
                </CardTitle>
                <CardDescription className="text-lg">{profileData.department}</CardDescription>
                <div className="flex justify-center gap-2 mt-4">
                  <Badge variant="secondary">{profileData.year}</Badge>
                  <Badge variant="outline">CGPA: {profileData.cgpa}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={() => handleFileUpload("profilePicture")}
                  disabled={!isEditing || isUploading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Update Photo"}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full bg-transparent" 
                  onClick={() => handleFileUpload("resume")}
                  disabled={isUploading}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  {isUploading ? "Uploading..." : "Upload Resume"}
                </Button>
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
                  <Badge variant="secondary">85%</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Applications</span>
                  <Badge>12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Interviews</span>
                  <Badge variant="outline">3</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Information */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={profileData.firstName}
                      onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={profileData.lastName}
                      onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="dateOfBirth">Date of Birth</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({ ...profileData, dateOfBirth: e.target.value })}
                    disabled={!isEditing}
                  />
                </div>

                <div>
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
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="rollNumber">Roll Number</Label>
                    <Input id="rollNumber" value={profileData.rollNumber} disabled />
                  </div>
                  <div>
                    <Label htmlFor="department">Department</Label>
                    <Input id="department" value={profileData.department} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="year">Year of Study</Label>
                    <Input id="year" value={profileData.year} disabled />
                  </div>
                  <div>
                    <Label htmlFor="cgpa">Current CGPA</Label>
                    <Input
                      id="cgpa"
                      value={profileData.cgpa}
                      onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                      disabled={!isEditing}
                    />
                  </div>
                  <div>
                    <Label htmlFor="backlogs">Number of Backlogs</Label>
                    <Input
                      id="backlogs"
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
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    placeholder="List your technical skills separated by commas"
                    value={profileData.skills}
                    onChange={(e) => setProfileData({ ...profileData, skills: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="projects">Projects</Label>
                  <Textarea
                    id="projects"
                    placeholder="Describe your key projects"
                    value={profileData.projects}
                    onChange={(e) => setProfileData({ ...profileData, projects: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div>
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

                <div>
                  <Label htmlFor="achievements">Achievements</Label>
                  <Textarea
                    id="achievements"
                    placeholder="List your achievements and awards"
                    value={profileData.achievements}
                    onChange={(e) => setProfileData({ ...profileData, achievements: e.target.value })}
                    disabled={!isEditing}
                    rows={3}
                  />
                </div>

                <div>
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
    <ProtectedRoute>
      <ProfilePageContent />
    </ProtectedRoute>
  )
}
