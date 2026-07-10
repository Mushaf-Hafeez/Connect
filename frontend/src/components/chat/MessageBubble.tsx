import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import {
  Message,
  MessageAvatar,
  MessageContent,
  MessageFooter,
} from "@/components/ui/message"
import type { Message as MessageType } from "@/types/chat"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { EllipsisVertical, Pencil, Trash2 } from "lucide-react"
import { getFileType, getFormattedTime } from "@/utils/util"
import AttachedVideo from "../attachment/AttachedVideo"
import AttachedImage from "../attachment/AttachedImage"
import AttachedFile from "../attachment/AttachedFile"
import { useState } from "react"
import Spinner from "../custom/Spinner"
import { chatStore } from "@/zustand/chatStore"
import { deleteMessage, editMessage } from "@/services/conversation.service"
import toast from "react-hot-toast"

const MessageBubble = ({ message }: { message: MessageType }) => {
  const { user } = useStore(userStore)
  const { conversationId, removeMessage, updateMessage } = useStore(chatStore)

  const { displayName, profilePic } = message.sender
  const text = message.text
  const attachments = message.attachments

  const isMe = message.sender.id === user?.id

  const [isDeleting, setIsDeleting] = useState<boolean>(false)
  const [isEditing, setIsEditing] = useState<boolean>(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedText, setEditedText] = useState(text || "")

  const time = getFormattedTime(message.createdAt)

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

  const handleMessageEdit = async () => {
    const nextText = editedText.trim()

    if (!conversationId) {
      toast.error("Conversation not selected.")
      return
    }

    if (!nextText || nextText === text) {
      setIsEditDialogOpen(false)
      return
    }

    setIsEditing(true)
    try {
      const response = await editMessage(conversationId, message.id, nextText)

      if (response.status === 200) {
        updateMessage(
          message.id,
          response.data?.updatedMessage?.text ?? nextText
        )
        toast.success("Message has been updated.")
        setIsEditDialogOpen(false)
      }
    } catch (error) {
      console.log("Error in the Message bubble component: ", error)
      toast.error("Failed to update message.")
    } finally {
      setIsEditing(false)
    }
  }

  return (
    <Message className="flex items-center" align={isMe ? "end" : "start"}>
      <MessageAvatar className="self-start">
        <Avatar>
          <AvatarImage src={profilePic ?? undefined} />
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
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={setIsEditDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <DropdownMenuItem
                            onSelect={(event) => event.preventDefault()}
                            className="flex cursor-pointer items-center gap-2 rounded p-1 transition-all duration-200 hover:bg-muted"
                          >
                            <Pencil size={16} />
                            <p className="font-medium">Edit</p>
                          </DropdownMenuItem>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit message</DialogTitle>
                            <DialogDescription>
                              Update your message below and save the changes.
                            </DialogDescription>
                          </DialogHeader>

                          <textarea
                            value={editedText}
                            onChange={(event) =>
                              setEditedText(event.target.value)
                            }
                            className="min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background outline-none focus-visible:ring-2 focus-visible:ring-ring"
                            placeholder="Write a message"
                          />

                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button
                              onClick={handleMessageEdit}
                              disabled={
                                isEditing || editedText.trim().length === 0
                              }
                            >
                              {isEditing && <Spinner />}
                              Save changes
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>

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
        {/* Todo: Add message time here... */}
        <MessageFooter>{time}</MessageFooter>
      </MessageContent>
    </Message>
  )
}

export default MessageBubble
