import {
  Phone,
  PhoneIncoming,
  PhoneMissed,
  PhoneOutgoing,
} from "lucide-react"
import { useStore } from "zustand"
import toast from "react-hot-toast"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { formatWhatsAppTime } from "@/utils/util"
import type { CallHistoryEntry } from "@/types/call"
import { callStore } from "@/zustand/callStore"

function formatDuration(seconds: number) {
  if (seconds <= 0) return "0s"

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60

  if (minutes === 0) return `${remainingSeconds}s`
  if (remainingSeconds === 0) return `${minutes}m`
  return `${minutes}m ${remainingSeconds}s`
}

function getCallLabel(call: CallHistoryEntry) {
  if (call.status === "RECEIVED") {
    return formatDuration(call.duration)
  }

  return call.direction === "incoming" ? "Missed call" : "No answer"
}

const CallHistoryItem = ({ call }: { call: CallHistoryEntry }) => {
  const { startCall, status: callStatus } = useStore(callStore)

  const isMissed = call.status === "MISSED"
  const formattedTime = formatWhatsAppTime(new Date(call.createdAt))

  const DirectionIcon =
    call.direction === "incoming"
      ? isMissed
        ? PhoneMissed
        : PhoneIncoming
      : PhoneOutgoing

  const handleCallBack = () => {
    if (callStatus !== "idle" && callStatus !== "ended") {
      toast.error("You are already in a call")
      return
    }

    startCall(call.peer, false)
  }

  return (
    <div className="flex items-center gap-3 border-b px-4 py-3">
      <Avatar>
        <AvatarImage src={call.peer.profilePic ?? undefined} />
        <AvatarFallback>
          {call.peer.displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <p className="truncate font-medium">{call.peer.displayName}</p>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formattedTime}
          </span>
        </div>

        <div className="mt-0.5 flex items-center gap-1.5">
          <DirectionIcon
            className={`size-3.5 shrink-0 ${isMissed ? "text-destructive" : "text-muted-foreground"}`}
          />
          <p
            className={`truncate text-xs ${isMissed ? "text-destructive" : "text-muted-foreground"}`}
          >
            {getCallLabel(call)}
          </p>
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon-sm"
        className="shrink-0 cursor-pointer text-muted-foreground hover:text-foreground"
        onClick={handleCallBack}
        aria-label={`Call ${call.peer.displayName}`}
      >
        <Phone className="size-4" />
      </Button>
    </div>
  )
}

export default CallHistoryItem
