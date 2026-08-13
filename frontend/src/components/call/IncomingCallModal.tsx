import { useEffect, useState } from "react"
import { Phone, PhoneOff, Video } from "lucide-react"
import { useStore } from "zustand"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { callStore } from "@/zustand/callStore"

const IncomingCallModal = () => {
  const { status, peer, metadata, acceptCall, rejectCall } = useStore(callStore)
  const [pulse, setPulse] = useState(true)

  const isOpen = status === "ringing-incoming" && peer !== null

  useEffect(() => {
    if (!isOpen) return

    const interval = setInterval(() => setPulse((p) => !p), 800)
    return () => clearInterval(interval)
  }, [isOpen])

  if (!peer) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && rejectCall()}>
      <DialogContent
        showCloseButton={false}
        className="border-border/60 bg-background/95 sm:max-w-md"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader className="items-center gap-2 text-center">
          <DialogTitle className="text-base">
            Incoming {metadata?.isVideo ? "video" : "audio"} call
          </DialogTitle>
          <DialogDescription>{peer.displayName} is calling you</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          <Avatar
            className={`size-24 transition-transform duration-300 ${pulse ? "scale-105" : "scale-100"}`}
          >
            <AvatarImage src={peer.profilePic ?? undefined} />
            <AvatarFallback className="text-2xl">
              {peer.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <p className="text-lg font-medium">{peer.displayName}</p>

          <div className="flex w-full items-center justify-center gap-6">
            <Button
              size="icon-lg"
              variant="destructive"
              className="size-14 rounded-full"
              onClick={rejectCall}
              aria-label="Reject call"
            >
              <PhoneOff className="size-6" />
            </Button>

            <Button
              size="icon-lg"
              className="size-14 rounded-full bg-green-600 hover:bg-green-700"
              onClick={acceptCall}
              aria-label="Accept call"
            >
              {metadata?.isVideo ? (
                <Video className="size-6" />
              ) : (
                <Phone className="size-6" />
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default IncomingCallModal
