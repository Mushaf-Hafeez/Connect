import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { getPendingRequests } from "@/services/friend.service"
import PendingRequestsList from "./PendingRequestsList"
import type { PendingRequest } from "@/types/chat"
import Spinner from "../custom/Spinner"
import UserSkeleton from "../custom/UserSkeleton"

interface PendingRequestsProps {
  isPendingDialogOpen: boolean
  setIsPendingDialogOpen: Dispatch<SetStateAction<boolean>>
}

const PendingRequests = ({
  isPendingDialogOpen,
  setIsPendingDialogOpen,
}: PendingRequestsProps) => {
  const [pendingRequests, setPendingRequests] = useState<
    PendingRequest[] | null
  >(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  useEffect(() => {
    if (!isPendingDialogOpen) return
    const fetchPendingRequests = async () => {
      setIsLoading(true)

      try {
        const response = await getPendingRequests()

        if (response.status === 200) {
          setPendingRequests(response.data.friends)
          console.log(response.data.friends)
        }
      } catch (error) {
        console.log("Error in the pending requests component: ", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchPendingRequests()
  }, [isPendingDialogOpen])

  return (
    <Dialog open={isPendingDialogOpen} onOpenChange={setIsPendingDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Pending requests</DialogTitle>
        </DialogHeader>
        {/* pending requests list */}
        <div className="mt-4 h-80 scrollbar-none overflow-y-auto">
          {isLoading ? (
            <ul>
              {Array.from({ length: 5 }).map((_, index) => (
                <UserSkeleton key={index} />
              ))}
            </ul>
          ) : (
            <PendingRequestsList
              pendingRequests={pendingRequests}
              setPendingRequests={setPendingRequests}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PendingRequests
