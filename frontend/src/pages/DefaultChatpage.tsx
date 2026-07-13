const DefaultChatpage = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background p-6">
      <div className="w-full max-w-2xl rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-2xl shadow-black/10 backdrop-blur sm:p-10">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-8 w-8"
          >
            <path
              d="M7 8h10M7 12h6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M5 5.5A2.5 2.5 0 0 1 7.5 3h9A2.5 2.5 0 0 1 19 5.5v8A2.5 2.5 0 0 1 16.5 16H9l-4 4v-4H7.5A2.5 2.5 0 0 1 5 13.5z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-semibold sm:text-3xl">
          Choose a conversation to begin
        </h1>
        <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
          Select a chat from the sidebar or start a fresh conversation with one
          of your friends to keep the conversation going.
        </p>

        <div className="mt-8 grid gap-3 text-left sm:grid-cols-3">
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-medium">Fast replies</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Stay connected with real-time messaging.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-medium">Shared media</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Send photos and files in one place.
            </p>
          </div>
          <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
            <p className="text-sm font-medium">Stay organized</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Keep all your conversations neatly grouped.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DefaultChatpage
