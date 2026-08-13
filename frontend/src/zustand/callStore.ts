import { create } from "zustand"
import type { Socket } from "socket.io-client"
import type {
  CallEndPayload,
  CallIceCandidatePayload,
  CallMetadata,
  CallOfferPayload,
  CallPeer,
  CallRingPayload,
  CallSignalingPayload,
  CallUiStatus,
} from "@/types/call"
import { socketStore } from "@/zustand/socketStore"
import { userStore } from "@/zustand/userStore"

const RING_TIMEOUT_MS = 30_000

function getIceServers(): RTCIceServer[] {
  const servers: RTCIceServer[] = []

  const stunUrl = import.meta.env.VITE_STUN_SERVER
  if (stunUrl) {
    servers.push({ urls: stunUrl })
  }

  const turnUrl = import.meta.env.VITE_TURN_SERVER
  if (turnUrl) {
    servers.push({
      urls: turnUrl,
      username: import.meta.env.VITE_TURN_USERNAME,
      credential: import.meta.env.VITE_TURN_CREDENTIAL,
    })
  }

  return servers
}

function getSocket(): Socket | null {
  return socketStore.getState().socket
}

function getCurrentUserId(): string | null {
  return userStore.getState().user?.id ?? null
}

interface CallState {
  status: CallUiStatus
  peerConnection: RTCPeerConnection | null
  localStream: MediaStream | null
  remoteStream: MediaStream | null
  metadata: CallMetadata | null
  peer: CallPeer | null
  isMuted: boolean
  isCameraOff: boolean
  isSpeakerOn: boolean
  incomingRingTimeoutId: ReturnType<typeof setTimeout> | null

  startCall: (peer: CallPeer, isVideo: boolean) => Promise<void>
  acceptCall: () => Promise<void>
  rejectCall: () => void
  endCall: () => void
  toggleMute: () => void
  toggleCamera: () => void
  toggleSpeaker: () => void
  initSocketListeners: (socket: Socket) => void
  removeSocketListeners: (socket: Socket) => void
}

const initialState = {
  status: "idle" as CallUiStatus,
  peerConnection: null,
  localStream: null,
  remoteStream: null,
  metadata: null,
  peer: null,
  isMuted: false,
  isCameraOff: false,
  isSpeakerOn: true,
  incomingRingTimeoutId: null,
}

function stopMediaStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop())
}

function closePeerConnection(pc: RTCPeerConnection | null) {
  if (!pc) return
  pc.onicecandidate = null
  pc.ontrack = null
  pc.onconnectionstatechange = null
  pc.close()
}

