import { useState } from "react"

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

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const DangerZoneSettings = () => {
  const [text, setText] = useState("")

  return (
    <Card className="border-destructive">
      <CardContent className="space-y-8 p-6">
        <div>
          <h2 className="text-xl font-semibold text-destructive">
            Danger Zone
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            Deleting your account is permanent and cannot be undone.
          </p>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete Account</Button>
          </AlertDialogTrigger>

          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Account?</AlertDialogTitle>

              <AlertDialogDescription>
                Type DELETE to permanently remove your account.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <Input
              placeholder="DELETE"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>

              <AlertDialogAction disabled={text !== "DELETE"}>
                Delete Account
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default DangerZoneSettings
