import { LoadingScreen } from "@/components/LoadingScreen"
import { ProfileHeaderSkeleton, CardSkeleton } from "@/components/Skeletons"

export default function ProfileLoading() {
  return (
    <div className="min-h-screen container mx-auto px-4 py-10 space-y-10">
      <ProfileHeaderSkeleton />
      <CardSkeleton count={2} />
      <LoadingScreen subtle fullscreen={false} message="Loading profile data" />
    </div>
  )
}
