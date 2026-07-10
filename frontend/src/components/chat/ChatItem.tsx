import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import type { Conversation } from "./ChatList"
import { useNavigate } from "react-router-dom"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"
import { socketStore } from "@/zustand/socketStore"

const ChatItem = ({ convo }: { convo: Conversation }) => {
  const { setIsChatSelected, setChatSelected } = useStore(chatStore)
  const { onlineUsers } = useStore(socketStore)

  console.log("online users: ", onlineUsers)

  const participant = convo.participants[0]
  const user = participant.user
  const lastMessage = convo.messages.at(-1)

  const navigate = useNavigate()

  const openChat = () => {
    setIsChatSelected(true)
    setChatSelected(participant, convo.id)
    navigate(`/chat/${convo.id}`)
  }

  return (
    <div
      onClick={openChat}
      className="flex cursor-pointer items-center gap-3 rounded-lg border-b p-4 transition-colors hover:bg-muted"
    >
      <Avatar className="relative">
        {onlineUsers.includes(user.id) && (
          <span className="absolute top-0 left-0 size-2 rounded-full bg-primary"></span>
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

        <p className="truncate text-sm text-muted-foreground">
          {lastMessage?.text ?? "No messages yet"}
        </p>
      </div>
    </div>
  )
}

export default ChatItem
