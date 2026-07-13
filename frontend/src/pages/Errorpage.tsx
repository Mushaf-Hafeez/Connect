import { Link } from "react-router-dom"

import { Button } from "../components/ui/button"

const Errorpage = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 text-foreground">
      <div className="w-full max-w-xl rounded-3xl border border-border/70 bg-card/80 p-8 text-center shadow-2xl shadow-black/10 backdrop-blur sm:p-10">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
          4
        </div>
        <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
          0
        </div>
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-4xl font-semibold text-primary">
          4
        </div>

        <h1 className="text-3xl font-semibold sm:text-4xl">Page not found</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-muted-foreground sm:text-base">
          The page you’re looking for may have been moved, deleted, or never
          existed. Let’s get you back to where you need to be.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link to="/">Go home</Link>
          </Button>
          <Button variant="outline" size="lg" className="w-full sm:w-auto">
            <Link to="/chat">Open chats</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Errorpage
