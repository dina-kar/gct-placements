"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Building2, ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

// Custom DatePicker component since it's not in shadcn by default
function DatePicker({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return <Input type="date" value={value} onChange={(e) => onChange(e.target.value)} />
}

export default function AddJobPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    jobType: "Full-time",
    package: "",
    description: "",
    responsibilities: "",
    qualifications: "",
    minCGPA: "7.0",
    noBacklogs: true,
    departments: [] as string[],
    applicationDeadline: "",
    driveDate: "",
    logo: null as File | null,
    additionalDocuments: null as File | null,
  })

  const departments = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
    "Chemical Engineering",
    "Textile Technology",
    "Production Engineering",
    "Biomedical Engineering",
  ]

  const jobTypes = ["Full-time", "Internship", "Part-time", "Contract"]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "logo" | "additionalDocuments") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      })
    }
  }

  const handleDepartmentChange = (department: string, checked: boolean) => {
    if (checked) {
      setFormData({
        ...formData,
        departments: [...formData.departments, department],
      })
    } else {
      setFormData({
        ...formData,
        departments: formData.departments.filter((d) => d !== department),
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Validate form
      if (formData.departments.length === 0) {
        throw new Error("Please select at least one eligible department")
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setMessage({
        type: "success",
        text: "Job posting created successfully!",
      })

      // Reset form or redirect after successful submission
      setTimeout(() => {
        router.push("/admin/jobs")
      }, 2000)
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create job posting. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GCT Placement Portal</h1>
                <p className="text-sm text-gray-600">Admin Dashboard</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Job Posting</h1>
            <p className="text-gray-600">Add a new job opportunity for students</p>
          </div>

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

          <Card>
            <CardHeader>
              <CardTitle>Job Information</CardTitle>
              <CardDescription>
                Fill in the details of the job posting. All fields marked with * are required.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Job Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Basic Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="title">Job Title *</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Software Engineer"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name *</Label>
                      <Input
                        id="company"
                        placeholder="e.g., Google"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="location">Location *</Label>
                      <Input
                        id="location"
                        placeholder="e.g., Bangalore"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="jobType">Job Type *</Label>
                      <Select
                        value={formData.jobType}
                        onValueChange={(value) => setFormData({ ...formData, jobType: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select job type" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="package">Package/Salary *</Label>
                      <Input
                        id="package"
                        placeholder="e.g., ₹8-10 LPA"
                        value={formData.package}
                        onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="logo">Company Logo</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="logo"
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, "logo")}
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" onClick={() => document.getElementById("logo")?.click()}>
                        <Upload className="w-4 h-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Upload company logo (JPEG, PNG, max 2MB)</p>
                  </div>
                </div>

                {/* Job Description */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Job Description</h3>

                  <div className="space-y-2">
                    <Label htmlFor="description">Job Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Provide a detailed description of the job..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={4}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="responsibilities">Responsibilities *</Label>
                    <Textarea
                      id="responsibilities"
                      placeholder="List the key responsibilities of the role..."
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                      rows={4}
                      required
                    />
                    <p className="text-xs text-gray-500">Enter each responsibility on a new line</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="qualifications">Qualifications *</Label>
                    <Textarea
                      id="qualifications"
                      placeholder="List the required qualifications..."
                      value={formData.qualifications}
                      onChange={(e) => setFormData({ ...formData, qualifications: e.target.value })}
                      rows={4}
                      required
                    />
                    <p className="text-xs text-gray-500">Enter each qualification on a new line</p>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Eligibility Criteria</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="minCGPA">Minimum CGPA *</Label>
                      <Select
                        value={formData.minCGPA}
                        onValueChange={(value) => setFormData({ ...formData, minCGPA: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select minimum CGPA" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6.0">6.0</SelectItem>
                          <SelectItem value="6.5">6.5</SelectItem>
                          <SelectItem value="7.0">7.0</SelectItem>
                          <SelectItem value="7.5">7.5</SelectItem>
                          <SelectItem value="8.0">8.0</SelectItem>
                          <SelectItem value="8.5">8.5</SelectItem>
                          <SelectItem value="9.0">9.0</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2 h-full pt-8">
                      <Checkbox
                        id="noBacklogs"
                        checked={formData.noBacklogs}
                        onCheckedChange={(checked) => setFormData({ ...formData, noBacklogs: checked as boolean })}
                      />
                      <Label htmlFor="noBacklogs" className="font-normal">
                        No active backlogs required
                      </Label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Eligible Departments *</Label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-2">
                      {departments.map((department) => (
                        <div key={department} className="flex items-center space-x-2">
                          <Checkbox
                            id={`dept-${department}`}
                            checked={formData.departments.includes(department)}
                            onCheckedChange={(checked) => handleDepartmentChange(department, checked as boolean)}
                          />
                          <Label htmlFor={`dept-${department}`} className="font-normal">
                            {department}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Important Dates */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Important Dates</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicationDeadline">Application Deadline *</Label>
                      <DatePicker
                        value={formData.applicationDeadline}
                        onChange={(value) => setFormData({ ...formData, applicationDeadline: value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="driveDate">Placement Drive Date</Label>
                      <DatePicker
                        value={formData.driveDate}
                        onChange={(value) => setFormData({ ...formData, driveDate: value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Additional Information</h3>

                  <div className="space-y-2">
                    <Label htmlFor="additionalDocuments">Additional Documents</Label>
                    <div className="flex items-center gap-4">
                      <Input
                        id="additionalDocuments"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFileChange(e, "additionalDocuments")}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById("additionalDocuments")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Browse
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">Upload any additional documents (PDF, DOC, max 5MB)</p>
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Creating..." : "Create Job Posting"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
