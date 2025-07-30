"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { DatabaseService } from "@/lib/database"
import { Job } from "@/lib/appwrite"
import { ProtectedRoute } from "@/components/ProtectedRoute"

export default function JobDetailPage() {
  const { user } = useAuth()
  const params = useParams()
  const router = useRouter()
  const jobId = params.id as string

  const [job, setJob] = useState<Job | null>(null)
  const [loading, setLoading] = useState(true)
  const [applicationStatus, setApplicationStatus] = useState<string | null>(null)
  const [applicationCount, setApplicationCount] = useState(0)

  useEffect(() => {
    if (jobId) {
      fetchJobDetails()
      checkApplicationStatus()
      fetchApplicationCount()
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

  const checkApplicationStatus = async () => {
    try {
      if (user) {
        const applications = await DatabaseService.getUserApplications(user.$id)
        const application = applications.find(app => app.jobId === jobId)
        setApplicationStatus(application ? application.status : null)
      }
    } catch (error) {
      console.error('Error checking application status:', error)
    }
  }

  const fetchApplicationCount = async () => {
    try {
      const applications = await DatabaseService.getJobApplications(jobId)
      setApplicationCount(applications.length)
    } catch (error) {
      console.error('Error fetching application count:', error)
      setApplicationCount(Math.floor(Math.random() * 50) + 10) // Fallback
    }
  }

  const isEligibleForJob = (job: Job) => {
    if (!user || !user.profile || !job) return { eligible: false, reason: "User profile not found" }
    
    const userCGPA = parseFloat(user.profile.cgpa || "0")
    const minCGPA = parseFloat(job.minCGPA)
    
    if (userCGPA < minCGPA) {
      return { eligible: false, reason: `Minimum CGPA required: ${minCGPA}, your CGPA: ${userCGPA}` }
    }
    
    // Check backlogs - convert string to boolean/number if needed
    const userBacklogs = user.profile.backlogs
    const hasBacklogs = userBacklogs && userBacklogs !== "0" && userBacklogs.toLowerCase() !== "no"
    
    if (job.noBacklogs && hasBacklogs) {
      return { eligible: false, reason: "No backlogs allowed" }
    }
    
    const userDept = user.profile.department
    const allowedDepts = job.departments
    if (!userDept || !allowedDepts.includes(userDept)) {
      return { eligible: false, reason: "Your department is not eligible for this position" }
    }
    
    const deadline = new Date(job.applicationDeadline)
    if (deadline < new Date()) {
      return { eligible: false, reason: "Application deadline has passed" }
    }
    
    if (job.status !== 'active') {
      return { eligible: false, reason: "This job posting is no longer active" }
    }
    
    return { eligible: true, reason: "" }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading job details...</div>
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

  const eligibility = isEligibleForJob(job)

  return (
    <ProtectedRoute requireAuth>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <Link href="/jobs">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Jobs
              </Button>
            </Link>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            {/* Job Header */}
            <Card className="mb-8">
              <CardContent className="p-8">
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Company Logo */}
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={`${job.company} logo`}
                          className="max-w-full max-h-full"
                        />
                      ) : (
                        <Building2 className="w-10 h-10 text-gray-400" />
                      )}
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="flex-grow">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-4">
                      <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
                        <div className="flex items-center gap-2 text-lg text-gray-600 mb-3">
                          <Building2 className="w-5 h-5" />
                          <span>{job.company}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location}</span>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 mt-4 md:mt-0">
                        <Badge variant={job.status === 'active' ? "default" : "secondary"} className="w-fit">
                          {job.status.toUpperCase()}
                        </Badge>
                        {applicationStatus && (
                          <Badge variant="secondary" className="w-fit">
                            Applied - {applicationStatus.replace('_', ' ').toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Job Details Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-medium">{job.package}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <TrendingUp className="w-4 h-4" />
                        <span>Min CGPA: {job.minCGPA}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span>Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{applicationCount} applications</span>
                      </div>
                    </div>

                    {/* Eligibility Status */}
                    {!eligibility.eligible ? (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-red-800">Not Eligible</h3>
                            <p className="text-sm text-red-600">{eligibility.reason}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                        <div className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-green-600 mt-0.5" />
                          <div>
                            <h3 className="font-medium text-green-800">You're Eligible!</h3>
                            <p className="text-sm text-green-600">You meet all the requirements for this position.</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3">
                      {eligibility.eligible && !applicationStatus && job.status === 'active' && (
                        <Link href={`/jobs/${job.$id}/apply`}>
                          <Button size="lg" className="w-full sm:w-auto">
                            Apply Now
                          </Button>
                        </Link>
                      )}
                      {applicationStatus && (
                        <Button size="lg" variant="secondary" disabled className="w-full sm:w-auto">
                          Applied - {applicationStatus.replace('_', ' ').toUpperCase()}
                        </Button>
                      )}
                      {!eligibility.eligible && (
                        <Button size="lg" variant="outline" disabled className="w-full sm:w-auto">
                          Not Eligible
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Job Description */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Job Description
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose max-w-none">
                  <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Job Requirements */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Academic Requirements</h3>
                    <ul className="space-y-1 text-gray-700">
                      <li>• Minimum CGPA: {job.minCGPA}</li>
                      <li>• No active backlogs: {job.noBacklogs ? "Required" : "Not required"}</li>
                    </ul>
                  </div>
                  
                  <Separator />
                  
                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Eligible Departments</h3>
                    <div className="flex flex-wrap gap-2">
                      {job.departments.map((dept, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700">
                          {dept}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium text-gray-900 mb-2">Important Dates</h3>
                    <div className="space-y-2 text-gray-700">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Application Deadline: {new Date(job.applicationDeadline).toLocaleDateString()}</span>
                      </div>
                      {job.driveDate && (
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>Selection Drive: {new Date(job.driveDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Company Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  About {job.company}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {job.logo ? (
                        <img
                          src={job.logo}
                          alt={`${job.company} logo`}
                          className="max-w-full max-h-full"
                        />
                      ) : (
                        <Building2 className="w-6 h-6 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{job.company}</h3>
                      <p className="text-sm text-gray-600">{job.location}</p>
                    </div>
                  </div>
                  <p className="text-gray-700">
                    This position offers an excellent opportunity to work with one of the leading companies 
                    in the industry. Join a dynamic team and contribute to innovative projects while growing 
                    your career.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
} 