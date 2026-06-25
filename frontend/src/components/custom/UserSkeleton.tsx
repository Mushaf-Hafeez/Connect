import { Skeleton } from "@/components/ui/skeleton"

const UserSkeleton = () => {
  return (
    <li className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        {/* Avatar */}
        <Skeleton className="h-10 w-10 rounded-full" />

        {/* Display Name & Username */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>

      {/* Action Button */}
      <Skeleton className="h-10 w-10 rounded-md" />
    </li>
  )
}

export default UserSkeleton
