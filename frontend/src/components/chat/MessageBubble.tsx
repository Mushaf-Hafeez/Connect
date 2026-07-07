import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import type { Message as MessageType } from "@/types/chat"
import { userStore } from "@/zustand/userStore"
import { useStore } from "zustand"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { DownloadIcon, FileTextIcon } from "lucide-react"
import { getFileType } from "@/utils/util"
import AttachedVideo from "../attachment/AttachedVideo"
import AttachedImage from "../attachment/AttachedImage"
import AttachedFile from "../attachment/AttachedFile"
import { Link } from "react-router-dom"

const MessageBubble = ({ message }: { message: MessageType }) => {
  const { user } = useStore(userStore)

  const { displayName, profilePic } = message.sender
  const text = message.text
  const attachments = message.attachments

  const isMe = message.sender.id === user.id

  const handleDownload = (url: string) => {
    window.open(url, "_blank")
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
          {text && <BubbleContent>{text}</BubbleContent>}

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
