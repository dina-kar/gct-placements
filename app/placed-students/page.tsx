"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { GraduationCap, Building2, Search, ArrowLeft, Briefcase, MapPin } from "lucide-react"
import Link from "next/link"

export default function PlacedStudentsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterDepartment, setFilterDepartment] = useState("all")
  const [filterYear, setFilterYear] = useState("all")

  const departments = [
    "Computer Science and Engineering",
    "Information Technology",
    "Electronics and Communication Engineering",
    "Electrical and Electronics Engineering",
    "Mechanical Engineering",
    "Civil Engineering",
  ]

  const years = ["2024", "2023", "2022", "2021"]

  // Sample placed students data
  const placedStudents = [
    {
      id: 1,
      name: "Priya Sharma",
      department: "Computer Science and Engineering",
      year: "2024",
      company: "Google",
      position: "Software Engineer",
      package: "₹24 LPA",
      location: "Bangalore",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Rahul Verma",
      department: "Information Technology",
      year: "2024",
      company: "Microsoft",
      position: "Frontend Developer",
      package: "₹18 LPA",
      location: "Hyderabad",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Ananya Patel",
      department: "Electronics and Communication Engineering",
      year: "2024",
      company: "Amazon",
      position: "Systems Engineer",
      package: "₹16 LPA",
      location: "Chennai",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Vikram Singh",
      department: "Computer Science and Engineering",
      year: "2024",
      company: "Adobe",
      position: "Product Engineer",
      package: "₹19 LPA",
      location: "Noida",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 5,
      name: "Neha Gupta",
      department: "Information Technology",
      year: "2024",
      company: "Infosys",
      position: "Technology Analyst",
      package: "₹10 LPA",
      location: "Pune",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 6,
      name: "Arjun Reddy",
      department: "Mechanical Engineering",
      year: "2024",
      company: "Tata Motors",
      position: "Design Engineer",
      package: "₹12 LPA",
      location: "Mumbai",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 7,
      name: "Kavya Krishnan",
      department: "Electrical and Electronics Engineering",
      year: "2023",
      company: "Siemens",
      position: "Electrical Engineer",
      package: "₹11 LPA",
      location: "Bangalore",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 8,
      name: "Rohan Mehta",
      department: "Computer Science and Engineering",
      year: "2023",
      company: "IBM",
      position: "Cloud Engineer",
      package: "₹14 LPA",
      location: "Hyderabad",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 9,
      name: "Divya Nair",
      department: "Civil Engineering",
      year: "2023",
      company: "L&T",
      position: "Project Engineer",
      package: "₹9 LPA",
      location: "Chennai",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  // Filter students based on search term and filters
  const filteredStudents = placedStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.position.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesDepartment = filterDepartment === "all" || student.department === filterDepartment
    const matchesYear = filterYear === "all" || student.year === filterYear

    return matchesSearch && matchesDepartment && matchesYear
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
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">GCT Placement Portal</h1>
                <p className="text-sm text-gray-600">Our Success Stories</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Placed Students</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our successful graduates who have secured exciting opportunities at top companies
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search by name, company, or position..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-full md:w-[250px]">
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
            <Select value={filterYear} onValueChange={setFilterYear}>
              <SelectTrigger className="w-full md:w-[150px]">
                <SelectValue placeholder="Filter by year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {years.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Students Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStudents.map((student) => (
            <Card key={student.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square relative overflow-hidden bg-gray-100">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage src={student.image || "/placeholder.svg"} alt={student.name} className="object-cover" />
                  <AvatarFallback className="text-2xl font-bold">
                    {student.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-xl">{student.name}</h3>
                  <p className="text-white/90 text-sm">{student.department}</p>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{student.company}</span>
                  <Badge className="ml-auto">{student.year}</Badge>
                </div>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4" />
                    <span>{student.position}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{student.location}</span>
                  </div>
                  <div className="flex items-center gap-2 font-medium text-green-600">
                    <span>{student.package}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Link href={`/placed-students/${student.id}`}>
                    <Button variant="outline" className="w-full bg-transparent">
                      View Success Story
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No placed students match your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  )
}
