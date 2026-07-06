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
import toast from "react-hot-toast"

const MessageBubble = ({ message }: { message: MessageType }) => {
  const { user } = useStore(userStore)

  const { displayName, profilePic } = message.sender
  const text = message.text
  const attachments = message.attachments

  const isMe = message.sender.id === user.id

  const handleDownload = (url: string) => {
    const anchor = document.createElement("a")
    anchor.href = url
    anchor.download = new Date().toISOString()

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <Message align={isMe ? "end" : "start"} variant="ghost">
      <MessageAvatar>
        <Avatar>
          <AvatarImage src={profilePic} />
          <AvatarFallback>{displayName.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>
      </MessageAvatar>
      <MessageContent>
        <Bubble variant={"ghost"}>
          {text && <BubbleContent>{text}</BubbleContent>}

          {attachments && attachments.length > 0 && (
            <BubbleContent className="mt-2">
              {attachments.map((file, index) => (
                <Attachment key={index} orientation="horizontal">
                  <AttachmentMedia>
                    <FileTextIcon />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>Download the file</AttachmentTitle>
                    <AttachmentDescription>
                      No preview available
                    </AttachmentDescription>
                    <img src={file} className="hidden" />
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction
                      type="button"
                      title="Download"
                      aria-label="Download"
                      size="icon-lg"
                      variant="secondary"
                      onClick={() => handleDownload(file)}
                    >
                      <DownloadIcon />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              ))}
            </BubbleContent>
          )}
        </Bubble>
      </MessageContent>
    </Message>
  )
}

export default MessageBubble
