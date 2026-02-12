import { LoadingScreen } from "@/components/LoadingScreen"
import { CardSkeleton } from "@/components/Skeletons"

export default function JobsLoading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-8">
      <div className="mx-auto max-w-xl text-center space-y-4">
        <h1 className="text-3xl font-bold">Loading Jobs</h1>
        <p className="text-muted-foreground text-sm">Retrieving the latest openings and your application status...</p>
      </div>
      <CardSkeleton count={5} />
      <LoadingScreen subtle fullscreen={false} message="Building list" />
    </div>
  )
}
