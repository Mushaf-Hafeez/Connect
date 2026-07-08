import { useParams } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import type { Message } from "@/types/chat"
import { useEffect, useState } from "react"
import { getMessages } from "@/services/conversation.service"
import Spinner from "../custom/Spinner"
import {
  Message as MessagePrimitive,
  MessageAvatar,
  MessageContent,
} from "@/components/ui/message"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { useStore } from "zustand/react"
import MessageBubble from "./MessageBubble"
import { chatStore } from "@/zustand/chatStore"

const ChatWindow = () => {
  const { messages, addMessages } = useStore(chatStore)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await getMessages(id as string)

        if (response.status === 200) {
          addMessages(response.data.messages)
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

      <div className="min-h-0 flex-1 scrollbar-none p-4">
        {isLoading ? (
          <Spinner />
        ) : messages.length === 0 ? (
          <div className="text-sm text-muted-foreground">No messages yet</div>
        ) : (
          <MessageScrollerProvider autoScroll>
            <MessageScroller>
              <MessageScrollerViewport className="scrollbar-none">
                <MessageScrollerContent>
                  {messages.map((message) => (
                    <MessageScrollerItem
                      key={message.id}
                      messageId={message.id}
                    >
                      <MessageBubble message={message} />
                    </MessageScrollerItem>
                  ))}
                </MessageScrollerContent>
              </MessageScrollerViewport>
              <MessageScrollerButton />
            </MessageScroller>
          </MessageScrollerProvider>
        )}
      </div>

      <MessageInput />
    </div>
  )
}

export default ChatWindow
