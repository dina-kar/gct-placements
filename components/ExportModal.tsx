"use client"

import { ApplicationWithUserData, UserProfile } from '@/lib/appwrite'
import { storage, config } from '@/lib/appwrite'
import * as XLSX from 'xlsx'

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Download, FileSpreadsheet, Sheet, X, ChevronDown, ChevronRight } from "lucide-react"

interface ExportModalProps {
  applications: ApplicationWithUserData[]
  isOpen: boolean
  onClose: () => void
  jobTitle?: string
}

interface ColumnOption {
  key: string
  label: string
  category: string
}

const availableColumns: ColumnOption[] = [
  // Basic Application Info
  { key: "userId", label: "User ID", category: "Basic Info" },
  { key: "userName", label: "Student Name", category: "Basic Info" },
  { key: "userRollNumber", label: "Roll Number", category: "Basic Info" },
  { key: "userDepartment", label: "Department", category: "Basic Info" },
  { key: "userBatch", label: "Batch", category: "Basic Info" },
  { key: "jobTitle", label: "Job Title", category: "Application" },
  { key: "company", label: "Company", category: "Application" },
  { key: "status", label: "Application Status", category: "Application" },
  { key: "appliedAt", label: "Applied Date", category: "Application" },
  
  // Contact Information
  { key: "userPersonalEmail", label: "Personal Email", category: "Contact" },
  { key: "userCollegeEmail", label: "College Email", category: "Contact" },
  { key: "userPhone", label: "Phone Number", category: "Contact" },
  { key: "userParentsName", label: "Parent's Name", category: "Contact" },
  { key: "userParentsPhone", label: "Parent's Phone", category: "Contact" },
  { key: "userCurrentAddress", label: "Current Address", category: "Contact" },
  { key: "userPermanentAddress", label: "Permanent Address", category: "Contact" },
  { key: "userCity", label: "City", category: "Contact" },
  { key: "userCountry", label: "Country", category: "Contact" },
  { key: "userAadharNo", label: "Aadhar Number", category: "Contact" },
  { key: "userPancardNo", label: "PAN Card Number", category: "Contact" },
  
  // Academic Information
  { key: "userCGPA", label: "Current CGPA", category: "Academic" },
  { key: "userTenthMarks", label: "10th Marks (%)", category: "Academic" },
  { key: "userTwelthMarks", label: "12th Marks (%)", category: "Academic" },
  { key: "userDiplomaMarks", label: "Diploma Marks (%)", category: "Academic" },
  { key: "userActiveBacklog", label: "Active Backlog", category: "Academic" },
  { key: "userHistoryOfArrear", label: "History of Arrear", category: "Academic" },
  { key: "userNoOfBacklogs", label: "Number of Backlogs", category: "Academic" },
  
  // Semester-wise CGPA
  { key: "userSem1Cgpa", label: "Semester 1 CGPA", category: "Semester Performance" },
  { key: "userSem2Cgpa", label: "Semester 2 CGPA", category: "Semester Performance" },
  { key: "userSem3Cgpa", label: "Semester 3 CGPA", category: "Semester Performance" },
  { key: "userSem4Cgpa", label: "Semester 4 CGPA", category: "Semester Performance" },
  { key: "userSem5Cgpa", label: "Semester 5 CGPA", category: "Semester Performance" },
  { key: "userSem6Cgpa", label: "Semester 6 CGPA", category: "Semester Performance" },
  { key: "userSem7Cgpa", label: "Semester 7 CGPA", category: "Semester Performance" },
  { key: "userSem8Cgpa", label: "Semester 8 CGPA", category: "Semester Performance" },
  
  // Personal Details
  { key: "userGender", label: "Gender", category: "Personal" },
  { key: "userDateOfBirth", label: "Date of Birth", category: "Personal" },
  
  // Documents & Social
  { key: "userResume", label: "Resume Link", category: "Documents" },
  { key: "userGithubProfile", label: "GitHub Profile", category: "Social" },
  { key: "userLinkedInProfile", label: "LinkedIn Profile", category: "Social" },
]

const defaultSelectedColumns = [
  "userName", "userRollNumber", "userDepartment", "userBatch", "userCGPA", 
  "userActiveBacklog", "userHistoryOfArrear", "userPersonalEmail", "userPhone", 
  "jobTitle", "company", "status", "appliedAt", "userResume"
]

type ExportFormat = "csv" | "xlsx"
type ExportOrganization = "single" | "department"

