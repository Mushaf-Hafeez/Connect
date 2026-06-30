import type { Friend } from "@/types/chat"
import { type Dispatch, type SetStateAction } from "react"
import ConversationItem from "./ConversationItem"

interface ConversationListProps {
  friends: Friend[] | null
  setConversationDialogOpen: Dispatch<SetStateAction<boolean>>
}

const ConversationList = ({
  friends,
  setConversationDialogOpen,
}: ConversationListProps) => {
  return (
    <ul className="mt-2">
      {friends === null
        ? null
        : friends.length > 0
          ? friends.map((friend: Friend) => (
              <ConversationItem
                key={friend.friendshipId}
                friend={friend}
                setConversationDialogOpen={setConversationDialogOpen}
              />
            ))
          : "No friends."}
    </ul>
  )
}

export default ConversationList
