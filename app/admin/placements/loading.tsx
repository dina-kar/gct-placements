import { LoadingScreen } from "@/components/LoadingScreen"
import { CardSkeleton } from "@/components/Skeletons"

export default function AdminPlacementsLoading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Loading Placement Records</h1>
        <p className="text-muted-foreground text-sm">Preparing data grid...</p>
      </div>
      <CardSkeleton count={6} />
      <LoadingScreen subtle fullscreen={false} message="Optimizing view" />
    </div>
  )
}
