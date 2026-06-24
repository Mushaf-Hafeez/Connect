import type { Dispatch, SetStateAction } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface PendingRequestsProps {
  isPendingDialogOpen: boolean
  setIsPendingDialogOpen: Dispatch<SetStateAction<boolean>>
}

const PendingRequests = ({
  isPendingDialogOpen,
  setIsPendingDialogOpen,
}: PendingRequestsProps) => {
  return (
    <Dialog open={isPendingDialogOpen} onOpenChange={setIsPendingDialogOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pending requests</DialogTitle>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default PendingRequests
