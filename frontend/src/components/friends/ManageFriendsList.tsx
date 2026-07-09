import type { Friend } from "@/types/chat"
import type { Dispatch, SetStateAction } from "react"
import FriendItem from "./ManageFriend"

interface ManageFriendsListProps {
  friends: Friend[] | null
  setFriends: Dispatch<SetStateAction<Friend[] | null>>
  searchQuery: string
}

const ManageFriendsList = ({
  friends,
  setFriends,
  searchQuery,
}: ManageFriendsListProps) => {
  const filteredFriends =
    friends?.filter((friend: Friend) => {
      const query = searchQuery.toLowerCase()
      const displayName = friend.displayName?.toLowerCase() ?? ""
      const username = friend.username?.toLowerCase() ?? ""

      return displayName.includes(query) || username.includes(query)
    }) ?? []

  return (
    <ul className="mt-2">
      {friends === null
        ? null
        : filteredFriends.length > 0
          ? filteredFriends.map((friend: Friend) => (
              <FriendItem
                key={friend.friendshipId}
                friend={friend}
                setFriends={setFriends}
              />
            ))
          : searchQuery
            ? "No friends match your search."
            : "No friends."}
    </ul>
  )
}

export default ManageFriendsList
