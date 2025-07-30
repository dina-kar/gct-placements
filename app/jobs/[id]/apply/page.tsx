"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  ArrowLeft,
  Building2,
  FileText,
  Upload,
  CheckCircle,
  AlertCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { DatabaseService } from "@/lib/database"
import { Job } from "@/lib/appwrite"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function ApplyJobPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [applicationData, setApplicationData] = useState({
    coverLetter: "",
    additionalInfo: "",
    confirmedEligibility: false,
    agreeTnC: false,
  })

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
      checkEligibilityAndRedirect()
    }
  }, [jobId, user])

  const fetchJobDetails = async () => {
    try {
      const jobData = await DatabaseService.getJob(jobId)
      setJob(jobData)
    } catch (error) {
      console.error('Error fetching job details:', error)
      router.push('/jobs')
    } finally {
      setLoading(false)
    }
  }

  const checkEligibilityAndRedirect = async () => {
    try {
      if (user) {
        // Check if already applied
        const applications = await DatabaseService.getUserApplications(user.$id)
        const existingApplication = applications.find(app => app.jobId === jobId)
        
        if (existingApplication) {
          router.push(`/jobs/${jobId}?message=already-applied`)
          return
        }

        // Check eligibility
        const jobData = await DatabaseService.getJob(jobId)
        if (jobData) {
          const eligibility = isEligibleForJob(jobData)
          if (!eligibility.eligible) {
            router.push(`/jobs/${jobId}?message=not-eligible`)
            return
          }
        }
      }
    } catch (error) {
      console.error('Error checking eligibility:', error)
    }
  }

  const isEligibleForJob = (job: Job) => {
    if (!user || !job) return { eligible: false, reason: "User not found" }
    
    const userCGPA = parseFloat(user.cgpa || "0")
    const minCGPA = parseFloat(job.minCGPA)
    
    if (userCGPA < minCGPA) {
      return { eligible: false, reason: `Minimum CGPA required: ${minCGPA}` }
    }
    
    if (job.noBacklogs && user.hasBacklogs) {
      return { eligible: false, reason: "No backlogs allowed" }
    }
    
    const userDept = user.department
    const allowedDepts = job.departments
    if (!allowedDepts.includes(userDept)) {
      return { eligible: false, reason: "Department not eligible" }
    }
    
    const deadline = new Date(job.applicationDeadline)
    if (deadline < new Date()) {
      return { eligible: false, reason: "Application deadline passed" }
    }
    
    return { eligible: true, reason: "" }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!job || !user) return
    
    if (!applicationData.confirmedEligibility || !applicationData.agreeTnC) {
      alert("Please confirm your eligibility and agree to terms and conditions")
      return
    }

    setSubmitting(true)
    
    try {
      await DatabaseService.createApplication({
        jobId: job.$id,
        userId: user.$id,
        jobTitle: job.title,
        company: job.company,
        status: 'applied',
        coverLetter: applicationData.coverLetter,
        additionalInfo: applicationData.additionalInfo,
        appliedAt: new Date().toISOString(),
      })

      router.push(`/jobs/${jobId}?message=application-success`)
    } catch (error) {
      console.error('Error submitting application:', error)
      alert("Failed to submit application. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading application form...</div>
      </div>
    )
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
          <Link href="/jobs">
            <Button>Back to Jobs</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href={`/jobs/${jobId}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Details
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-3xl mx-auto">
            {/* Job Summary */}
            <Card className="mb-8">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                    {job.logo ? (
                      <img
                        src={job.logo}
                        alt={`${job.company} logo`}
                        className="max-w-full max-h-full"
                      />
                    ) : (
                      <Building2 className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                    <p className="text-lg text-gray-600">{job.company}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">{job.location}</Badge>
                      <Badge variant="outline">{job.package}</Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Application Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Submit Your Application
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Applicant Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Applicant Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={user?.name || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={user?.email || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="rollNumber">Roll Number</Label>
                        <Input
                          id="rollNumber"
                          value={user?.rollNumber || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="department">Department</Label>
                        <Input
                          id="department"
                          value={user?.department || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="cgpa">CGPA</Label>
                        <Input
                          id="cgpa"
                          value={user?.cgpa || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={user?.phone || ""}
                          disabled
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div className="space-y-2">
                    <Label htmlFor="coverLetter">Cover Letter</Label>
                    <Textarea
                      id="coverLetter"
                      placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a good fit..."
                      value={applicationData.coverLetter}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        coverLetter: e.target.value
                      })}
                      rows={6}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Optional but recommended. Highlight your relevant skills and experience.
                    </p>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-2">
                    <Label htmlFor="additionalInfo">Additional Information</Label>
                    <Textarea
                      id="additionalInfo"
                      placeholder="Any additional information you'd like to share (projects, achievements, certifications, etc.)..."
                      value={applicationData.additionalInfo}
                      onChange={(e) => setApplicationData({
                        ...applicationData,
                        additionalInfo: e.target.value
                      })}
                      rows={4}
                      className="resize-none"
                    />
                    <p className="text-xs text-gray-500">
                      Optional. Include any relevant projects, certifications, or achievements.
                    </p>
                  </div>

                  {/* Documents Section */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Documents</h3>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-start gap-3">
                        <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-blue-800">Resume Required</h4>
                          <p className="text-sm text-blue-600">
                            Make sure your resume is uploaded in your profile. The latest version will be 
                            automatically included with your application.
                          </p>
                          {user?.resume ? (
                            <div className="flex items-center gap-2 mt-2">
                              <CheckCircle className="w-4 h-4 text-green-600" />
                              <span className="text-sm text-green-600">Resume uploaded</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 mt-2">
                              <AlertCircle className="w-4 h-4 text-red-600" />
                              <span className="text-sm text-red-600">No resume uploaded</span>
                              <Link href="/profile" className="text-sm text-blue-600 underline">
                                Upload resume
                              </Link>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Checkboxes */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Confirmation</h3>
                    
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="eligibility"
                        checked={applicationData.confirmedEligibility}
                        onCheckedChange={(checked) => setApplicationData({
                          ...applicationData,
                          confirmedEligibility: checked as boolean
                        })}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="eligibility"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I confirm that I meet all the eligibility criteria for this position
                        </label>
                        <p className="text-xs text-muted-foreground">
                          Including CGPA requirements, department eligibility, and backlog status.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox
                        id="terms"
                        checked={applicationData.agreeTnC}
                        onCheckedChange={(checked) => setApplicationData({
                          ...applicationData,
                          agreeTnC: checked as boolean
                        })}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-xs text-muted-foreground">
                          I understand that providing false information may result in disqualification.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="flex flex-col sm:flex-row gap-4 pt-6">
                    <Button
                      type="submit"
                      size="lg"
                      disabled={submitting || !applicationData.confirmedEligibility || !applicationData.agreeTnC}
                      className="flex-1"
                    >
                      {submitting ? "Submitting Application..." : "Submit Application"}
                    </Button>
                    <Link href={`/jobs/${jobId}`}>
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 