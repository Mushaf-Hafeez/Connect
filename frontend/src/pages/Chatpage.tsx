import ChatSidebar from "@/components/chat/ChatSidebar"
import { Outlet } from "react-router-dom"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"
import { useEffect, useRef } from "react"
import { socketStore } from "@/zustand/socketStore"
import type { Message, MessageStatusInfo } from "@/types/chat"
import { conversationStore } from "@/zustand/conversationStore"
import toast from "react-hot-toast"

const ChatPage = () => {
  const {
    addMessage,
    isChatSelected,
    conversationId,
    chatSelected,
    setIsTyping,
    updateMessageStatus,
  } = useStore(chatStore)
  const { socket } = useStore(socketStore)
  const {
    updateLastMessage,
    updateLastMessageStatus,
    incrementUnreadCount,
    resetUnreadCount,
  } = useStore(conversationStore)

  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (conversationId) {
      resetUnreadCount(conversationId)
    }
  }, [conversationId, resetUnreadCount])

  useEffect(() => {
    if (!socket) return

    const handleNewMessage = (message: Message) => {
      if (audioRef.current) {
        audioRef.current.currentTime = 1
        audioRef.current.play()
      }

      if (conversationId !== message.conversationId) {
        toast.success(`new message from ${message.sender.displayName}`)
      }
      socket.emit("message-delivered", message.statuses[0].id)
      updateLastMessage(message)

      if (message.conversationId && message.conversationId !== conversationId) {
        incrementUnreadCount(message.conversationId)
      }

      if (message.conversationId !== conversationId) return

      if (chatSelected?.user.id === message.sender.id) {
        setIsTyping(false)
      }

      addMessage(message)
    }

    const handleUserTyping = ({
      conversationId: typingConversationId,
      senderId,
    }: {
      conversationId: string
      senderId: string
    }) => {
      if (typingConversationId !== conversationId) return
      if (chatSelected?.user.id !== senderId) return

      setIsTyping(true)
    }

    const handleUserStoppedTyping = ({
      conversationId: typingConversationId,
      senderId,
    }: {
      conversationId: string
      senderId: string
    }) => {
      if (typingConversationId !== conversationId) return
      if (chatSelected?.user.id !== senderId) return

      setIsTyping(false)
    }

    const handleMessageStatusUpdate = (data: {
      messageId: string
      status: MessageStatusInfo
    }) => {
      updateMessageStatus(data.messageId, data.status)
      updateLastMessageStatus(data.messageId, data.status.status)
    }

    socket.on("new-message", handleNewMessage)
    socket.on("user-typing", handleUserTyping)
    socket.on("user-stopped-typing", handleUserStoppedTyping)
    socket.on("message-status-updated", handleMessageStatusUpdate)

    return () => {
      socket.off("new-message", handleNewMessage)
      socket.off("user-typing", handleUserTyping)
      socket.off("user-stopped-typing", handleUserStoppedTyping)
      socket.off("message-status-updated", handleMessageStatusUpdate)
    }
  }, [
    socket,
    addMessage,
    conversationId,
    chatSelected,
    setIsTyping,
    updateLastMessage,
    updateLastMessageStatus,
    incrementUnreadCount,
    updateMessageStatus,
    resetUnreadCount,
  ])
  return (
    <div className="h-screen bg-background">
      <div className="flex h-full">
        {/* Sidebar */}
        <div
          className={`w-full shrink-0 border-r md:w-96 ${isChatSelected ? "hidden md:block" : "block"} `}
        >
          <ChatSidebar />
        </div>

        {/* Chat Area */}
        <div
          className={`flex-1 ${isChatSelected ? "block" : "hidden md:block"} `}
        >
          <Outlet />
        </div>

        <audio ref={audioRef} src="/notification.mp3"></audio>
      </div>
    </div>
  )
}

export default ChatPage
