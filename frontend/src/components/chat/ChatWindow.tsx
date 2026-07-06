import { useParams } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageBubble from "./MessageBubble"
import MessageInput from "./MessageInput"
import type { Message } from "@/types/chat"
import { useEffect, useState } from "react"
import { getMessages } from "@/services/conversation.service"
import Spinner from "../custom/Spinner"

const ChatWindow = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const params = useParams()
  const id = params.id

  // Todo: fetch the conversation with params.id
  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await getMessages(id as string)

        if (response.status === 200) {
          console.log("Fetched messages:", response.data.messages)
          setMessages(response.data.messages)
        }
      } catch (error) {
        console.error("Error in chat window component:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMessages()
  }, [id])

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <div className="flex-1 space-y-4 overflow-y-auto p-4">
        {isLoading ? (
          <Spinner />
        ) : messages.length === 0 ? (
          "No messages yet"
        ) : (
          messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))
        )}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatWindow
