import type { PendingRequest } from "@/types/chat"
import PendingRequestItem from "./PendingRequest"
import type { Dispatch, SetStateAction } from "react"

interface PendingRequestsListProps {
  pendingRequests: PendingRequest[] | null
  setPendingRequests: Dispatch<SetStateAction<PendingRequest[] | null>>
  searchQuery: string
}

const PendingRequestsList = ({
  pendingRequests,
  setPendingRequests,
  searchQuery,
}: PendingRequestsListProps) => {
  const filteredPendingRequests =
    pendingRequests?.filter((pendingRequest: PendingRequest) => {
      const query = searchQuery.toLowerCase()
      const displayName =
        pendingRequest.requester.displayName?.toLowerCase() ?? ""
      const username = pendingRequest.requester.username?.toLowerCase() ?? ""

      return displayName.includes(query) || username.includes(query)
    }) ?? []

  return (
    <ul className="mt-2">
      {pendingRequests === null
        ? null
        : filteredPendingRequests.length > 0
          ? filteredPendingRequests.map((pendingRequest: PendingRequest) => (
              <PendingRequestItem
                key={pendingRequest.id}
                request={pendingRequest}
                setPendingRequests={setPendingRequests}
              />
            ))
          : searchQuery
            ? "No pending requests match your search."
            : "No pending requests."}
    </ul>
  )
}

export default PendingRequestsList
