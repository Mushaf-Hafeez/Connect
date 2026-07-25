import { Camera } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useStore } from "zustand"
import { userStore } from "@/zustand/userStore"
import { useState, type ChangeEvent } from "react"
import toast from "react-hot-toast"
import { updateProfilePic } from "@/services/user.service"
import Spinner from "../custom/Spinner"

const AccountSettings = () => {
  const { user, updateUserProfilePic } = useStore(userStore)
  const [isUploading, setIsUploading] = useState<boolean>(false)

  // Todo: Add the logic to upload the file
  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]

    if (!file) {
      toast("please select a picture.")
      return
    }

    try {
      setIsUploading(true)

      const formData = new FormData()
      formData.append("profilePic", file)

      const response = await updateProfilePic(formData)

      if (response.status) {
        updateUserProfilePic(response.data.profilePic)
        toast.success(response.data.message)
      }
    } catch (error) {
      toast.error(error.response.data.message || "Something went wrong.")
      console.log("Error while upload the profile pic: ", error)
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-8 p-6">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold">Account</h2>
          <p className="text-sm text-muted-foreground">
            Update your profile information.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Avatar className="size-28">
            <AvatarImage className="object-cover" src={user?.profilePic} />
            <AvatarFallback>
              {user?.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <Label
            htmlFor="profile"
            className="cursor-pointer rounded bg-secondary p-2 text-xs outline"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">Uploading...</div>
            ) : (
              <div className="flex items-center gap-2">
                <Camera size={18} />
                Change Picture
              </div>
            )}
          </Label>

          <Input
            id="profile"
            type="file"
            name="profile-pic"
            accept=".png, .jpgm .jpeg"
            onChange={handleFileUpload}
            className="hidden"
            disabled={isUploading}
          />
        </div>

        <div className="grid gap-6">
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input placeholder="Mushaf Hafeez" />
          </div>
        </div>

        <Button>Save Changes</Button>
      </CardContent>
    </Card>
  )
}

export default AccountSettings
