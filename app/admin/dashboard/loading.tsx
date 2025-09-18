import { LoadingScreen } from "@/components/LoadingScreen"
import { CardSkeleton } from "@/components/Skeletons"

export default function AdminDashboardLoading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-8">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Loading Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm">Fetching stats and recent activity...</p>
      </div>
      <CardSkeleton count={4} />
      <LoadingScreen subtle fullscreen={false} message="Aggregating data" />
    </div>
  )
}
