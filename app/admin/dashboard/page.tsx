"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Users,
  Briefcase,
  TrendingUp,
  Calendar,
  Building2,
  Search,
  Download,
  Plus,
  Eye,
  Edit,
  LogOut,
  Settings,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [admin, setAdmin] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const router = useRouter()

  useEffect(() => {
    const adminData = localStorage.getItem("admin")
    if (!adminData) {
      router.push("/admin/login")
      return
    }
    setAdmin(JSON.parse(adminData))
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("admin")
    router.push("/")
  }

  const students = [
    {
      id: 1,
      name: "John Doe",
      rollNumber: "21CS001",
      department: "Computer Science and Engineering",
      year: "4th Year",
      cgpa: 8.2,
      email: "john.doe@gct.ac.in",
      phone: "+91 9876543210",
      applications: 5,
      status: "Active",
    },
    {
      id: 2,
      name: "Jane Smith",
      rollNumber: "21IT002",
      department: "Information Technology",
      year: "4th Year",
      cgpa: 8.7,
      email: "jane.smith@gct.ac.in",
      phone: "+91 9876543211",
      applications: 8,
      status: "Active",
    },
    {
      id: 3,
      name: "Mike Johnson",
      rollNumber: "21EC003",
      department: "Electronics and Communication Engineering",
      year: "4th Year",
      cgpa: 7.9,
      email: "mike.johnson@gct.ac.in",
      phone: "+91 9876543212",
      applications: 3,
      status: "Active",
    },
  ]

  const jobs = [
    {
      id: 1,
      title: "Software Engineer",
      company: "TCS",
      location: "Chennai",
      salary: "₹6-8 LPA",
      minCGPA: 7.0,
      deadline: "2024-02-15",
      applications: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Frontend Developer",
      company: "Infosys",
      location: "Bangalore",
      salary: "₹5-7 LPA",
      minCGPA: 6.5,
      deadline: "2024-02-20",
      applications: 32,
      status: "Active",
    },
    {
      id: 3,
      title: "Data Analyst",
      company: "Wipro",
      location: "Coimbatore",
      salary: "₹4-6 LPA",
      minCGPA: 7.5,
      deadline: "2024-02-25",
      applications: 28,
      status: "Draft",
    },
  ]

  const departments = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ]

  const filteredStudents = students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment
    return matchesSearch && matchesDepartment
  })

  const exportStudentData = () => {
    // Mock export functionality
    const csvData = filteredStudents.map((student) => ({
      Name: student.name,
      RollNumber: student.rollNumber,
      Department: student.department,
      CGPA: student.cgpa,
      Email: student.email,
      Phone: student.phone,
      Applications: student.applications,
    }))

    console.log("Exporting data:", csvData)
    alert("Student data exported successfully!")
  }

  if (!admin) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">GCT Placement Portal</h1>
              <p className="text-sm text-gray-600">Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {admin.name || "Admin"}!</h1>
          <p className="text-gray-600">Manage student placements and job postings</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">5 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Applications</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">856</div>
              <p className="text-xs text-muted-foreground">+23% from last week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Placement Rate</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">87%</div>
              <p className="text-xs text-muted-foreground">+5% from last year</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Student Management */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5" />
                      Student Management
                    </CardTitle>
                    <CardDescription>View and manage student profiles and data</CardDescription>
                  </div>
                  <Button onClick={exportStudentData}>
                    <Download className="w-4 h-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {/* Search and Filter */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Search students..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Select value={filterDepartment} onValueChange={setFilterDepartment}>
                    <SelectTrigger className="w-full sm:w-[250px]">
                      <SelectValue placeholder="Filter by department" />
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
                </div>

                {/* Student List */}
                <div className="space-y-4">
                  {filteredStudents.map((student) => (
                    <div key={student.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-lg">{student.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                            <span>{student.rollNumber}</span>
                            <span>{student.department}</span>
                            <Badge variant="outline">CGPA: {student.cgpa}</Badge>
                          </div>
                        </div>
                        <Badge variant={student.status === "Active" ? "default" : "secondary"}>{student.status}</Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                        <span>{student.email}</span>
                        <span>{student.phone}</span>
                        <span>{student.applications} applications</span>
                      </div>

                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="text-center pt-4">
                  <Button variant="outline">View All Students</Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Management */}
          <div>
            <Card className="mb-6">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5" />
                    Job Postings
                  </CardTitle>
                  <Button size="sm">
                    <Plus className="w-4 h-4 mr-1" />
                    New Job
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium">{job.title}</h4>
                      <Badge variant={job.status === "Active" ? "default" : "secondary"}>{job.status}</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      {job.company} • {job.location}
                    </p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{job.applications} applications</span>
                      <span>Due: {job.deadline}</span>
                    </div>
                    <div className="flex gap-1 mt-3">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Eye className="w-3 h-3 mr-1" />
                        View
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent">
                        <Edit className="w-3 h-3 mr-1" />
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}

                <div className="text-center pt-4">
                  <Button variant="outline" size="sm">
                    View All Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Plus className="w-4 h-4 mr-2" />
                  Create Job Posting
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Download className="w-4 h-4 mr-2" />
                  Export Reports
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Users className="w-4 h-4 mr-2" />
                  Manage Students
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Analytics
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
