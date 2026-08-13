export type CallUiStatus =
  | "idle"
  | "ringing-outgoing"
  | "ringing-incoming"
  | "connecting"
  | "connected"
  | "ended"

export interface CallPeer {
  id: string
  displayName: string
  profilePic: string | null
}

export interface CallMetadata {
  callerId: string
  receiverId: string
  callStartTime: number | null
  isVideo: boolean
}

export interface CallRingPayload {
  callerId: string
  caller: CallPeer
  receiverId: string
  isVideo: boolean
}

export interface CallSignalingPayload {
  callerId: string
  receiverId: string
}

export interface CallOfferPayload extends CallSignalingPayload {
  sdp: RTCSessionDescriptionInit
}

export interface CallAnswerPayload extends CallSignalingPayload {
  sdp: RTCSessionDescriptionInit
}

export interface CallIceCandidatePayload extends CallSignalingPayload {
  candidate: RTCIceCandidateInit
}

export interface CallEndPayload extends CallSignalingPayload {
  duration?: number
}

export type CallRecordStatus = "MISSED" | "RECEIVED"
export type CallDirection = "incoming" | "outgoing"

export interface CallHistoryEntry {
  id: string
  status: CallRecordStatus
  duration: number
  createdAt: string
  direction: CallDirection
  peer: CallPeer
}
