import type { Friend } from "@/types/chat"
import type { Dispatch, SetStateAction } from "react"
import FriendItem from "./ManageFriend"

interface ManageFriendsListProps {
  friends: Friend[] | null
  setFriends: Dispatch<SetStateAction<Friend[] | null>>
}

const ManageFriendsList = ({ friends, setFriends }: ManageFriendsListProps) => {
  return (
    <ul className="mt-2">
      {friends === null
        ? null
        : friends.length > 0
          ? friends.map((friend: Friend) => (
              <FriendItem
                key={friend.friendshipId}
                friend={friend}
                setFriends={setFriends}
              />
            ))
          : "No friends."}
    </ul>
  )
}

export default ManageFriendsList
