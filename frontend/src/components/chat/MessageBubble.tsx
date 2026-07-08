import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import type { Message as MessageType } from "@/types/chat"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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

import { EllipsisVertical, Trash2 } from "lucide-react"
import { getFileType } from "@/utils/util"
import AttachedVideo from "../attachment/AttachedVideo"
import AttachedImage from "../attachment/AttachedImage"
import AttachedFile from "../attachment/AttachedFile"
import { useState } from "react"
import Spinner from "../custom/Spinner"
import { chatStore } from "@/zustand/chatStore"
import { deleteMessage } from "@/services/conversation.service"
import { useParams } from "react-router-dom"
import toast from "react-hot-toast"
import type { ZodStringFormat } from "zod"

const MessageBubble = ({ message }: { message: MessageType }) => {
  const { user } = useStore(userStore)
  const { conversationId, removeMessage } = useStore(chatStore)

  const { displayName, profilePic } = message.sender
  const text = message.text
  const attachments = message.attachments

  const isMe = message.sender.id === user.id

  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const handleMessageDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await deleteMessage(conversationId as string, message.id)

      if (response.status === 200) {
        removeMessage(message.id)
        toast.success("Message has been deleted.")
      }
    } catch (error) {
      console.log("Error in the Message bubble component: ", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Message className="flex items-center" align={isMe ? "end" : "start"}>
      <MessageAvatar className="self-start">
        <Avatar>
          <AvatarImage src={profilePic} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant={"outline"}>
          {text && (
            <BubbleContent>
              <div className="mb-2 flex items-center justify-between gap-4">
                <p className="font-medium text-primary">
                  {isMe ? "You" : displayName}
                </p>

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={`${!isMe && "hidden"} cursor-pointer border-none outline-none`}
                  >
                    <EllipsisVertical size={14} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel className="p-1">
                      <AlertDialog>
                        <AlertDialogTrigger className="flex w-full cursor-pointer items-center gap-2 rounded p-1 transition-all duration-200 hover:bg-red-400/20 hover:text-red-400">
                          <Trash2 size={16} />
                          <p className="font-medium">Delete</p>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you absolutely sure?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will
                              permanently delete this message from our servers.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction asChild>
                              <Button
                                variant={"destructive"}
                                className="flex cursor-pointer items-center gap-2"
                                onClick={handleMessageDelete}
                                disabled={isDeleting}
                              >
                                {isDeleting && <Spinner />}
                                Delete
                              </Button>
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuLabel>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              {text}
            </BubbleContent>
          )}

          {attachments && attachments.length > 0 && (
            <BubbleContent className="mt-2">
              {attachments.map((file, index) => {
                const fileTypes = file.split(".")
                const fileType = fileTypes[fileTypes.length - 1]

                const type = getFileType(fileType)

                if (type === "image") {
                  return (
                    <AttachedImage
                      key={index}
                      link={file}
                      fileType={fileType}
                    />
                  )
                }

                if (type === "video") {
                  return (
                    <AttachedVideo
                      key={index}
                      link={file}
                      fileType={fileType}
                    />
                  )
                }

                return (
                  <AttachedFile key={index} link={file} fileType={fileType} />
                )
              })}
            </BubbleContent>
          )}
        </Bubble>
      </MessageContent>
    </Message>
  )
}

export default MessageBubble
