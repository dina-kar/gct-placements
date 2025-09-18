import { LoadingScreen } from "@/components/LoadingScreen"
import { CardSkeleton } from "@/components/Skeletons"

export default function PlacementsLoading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-8">
      <div className="mx-auto max-w-2xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Loading Placements</h1>
        <p className="text-muted-foreground text-sm">Fetching successful student placement records...</p>
      </div>
      <CardSkeleton count={6} />
      <LoadingScreen subtle fullscreen={false} message="Almost there" />
    </div>
  )
}
