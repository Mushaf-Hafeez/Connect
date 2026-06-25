import { useEffect, useState } from "react"
import type { Dispatch, SetStateAction } from "react"

import type { User } from "@/types/user"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import z from "zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Input } from "../ui/input"
import { Button } from "../ui/button"
import Spinner from "../custom/Spinner"
import { SearchIcon } from "lucide-react"
import SearchedUsers from "../custom/SearchedUsers"
import { searchUser } from "@/services/user.service"
import UserSkeleton from "../custom/UserSkeleton"

const addFriendSchema = z.object({
  username: z
    .string({
      error: () => "Username is required.",
    })
    .trim()
    .min(1, {
      error: "Username must be at least 1 character.",
    })
    .max(30, {
      error: "Username cannot exceed 30 characters.",
    })
    .regex(/^[a-zA-Z0-9_]+$/, {
      error: "Username can only contain letters, numbers and underscores.",
    }),
})

type AddFriendData = z.infer<typeof addFriendSchema>

interface AddFriendProps {
  isAddDialogOpen: boolean
  setIsAddDialogOpen: Dispatch<SetStateAction<boolean>>
}

const AddFriend = ({ isAddDialogOpen, setIsAddDialogOpen }: AddFriendProps) => {
  const [users, setUsers] = useState<User[] | null>(null)

  const {
    register,
    handleSubmit,
    clearErrors,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AddFriendData>({
    defaultValues: {
      username: "",
    },
    resolver: zodResolver(addFriendSchema),
    mode: "onChange",
  })

  const onSubmit: SubmitHandler<AddFriendData> = async (data) => {
    clearErrors()
    try {
      const response = await searchUser(data.username)

      if (response.status === 200) {
        setUsers(response.data.users)

        reset({
          username: "",
        })
      }
    } catch (error) {
      console.log("Error in add friend component: ", error)
    }
  }

  return (
    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a friend</DialogTitle>
          <form onSubmit={handleSubmit(onSubmit)} className="mt-2">
            <div className="flex items-center gap-2">
              <Input
                {...register("username")}
                type="text"
                placeholder="Search username"
              />
              <Button
                variant={"outline"}
                size={"icon"}
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer"
              >
                {isSubmitting ? <Spinner /> : <SearchIcon size={18} />}
              </Button>
            </div>
            {errors.username && (
              <p className="mt-2 text-red-400">{errors.username.message}</p>
            )}
            {/* list searched users */}
            <div className="mt-4 h-80 scrollbar-none overflow-y-auto">
              {isSubmitting ? (
                <ul className="space-y-2">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <UserSkeleton key={index} />
                  ))}
                </ul>
              ) : (
                <SearchedUsers users={users} />
              )}
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default AddFriend
