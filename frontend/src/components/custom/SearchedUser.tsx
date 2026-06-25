import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "../ui/button"
import { UserPlus } from "lucide-react"

import type { User } from "@/types/user"
import toast from "react-hot-toast"

import { sendFriendRequest } from "@/services/friend.service"
import { useState } from "react"
import Spinner from "./Spinner"

const SearchedUser = ({ user }: { user: User }) => {
  const [isSendingRequest, setIsSendingRequest] = useState<boolean>(false)

  const handleAddFriend = async () => {
    setIsSendingRequest(true)
    try {
      const response = await sendFriendRequest(user.id)

      if (response.status === 201) {
        toast.success("Request sent.")
      }
    } catch (error) {
      console.log("Error in search user: ", error)
      toast.error(error.response.data.message)
    } finally {
      setIsSendingRequest(false)
    }
  }

  return (
    <li className="flex items-center justify-between p-2">
      <div className="flex items-center gap-2">
        <Avatar>
          <AvatarImage src={user.profilePic} />
          <AvatarFallback>
            {user.username.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-sm font-semibold">{user.displayName}</h3>
          <p className="text-muted-foreground">{user.username}</p>
        </div>
      </div>
      <Button
        onClick={handleAddFriend}
        type="button"
        variant={"ghost"}
        size={"icon-lg"}
        className="cursor-pointer"
        disabled={isSendingRequest}
      >
        {isSendingRequest ? <Spinner /> : <UserPlus />}
      </Button>
    </li>
  )
}

export default SearchedUser
