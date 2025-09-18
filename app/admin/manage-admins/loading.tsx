import { LoadingScreen } from "@/components/LoadingScreen"
import { ListSkeleton } from "@/components/Skeletons"

export default function ManageAdminsLoading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Loading Admins</h1>
        <p className="text-sm text-muted-foreground">Fetching administrator directory...</p>
      </div>
      <ListSkeleton rows={8} />
    </div>
  )
}
