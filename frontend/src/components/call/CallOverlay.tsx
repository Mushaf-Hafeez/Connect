import IncomingCallModal from "@/components/call/IncomingCallModal"
import ActiveCallScreen from "@/components/call/ActiveCallScreen"

const CallOverlay = () => {
  return (
    <>
      <IncomingCallModal />
      <ActiveCallScreen />
    </>
  )
}

export default CallOverlay
