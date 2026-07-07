import { Download, FileText } from "lucide-react"

import { Attachment, AttachmentContent } from "@/components/ui/attachment"
import { Button } from "@/components/ui/button"

type AttachedFileProps = {
  link: string
  fileType: string
}
const AttachedFile = ({ link, fileType }: AttachedFileProps) => {
  // Todo: add download logic
  return (
    <Attachment className="relative w-72">
      <AttachmentContent className="flex items-center gap-3 rounded-lg border p-2">
        <div className="flex size-12 items-center justify-center rounded-md bg-muted">
          <FileText className="size-6" />
        </div>

        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium">Document</p>
          <p className="text-xs text-muted-foreground">PDF Document</p>
        </div>

        <Button size="icon" variant="secondary" className="cursor-pointer">
          <Download className="size-4" />
        </Button>
      </AttachmentContent>
    </Attachment>
  )
}

export default AttachedFile