export function ExportModal({ applications, isOpen, onClose, jobTitle }: ExportModalProps) {
  const [selectedColumns, setSelectedColumns] = useState<string[]>(defaultSelectedColumns)
  const [fileName, setFileName] = useState("")
  const [exportFormat, setExportFormat] = useState<ExportFormat>("csv")
  const [exportOrganization, setExportOrganization] = useState<ExportOrganization>("single")

  useEffect(() => {
    if (isOpen) {
      const defaultName = `applications_${jobTitle || "all"}_${new Date().toISOString().split('T')[0]}`
      setFileName(defaultName)
    }
  }, [isOpen, jobTitle])

  const toggleColumn = (columnKey: string) => {
    setSelectedColumns(prev => 
      prev.includes(columnKey)
        ? prev.filter(key => key !== columnKey)
        : [...prev, columnKey]
    )
  }

  const selectAllInCategory = (category: string) => {
    const categoryColumns = availableColumns.filter(col => col.category === category).map(col => col.key)
    const allSelected = categoryColumns.every(key => selectedColumns.includes(key))
    
    if (allSelected) {
      setSelectedColumns(prev => prev.filter(key => !categoryColumns.includes(key)))
    } else {
      setSelectedColumns(prev => [...new Set([...prev, ...categoryColumns])])
    }
  }

  const formatFileUrl = (fileId: string) => {
    if (!fileId || fileId === "N/A") return "N/A"
    
    try {
      // If it's already a full URL, return as is
      if (fileId.includes('storage.cloud.appwrite.io') || fileId.includes('/storage/buckets/')) {
        return fileId
      }
      
      // Handle different file ID formats
      let cleanFileId = fileId
      if (fileId.includes('/')) {
        cleanFileId = fileId.split('/').pop() || fileId
      }
      if (cleanFileId.includes('?')) {
        cleanFileId = cleanFileId.split('?')[0]
      }
      
      // Create proper Appwrite view URL
      return `${process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT}/storage/buckets/${config.storageId}/files/${cleanFileId}/view?project=${process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID}`
    } catch (error) {
      console.error('Error formatting file URL:', error)
      return fileId
    }
  }

  const formatCellValue = (key: string, value: any) => {
    if (key === "appliedAt" && value) {
      return new Date(value).toLocaleDateString()
    }
    if (key === "userDateOfBirth" && value) {
      return new Date(value).toLocaleDateString()
    }
    if (key === "userResume" && value && value !== "N/A") {
      return formatFileUrl(value)
    }
    return value || "N/A"
  }

  const exportAsCSV = (data: ApplicationWithUserData[], filename: string) => {
    const headers = selectedColumns.map(key => {
      const column = availableColumns.find(col => col.key === key)
      return column?.label || key
    })

    const csvData = [
      headers,
      ...data.map((row: ApplicationWithUserData) => 
        selectedColumns.map(key => formatCellValue(key, (row as any)[key]))
      )
    ]

    const csvString = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(",")
    ).join("\n")
    
    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `${filename}.csv`
    document.body.appendChild(a)
    a.click()
    window.URL.revokeObjectURL(url)
    document.body.removeChild(a)
  }

  const exportAsXLSX = async (data: ApplicationWithUserData[], filename: string) => {
    try {
      // Dynamic import to avoid SSR issues
      const XLSX = await import('xlsx')
      
      const headers = selectedColumns.map(key => {
        const column = availableColumns.find(col => col.key === key)
        return column?.label || key
      })

      let workbook: any
      
      if (exportOrganization === "department") {
        // Group by department
        const departmentGroups = data.reduce((acc, app) => {
          const dept = app.userDepartment || "Unknown"
          if (!acc[dept]) acc[dept] = []
          acc[dept].push(app)
          return acc
        }, {} as Record<string, ApplicationWithUserData[]>)

        workbook = XLSX.utils.book_new()
        
        Object.entries(departmentGroups).forEach(([dept, apps]) => {
          const worksheetData = [
            headers,
            ...apps.map((row: ApplicationWithUserData) => 
              selectedColumns.map(key => formatCellValue(key, (row as any)[key]))
            )
          ]
          
          const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
          // Clean department name for sheet name (Excel sheet names have restrictions)
          const sheetName = dept.replace(/[\\\/\?\*\[\]]/g, '').substring(0, 31)
          XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
        })
      } else {
        // Single sheet
        const worksheetData = [
          headers,
          ...data.map((row: ApplicationWithUserData) => 
            selectedColumns.map(key => formatCellValue(key, (row as any)[key]))
          )
        ]
        
        const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
        workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook, worksheet, "Applications")
      }

      XLSX.writeFile(workbook, `${filename}.xlsx`)
    } catch (error) {
      console.error('Error exporting XLSX:', error)
      alert('Error exporting to Excel format. Please try CSV instead.')
    }
  }

  const handleExport = async () => {
    if (selectedColumns.length === 0) {
      alert("Please select at least one column to export")
      return
    }

    if (applications.length === 0) {
      alert("No applications to export")
      return
    }

    const dataToExport = applications.map(app => {
      // Create extended application data with semester CGPAs
      return {
        ...app,
        userSem1Cgpa: (app as any).userSem1Cgpa || "N/A",
        userSem2Cgpa: (app as any).userSem2Cgpa || "N/A",
        userSem3Cgpa: (app as any).userSem3Cgpa || "N/A",
        userSem4Cgpa: (app as any).userSem4Cgpa || "N/A",
        userSem5Cgpa: (app as any).userSem5Cgpa || "N/A",
        userSem6Cgpa: (app as any).userSem6Cgpa || "N/A",
        userSem7Cgpa: (app as any).userSem7Cgpa || "N/A",
        userSem8Cgpa: (app as any).userSem8Cgpa || "N/A",
      }
    })

    if (exportFormat === "csv") {
      exportAsCSV(dataToExport, fileName)
    } else {
      await exportAsXLSX(dataToExport, fileName)
    }
    
    onClose()
  }

  const getDepartmentCount = () => {
    const departments = [...new Set(applications.map(app => app.userDepartment || "Unknown"))]
    return departments.length
  }

  const categories = [...new Set(availableColumns.map(col => col.category))]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Applications Data
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Export Settings */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fileName">File Name</Label>
              <Input
                id="fileName"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                placeholder="Enter file name"
                className="mt-1"
              />
            </div>
            
            <div>
              <Label htmlFor="exportFormat">Export Format</Label>
              <Select value={exportFormat} onValueChange={(value) => setExportFormat(value as ExportFormat)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="csv">
                    <div className="flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      CSV File
                    </div>
                  </SelectItem>
                  <SelectItem value="xlsx">
                    <div className="flex items-center gap-2">
                      <Sheet className="w-4 h-4" />
                      Excel (.xlsx)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="exportOrganization">Organization</Label>
              <Select 
                value={exportOrganization} 
                onValueChange={(value) => setExportOrganization(value as ExportOrganization)}
                disabled={exportFormat === "csv"}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="single">Single Sheet</SelectItem>
                  <SelectItem value="department">
                    By Department ({getDepartmentCount()} sheets)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Column Selection */}
          <div>
            <h3 className="text-lg font-medium mb-4">Select Columns to Export</h3>
            <p className="text-sm text-gray-600 mb-4">
              Choose which data fields you want to include in your export. Data for {applications.length} applications will be exported.
            </p>

            <div className="space-y-4">
              {categories.map(category => {
                const categoryColumns = availableColumns.filter(col => col.category === category)
                const allSelected = categoryColumns.every(col => selectedColumns.includes(col.key))
                const someSelected = categoryColumns.some(col => selectedColumns.includes(col.key))

                return (
                  <div key={category} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => selectAllInCategory(category)}
                      />
                      <Label className="font-medium">{category}</Label>
                      <span className="text-sm text-gray-500">
                        ({categoryColumns.filter(col => selectedColumns.includes(col.key)).length}/{categoryColumns.length})
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 ml-6">
                      {categoryColumns.map(column => (
                        <div key={column.key} className="flex items-center space-x-2">
                          <Checkbox
                            checked={selectedColumns.includes(column.key)}
                            onCheckedChange={() => toggleColumn(column.key)}
                          />
                          <Label className="text-sm">{column.label}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          <Separator />

          {/* Export Summary */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Export Summary</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Applications to export: <span className="font-medium">{applications.length}</span></p>
              <p>Columns selected: <span className="font-medium">{selectedColumns.length}</span></p>
              <p>File format: <span className="font-medium">{exportFormat.toUpperCase()}</span></p>
              {exportFormat === "xlsx" && (
                <p>Organization: <span className="font-medium">
                  {exportOrganization === "department" ? `${getDepartmentCount()} department sheets` : "Single sheet"}
                </span></p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleExport} disabled={selectedColumns.length === 0}>
              {exportFormat === "csv" ? (
                <FileSpreadsheet className="w-4 h-4 mr-2" />
              ) : (
                <Sheet className="w-4 h-4 mr-2" />
              )}
              Export {exportFormat.toUpperCase()}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
