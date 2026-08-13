import { ArrowLeft, MoreVertical, Phone, Trash2, Video } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useStore } from "zustand"
import { chatStore } from "@/zustand/chatStore"
import { socketStore } from "@/zustand/socketStore"
import { Button } from "../ui/button"
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useNavigate } from "react-router-dom"

import dayjs from "dayjs"
import relativeTime from "dayjs/plugin/relativeTime"
import calender from "dayjs/plugin/calendar"
import toast from "react-hot-toast"
import { useState } from "react"
import { callStore } from "@/zustand/callStore"

dayjs.extend(relativeTime)
dayjs.extend(calender)

const ChatHeader = () => {
  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false)

  const { chatSelected, clearChatSelected, isTyping } = useStore(chatStore)
  const { onlineUsers } = useStore(socketStore)
  const { startCall, status: callStatus } = useStore(callStore)

  const navigate = useNavigate()

  const { displayName, profilePic, id, lastSeen } = chatSelected.user

  const lastSeenDate = dayjs(lastSeen)
  const lastSeenTime = lastSeenDate.fromNow()

  const isOnline = onlineUsers.includes(id)

  const handleGoBack = () => {
    clearChatSelected()
    navigate("/chat")
  }

  const handleAudioCall = () => {
    if (callStatus !== "idle" && callStatus !== "ended") {
      toast.error("You are already in a call")
      return
    }
    startCall({ id, displayName, profilePic }, false)
  }

  const handleVideoCall = () => {
    if (callStatus !== "idle" && callStatus !== "ended") {
      toast.error("You are already in a call")
      return
    }
    startCall({ id, displayName, profilePic }, true)
  }

  const handleDelete = () => {
    toast.success("Deleting conversation.")
  }

  return (
    <header className="flex h-16 items-center justify-between border-b px-4">
      <div className="flex items-center gap-1">
        <Button
          onClick={handleGoBack}
          size={"icon"}
          variant={"link"}
          className="cursor-pointer text-muted-foreground transition-all duration-100 hover:text-white"
        >
          <ArrowLeft />
        </Button>

        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={profilePic} />
            <AvatarFallback>
              {displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <h2 className="font-medium">{displayName}</h2>

            <p
              className={`text-xs ${
                isTyping
                  ? "text-primary"
                  : isOnline
                    ? "text-primary"
                    : "text-muted-foreground"
              }`}
            >
              {isTyping ? "typing..." : isOnline ? "Online" : lastSeenTime}
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button
          variant={"ghost"}
          className="cursor-pointer"
          onClick={handleAudioCall}
        >
          <Phone className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
        </Button>

        <Button
          variant={"ghost"}
          className="cursor-pointer"
          onClick={handleVideoCall}
        >
          <Video className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground" />
        </Button>

        <AlertDialog>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                size={18}
                className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent sideOffset={10} align="end">
              <AlertDialogTrigger className="w-full">
                <DropdownMenuItem
                  onSelect={() => setIsAlertOpen(true)}
                  variant="destructive"
                  className="w-full cursor-pointer transition-all duration-100 hover:bg-red-400/10"
                >
                  <Trash2 size={18} />
                  Delete chat
                </DropdownMenuItem>
              </AlertDialogTrigger>
            </DropdownMenuContent>
          </DropdownMenu>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete all
                the messages from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="cursor-pointer">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant={"destructive"}
                className="cursor-pointer"
                onClick={handleDelete}
              >
                Delect
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  )
}

export default ChatHeader
