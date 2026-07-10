import type { Friend } from "@/types/chat"
import { useState, type Dispatch, type SetStateAction } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Button } from "../ui/button"
import { Plus } from "lucide-react"
import Spinner from "../custom/Spinner"
import { createConversation } from "@/services/conversation.service"
import { useStore } from "zustand"
import { conversationStore } from "@/zustand/conversationStore"

interface FriendItemProps {
  friend: Friend
  setConversationDialogOpen: Dispatch<SetStateAction<boolean>>
}

const ConversationItem = ({
  friend,
  setConversationDialogOpen,
}: FriendItemProps) => {
  const { displayName, username, profilePic, id } = friend

  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { addConversation } = useStore(conversationStore)

  const handleAddConversation = async () => {
    setIsLoading(true)
    try {
      const response = await createConversation(id)

      if (response.status === 201 || response.status === 200) {
        const conversation = {
          ...response.data.conversation,
          participants: response.data.conversation.participants.filter(
            (participant: { user: { id: string } }) =>
              participant.user.id === id
          ),
          messages: response.data.conversation.messages ?? [],
        }
        addConversation(conversation)
        setConversationDialogOpen(false)
      }
    } catch (error) {
      console.log("Error in conversation item component: ", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <li className="flex w-full items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={profilePic} />
          <AvatarFallback>{username.slice(0, 2).toUpperCase()}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">{displayName}</h3>
          <p className="text-muted-foreground">{username}</p>
        </div>
      </div>
      <div className="space-x-2">
        <Button
          onClick={handleAddConversation}
          size={"icon-lg"}
          className="cursor-pointer"
          disabled={isLoading}
        >
          {isLoading ? <Spinner /> : <Plus size={18} />}
        </Button>
      </div>
    </li>
  )
}

export default ConversationItem
