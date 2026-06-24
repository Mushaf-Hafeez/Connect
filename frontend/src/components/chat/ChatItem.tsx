import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

import type { Chat } from "@/types/chat"

interface ChatItemProps {
  chat: Chat
}

const ChatItem = ({ chat }: ChatItemProps) => {
  return (
    <div className="flex cursor-pointer items-center gap-3 border-b p-4 hover:bg-muted">
      <Avatar>
        <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex justify-between">
          <h3 className="truncate font-medium">{chat.name}</h3>

          <span className="text-xs text-muted-foreground">{chat.time}</span>
        </div>

        <p className="truncate text-sm text-muted-foreground">
          {chat.lastMessage}
        </p>
      </div>

      {chat.unread > 0 && <Badge className="rounded-full">{chat.unread}</Badge>}
    </div>
  )
}

export default ChatItem
