import { useState } from "react"

import {
  EllipsisVertical,
  MessageCircle,
  Phone,
  Search,
  UserCheck,
  UserPlus,
  Users,
  type LucideIcon,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

interface Tab {
  id: number
  label: string
  value: string
  icon: LucideIcon
}

const tabs: Tab[] = [
  {
    id: 1,
    label: "Chats",
    value: "chats",
    icon: MessageCircle,
  },
  {
    id: 2,
    label: "Groups",
    value: "groups",
    icon: Users,
  },
  {
    id: 3,
    label: "Calls",
    value: "calls",
    icon: Phone,
  },
]

const ChatSidebar = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false)
  const [isManageFriendsDialogOpen, setIsManageFriendsDialogOpen] =
    useState(false)

  return (
    <>
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Messages</h1>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <EllipsisVertical className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setIsAddDialogOpen(true)}>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add friend
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => setIsPendingDialogOpen(true)}>
                  <UserCheck className="mr-2 h-4 w-4" />
                  Pending requests
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => setIsManageFriendsDialogOpen(true)}
                >
                  <Users className="mr-2 h-4 w-4" />
                  Manage friends
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input placeholder="Search conversations..." className="pl-9" />
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="chats" className="flex min-h-0 flex-1 flex-col">
          <div className="border-b p-4">
            <TabsList className="grid w-full grid-cols-3 bg-transparent">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.id}
                  value={tab.value}
                  className="cursor-pointer"
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent
            value="chats"
            className="mt-0 min-h-0 flex-1 overflow-y-auto"
          >
            <ChatList />
          </TabsContent>

          <TabsContent
            value="groups"
            className="mt-0 min-h-0 flex-1 overflow-y-auto p-4"
          >
            groups tab
          </TabsContent>

          <TabsContent
            value="calls"
            className="mt-0 min-h-0 flex-1 overflow-y-auto p-4"
          >
            calls tab
          </TabsContent>
        </Tabs>
      </div>

      <AddFriend
        isAddDialogOpen={isAddDialogOpen}
        setIsAddDialogOpen={setIsAddDialogOpen}
      />

      <PendingRequests
        isPendingDialogOpen={isPendingDialogOpen}
        setIsPendingDialogOpen={setIsPendingDialogOpen}
      />

      <ManageFriends
        isManageFriendsDialogOpen={isManageFriendsDialogOpen}
        setIsManageFriendsDialogOpen={setIsManageFriendsDialogOpen}
      />
    </>
  )
}

export default ChatSidebar
