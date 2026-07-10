import { ArrowLeft, MoreVertical, Phone, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"
import { socketStore } from "@/zustand/socketStore"
import { Button } from "../ui/button"
import { useNavigate } from "react-router-dom"

const ChatHeader = () => {
  const { chatSelected, clearChatSelected } = useStore(chatStore)
  const { onlineUsers } = useStore(socketStore)

  const navigate = useNavigate()

  const { displayName, profilePic, id } = chatSelected.user

  const isOnline = onlineUsers.includes(id)

  const handleGoBack = () => {
    clearChatSelected()
    navigate("/chat")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-1">
        <Button
          onClick={handleGoBack}
          size={"icon"}
          variant={"link"}
          className="cursor-pointer text-muted-foreground transition-all duration-100 hover:text-white"
        >
          <ArrowLeft />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profilePic} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
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
