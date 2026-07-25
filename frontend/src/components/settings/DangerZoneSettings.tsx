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
import toast from "react-hot-toast"
import Spinner from "../custom/Spinner"
import { useStore } from "zustand"
import { userStore } from "@/zustand/userStore"
import { useNavigate } from "react-router-dom"
import { deleteAccount } from "@/services/user.service"

const DangerZoneSettings = () => {
  const { clearUser } = useStore(userStore)

  const [text, setText] = useState<string>("")
  const [isDeleting, setIsDeleting] = useState<boolean>(false)

  const [showDeleteDialog, setShowDeleteDialog] = useState<boolean>(false)

  const navigate = useNavigate()

  const handleAccountDelete = async () => {
    setIsDeleting(true)
    try {
      const response = await deleteAccount()

      if (response.status === 200) {
        toast.success(response.data.message)
        clearUser()
        navigate("/")
      }
    } catch (error) {
      console.log("Error while deleting the account: ", error)
      toast.error(error.response.data.message || "Something went wrong.")
    } finally {
      setIsDeleting(false)
    }
  }

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

        <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="cursor-pointer">
              Delete Account
            </Button>
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

              <AlertDialogAction
                variant={"destructive"}
                disabled={text !== "DELETE" || isDeleting}
                className="cursor-pointer"
                onClick={handleAccountDelete}
              >
                {isDeleting ? (
                  <div className="flex items-center gap-2">
                    <Spinner />
                    Deleting
                  </div>
                ) : (
                  "Delete Account"
                )}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  )
}

export default DangerZoneSettings
