"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Briefcase,
  Search,
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  Clock,
  TrendingUp,
  Users,
  Filter,
} from "lucide-react"
import Link from "next/link"

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterLocation, setFilterLocation] = useState("all")
  const [filterMinCGPA, setFilterMinCGPA] = useState("all")

  const departments = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ]

  const locations = ["All Locations", "Bangalore", "Chennai", "Hyderabad", "Mumbai", "Pune", "Delhi NCR", "Remote"]
  const cgpaRanges = ["All", "6.0+", "7.0+", "8.0+", "9.0+"]

  // Sample job openings data
  const jobs = [
    {
      id: 1,
      title: "Software Development Engineer",
      company: "Amazon",
      logo: "/placeholder.svg?height=80&width=80",
      location: "Bangalore",
      type: "Full-time",
      departments: ["Computer Science and Engineering", "Information Technology"],
      minCGPA: 7.5,
      package: "₹16-20 LPA",
      deadline: "2024-03-15",
      postedDate: "2024-02-01",
      description:
        "Amazon is looking for talented Software Development Engineers to join our team. You will be responsible for designing, developing, and maintaining high-performance software systems.",
      requirements: [
        "B.Tech/B.E. in Computer Science or related field",
        "Strong programming skills in Java, Python, or C++",
        "Knowledge of data structures and algorithms",
        "Minimum CGPA of 7.5",
        "No active backlogs",
      ],
      applications: 45,
      status: "Open",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Microsoft",
      logo: "/placeholder.svg?height=80&width=80",
      location: "Hyderabad",
      type: "Full-time",
      departments: ["Computer Science and Engineering", "Information Technology"],
      minCGPA: 8.0,
      package: "₹18-22 LPA",
      deadline: "2024-03-20",
      postedDate: "2024-02-05",
      description:
        "Microsoft is seeking Frontend Developers to create exceptional user experiences. You will work on building responsive web applications using modern JavaScript frameworks.",
      requirements: [
        "B.Tech/B.E. in Computer Science or related field",
        "Experience with React, Angular, or Vue.js",
        "Strong HTML, CSS, and JavaScript skills",
        "Minimum CGPA of 8.0",
        "No active backlogs",
      ],
      applications: 32,
      status: "Open",
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Google",
      logo: "/placeholder.svg?height=80&width=80",
      location: "Bangalore",
      type: "Full-time",
      departments: [
        "Computer Science and Engineering",
        "Information Technology",
        "Electronics and Communication Engineering",
      ],
      minCGPA: 8.5,
      package: "₹20-24 LPA",
      deadline: "2024-03-25",
      postedDate: "2024-02-10",
      description:
        "Google is looking for Data Analysts to join our team. You will analyze large datasets and provide insights to drive business decisions.",
      requirements: [
        "B.Tech/B.E. in Computer Science, IT, or related field",
        "Strong analytical and problem-solving skills",
        "Experience with SQL, Python, and data visualization tools",
        "Minimum CGPA of 8.5",
        "No active backlogs",
      ],
      applications: 28,
      status: "Open",
    },
    {
      id: 4,
      title: "Mechanical Design Engineer",
      company: "Tata Motors",
      logo: "/placeholder.svg?height=80&width=80",
      location: "Pune",
      type: "Full-time",
      departments: ["Mechanical Engineering"],
      minCGPA: 7.0,
      package: "₹8-10 LPA",
      deadline: "2024-03-18",
      postedDate: "2024-02-03",
      description:
        "Tata Motors is seeking Mechanical Design Engineers to join our product development team. You will be involved in designing and developing automotive components and systems.",
      requirements: [
        "B.Tech/B.E. in Mechanical Engineering",
        "Knowledge of CAD software (CATIA, SolidWorks)",
        "Understanding of mechanical design principles",
        "Minimum CGPA of 7.0",
        "No active backlogs",
      ],
      applications: 15,
      status: "Open",
    },
    {
      id: 5,
      title: "Electrical Engineer",
      company: "Siemens",
      logo: "/placeholder.svg?height=80&width=80",
      location: "Chennai",
      type: "Full-time",
      departments: ["Electrical and Electronics Engineering"],
      minCGPA: 7.0,
      package: "₹7-9 LPA",
      deadline: "2024-03-22",
      postedDate: "2024-02-07",
      description:
        "Siemens is looking for Electrical Engineers to join our team. You will be responsible for designing, developing, and testing electrical systems and components.",
      requirements: [
        "B.Tech/B.E. in Electrical Engineering",
        "Knowledge of electrical design and systems",
        "Familiarity with electrical standards and codes",
        "Minimum CGPA of 7.0",
        "No active backlogs",
      ],
      applications: 20,
      status: "Open",
    },
    {
      id: 6,
      title: "Civil Engineer",
      company: "L&T",
      logo: "/placeholder.svg?height=80&width=80&T+logo=",
      location: "Mumbai",
      type: "Full-time",
      departments: ["Civil Engineering"],
      minCGPA: 6.5,
      package: "₹6-8 LPA",
      deadline: "2024-03-30",
      postedDate: "2024-02-12",
      description:
        "L&T is seeking Civil Engineers to join our construction projects. You will be involved in planning, designing, and overseeing construction projects.",
      requirements: [
        "B.Tech/B.E. in Civil Engineering",
        "Knowledge of construction methods and materials",
        "Familiarity with AutoCAD and other design software",
        "Minimum CGPA of 6.5",
        "No active backlogs",
      ],
      applications: 18,
      status: "Open",
    },
  ]

  // Filter jobs based on search term and filters
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || job.departments.includes(filterDepartment)
    const matchesLocation =
      filterLocation === "all" || filterLocation === "All Locations" || job.location === filterLocation

    const minCGPAValue = filterMinCGPA === "all" ? 0 : Number.parseFloat(filterMinCGPA.replace("+", ""))
    const matchesCGPA = filterMinCGPA === "all" || job.minCGPA >= minCGPAValue

    return matchesSearch && matchesDepartment && matchesLocation && matchesCGPA
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GCT Placement Portal</h1>
                <p className="text-sm text-gray-600">Job Openings</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Job Openings</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore exciting career opportunities from top companies recruiting at GCT
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="all" className="mb-8">
          <div className="flex justify-center">
            <TabsList>
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="tech">Tech</TabsTrigger>
              <TabsTrigger value="engineering">Engineering</TabsTrigger>
              <TabsTrigger value="management">Management</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="all" className="mt-6">
            {/* Search and Filters */}
            <div className="mb-8 max-w-5xl mx-auto">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search jobs by title, company, or keywords..."
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
                  <Select value={filterLocation} onValueChange={setFilterLocation}>
                    <SelectTrigger className="w-full sm:w-[150px]">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filterMinCGPA} onValueChange={setFilterMinCGPA}>
                    <SelectTrigger className="w-full sm:w-[100px]">
                      <SelectValue placeholder="Min CGPA" />
                    </SelectTrigger>
                    <SelectContent>
                      {cgpaRanges.map((range) => (
                        <SelectItem key={range} value={range === "All" ? "all" : range}>
                          {range}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button variant="outline" className="flex items-center gap-2 bg-transparent">
                    <Filter className="w-4 h-4" />
                    More Filters
                  </Button>
                </div>
              </div>
            </div>

            {/* Jobs List */}
            <div className="space-y-6 max-w-5xl mx-auto">
              {filteredJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Company Logo */}
                      <div className="flex-shrink-0">
                        <div className="w-16 h-16 bg-white rounded-lg border flex items-center justify-center overflow-hidden">
                          <img
                            src={job.logo || "/placeholder.svg"}
                            alt={`${job.company} logo`}
                            className="max-w-full max-h-full"
                          />
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex-grow">
                        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900">{job.title}</h3>
                            <div className="flex items-center gap-2 text-gray-600 mt-1">
                              <Building2 className="w-4 h-4" />
                              <span>{job.company}</span>
                            </div>
                          </div>
                          <Badge className="mt-2 md:mt-0">{job.status}</Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-4">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>Posted: {job.postedDate}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>Deadline: {job.deadline}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <TrendingUp className="w-4 h-4" />
                            <span>Min CGPA: {job.minCGPA}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
                            <span>{job.package}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="w-4 h-4" />
                            <span>{job.applications} applications</span>
                          </div>
                        </div>

                        <p className="text-gray-600 mb-4 line-clamp-2">{job.description}</p>

                        <div className="flex flex-wrap gap-2 mb-4">
                          {job.departments.map((dept, index) => (
                            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-50">
                              {dept.split(" ")[0]}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                          <Link href={`/jobs/${job.id}`} className="flex-1">
                            <Button variant="default" className="w-full">
                              View Details
                            </Button>
                          </Link>
                          <Link href={`/jobs/${job.id}/apply`} className="flex-1">
                            <Button variant="outline" className="w-full bg-transparent">
                              Apply Now
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {filteredJobs.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg">No job openings match your search criteria.</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="tech" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Filter applied for Tech jobs.</p>
            </div>
          </TabsContent>

          <TabsContent value="engineering" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Filter applied for Engineering jobs.</p>
            </div>
          </TabsContent>

          <TabsContent value="management" className="mt-6">
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Filter applied for Management jobs.</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
