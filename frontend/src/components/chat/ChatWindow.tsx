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
import TypingIndicator from "./TypingIndicator"
import { chatStore } from "@/zustand/chatStore"
import { socketStore } from "@/zustand/socketStore"
import type { MessageStatus } from "@/types/chat"
import { conversationStore } from "@/zustand/conversationStore"

const ChatWindow = () => {
  const { socket } = useStore(socketStore)

  const {
    messages,
    addMessages,
    prependMessages,
    clearMessages,
    setIsTyping,
    updateMessageStatusToSeen,
    isTyping,
  } = useStore(chatStore)
  const { updateLastMessageStatus } = useStore(conversationStore)
  const setConversationId = useStore(
    chatStore,
    (state) => state.setConversationId
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingOlder, setIsFetchingOlder] = useState(false)
  const viewportRef = useRef<HTMLDivElement | null>(null)

  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const params = useParams()
  const id = params.id

  useEffect(() => {
    if (id) {
      setConversationId(id)
      setIsTyping(false)
    }
  }, [id, setConversationId, setIsTyping])

  useEffect(() => {
    const fetchMessages = async () => {
      setIsLoading(true)
      clearMessages()
      setPage(1)
      setHasMore(true)

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
  }, [addMessages, clearMessages, id])

  // useEffect to change the message status to seen
  useEffect(() => {
    if (!socket || !id) return

    socket.emit("messages-seen", id)

    const handleMessageStatusToSeen = (data: {
      messageIds: string[]
      userId: string
      status: MessageStatus
    }) => {
      console.log(
        "messages has been read on the client side after status update in db"
      )
      updateMessageStatusToSeen(data.messageIds, data.userId, data.status)

      for (const messageId of data.messageIds) {
        updateLastMessageStatus(messageId, data.status)
      }
    }

    socket.on("update-messages-seen", handleMessageStatusToSeen)

    return () => {
      socket.off("update-messages-seen", handleMessageStatusToSeen)
    }
  }, [socket, id, updateMessageStatusToSeen, messages, updateLastMessageStatus])

  const fetchOlderMessages = async () => {
    if (!id || isFetchingOlder || !hasMore) return

    setIsFetchingOlder(true)

    try {
      const response = await getMessages(id as string, page, 20)

      if (response.status === 200) {
        const olderMessages = response.data.messages

        if (olderMessages.length > 0) {
          prependMessages(olderMessages)
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

  useEffect(() => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollTo({
        top: scrollerRef.current.scrollHeight,
        behavior: "smooth",
      })
    }
  }, [messages, isTyping])

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
                  <MessageScrollerContent ref={scrollerRef}>
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

      {!isLoading && (
        <div className="px-4 pb-1">
          <TypingIndicator />
        </div>
      )}

      <MessageInput />
    </div>
  )
}

export default ChatWindow
