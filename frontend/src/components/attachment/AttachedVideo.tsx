import { Download } from "lucide-react"

import { Attachment, AttachmentContent } from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"

type VideoAttachmentProps = {
  link: string
  fileType: string
}

const AttachedVideo = ({ link, fileType }: VideoAttachmentProps) => {
  const handleVideoDownload = () => {
    const anchor = document.createElement("a")

    anchor.href = link
    anchor.download = `VID${Date.now()}.${fileType}`
    anchor.target = "_blank"

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <Attachment className="relative w-fit">
      <AttachmentContent>
        <video
          src={link}
          controls
          preload="metadata"
          muted
          className="max-h-80 rounded-lg"
        />
      </AttachmentContent>

      <Button
        size="icon"
        variant="secondary"
        className="absolute top-4 right-4 z-10 cursor-pointer"
        onClick={handleVideoDownload}
      >
        <Download />
      </Button>
    </Attachment>
  )
}

export default AttachedVideo
