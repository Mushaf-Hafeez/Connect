import { useState } from "react"

import {
  EllipsisVertical,
  MessageCircle,
  Phone,
  Search,
  UserCheck,
  UserPlus,
  Users,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import ChatList from "./ChatList"
import PendingRequests from "../friends/PendingRequests"
import AddFriend from "../friends/AddFriend"
import ManageFriends from "../friends/ManageFriends"

const ChatSidebar = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState<boolean>(false)
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState<boolean>(false)
  const [isManageFriendsDialogOpen, setIsManageFriendsDialogOpen] =
    useState<boolean>(false)

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messages</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"} className="cursor-pointer">
                <EllipsisVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setIsAddDialogOpen(true)}
              >
                <UserPlus size={18} />
                Add friend
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setIsPendingDialogOpen(true)}
              >
                <UserCheck size={18} />
                Pending requests
              </DropdownMenuItem>
              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-2"
                onClick={() => setIsManageFriendsDialogOpen(true)}
              >
                <Users size={18} />
                Manage friends
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Add friend dialog */}
          <AddFriend
            isAddDialogOpen={isAddDialogOpen}
            setIsAddDialogOpen={setIsAddDialogOpen}
          />

          {/* Pending requests dialog */}
          <PendingRequests
            isPendingDialogOpen={isPendingDialogOpen}
            setIsPendingDialogOpen={setIsPendingDialogOpen}
          />

          {/* Pending requests dialog */}
          <ManageFriends
            isManageFriendsDialogOpen={isManageFriendsDialogOpen}
            setIsManageFriendsDialogOpen={setIsManageFriendsDialogOpen}
          />
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b p-4">
        <Tabs defaultValue="chats">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chats">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chats
            </TabsTrigger>

            <TabsTrigger value="groups">
              <Users className="mr-2 h-4 w-4" />
              Groups
            </TabsTrigger>

            <TabsTrigger value="calls">
              <Phone className="mr-2 h-4 w-4" />
              Calls
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat List */}
      <ChatList />
    </div>
  )
}

export default ChatSidebar
