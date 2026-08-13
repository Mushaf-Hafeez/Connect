import { useEffect, useRef, useState } from "react"
import {
  Mic,
  MicOff,
  PhoneOff,
  Video,
  VideoOff,
  Volume2,
  VolumeX,
} from "lucide-react"
import { useStore } from "zustand"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { callStore } from "@/zustand/callStore"

function formatDuration(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`
}

const ActiveCallScreen = () => {
  const {
    status,
    peer,
    metadata,
    localStream,
    remoteStream,
    isMuted,
    isCameraOff,
    isSpeakerOn,
    toggleMute,
    toggleCamera,
    toggleSpeaker,
    endCall,
  } = useStore(callStore)

  const localVideoRef = useRef<HTMLVideoElement>(null)
  const remoteVideoRef = useRef<HTMLVideoElement>(null)
  const remoteAudioRef = useRef<HTMLAudioElement>(null)
  const pipRef = useRef<HTMLDivElement>(null)

  const [elapsed, setElapsed] = useState(0)
  const [pipPos, setPipPos] = useState({ x: 16, y: 16 })
  const dragState = useRef<{ dragging: boolean; offsetX: number; offsetY: number }>({
    dragging: false,
    offsetX: 0,
    offsetY: 0,
  })

  const isVisible =
    status === "ringing-outgoing" ||
    status === "connecting" ||
    status === "connected"

  useEffect(() => {
    if (localVideoRef.current && localStream) {
      localVideoRef.current.srcObject = localStream
    }
  }, [localStream])

  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream
    }
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream
    }
  }, [remoteStream])

  useEffect(() => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.muted = !isSpeakerOn
    }
  }, [isSpeakerOn, remoteStream])

  useEffect(() => {
    if (status !== "connected" || !metadata?.callStartTime) {
      setElapsed(0)
      return
    }

    const tick = () => {
      setElapsed(Math.floor((Date.now() - metadata.callStartTime!) / 1000))
    }

    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [status, metadata?.callStartTime])

  const onPipPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!pipRef.current) return
    dragState.current.dragging = true
    dragState.current.offsetX = e.clientX - pipPos.x
    dragState.current.offsetY = e.clientY - pipPos.y
    pipRef.current.setPointerCapture(e.pointerId)
  }

  const onPipPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragState.current.dragging) return

    const maxX = window.innerWidth - 160
    const maxY = window.innerHeight - 120

    setPipPos({
      x: Math.min(Math.max(0, e.clientX - dragState.current.offsetX), maxX),
      y: Math.min(Math.max(0, e.clientY - dragState.current.offsetY), maxY),
    })
  }

  const onPipPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    dragState.current.dragging = false
    pipRef.current?.releasePointerCapture(e.pointerId)
  }

  if (!isVisible || !peer) return null

  const statusLabel =
    status === "ringing-outgoing"
      ? "Calling..."
      : status === "connecting"
        ? "Connecting..."
        : formatDuration(elapsed)

  const remoteHasVideo =
    remoteStream?.getVideoTracks().some((track) => track.enabled) ?? false
  const showRemoteVideo = metadata?.isVideo && remoteStream && remoteHasVideo

  return (
    <div className="fixed inset-0 z-[100] flex flex-col bg-black text-white">
      <div className="relative flex-1 overflow-hidden">
        {showRemoteVideo ? (
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-b from-zinc-900 to-black">
            <Avatar className="size-32">
              <AvatarImage src={peer.profilePic ?? undefined} />
              <AvatarFallback className="text-4xl">
                {peer.displayName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
        )}

        <audio ref={remoteAudioRef} autoPlay playsInline />

        {metadata?.isVideo && localStream && (
          <div
            ref={pipRef}
            className="absolute z-10 h-28 w-40 cursor-grab overflow-hidden rounded-xl border border-white/20 shadow-lg active:cursor-grabbing"
            style={{ left: pipPos.x, top: pipPos.y }}
            onPointerDown={onPipPointerDown}
            onPointerMove={onPipPointerMove}
            onPointerUp={onPipPointerUp}
          >
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className={cn(
                "size-full object-cover",
                isCameraOff && "hidden",
              )}
            />
            {isCameraOff && (
              <div className="flex size-full items-center justify-center bg-zinc-800">
                <VideoOff className="size-6 text-muted-foreground" />
              </div>
            )}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 top-0 bg-gradient-to-b from-black/70 to-transparent px-6 py-5">
        <p className="text-center text-lg font-medium">{peer.displayName}</p>
        <p className="text-center text-sm text-white/70">{statusLabel}</p>
      </div>

      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-6 pb-8 pt-16">
        <div className="mx-auto flex max-w-md items-center justify-center gap-4">
          <Button
            size="icon-lg"
            variant="secondary"
            className={cn(
              "size-12 rounded-full bg-white/15 text-white hover:bg-white/25",
              isMuted && "bg-destructive/80 hover:bg-destructive",
            )}
            onClick={toggleMute}
            aria-label={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? <MicOff /> : <Mic />}
          </Button>

          {metadata?.isVideo && (
            <Button
              size="icon-lg"
              variant="secondary"
              className={cn(
                "size-12 rounded-full bg-white/15 text-white hover:bg-white/25",
                isCameraOff && "bg-destructive/80 hover:bg-destructive",
              )}
              onClick={toggleCamera}
              aria-label={isCameraOff ? "Turn camera on" : "Turn camera off"}
            >
              {isCameraOff ? <VideoOff /> : <Video />}
            </Button>
          )}

          <Button
            size="icon-lg"
            variant="destructive"
            className="size-14 rounded-full"
            onClick={endCall}
            aria-label="End call"
          >
            <PhoneOff className="size-6" />
          </Button>

          <Button
            size="icon-lg"
            variant="secondary"
            className={cn(
              "size-12 rounded-full bg-white/15 text-white hover:bg-white/25",
              !isSpeakerOn && "bg-destructive/80 hover:bg-destructive",
            )}
            onClick={toggleSpeaker}
            aria-label={isSpeakerOn ? "Turn speaker off" : "Turn speaker on"}
          >
            {isSpeakerOn ? <Volume2 /> : <VolumeX />}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ActiveCallScreen
