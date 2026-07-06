import { MoreVertical, Phone, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"

const ChatHeader = () => {
  const { chatSelected } = useStore(chatStore)

  const { displayName, profilePic } = chatSelected.user

  const isOnline = true

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={profilePic} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        <div>
          <h2 className="font-medium">{displayName}</h2>

          <p
            className={`text-xs ${
              isOnline ? "text-green-500" : "text-muted-foreground"
            }`}
          >
            {isOnline ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Phone className="h-5 w-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />

        <Video className="h-5 w-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />

        <MoreVertical className="h-5 w-5 cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
      </div>
    </header>
  )
}

export default ChatHeader
