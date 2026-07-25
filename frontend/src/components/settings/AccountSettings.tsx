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
import { updateProfile, updateProfilePic } from "@/services/user.service"

import z from "zod"
import type { SubmitHandler } from "react-hook-form"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Spinner from "../custom/Spinner"

const EditProfileSchema = z.object({
  displayName: z
    .string({
      error: () => "Display name is required.",
    })
    .trim()
    .min(2, {
      error: "Display name must be at least 2 characters.",
    })
    .max(50, {
      error: "Display name cannot exceed 50 characters.",
    }),
})

type EditProfileData = z.infer<typeof EditProfileSchema>

const AccountSettings = () => {
  const { user, updateUserProfilePic, updateUserDisplayName } =
    useStore(userStore)
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      displayName: user!.displayName,
    },
    resolver: zodResolver(EditProfileSchema),
    mode: "onChange",
  })

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

      if (response.status === 200) {
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

  const onSubmit: SubmitHandler<EditProfileData> = async (data) => {
    try {
      const response = await updateProfile(data)

      if (response.status === 200) {
        updateUserDisplayName(watch("displayName"))
        toast.success(response.data.message)
      }
    } catch (error) {
      console.log("Error while updating the user's profile: ", error)
      toast.error(error.response.data.message || "Something went wrong.")
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

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
          <div className="grid gap-6">
            <div className="space-y-2">
              <Label>Display Name</Label>
              <Input {...register("displayName")} />
              {errors && errors.displayName && (
                <p className="text-red-400">{errors.displayName.message}</p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex cursor-pointer items-center gap-2"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <Spinner />
                Saving
              </div>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}

export default AccountSettings
