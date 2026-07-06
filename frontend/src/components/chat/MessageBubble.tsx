import type { Message } from "@/types/chat"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand/react"

interface MessageBubbleProps {
  message: Message
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const { user } = useStore(userStore)

  const isMe = message.sender.id === user.id

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          isMe ? "bg-primary text-primary-foreground" : "border bg-background"
        }`}
      >
        {message.text}
        {message.attachments.length > 0 && (
          <div className="mt-2">
            {message.attachments.map((attachment, index) => (
              <img
                key={index}
                src={attachment}
                alt={`Attachment ${index}`}
                className="max-h-48 max-w-full rounded-lg border"
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default MessageBubble
