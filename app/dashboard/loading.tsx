import { LoadingScreen } from "@/components/LoadingScreen"
import { CardSkeleton, ProfileHeaderSkeleton } from "@/components/Skeletons"

export default function DashboardLoading() {
  return (
    <div className="min-h-screen px-4 py-8 container mx-auto space-y-8">
      <ProfileHeaderSkeleton />
      <CardSkeleton count={4} />
      <div className="mt-10">
        <LoadingScreen subtle message="Fetching recent jobs" fullscreen={false} />
      </div>
    </div>
  )
}
