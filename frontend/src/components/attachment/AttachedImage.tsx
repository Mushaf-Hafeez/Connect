import { Download } from "lucide-react"

import { Attachment, AttachmentContent } from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"

type AttachedImageProps = {
  link: string
  fileType: string
}

const AttachedImage = ({ link, fileType }: AttachedImageProps) => {
  const downloadImage = () => {
    const anchor = document.createElement("a")

    anchor.href = link
    anchor.download = `IMG${Date.now()}.${fileType}`
    anchor.target = "_blank"

    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  }

  return (
    <Attachment className="relative w-fit">
      <AttachmentContent>
        <img
          src={link}
          alt="Attachment"
          className="max-h-80 rounded-lg object-cover"
        />
      </AttachmentContent>

      <Button
        size="icon-lg"
        variant="secondary"
        className="absolute top-4 right-4 cursor-pointer"
        onClick={downloadImage}
      >
        <Download />
      </Button>
    </Attachment>
  )
}

export default AttachedImage
