import { Skeleton } from "@/components/ui/skeleton"

const ChatListSkeleton = () => {
  return (
    <div>
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 border-b p-4">
          {/* Avatar */}
          <Skeleton className="size-8 rounded-full" />

          {/* Chat Info */}
          <div className="min-w-0 flex-1">
            <div className="mb-2 flex items-center justify-between">
              <Skeleton className="h-3 w-24" />
            </div>

            <Skeleton className="h-2 w-3/4" />
          </div>

          {/* Unread Badge */}
          <div className="flex flex-col items-center gap-1">
            <Skeleton className="h-3 w-6" />
            <Skeleton className="size-4 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatListSkeleton
