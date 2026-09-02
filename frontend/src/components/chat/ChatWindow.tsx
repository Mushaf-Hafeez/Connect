import { useParams, useNavigate } from "react-router-dom"
import ChatHeader from "./ChatHeader"
import MessageInput from "./MessageInput"
import { useEffect, useLayoutEffect, useRef, useState } from "react"
import { getConversation, getMessages } from "@/services/conversation.service"
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
  const { updateLastMessageStatus, resetUnreadCount } =
    useStore(conversationStore)
  const setConversationId = useStore(
    chatStore,
    (state) => state.setConversationId
  )
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [isHydratingChat, setIsHydratingChat] = useState<boolean>(false)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [isFetchingOlder, setIsFetchingOlder] = useState(false)
  const viewportRef = useRef<HTMLDivElement | null>(null)
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  const shouldRestoreScrollRef = useRef(false)
  const prevScrollHeightRef = useRef(0)

  const params = useParams()
  const id = params.id
  const navigate = useNavigate()

  useEffect(() => {
    if (!id) return

    let cancelled = false

    const hydrateChat = async () => {
      const { chatSelected, conversationId, setChatSelected, setIsChatSelected } =
        chatStore.getState()

      if (conversationId === id && chatSelected) {
        setIsChatSelected(true)
        return
      }

      const cachedConversation = conversationStore
        .getState()
        .conversations?.find((convo) => convo.id === id)

      if (cachedConversation?.participants[0]) {
        setChatSelected(cachedConversation.participants[0], id)
        setIsChatSelected(true)
        return
      }

      setIsHydratingChat(true)

      try {
        const response = await getConversation(id)

        if (cancelled) return

        if (response.status === 200) {
          const participant = response.data.conversation.participants[0]
          chatStore.getState().setChatSelected(participant, id)
          chatStore.getState().setIsChatSelected(true)
        }
      } catch (error) {
        if (cancelled) return
        console.error("Error hydrating chat:", error)
        navigate("/chat")
      } finally {
        if (!cancelled) {
          setIsHydratingChat(false)
        }
      }
    }

    hydrateChat()

    return () => {
      cancelled = true
    }
  }, [id, navigate])

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

  useEffect(() => {
    if (!socket || !id) return

    socket.emit("messages-seen", id)

    const handleMessageStatusToSeen = (data: {
      messageIds: string[]
      userId: string
      status: MessageStatus
    }) => {
      updateMessageStatusToSeen(data.messageIds, data.userId, data.status)

      if (id) {
        resetUnreadCount(id)
      }

      for (const messageId of data.messageIds) {
        updateLastMessageStatus(messageId, data.status)
      }
    }

    socket.on("update-messages-seen", handleMessageStatusToSeen)

    return () => {
      socket.off("update-messages-seen", handleMessageStatusToSeen)
    }
  }, [
    socket,
    id,
    updateMessageStatusToSeen,
    messages,
    updateLastMessageStatus,
    resetUnreadCount,
  ])

  const fetchOlderMessages = async () => {
    if (!id || isFetchingOlder || !hasMore) return

    const viewport = viewportRef.current
    setIsFetchingOlder(true)

    try {
      const response = await getMessages(id as string, page, 20)

      if (response.status === 200) {
        const olderMessages = response.data.messages

        if (olderMessages.length > 0) {
          if (viewport) {
            prevScrollHeightRef.current = viewport.scrollHeight
            shouldRestoreScrollRef.current = true
          }
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
    const viewport = viewportRef.current
    if (!viewport || isLoading) return

    const handleScroll = () => {
      if (viewport.scrollTop < 80) {
        fetchOlderMessages()
      }
    }

    viewport.addEventListener("scroll", handleScroll)
    return () => viewport.removeEventListener("scroll", handleScroll)
  }, [id, page, hasMore, isFetchingOlder, isLoading])

  useLayoutEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    if (shouldRestoreScrollRef.current) {
      viewport.scrollTop = viewport.scrollHeight - prevScrollHeightRef.current
      shouldRestoreScrollRef.current = false
      return
    }

    viewport.scrollTo({
      top: viewport.scrollHeight,
      behavior: "smooth",
    })
  }, [messages, isTyping])

  return (
    <div className="flex h-full flex-col">
      <ChatHeader isLoading={isHydratingChat} />

      <div className="min-h-0 flex-1 scrollbar-none p-4">
        {isLoading || isHydratingChat ? (
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
                <MessageScrollerContent ref={scrollerRef}>
                  {isFetchingOlder && (
                    <div className="py-2 text-center text-xs text-muted-foreground">
                      Loading older messages...
                    </div>
                  )}

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

      {!isLoading && !isHydratingChat && (
        <div className="px-4 pb-1">
          <TypingIndicator />
        </div>
      )}

      <MessageInput />
    </div>
  )
}

export default ChatWindow
