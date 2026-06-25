import type { PendingRequest } from "@/types/chat"
import PendingRequestItem from "./PendingRequest"
import type { Dispatch, SetStateAction } from "react"

interface PendingRequestsListProps {
  pendingRequests: PendingRequest[] | null
  setPendingRequests: Dispatch<SetStateAction<PendingRequest[] | null>>
}

const PendingRequestsList = ({
  pendingRequests,
  setPendingRequests,
}: PendingRequestsListProps) => {
  return (
    <ul className="mt-2">
      {pendingRequests === null
        ? null
        : pendingRequests.length > 0
          ? pendingRequests.map((pendingRequest: PendingRequest) => (
              <PendingRequestItem
                key={pendingRequest.id}
                request={pendingRequest}
                setPendingRequests={setPendingRequests}
              />
            ))
          : "No pending requests."}
    </ul>
  )
}

export default PendingRequestsList
