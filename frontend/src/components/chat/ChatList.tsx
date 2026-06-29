import { useEffect, useState } from "react"
import ChatItem from "./ChatItem"
import type { Chat } from "@/types/chat"
import { getConversations } from "@/services/conversation.service"
import Spinner from "../custom/Spinner"
import ChatListSkeleton from "./ChatListSkeleton"
import type { User } from "@/types/user"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import toast from "react-hot-toast"

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

type Participant = User & { lastReadAt: Date | null }

interface Message {
  id: string
  text: string | null
  attachments: string[] | null
  senderId: string
  createdAt: Date
}

export interface Conversation {
  id: string
  type: "DIRECT" | "GROUP"
  participants: Participant[]
  messages: Message
}

const ChatList = () => {
  const [conversations, setConversations] = useState<Conversation[] | null>(
    null
  )
  const [isFetching, setIsFetching] = useState<boolean>(false)

  const addConversation = () => {
    // Todo
    // 1. replace the button with the dialog
    // 2. in the dialog fetch the user's friends and list them with skeleton loading
    // 3. also add the search logic
    // 4. add the onclick logic
  }

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
    <div className="relative h-full flex-1 p-4">
      {!isFetching && (
        <Button
          className="absolute right-6 bottom-4 cursor-pointer rounded-full"
          size={"icon-lg"}
          onClick={addConversation}
        >
          <Plus size={18} />
        </Button>
      )}
      {isFetching ? (
        <ChatListSkeleton />
      ) : conversations && conversations.length > 0 ? (
        conversations.map((convo) => <ChatItem key={convo.id} convo={convo} />)
      ) : (
        "No Start conversation"
      )}
    </div>
  )
}

export default ChatList
