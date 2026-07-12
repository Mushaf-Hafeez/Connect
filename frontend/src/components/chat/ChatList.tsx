import { useEffect, useState } from "react"
import ChatItem from "./ChatItem"
import type { Friend } from "@/types/chat"
import { getConversations } from "@/services/conversation.service"

import ChatListSkeleton from "./ChatListSkeleton"
import type { User } from "@/types/user"
import { Button } from "../ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import { Input } from "../ui/input"
import { getFriends } from "@/services/friend.service"
import UserSkeleton from "../custom/UserSkeleton"
import ConversationList from "./ConversationList"
import { useStore } from "zustand"
import { conversationStore } from "@/zustand/conversationStore"

export type Participant = {
  user: User
  lastReadAt: Date | null
}

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

interface ChatListProps {
  searchQuery: string
}

const ChatList = ({ searchQuery }: ChatListProps) => {
  const [search, setSearch] = useState<string>("")
  const [friends, setFriends] = useState<Friend[] | null>(null)
  const { conversations, setConversations } = useStore(conversationStore)
  const [isFetching, setIsFetching] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [conversationDialogOpen, setConversationDialogOpen] =
    useState<boolean>(false)

  useEffect(() => {
    const fetchConversations = async () => {
      setIsFetching(true)
      try {
        const response = await getConversations()

        if (response.status === 200) {
          setConversations(response.data.conversations)
        }
      } catch (error) {
        console.log("Error in the chat list component: ", error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchConversations()
  }, [])

  useEffect(() => {
    if (!conversationDialogOpen) return
    const fetchFriends = async () => {
      setIsLoading(true)
      try {
        const response = await getFriends()

        if (response.status === 200) {
          setFriends(response.data.friends)
          console.log("friends: ", response.data.friends)
        }
      } catch (error) {
        console.log("Error in the manage friends component: ", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchFriends()
  }, [conversationDialogOpen])

  const filteredConversations =
    conversations?.filter((convo) => {
      const query = searchQuery.trim().toLowerCase()
      if (!query) return true

      const participant = convo.participants[0]
      const displayName = participant?.user?.displayName?.toLowerCase() ?? ""
      const username = participant?.user?.username?.toLowerCase() ?? ""
      const lastMessage = convo.messages?.at(-1)?.text?.toLowerCase() ?? ""

      return (
        displayName.includes(query) ||
        username.includes(query) ||
        lastMessage.includes(query)
      )
    }) ?? []

  return (
    <div className="relative h-full flex-1 px-4">
      {!isFetching && (
        <Dialog
          open={conversationDialogOpen}
          onOpenChange={setConversationDialogOpen}
        >
          <DialogTrigger asChild>
            <Button
              className="absolute right-6 bottom-4 cursor-pointer rounded-full"
              size={"icon-lg"}
            >
              <Plus size={18} />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add new conversation</DialogTitle>
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="search..."
                className="mt-2"
              />
            </DialogHeader>
            {/* Frinds list */}
            <div className="mt-4 h-80 scrollbar-none overflow-y-auto">
              {isLoading ? (
                <ul className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <UserSkeleton key={index} />
                  ))}
                </ul>
              ) : (
                <ConversationList
                  friends={friends}
                  setConversationDialogOpen={setConversationDialogOpen}
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}
      {isFetching ? (
        <ChatListSkeleton />
      ) : filteredConversations.length > 0 ? (
        filteredConversations.map((convo) => (
          <ChatItem key={convo.id} convo={convo} />
        ))
      ) : searchQuery.trim() ? (
        "No conversations match your search"
      ) : (
        "No Start conversation"
      )}
    </div>
  )
}

export default ChatList
