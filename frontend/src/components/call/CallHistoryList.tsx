import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Phone } from "lucide-react"
import toast from "react-hot-toast"
import { useStore } from "zustand"

import CallHistoryItem from "@/components/call/CallHistoryItem"
import ChatListSkeleton from "@/components/chat/ChatListSkeleton"
import { getCallHistory } from "@/services/call.service"
import type { CallHistoryEntry } from "@/types/call"
import { callStore } from "@/zustand/callStore"

interface CallHistoryListProps {
  isActive: boolean
  searchQuery: string
}

const CallHistoryList = ({ isActive, searchQuery }: CallHistoryListProps) => {
  const [calls, setCalls] = useState<CallHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const callStatus = useStore(callStore, (state) => state.status)
  const previousCallStatus = useRef(callStatus)

  const fetchCallHistory = useCallback(async () => {
    setIsLoading(true)

    try {
      const response = await getCallHistory()

      if (response.status === 200) {
        setCalls(response.data.calls)
      }
    } catch (error) {
      console.error("Failed to fetch call history:", error)
      toast.error("Failed to load call history")
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isActive) return
    fetchCallHistory()
  }, [isActive, fetchCallHistory])

  useEffect(() => {
    const wasInCall =
      previousCallStatus.current !== "idle" &&
      previousCallStatus.current !== "ended"
    const isNowIdle = callStatus === "idle" || callStatus === "ended"

    if (isActive && wasInCall && isNowIdle) {
      fetchCallHistory()
    }

    previousCallStatus.current = callStatus
  }, [callStatus, isActive, fetchCallHistory])

  const filteredCalls = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) return calls

    return calls.filter((call) =>
      call.peer.displayName.toLowerCase().includes(query),
    )
  }, [calls, searchQuery])

  if (isLoading) {
    return <ChatListSkeleton />
  }

  if (filteredCalls.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-2 p-8 text-center text-muted-foreground">
        <Phone className="size-10 opacity-40" />
        <p className="text-sm">
          {searchQuery.trim()
            ? "No calls match your search"
            : "No calls yet"}
        </p>
      </div>
    )
  }

  return (
    <div className="scrollbar-none">
      {filteredCalls.map((call) => (
        <CallHistoryItem key={call.id} call={call} />
      ))}
    </div>
  )
}

export default CallHistoryList
