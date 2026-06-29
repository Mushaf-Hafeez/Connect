import { useEffect, useState } from "react"
import ChatItem from "./ChatItem"
import type { Chat } from "@/types/chat"
import { getConversations } from "@/services/conversation.service"
import Spinner from "../custom/Spinner"
import ChatListSkeleton from "./ChatListSkeleton"

const chats: Chat[] = [
  {
    id: "1",
    name: "Sarah Jenkins",
    lastMessage: "The quarterly report looks solid...",
    time: "10:42 AM",
    unread: 2,
  },
  {
    id: "2",
    name: "Michael Chen",
    lastMessage: "Thanks for sending those files.",
    time: "Yesterday",
    unread: 0,
  },
]

const ChatList = () => {
  const [conversations, setConversations] = useState()
  const [isFetching, setIsFetching] = useState<boolean>(false)

  useEffect(() => {
    const fetchConversations = async () => {
      setIsFetching(true)
      try {
        const response = await getConversations()

        if (response.status === 200) {
          setConversations(response.data.conversations)
          console.log(response.data.conversations)
        }
      } catch (error) {
        console.log("Error in the chat list component: ", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchConversations()
  }, [])

  return (
    <div className="flex-1 p-4">
      {isFetching ? (
        <ChatListSkeleton />
      ) : (
        chats.map((chat) => <ChatItem key={chat.id} chat={chat} />)
      )}
    </div>
  )
}

export default ChatList
