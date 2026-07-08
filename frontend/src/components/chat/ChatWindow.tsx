import { useParams } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import { useEffect, useRef, useState } from "react"
import { getMessages } from "@/services/conversation.service"
import { Skeleton } from "@/components/ui/skeleton"
import InfiniteScroll from "react-infinite-scroll-component"
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
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingOlder, setIsFetchingOlder] = useState(false)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  const params = useParams()
  const id = params.id

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      try {
        const response = await getMessages(id as string, 1, 20)

        if (response.status === 200) {
          addMessages(response.data.messages)
          setHasMore(response.data.hasMore)
          setPage(2)
        }
      } catch (error) {
        console.error("Error in chat window component:", error)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchMessages()
    }
  }, [addMessages, id])

  const fetchOlderMessages = async () => {
    if (!id || isFetchingOlder || !hasMore) return

    setIsFetchingOlder(true)

    try {
      const response = await getMessages(id as string, page, 20)

      if (response.status === 200) {
        const olderMessages = response.data.messages

        if (olderMessages.length > 0) {
          addMessages([...olderMessages, ...messages])
          setPage((prev) => prev + 1)
          setHasMore(response.data.hasMore)
        } else {
          setHasMore(false)
        }
      }
    } catch (error) {
      console.error("Error fetching older messages:", error)
    } finally {
      setIsFetchingOlder(false)
    }
  }

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
              <MessageScrollerViewport
                ref={viewportRef}
                className="scrollbar-none"
                id="chat-scroll-view"
              >
                <InfiniteScroll
                  dataLength={messages.length}
                  next={fetchOlderMessages}
                  hasMore={hasMore}
                  loader={
                    <div className="py-2 text-center text-xs text-muted-foreground">
                      Loading older messages...
                    </div>
                  }
                  reverse={true}
                  inverse={false}
                  style={{ display: "flex", flexDirection: "column" }}
                  scrollableTarget="chat-scroll-view"
                  scrollThreshold={0.8}
                >
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
                </InfiniteScroll>
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
