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
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
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
  }, [pendingRequests])

  return (
    <Dialog open={isPendingDialogOpen} onOpenChange={setIsPendingDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending requests</DialogTitle>
        </DialogHeader>
        {/* pending requests list */}
        <PendingRequestsList
          pendingRequests={pendingRequests}
          setPendingRequests={setPendingRequests}
        />
      </DialogContent>
    </Dialog>
  )
}

export default PendingRequests
