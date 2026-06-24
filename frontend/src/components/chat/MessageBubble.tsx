import type { Message } from "@/types/chat"

interface MessageBubbleProps {
  message: Message
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isMe = message.sender === "me"

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm ${
          isMe ? "bg-primary text-primary-foreground" : "border bg-background"
        }`}
      >
        {message.text}
      </div>
    </div>
  )
}
export default MessageBubble
