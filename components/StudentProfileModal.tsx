"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap, 
  Award, 
  FileText, 
  Github, 
  Linkedin,
  Download,
  ExternalLink
} from "lucide-react"
import { DatabaseService } from "@/lib/database"
import { UserProfile } from "@/lib/appwrite"
import { storage, config } from "@/lib/appwrite"

interface StudentProfileModalProps {
  userId: string
  isOpen: boolean
  onClose: () => void
}

export function StudentProfileModal({ userId, isOpen, onClose }: StudentProfileModalProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen && userId) {
      fetchProfile()
    }
  }, [isOpen, userId])

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const userProfile = await DatabaseService.getUserProfile(userId)
      setProfile(userProfile)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownloadResume = () => {
    if (profile?.resume) {
      try {
        // Extract file ID from the resume URL or use the resume field directly if it's already a file ID
        const fileId = profile.resume.includes('/') ? 
          profile.resume.split('/').pop()?.split('?')[0] || profile.resume : 
          profile.resume
        
        const downloadUrl = storage.getFileDownload(config.storageId, fileId)
        window.open(downloadUrl.toString(), '_blank')
      } catch (error) {
        console.error('Error downloading resume:', error)
        alert('Unable to download resume. Please check if the file exists.')
      }
    }
  }

  const handleViewResume = () => {
    if (profile?.resume) {
      try {
        // Extract file ID from the resume URL or use the resume field directly if it's already a file ID
        const fileId = profile.resume.includes('/') ? 
          profile.resume.split('/').pop()?.split('?')[0] || profile.resume : 
          profile.resume
        
        const previewUrl = storage.getFileView(config.storageId, fileId)
        window.open(previewUrl.toString(), '_blank')
      } catch (error) {
        console.error('Error viewing resume:', error)
        alert('Unable to view resume. Please try downloading instead.')
      }
    }
  }

  const getProfileImageUrl = (profilePicture: string) => {
    if (!profilePicture) return null
    
    try {
      // Extract file ID from the profile picture URL or use the field directly if it's already a file ID
      const fileId = profilePicture.includes('/') ? 
        profilePicture.split('/').pop()?.split('?')[0] || profilePicture : 
        profilePicture
      
      return storage.getFilePreview(config.storageId, fileId, 200, 200).toString()
    } catch (error) {
      console.error('Error getting profile image URL:', error)
      return null
    }
  }

  if (loading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Loading Student Profile</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div>Loading student profile...</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  if (!profile) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Student Profile Not Found</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center h-64">
            <div>Profile not found</div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <User className="w-6 h-6" />
            Student Profile - {profile.fullName}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info */}
          <div className="lg:col-span-1 space-y-4">
            {/* Profile Picture */}
            <Card>
              <CardContent className="p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                  {profile.profilePicture && getProfileImageUrl(profile.profilePicture) ? (
                    <img 
                      src={getProfileImageUrl(profile.profilePicture)!} 
                      alt="Profile" 
                      className="w-24 h-24 rounded-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                        e.currentTarget.nextElementSibling?.classList.remove('hidden')
                      }}
                    />
                  ) : null}
                  <User className={`w-12 h-12 text-gray-400 ${profile.profilePicture && getProfileImageUrl(profile.profilePicture) ? 'hidden' : ''}`} />
                </div>
                <h3 className="font-semibold text-lg">{profile.fullName}</h3>
                <p className="text-gray-600">{profile.rollNo}</p>
                <Badge className="mt-2">
                  {profile.department}
                </Badge>
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Phone className="w-5 h-5" />
                  Contact Info
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{profile.collegeEmail}</span>
                </div>
                {profile.personalEmail && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.personalEmail}</span>
                  </div>
                )}
                {profile.phoneNo && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">{profile.phoneNo}</span>
                  </div>
                )}
                {profile.currentAddress && (
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-gray-500 mt-0.5" />
                    <span className="text-sm">{profile.currentAddress}</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Profiles */}
            {(profile.githubProfile || profile.linkedInProfile) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Social Profiles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {profile.githubProfile && (
                    <div className="flex items-center gap-2">
                      <Github className="w-4 h-4" />
                      <a 
                        href={profile.githubProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                  {profile.linkedInProfile && (
                    <div className="flex items-center gap-2">
                      <Linkedin className="w-4 h-4" />
                      <a 
                        href={profile.linkedInProfile} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Academic & Other Info */}
          <div className="lg:col-span-2 space-y-4">
            {/* Academic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Academic Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Roll Number</label>
                    <p className="font-semibold">{profile.rollNo || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Department</label>
                    <p className="font-semibold">{profile.department || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Batch</label>
                    <p className="font-semibold">{profile.batch || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Current CGPA</label>
                    <p className="font-semibold">{profile.currentCgpa || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">10th Marks</label>
                    <p className="font-semibold">{profile.tenthMarkPercent ? `${profile.tenthMarkPercent}%` : "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">12th Marks</label>
                    <p className="font-semibold">{profile.twelthMarkPercent ? `${profile.twelthMarkPercent}%` : "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Active Backlog</label>
                    <Badge variant={profile.activeBacklog === "Yes" ? "destructive" : "default"}>
                      {profile.activeBacklog || "N/A"}
                    </Badge>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">History of Arrear</label>
                    <Badge variant={profile.historyOfArrear === "Yes" ? "secondary" : "default"}>
                      {profile.historyOfArrear || "N/A"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Semester-wise CGPA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  Semester-wise Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-4 gap-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                    const cgpaKey = `sem${sem}Cgpa` as keyof UserProfile
                    const cgpa = profile[cgpaKey] as string
                    return (
                      <div key={sem} className="text-center p-2 border rounded">
                        <div className="text-sm text-gray-600">Sem {sem}</div>
                        <div className="font-semibold">{cgpa || "N/A"}</div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Personal Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Personal Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Date of Birth</label>
                    <p className="font-semibold">{profile.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString() : "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Gender</label>
                    <p className="font-semibold">{profile.gender || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Parent's Name</label>
                    <p className="font-semibold">{profile.parentsName || "N/A"}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Parent's Phone</label>
                    <p className="font-semibold">{profile.parentsNo || "N/A"}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-gray-600">Permanent Address</label>
                    <p className="font-semibold">{profile.permanentAddress || "N/A"}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Resume */}
            {profile.resume && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Resume
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2">
                    <Button onClick={handleViewResume} variant="outline">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Resume
                    </Button>
                    <Button onClick={handleDownloadResume} variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Download Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
