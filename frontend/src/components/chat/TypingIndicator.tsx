import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import TypingDots from "@/components/custom/TypingDots"
import { chatStore } from "@/zustand/chatStore"
import { useStore } from "zustand"

const TypingIndicator = () => {
  const { isTyping, chatSelected } = useStore(chatStore)

  if (!isTyping || !chatSelected) return null

  const { displayName, profilePic } = chatSelected.user

  return (
    <div className="flex items-end gap-2 px-1">
      <Avatar className="size-8">
        <AvatarImage src={profilePic} />
        <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
      </Avatar>

      <div className="rounded border bg-muted p-3 flex items-center justify-center">
        <TypingDots />
      </div>
    </div>
  )
}

export default TypingIndicator
