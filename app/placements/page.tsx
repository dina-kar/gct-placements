"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Building2,
  ArrowLeft,
  Search,
  Filter,
  Download,
  Eye,
  Plus,
  Calendar,
  MapPin,
  GraduationCap,
  User,
  Briefcase,
} from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { DatabaseService } from "@/lib/database"
import { Placement } from "@/lib/appwrite"

export default function PlacementsPage() {
  const { user, isAdmin, hasStudentAccess } = useAuth()
  const [placements, setPlacements] = useState<Placement[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterBatch, setFilterBatch] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid")

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

  useEffect(() => {
    fetchPlacements()
  }, [])

  const fetchPlacements = async () => {
    try {
      const response = await DatabaseService.getPlacements()
      setPlacements(response)
    } catch (error) {
      console.error('Error fetching placements:', error)
    } finally {
      setLoading(false)
    }
  }

  // Get file preview URL
  const getFilePreviewUrl = (fileId: string) => {
    if (!fileId) return "/placeholder-user.jpg"
    return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${process.env.NEXT_PUBLIC_APPWRITE_STORAGE_BUCKET_ID}/files/${fileId}/preview?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
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

  // Filter placements based on search term, filters, and tab
  const filteredPlacements = placements.filter((placement) => {
    const studentName = placement.studentName || ""
    const studentId = placement.studentId || ""
    const company = placement.company || ""
    const position = placement.position || ""
    
    const matchesSearch =
      studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || 
      placement.department === filterDepartment
    
    const matchesBatch = filterBatch === "all" || 
      placement.batch === filterBatch

    // Tab filtering
    let matchesTab = true
    if (activeTab === "tech") {
      matchesTab = position.toLowerCase().includes("software") || 
                   position.toLowerCase().includes("developer") || 
                   position.toLowerCase().includes("engineer")
    } else if (activeTab === "engineering") {
      matchesTab = position.toLowerCase().includes("mechanical") || 
                   position.toLowerCase().includes("civil") || 
                   position.toLowerCase().includes("electrical")
    } else if (activeTab === "management") {
      matchesTab = position.toLowerCase().includes("manager") || 
                   position.toLowerCase().includes("lead")
    }

    return matchesSearch && matchesDepartment && matchesBatch && matchesTab
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Loading placements...</div>
      </div>
    )
  }

  // Determine the appropriate back link and title based on user role
  const getBackLink = () => {
    if (isAdmin) return "/admin/dashboard"
    if (hasStudentAccess) return "/dashboard"
    return "/"
  }

  const getPageTitle = () => {
    if (isAdmin) return "Placement Records"
    return "Placed Students"
  }

  const getPageDescription = () => {
    if (isAdmin) return "View and manage all student placement records"
    return "Meet our successful graduates who have secured exciting opportunities at top companies"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href={getBackLink()}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to {isAdmin ? "Dashboard" : hasStudentAccess ? "Dashboard" : "Home"}
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                {isAdmin ? <Building2 className="w-6 h-6 text-white" /> : <GraduationCap className="w-6 h-6 text-white" />}
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GCT Placement Portal</h1>
                <p className="text-sm text-gray-600">{isAdmin ? "Admin Dashboard" : "Our Success Stories"}</p>
              </div>
            </div>
          </div>
          {isAdmin && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setViewMode(viewMode === "grid" ? "table" : "grid")}
              >
                {viewMode === "grid" ? "Table View" : "Grid View"}
              </Button>
              <Link href="/admin/add-placement">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Placement
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{getPageTitle()}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getPageDescription()}
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Placements ({placements.length})</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value={activeTab} className="mt-6">
            {/* Search and Filters */}
            <div className="mb-8 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search by student name, ID, company, or position..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full sm:w-[200px]">
                      <SelectValue placeholder="Department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Departments</SelectItem>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterBatch} onValueChange={setFilterBatch}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Batch" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Batches</SelectItem>
                      {batches.map((batch) => (
                        <SelectItem key={batch} value={batch}>
                          {batch}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Placements Display */}
            {filteredPlacements.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No placement records match your search criteria.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setFilterDepartment("all")
                    setFilterBatch("all")
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            ) : viewMode === "grid" || !isAdmin ? (
              /* Grid View - Used for public view and admin grid view */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {filteredPlacements.map((placement) => (
                  <Card key={placement.$id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-square relative overflow-hidden bg-gray-100">
                      <Avatar className="w-full h-full rounded-none">
                        <AvatarImage 
                          src={placement.photo ? getFilePreviewUrl(placement.photo) : "/placeholder-user.jpg"} 
                          alt={placement.studentName} 
                          className="object-cover" 
                        />
                        <AvatarFallback className="text-2xl font-bold">
                          {placement.studentName
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("") || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white font-bold text-xl">{placement.studentName}</h3>
                        <p className="text-white/90 text-sm">{placement.department}</p>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Building2 className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{placement.company}</span>
                        {placement.batch && <Badge className="ml-auto">{placement.batch}</Badge>}
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        {placement.position && (
                          <div className="flex items-center gap-2">
                            <Briefcase className="w-4 h-4" />
                            <span>{placement.position}</span>
                          </div>
                        )}
                        {placement.location && (
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" />
                            <span>{placement.location}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 font-medium text-green-600">
                          <span>{placement.package}</span>
                        </div>
                      </div>
                      {placement.testimonial && (
                        <p className="text-gray-600 text-sm mt-3 italic line-clamp-3">
                          "{placement.testimonial}"
                        </p>
                      )}
                      {isAdmin && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {placement.photo && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(placement.photo!, `${placement.studentName}-photo.jpg`)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Photo
                            </Button>
                          )}
                          {placement.offerLetter && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => downloadFile(placement.offerLetter!, `${placement.studentName}-offer-letter.pdf`)}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              Offer Letter
                            </Button>
                          )}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              /* Table View - Admin only */
              <div className="space-y-6 max-w-6xl mx-auto">
                {filteredPlacements.map((placement) => (
                  <Card key={placement.$id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Student Photo */}
                        <div className="flex-shrink-0">
                          <div className="w-24 h-24 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                            {placement.photo ? (
                              <img
                                src={getFilePreviewUrl(placement.photo)}
                                alt={`${placement.studentName} photo`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.currentTarget.src = '/placeholder-user.jpg'
                                }}
                              />
                            ) : (
                              <User className="w-12 h-12 text-gray-400" />
                            )}
                          </div>
                        </div>

                        {/* Placement Details */}
                        <div className="flex-grow">
                          <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900">{placement.studentName}</h3>
                              <div className="flex items-center gap-2 text-gray-600 mt-1">
                                <GraduationCap className="w-4 h-4" />
                                <span>{placement.studentId}</span>
                              </div>
                            </div>
                            <div className="flex gap-2 mt-2 md:mt-0">
                              {placement.department && <Badge variant="outline">{placement.department}</Badge>}
                              {placement.batch && <Badge variant="secondary">{placement.batch}</Badge>}
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-4">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Building2 className="w-4 h-4" />
                              <span>{placement.company}</span>
                            </div>
                            {placement.position && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <span className="font-medium">{placement.position}</span>
                              </div>
                            )}
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <span className="font-medium text-green-600">{placement.package}</span>
                            </div>
                            {placement.location && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <MapPin className="w-4 h-4" />
                                <span>{placement.location}</span>
                              </div>
                            )}
                            {placement.offerLetterDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Offer: {new Date(placement.offerLetterDate).toLocaleDateString()}</span>
                              </div>
                            )}
                            {placement.joiningDate && (
                              <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar className="w-4 h-4" />
                                <span>Joining: {new Date(placement.joiningDate).toLocaleDateString()}</span>
                              </div>
                            )}
                          </div>

                          {placement.testimonial && (
                            <p className="text-gray-600 mb-4 italic">"{placement.testimonial}"</p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {placement.photo && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFile(placement.photo!, `${placement.studentName}-photo.jpg`)}
                              >
                                <Eye className="w-4 h-4 mr-2" />
                                View Photo
                              </Button>
                            )}
                            {placement.offerLetter && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => downloadFile(placement.offerLetter!, `${placement.studentName}-offer-letter.pdf`)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download Offer Letter
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 