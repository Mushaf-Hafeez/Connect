import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { getPendingRequests } from "@/services/friend.service"
import PendingRequestsList from "./PendingRequestsList"
import type { PendingRequest } from "@/types/chat"
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
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isPendingDialogOpen) {
      setSearchQuery("")
      return
    }

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
        <div className="mt-4 space-y-3">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search requests"
            className="h-9"
          />

          <div className="h-80 scrollbar-none overflow-y-auto">
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
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default PendingRequests