export const callStore = create<CallState>((set, get) => {
  const clearIncomingRingTimeout = () => {
    const { incomingRingTimeoutId } = get()
    if (incomingRingTimeoutId) {
      clearTimeout(incomingRingTimeoutId)
      set({ incomingRingTimeoutId: null })
    }
  }

  const cleanup = () => {
    clearIncomingRingTimeout()

    const { peerConnection, localStream } = get()
    stopMediaStream(localStream)
    closePeerConnection(peerConnection)

    set({
      ...initialState,
      status: "idle",
    })
  }

  const createPeerConnection = (
    callerId: string,
    receiverId: string,
  ): RTCPeerConnection => {
    const pc = new RTCPeerConnection({ iceServers: getIceServers() })

    pc.onicecandidate = (event) => {
      if (!event.candidate) return

      getSocket()?.emit("call:ice-candidate", {
        callerId,
        receiverId,
        candidate: event.candidate.toJSON(),
      } satisfies CallIceCandidatePayload)
    }

    pc.ontrack = (event) => {
      const [stream] = event.streams
      if (stream) {
        set({ remoteStream: stream, status: "connected" })
      }
    }

    pc.onconnectionstatechange = () => {
      if (pc.connectionState === "connected") {
        const { metadata } = get()
        if (metadata && !metadata.callStartTime) {
          set({
            status: "connected",
            metadata: { ...metadata, callStartTime: Date.now() },
          })
        }
      }
    }

    return pc
  }

  const attachLocalTracks = (pc: RTCPeerConnection, stream: MediaStream) => {
    stream.getTracks().forEach((track) => pc.addTrack(track, stream))
  }

  const getUserMedia = async (isVideo: boolean): Promise<MediaStream> => {
    return navigator.mediaDevices.getUserMedia({
      audio: true,
      video: isVideo,
    })
  }

  const handleRemoteEnd = () => {
    cleanup()
  }

  const handleCallRing = ({
    callerId,
    caller,
    receiverId,
    isVideo,
  }: CallRingPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId || currentUserId !== receiverId) return

    const { status } = get()
    if (status !== "idle" && status !== "ended") {
      getSocket()?.emit("call:reject", {
        callerId,
        receiverId: currentUserId,
      })
      return
    }

    clearIncomingRingTimeout()

    const timeoutId = setTimeout(() => {
      get().rejectCall()
    }, RING_TIMEOUT_MS)

    set({
      status: "ringing-incoming",
      peer: caller,
      metadata: {
        callerId,
        receiverId,
        callStartTime: null,
        isVideo,
      },
      incomingRingTimeoutId: timeoutId,
    })
  }

  const handleCallAccept = async ({
    callerId,
    receiverId,
  }: CallSignalingPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId || currentUserId !== callerId) return

    const { metadata, localStream, peerConnection } = get()
    if (!metadata || !localStream || !peerConnection) return

    set({ status: "connecting" })

    const offer = await peerConnection.createOffer()
    await peerConnection.setLocalDescription(offer)

    getSocket()?.emit("call:offer", {
      callerId,
      receiverId,
      sdp: offer,
    } satisfies CallOfferPayload)
  }

  const handleCallReject = ({ callerId }: CallSignalingPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId || currentUserId !== callerId) return
    cleanup()
  }

  const handleCallBusy = () => {
    cleanup()
  }

  const handleCallTimeout = ({ callerId }: CallSignalingPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId || currentUserId !== callerId) return
    cleanup()
  }

  const handleCallOffer = async ({
    callerId,
    receiverId,
    sdp,
  }: CallOfferPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId || currentUserId !== receiverId) return

    const { peerConnection } = get()
    if (!peerConnection) return

    set({ status: "connecting" })

    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
    const answer = await peerConnection.createAnswer()
    await peerConnection.setLocalDescription(answer)

    getSocket()?.emit("call:answer", {
      callerId,
      receiverId,
      sdp: answer,
    } satisfies CallOfferPayload)
  }

  const handleCallAnswer = async ({
    callerId,
    sdp,
  }: CallOfferPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId || currentUserId !== callerId) return

    const { peerConnection } = get()
    if (!peerConnection) return

    await peerConnection.setRemoteDescription(new RTCSessionDescription(sdp))
    set({ status: "connecting" })
  }

  const handleIceCandidate = async ({
    callerId,
    receiverId,
    candidate,
  }: CallIceCandidatePayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) return
    if (currentUserId !== callerId && currentUserId !== receiverId) return

    const { peerConnection } = get()
    if (!peerConnection) return

    try {
      await peerConnection.addIceCandidate(new RTCIceCandidate(candidate))
    } catch {
      // ICE candidates can arrive after negotiation; ignore stale ones.
    }
  }

  const handleCallEnd = ({ callerId, receiverId }: CallEndPayload) => {
    const currentUserId = getCurrentUserId()
    if (!currentUserId) return
    if (currentUserId !== callerId && currentUserId !== receiverId) return
    handleRemoteEnd()
  }

  return {
    ...initialState,

    startCall: async (peer, isVideo) => {
      const currentUserId = getCurrentUserId()
      const socket = getSocket()
      if (!currentUserId || !socket) return

      const { status } = get()
      if (status !== "idle" && status !== "ended") return

      try {
        const localStream = await getUserMedia(isVideo)
        const metadata: CallMetadata = {
          callerId: currentUserId,
          receiverId: peer.id,
          callStartTime: null,
          isVideo,
        }

        const peerConnection = createPeerConnection(currentUserId, peer.id)
        attachLocalTracks(peerConnection, localStream)

        set({
          status: "ringing-outgoing",
          peer,
          metadata,
          localStream,
          peerConnection,
          isCameraOff: !isVideo,
        })

        socket.emit("call:ring", {
          receiverId: peer.id,
          caller: {
            id: currentUserId,
            displayName: userStore.getState().user!.displayName,
            profilePic: userStore.getState().user!.profilePic,
          },
          isVideo,
        })
      } catch (error) {
        console.error("Failed to start call:", error)
        cleanup()
      }
    },

    acceptCall: async () => {
      const currentUserId = getCurrentUserId()
      const socket = getSocket()
      const { metadata, status } = get()

      if (!currentUserId || !socket || !metadata || status !== "ringing-incoming") {
        return
      }

      clearIncomingRingTimeout()

      try {
        const localStream = await getUserMedia(metadata.isVideo)
        const peerConnection = createPeerConnection(
          metadata.callerId,
          metadata.receiverId,
        )
        attachLocalTracks(peerConnection, localStream)

        set({
          status: "connecting",
          localStream,
          peerConnection,
          isCameraOff: !metadata.isVideo,
        })

        socket.emit("call:accept", {
          callerId: metadata.callerId,
          receiverId: metadata.receiverId,
        })
      } catch (error) {
        console.error("Failed to accept call:", error)
        get().rejectCall()
      }
    },

    rejectCall: () => {
      const { metadata, status } = get()
      const socket = getSocket()

      if (!metadata || status !== "ringing-incoming") return

      clearIncomingRingTimeout()

      socket?.emit("call:reject", {
        callerId: metadata.callerId,
        receiverId: metadata.receiverId,
      })

      cleanup()
    },

    endCall: () => {
      const { metadata, status } = get()
      const socket = getSocket()

      if (!metadata) {
        cleanup()
        return
      }

      const duration =
        metadata.callStartTime != null
          ? Math.floor((Date.now() - metadata.callStartTime) / 1000)
          : 0

      if (
        status === "ringing-outgoing" ||
        status === "connecting" ||
        status === "connected" ||
        status === "ringing-incoming"
      ) {
        socket?.emit("call:end", {
          callerId: metadata.callerId,
          receiverId: metadata.receiverId,
          duration,
        })
      }

      cleanup()
    },

    toggleMute: () => {
      const { localStream, isMuted } = get()
      localStream?.getAudioTracks().forEach((track) => {
        track.enabled = isMuted
      })
      set({ isMuted: !isMuted })
    },

    toggleCamera: () => {
      const { localStream, isCameraOff, metadata } = get()
      if (!metadata?.isVideo) return

      localStream?.getVideoTracks().forEach((track) => {
        track.enabled = isCameraOff
      })
      set({ isCameraOff: !isCameraOff })
    },

    toggleSpeaker: () => {
      set((state) => ({ isSpeakerOn: !state.isSpeakerOn }))
    },

    initSocketListeners: (socket: Socket) => {
      socket.on("call:ring", handleCallRing)
      socket.on("call:accept", handleCallAccept)
      socket.on("call:reject", handleCallReject)
      socket.on("call:busy", handleCallBusy)
      socket.on("call:timeout", handleCallTimeout)
      socket.on("call:offer", handleCallOffer)
      socket.on("call:answer", handleCallAnswer)
      socket.on("call:ice-candidate", handleIceCandidate)
      socket.on("call:end", handleCallEnd)
    },

    removeSocketListeners: (socket: Socket) => {
      socket.off("call:ring", handleCallRing)
      socket.off("call:accept", handleCallAccept)
      socket.off("call:reject", handleCallReject)
      socket.off("call:busy", handleCallBusy)
      socket.off("call:timeout", handleCallTimeout)
      socket.off("call:offer", handleCallOffer)
      socket.off("call:answer", handleCallAnswer)
      socket.off("call:ice-candidate", handleIceCandidate)
      socket.off("call:end", handleCallEnd)
    },
  }
})

export function useCallStore() {
  return callStore
}
