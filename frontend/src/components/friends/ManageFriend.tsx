import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import type { Friend } from "@/types/chat"
import { useState, type Dispatch, type SetStateAction } from "react"
import { X } from "lucide-react"
import toast from "react-hot-toast"
import Spinner from "../custom/Spinner"
import { removeFriend } from "@/services/friend.service"

interface FriendItemProps {
  friend: Friend
  setFriends: Dispatch<SetStateAction<Friend[] | null>>
}

const FriendItem = ({ friend, setFriends }: FriendItemProps) => {
  const { displayName, username, profilePic, friendshipId } = friend

  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const handleRemoveFriend = async () => {
    setIsDeleting(true)
    try {
      const response = await removeFriend(friendshipId)

      if (response.status === 200) {
        setFriends((prev) =>
          prev ? prev.filter((f) => f.friendshipId !== friendshipId) : prev
        )

        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("Error while deleting the friend: ", error)
      toast.error(error.response.data.message)
    } finally {
      setIsDeleting(false)
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
          onClick={handleRemoveFriend}
          variant={"destructive"}
          size={"icon-lg"}
          className="cursor-pointer"
          disabled={isDeleting}
        >
          {isDeleting ? <Spinner /> : <X size={18} />}
        </Button>
      </div>
    </li>
  )
}

export default FriendItem
