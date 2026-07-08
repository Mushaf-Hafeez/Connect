import { useParams } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import { useEffect, useState } from "react"
import { getMessages } from "@/services/conversation.service"
import { Skeleton } from "@/components/ui/skeleton"
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
  }, [addMessages, id])

  return (
    <div className="flex h-full flex-col">
      <ChatHeader />

      <div className="min-h-0 flex-1 scrollbar-none p-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => {
              const isRightAligned = index % 2 === 1

              return (
                <div
                  key={index}
                  className={`flex items-start gap-3 ${isRightAligned ? "justify-end" : "justify-start"}`}
                >
                  {!isRightAligned && (
                    <Skeleton className="mt-1 size-8 shrink-0 rounded-full" />
                  )}

                  <div
                    className={`flex max-w-[85%] flex-col gap-2 ${isRightAligned ? "items-end" : "items-start"}`}
                  >
                    <Skeleton
                      className={`h-3 ${isRightAligned ? "w-20" : "w-24"}`}
                    />
                    <Skeleton
                      className={`h-12 rounded-2xl ${isRightAligned ? "w-48" : "w-full"}`}
                    />
                  </div>
                </div>
              )
            })}
          </div>
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
