import { useMemo, useState } from "react"
import { FileText, Plus, SendHorizontal, Video, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Spinner from "../custom/Spinner"
import { sendMessage } from "@/services/conversation.service"
import { useParams } from "react-router-dom"

const MessageInput = () => {
  const [message, setMessage] = useState("")
  const [attachments, setAttachments] = useState<File[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const params = useParams()

  const previews = useMemo(() => {
    return attachments.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }))
  }, [attachments])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])

    setAttachments((prev) => [...prev, ...files])

    // Allow selecting the same file again
    e.target.value = ""
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!message.trim() && attachments.length === 0) return

    try {
      setIsSubmitting(true)

      const formData = new FormData()

      formData.append("text", message)

      attachments.forEach((file) => {
        formData.append("attachments", file)
      })

      console.log({
        message,
        attachments,
      })

      // make the api call to the backend
      const response = await sendMessage(params.id as string, formData)

      if (response.status === 201) {
        console.log("Message sent successfully:", response.data)
        setMessage("")
        setAttachments([])
      }
    } catch (error) {
      console.log("Error in message input component: ", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="border-t p-4">
      {attachments.length > 0 && (
        <div className="mb-3 flex scrollbar-none gap-3 overflow-x-auto pb-1">
          {previews.map(({ file, url }, index) => (
            <div key={`${file.name}-${index}`} className="relative shrink-0">
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 z-10 h-6 w-6 cursor-pointer rounded-full"
                onClick={() => removeAttachment(index)}
              >
                <X className="h-3 w-3" />
              </Button>

              {file.type.startsWith("image/") && (
                <img
                  src={url}
                  alt={file.name}
                  className="h-24 w-24 rounded-md border object-cover"
                />
              )}

              {file.type.startsWith("video/") && (
                <video
                  src={url}
                  className="h-24 w-24 rounded-md border object-cover"
                  controls
                />
              )}

              {file.type === "application/pdf" && (
                <div className="flex h-24 w-24 flex-col items-center justify-center rounded-md border p-2 text-center">
                  <FileText className="mb-1 h-8 w-8 text-red-500" />
                  <p className="line-clamp-2 text-xs">{file.name}</p>
                </div>
              )}

              {!file.type.startsWith("image/") &&
                !file.type.startsWith("video/") &&
                file.type !== "application/pdf" && (
                  <div className="flex h-24 w-24 flex-col items-center justify-center rounded-md border p-2 text-center">
                    <Video className="mb-1 h-8 w-8" />
                    <p className="line-clamp-2 text-xs">{file.name}</p>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-center gap-2">
        <Label htmlFor="attachments" className="cursor-pointer">
          <Plus size={20} />
        </Label>

        <Input
          id="attachments"
          type="file"
          multiple
          accept="image/*,video/*,.pdf"
          className="hidden"
          onChange={handleFileChange}
        />

        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />

        <Button type="submit" size="icon" disabled={isSubmitting}>
          {isSubmitting ? <Spinner /> : <SendHorizontal size={18} />}
        </Button>
      </form>
    </div>
  )
}

export default MessageInput
