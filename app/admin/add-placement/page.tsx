"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DatePicker } from "@/components/ui/date-picker"
import { Building2, ArrowLeft, Upload, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { DatabaseService } from "@/lib/database"
import { AdminRoute } from "@/components/ProtectedRoute"

export default function AddPlacementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })

  const [formData, setFormData] = useState({
    studentName: "",
    studentId: "",
    studentEmail: "",
    department: "",
    batch: "",
    company: "",
    position: "",
    package: "",
    location: "",
    joiningDate: "",
    offerLetterDate: "",
    placedAt: "",
    testimonial: "",
    jobId: "",
    photo: null as File | null,
    offerLetter: null as File | null,
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

  const batches = ["2025", "2026", "2027", "2028"]

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: "photo" | "offerLetter") => {
    if (e.target.files && e.target.files[0]) {
      setFormData({
        ...formData,
        [field]: e.target.files[0],
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage({ type: "", text: "" })

    try {
      // Validate required fields
      if (!formData.studentName || !formData.company || !formData.package) {
        throw new Error("Please fill in all required fields: Student Name, Company, and Package")
      }

      // Upload files if provided
      let photoFileId = null
      let offerLetterFileId = null

      if (formData.photo) {
        const photoUpload = await DatabaseService.uploadFile(formData.photo)
        photoFileId = photoUpload.$id
      }

      if (formData.offerLetter) {
        const offerLetterUpload = await DatabaseService.uploadFile(formData.offerLetter)
        offerLetterFileId = offerLetterUpload.$id
      }

      // Create placement record with only the required database fields
      const placementData = {
        userId: formData.studentEmail || `manual_${Date.now()}`,
        jobId: formData.jobId || `manual_job_${Date.now()}`,
        company: formData.company,
        package: formData.package,
        placedAt: formData.placedAt || new Date().toISOString(),
      }

      await DatabaseService.createPlacement(placementData)

      setMessage({
        type: "success",
        text: "Placement record added successfully!",
      })

      // Reset form after successful submission
      setTimeout(() => {
        router.push("/placements")
      }, 2000)
    } catch (error: any) {
      console.error('Error creating placement:', error)
      setMessage({
        type: "error",
        text: error.message || "Failed to add placement record. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AdminRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white border-b">
          <div className="container mx-auto px-4 py-4 flex items-center gap-4">
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
                <p className="text-sm text-gray-600">Add New Placement</p>
              </div>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Add New Placement Record</h1>
              <p className="text-gray-600">Create a new placement record for a student</p>
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
                <CardTitle>Placement Information</CardTitle>
                <CardDescription>
                  Fill in the details of the student's placement. All fields marked with * are required.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Student Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Student Information</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentName">Student Name *</Label>
                        <Input
                          id="studentName"
                          placeholder="Enter student full name"
                          value={formData.studentName}
                          onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="studentId">Student ID/Roll Number</Label>
                        <Input
                          id="studentId"
                          placeholder="Enter roll number or student ID"
                          value={formData.studentId}
                          onChange={(e) => setFormData({ ...formData, studentId: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="studentEmail">Student Email (Optional)</Label>
                        <Input
                          id="studentEmail"
                          type="email"
                          placeholder="student@gct.ac.in"
                          value={formData.studentEmail}
                          onChange={(e) => setFormData({ ...formData, studentEmail: e.target.value })}
                        />
                        <p className="text-xs text-gray-500">Used to link with existing student profile if available</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="department">Department</Label>
                        <Select
                          value={formData.department}
                          onValueChange={(value) => setFormData({ ...formData, department: value })}
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

                    <div className="space-y-2">
                      <Label htmlFor="batch">Batch/Year</Label>
                      <Select
                        value={formData.batch}
                        onValueChange={(value) => setFormData({ ...formData, batch: value })}
                      >
                        <SelectTrigger className="w-full md:w-[200px]">
                          <SelectValue placeholder="Select batch" />
                        </SelectTrigger>
                        <SelectContent>
                          {batches.map((batch) => (
                            <SelectItem key={batch} value={batch}>
                              {batch}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Company Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Company & Position Details</h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="company">Company Name *</Label>
                        <Input
                          id="company"
                          placeholder="e.g., Google, Microsoft, TCS"
                          value={formData.company}
                          onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="position">Position/Role</Label>
                        <Input
                          id="position"
                          placeholder="e.g., Software Engineer, Data Analyst"
                          value={formData.position}
                          onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="package">Package/Salary *</Label>
                        <Input
                          id="package"
                          placeholder="e.g., ₹12 LPA, $80,000"
                          value={formData.package}
                          onChange={(e) => setFormData({ ...formData, package: e.target.value })}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="location">Work Location</Label>
                        <Input
                          id="location"
                          placeholder="e.g., Bangalore, Chennai, Remote"
                          value={formData.location}
                          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Important Dates */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Important Dates</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="placedAt">Placement Date</Label>
                        <DatePicker
                          value={formData.placedAt}
                          onChange={(date) => setFormData({ ...formData, placedAt: date })}
                          placeholder="Select placement date"
                        />
                        <p className="text-xs text-gray-500">Date when student got placed</p>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offerLetterDate">Offer Letter Date</Label>
                        <DatePicker
                          value={formData.offerLetterDate}
                          onChange={(date) => setFormData({ ...formData, offerLetterDate: date })}
                          placeholder="Select offer date"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="joiningDate">Joining Date</Label>
                        <DatePicker
                          value={formData.joiningDate}
                          onChange={(date) => setFormData({ ...formData, joiningDate: date })}
                          placeholder="Select joining date"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Additional Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Additional Information</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="testimonial">Student Testimonial</Label>
                      <Textarea
                        id="testimonial"
                        placeholder="Share the student's thoughts about their placement experience..."
                        value={formData.testimonial}
                        onChange={(e) => setFormData({ ...formData, testimonial: e.target.value })}
                        rows={4}
                      />
                    </div>
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Documents</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="photo">Student Photo</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "photo")}
                          />
                          <Upload className="w-4 h-4 text-gray-400" />
                        </div>
                        {formData.photo && (
                          <p className="text-xs text-gray-500">Selected: {formData.photo.name}</p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="offerLetter">Offer Letter</Label>
                        <div className="flex items-center gap-2">
                          <Input
                            id="offerLetter"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={(e) => handleFileChange(e, "offerLetter")}
                          />
                          <Upload className="w-4 h-4 text-gray-400" />
                        </div>
                        {formData.offerLetter && (
                          <p className="text-xs text-gray-500">Selected: {formData.offerLetter.name}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4">
                    <Link href="/admin/dashboard">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Adding..." : "Add Placement Record"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AdminRoute>
  )
}
