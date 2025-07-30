"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Building2, ArrowLeft, Plus, UserPlus, CheckCircle, AlertCircle, Edit, Trash2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"
import { DatabaseService } from "@/lib/database"
import { UserRole, type AdminRole } from "@/lib/appwrite"
import { PlacementCoordinatorRoute } from "@/components/ProtectedRoute"

function ManageAdminsPageContent() {
  const router = useRouter()
  const { user } = useAuth()
  const [adminRoles, setAdminRoles] = useState<AdminRole[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [showAddForm, setShowAddForm] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    role: UserRole.PLACEMENT_REP,
    name: "",
    department: "",
  })

  useEffect(() => {
    fetchAdminRoles()
  }, [])

  const fetchAdminRoles = async () => {
    setIsLoading(true)
    try {
      const roles = await DatabaseService.getAllAdminRoles()
      setAdminRoles(roles)
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to fetch admin roles" })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage({ type: "", text: "" })

    try {
      // Validate form
      if (!formData.email || !formData.name || !formData.role) {
        throw new Error("Please fill in all required fields")
      }

      const adminData = {
        email: formData.email,
        role: formData.role,
        name: formData.name,
        department: formData.department || undefined,
        isActive: true,
      }

      await DatabaseService.createAdminRole(adminData)

      setMessage({
        type: "success",
        text: "Admin role created successfully!",
      })

      // Reset form
      setFormData({
        email: "",
        role: UserRole.PLACEMENT_REP,
        name: "",
        department: "",
      })
      setShowAddForm(false)
      
      // Refresh list
      fetchAdminRoles()
    } catch (error: any) {
      setMessage({
        type: "error",
        text: error.message || "Failed to create admin role. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeactivate = async (adminId: string) => {
    try {
      await DatabaseService.updateAdminRole(adminId, { isActive: false })
      setMessage({ type: "success", text: "Admin role deactivated successfully" })
      fetchAdminRoles()
    } catch (error: any) {
      setMessage({ type: "error", text: error.message || "Failed to deactivate admin role" })
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case UserRole.PLACEMENT_COORDINATOR:
        return "bg-purple-100 text-purple-800"
      case UserRole.PLACEMENT_OFFICER:
        return "bg-blue-100 text-blue-800"
      case UserRole.PLACEMENT_REP:
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

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
                <p className="text-sm text-gray-600">Admin Management</p>
              </div>
            </div>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Admin
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Page Title */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Manage Admin Roles</h1>
            <p className="text-gray-600">Create and manage admin roles for placement management</p>
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

          {/* Add Admin Form */}
          {showAddForm && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5" />
                  Add New Admin Role
                </CardTitle>
                <CardDescription>
                  Create a new admin role for placement management
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@gct.ac.in"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Enter full name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="role">Admin Role *</Label>
                      <Select
                        value={formData.role}
                        onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select admin role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={UserRole.PLACEMENT_REP}>Placement Representative</SelectItem>
                          <SelectItem value={UserRole.PLACEMENT_OFFICER}>Placement Officer</SelectItem>
                          <SelectItem value={UserRole.PLACEMENT_COORDINATOR}>Placement Coordinator</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="department">Department (Optional)</Label>
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

                  <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSaving}>
                      {isSaving ? "Creating..." : "Create Admin Role"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {/* Admin Roles List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Admin Roles</CardTitle>
              <CardDescription>
                Manage existing admin roles and their permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">Loading admin roles...</p>
                </div>
              ) : adminRoles.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500">No admin roles found. Create the first one!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {adminRoles.map((admin) => (
                    <div key={admin.$id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{admin.name}</h3>
                            <Badge className={getRoleBadgeColor(admin.role)}>
                              {admin.role.replace('_', ' ').toUpperCase()}
                            </Badge>
                            {!admin.isActive && (
                              <Badge variant="secondary">Inactive</Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Email: {admin.email}</p>
                            {admin.department && <p>Department: {admin.department}</p>}
                            <p>Created: {new Date(admin.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          {admin.isActive && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeactivate(admin.$id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Deactivate
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function ManageAdminsPage() {
  return (
    <PlacementCoordinatorRoute>
      <ManageAdminsPageContent />
    </PlacementCoordinatorRoute>
  )
} 