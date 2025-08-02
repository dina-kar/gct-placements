"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Users, AlertCircle } from "lucide-react"
import { ApplicationWithUserData } from "@/lib/appwrite"

interface BulkUpdateModalProps {
  selectedApplications: string[]
  applications: ApplicationWithUserData[]
  isOpen: boolean
  onClose: () => void
  onUpdate: (applicationIds: string[], newStatus: string) => Promise<void>
}

const statusOptions = [
  { value: "applied", label: "Applied", variant: "outline" as const },
  { value: "under_review", label: "Under Review", variant: "secondary" as const },
  { value: "interview_scheduled", label: "Interview Scheduled", variant: "default" as const },
  { value: "selected", label: "Selected", variant: "default" as const },
  { value: "rejected", label: "Rejected", variant: "destructive" as const },
]

export function BulkUpdateModal({ 
  selectedApplications, 
  applications, 
  isOpen, 
  onClose, 
  onUpdate 
}: BulkUpdateModalProps) {
  const [newStatus, setNewStatus] = useState("")
  const [isUpdating, setIsUpdating] = useState(false)

  const selectedApps = applications.filter(app => selectedApplications.includes(app.$id))

  const handleUpdate = async () => {
    if (!newStatus) {
      alert("Please select a status")
      return
    }

    try {
      setIsUpdating(true)
      await onUpdate(selectedApplications, newStatus)
      onClose()
    } catch (error) {
      console.error('Error updating applications:', error)
      alert("Failed to update applications. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const statusCounts = selectedApps.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Bulk Status Update
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Selected Applications Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Selected Applications ({selectedApplications.length})
            </h3>
            <div className="text-sm text-gray-600 space-y-2">
              <p>You are about to update the status for {selectedApplications.length} applications.</p>
              
              {/* Current Status Distribution */}
              <div>
                <p className="font-medium mb-1">Current status distribution:</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(statusCounts).map(([status, count]) => (
                    <Badge key={status} variant="outline" className="text-xs">
                      {status.replace('_', ' ')}: {count}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <Separator />

          {/* Application List Preview */}
          <div>
            <h4 className="font-medium mb-3">Applications to Update:</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {selectedApps.map((app) => (
                <div key={app.$id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{app.userName}</p>
                    <p className="text-sm text-gray-600">
                      {app.userRollNumber} • {app.jobTitle} @ {app.company}
                    </p>
                  </div>
                  <Badge
                    variant={
                      app.status === "selected"
                        ? "default"
                        : app.status === "interview_scheduled"
                          ? "secondary"
                          : app.status === "rejected"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {app.status.replace('_', ' ').toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Status Selection */}
          <div>
            <h4 className="font-medium mb-3">Select New Status:</h4>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Choose new status for all selected applications" />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    <div className="flex items-center gap-2">
                      <Badge variant={option.variant} className="text-xs">
                        {option.label}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Warning</p>
                <p className="text-yellow-700">
                  This action will update the status for all {selectedApplications.length} selected applications. 
                  This action cannot be undone.
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={isUpdating}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdate} 
              disabled={!newStatus || isUpdating}
            >
              {isUpdating ? "Updating..." : `Update ${selectedApplications.length} Applications`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
