import { useState } from "react"

import { Plus, SendHorizontal, Smile } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface MessageInputProps {
  onSend?: (message: string) => void
}

const MessageInput = ({ onSend }: MessageInputProps) => {
  const [message, setMessage] = useState("")

  const handleSend = () => {
    const trimmedMessage = message.trim()

    if (!trimmedMessage) return

    onSend?.(trimmedMessage)

    setMessage("")
  }

  return (
    <div className="border-t p-4">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Plus className="h-5 w-5" />
        </Button>

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSend()
            }
          }}
        />

        <Button variant="ghost" size="icon">
          <Smile className="h-5 w-5" />
        </Button>

        <Button size="icon" onClick={handleSend}>
          <SendHorizontal className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

export default MessageInput
