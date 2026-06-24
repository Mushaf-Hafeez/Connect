import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"

import { useState, type Dispatch, type SetStateAction } from "react"
import type { PendingRequest } from "@/types/chat"

import { Check, X } from "lucide-react"
import toast from "react-hot-toast"
import {
  acceptFriendRequest,
  rejectFriendRequest,
} from "@/services/friend.service"
import Spinner from "../custom/Spinner"

interface PendingRequestItemProps {
  request: PendingRequest
  setPendingRequests: Dispatch<SetStateAction<PendingRequest[] | null>>
}

const PendingRequestItem = ({
  request,
  setPendingRequests,
}: PendingRequestItemProps) => {
  const [isCancelling, setIsCancelling] = useState<boolean>(false)
  const [isAccepting, setIsAccepting] = useState<boolean>(false)

  const { displayName, username, profilePic } = request.requester

  const filterPendingRequests = () => {
    setPendingRequests((prev) =>
      prev ? prev.filter((req) => req.id !== request.id) : prev
    )
  }

  const handleReject = async () => {
    setIsCancelling(true)
    try {
      const response = await rejectFriendRequest(request.id)

      if (response.status === 200) {
        // filter the pending requests
        filterPendingRequests()
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("Error while reject the request: ", error)
      toast.error(error.response.data.message)
    } finally {
      setIsCancelling(false)
    }
  }

  const handleAccept = async () => {
    setIsAccepting(true)
    try {
      const response = await acceptFriendRequest(request.id)

      if (response.status === 200) {
        // filter the pending requests
        filterPendingRequests()
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("Error while accepting the request: ", error)
      toast.error(error.response.data.message)
    } finally {
      setIsAccepting(false)
    }
  }

  return (
    <li className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={profilePic} />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">{displayName}</h3>
          <p className="text-muted-foreground">{username}</p>
        </div>
      </div>
      <div className="space-x-2">
        <Button
          onClick={handleReject}
          variant={"secondary"}
          size={"icon-lg"}
          className="cursor-pointer"
        >
          {isCancelling ? <Spinner /> : <X size={18} />}
        </Button>
        <Button
          onClick={handleAccept}
          size={"icon-lg"}
          className="cursor-pointer"
        >
          {isAccepting ? <Spinner /> : <Check size={18} />}
        </Button>
      </div>
    </li>
  )
}

export default PendingRequestItem
