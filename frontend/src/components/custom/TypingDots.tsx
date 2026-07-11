import { cn } from "@/lib/utils"

interface TypingDotsProps {
  className?: string
  dotClassName?: string
}

const TypingDots = ({ className, dotClassName }: TypingDotsProps) => {
  return (
    <span
      className={cn("inline-flex items-center gap-1", className)}
      role="status"
      aria-label="Typing"
    >
      <span
        className={cn(
          "size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]",
          dotClassName
        )}
      />
      <span
        className={cn(
          "size-1 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]",
          dotClassName
        )}
      />
      <span
        className={cn(
          "size-1 animate-bounce rounded-full bg-muted-foreground",
          dotClassName
        )}
      />
      <span className="sr-only">Typing...</span>
    </span>
  )
}

export default TypingDots
