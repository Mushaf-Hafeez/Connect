import { useEffect, useState, type Dispatch, type SetStateAction } from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import ManageFriendsList from "./ManageFriendsList"
import { getFriends } from "@/services/friend.service"
import type { Friend } from "@/types/chat"
import UserSkeleton from "../custom/UserSkeleton"

interface ManageFriendsProps {
  isManageFriendsDialogOpen: boolean
  setIsManageFriendsDialogOpen: Dispatch<SetStateAction<boolean>>
}

const ManageFriends = ({
  isManageFriendsDialogOpen,
  setIsManageFriendsDialogOpen,
}: ManageFriendsProps) => {
  const [friends, setFriends] = useState<Friend[] | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isManageFriendsDialogOpen) {
      setSearchQuery("")
      return
    }

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
  }, [isManageFriendsDialogOpen])

  return (
    <Dialog
      open={isManageFriendsDialogOpen}
      onOpenChange={setIsManageFriendsDialogOpen}
    >
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Friends</DialogTitle>
        </DialogHeader>
        <div className="mt-4 space-y-3">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search friends"
            className="h-9"
          />

          <div className="h-80 scrollbar-none overflow-y-auto">
            {isLoading ? (
              <ul className="space-y-2">
                {Array.from({ length: 5 }).map((_, index) => (
                  <UserSkeleton key={index} />
                ))}
              </ul>
            ) : (
              <ManageFriendsList
                friends={friends}
                setFriends={setFriends}
                searchQuery={searchQuery}
              />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ManageFriends
