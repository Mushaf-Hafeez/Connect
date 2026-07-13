import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageIcon, Video, FileText } from "lucide-react"

import type { Conversation } from "./ChatList"
import { useNavigate } from "react-router-dom"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"
import { socketStore } from "@/zustand/socketStore"
import { getFileType } from "@/utils/util"

const ChatItem = ({ convo }: { convo: Conversation }) => {
  const { setIsChatSelected, setChatSelected, conversationId } =
    useStore(chatStore)
  const { onlineUsers } = useStore(socketStore)

  const participant = convo.participants[0]
  const user = participant.user
  const lastMessage = convo.messages[0]

  const lastAttachment =
    lastMessage?.attachments?.[lastMessage.attachments.length - 1]

  const extension = lastAttachment?.split(".").pop()
  const type = extension ? getFileType(extension) : null

  const navigate = useNavigate()

  const openChat = () => {
    setIsChatSelected(true)
    setChatSelected(participant, convo.id)
    navigate(`/chat/${convo.id}`)
  }

  const renderLastMessage = () => {
    if (!lastMessage) {
      return "No messages yet"
    }

    if (!lastAttachment) {
      return lastMessage.text
    }

    switch (type) {
      case "image":
        return (
          <span className="flex items-center gap-1">
            <ImageIcon className="size-4" />
            Image
          </span>
        )

      case "video":
        return (
          <span className="flex items-center gap-1">
            <Video className="size-4" />
            Video
          </span>
        )

      case "file":
        return (
          <span className="flex items-center gap-1">
            <FileText className="size-4" />
            PDF
          </span>
        )

      default:
        return (
          <span className="flex items-center gap-1">
            <FileText className="size-4" />
            File
          </span>
        )
    }
  }

  return (
    <div
      onClick={openChat}
      className={`mb-1 flex cursor-pointer items-center gap-3 rounded-lg border-b p-4 transition-colors hover:bg-muted ${
        conversationId === convo.id && "bg-muted"
      }`}
    >
      <Avatar className="relative">
        {onlineUsers.includes(user.id) && (
          <span className="absolute top-0 left-0 size-2 rounded-full bg-primary" />
        )}
        <AvatarImage src={user.profilePic ?? undefined} />
        <AvatarFallback>
          {user.displayName.charAt(0).toUpperCase()}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate font-medium">{user.displayName}</h3>

          <span className="shrink-0 text-xs text-muted-foreground">
            {participant.lastReadAt
              ? new Date(participant.lastReadAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </span>
        </div>

        <div className="truncate text-sm text-muted-foreground">
          {renderLastMessage()}
        </div>
      </div>
    </div>
  )
}

export default ChatItem
