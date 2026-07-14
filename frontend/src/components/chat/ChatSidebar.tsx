import { useState } from "react"

import {
  EllipsisVertical,
  LogOut,
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import ChatList from "./ChatList"
import PendingRequests from "../friends/PendingRequests"
import AddFriend from "../friends/AddFriend"
import ManageFriends from "../friends/ManageFriends"
import { logout } from "@/services/auth.service"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"
import toast from "react-hot-toast"
import Spinner from "../custom/Spinner"

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
  // {
  //   id: 2,
  //   label: "Groups",
  //   value: "groups",
  //   icon: Users,
  // },
  {
    id: 3,
    label: "Calls",
    value: "calls",
    icon: Phone,
  },
]

const ChatSidebar = () => {
  const { clearUser } = useStore(userStore)

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isPendingDialogOpen, setIsPendingDialogOpen] = useState(false)
  const [isManageFriendsDialogOpen, setIsManageFriendsDialogOpen] =
    useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  const [defaultTab, setDefaultTab] = useState("chats")

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const handleLogout = async () => {
    setIsLoading(true)

    try {
      const response = await logout()

      if (response.status === 200) {
        clearUser()
      }
    } catch (error) {
      console.log("error while logging out in homepage: ", error)
      toast.error(error.response.data.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className="flex h-full w-full flex-col lg:border-r">
        {/* Header */}
        <div className="border-b p-4">
          <div className="mb-4 flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Messages</h1>

            <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="cursor-pointer"
                  >
                    <EllipsisVertical className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-100 hover:bg-muted"
                    onClick={() => setIsAddDialogOpen(true)}
                  >
                    <UserPlus className="mr-2 h-4 w-4" />
                    Add friend
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-100 hover:bg-muted"
                    onClick={() => setIsPendingDialogOpen(true)}
                  >
                    <UserCheck className="mr-2 h-4 w-4" />
                    Pending requests
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="cursor-pointer transition-all duration-100 hover:bg-muted"
                    onClick={() => setIsManageFriendsDialogOpen(true)}
                  >
                    <Users className="mr-2 h-4 w-4" />
                    Manage friends
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <AlertDialogTrigger className="w-full">
                    <DropdownMenuItem
                      variant="destructive"
                      className="w-full cursor-pointer transition-all duration-100 hover:bg-red-400/10"
                      onSelect={() => setIsAlertOpen(true)}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuContent>
              </DropdownMenu>
              {/* ========================================================== */}
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Logout</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to logout?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="cursor-pointer">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    variant={"destructive"}
                    className="flex cursor-pointer items-center gap-2"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    {isLoading && <Spinner />}
                    Logout
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search conversations..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          defaultValue={defaultTab}
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="border-b p-4">
            <TabsList
              variant="line"
              className="grid w-full grid-cols-2 justify-evenly bg-transparent"
            >
              {tabs.map((tab) => (
                <TabsTrigger
                  onClick={() => setDefaultTab(tab.value)}
                  key={tab.id}
                  value={tab.value}
                  className={`cursor-pointer ${defaultTab === tab.value && "text-white! transition-all duration-100"}`}
                >
                  <tab.icon className="mr-2 h-4 w-4" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent
            value="chats"
            className="mt-0 min-h-0 flex-1 scrollbar-none overflow-y-auto"
          >
            <ChatList searchQuery={searchQuery} />
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
      </div>
    </>
  )
}

export default ChatSidebar
