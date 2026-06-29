import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

import type { Conversation } from "./ChatList"

const ChatItem = ({ convo }: { convo: Conversation }) => {
  const participant = convo.participants[0]
  const user = participant.user

  const lastMessage = convo.messages.at(-1)

  return (
    <div className="flex cursor-pointer items-center gap-3 border-b p-4 transition-colors hover:bg-muted">
      <Avatar>
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
