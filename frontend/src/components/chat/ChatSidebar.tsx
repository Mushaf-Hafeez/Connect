import { useState } from "react"

import {
  EllipsisVertical,
  MessageCircle,
  Phone,
  Search,
  SearchIcon,
  Users,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import ChatList from "./ChatList"

import z from "zod"
import { useForm } from "react-hook-form"
import type { SubmitHandler } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import Spinner from "../custom/Spinner"
import { searchUser } from "@/services/user.service"

import type { User } from "@/types/user"
import SearchedUsers from "../custom/SearchedUsers"

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

const ChatSidebar = () => {
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

  const [users, setUsers] = useState<User[] | null>(null)
  const [open, setOpen] = useState<boolean>(false)

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
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messages</h1>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size={"icon"} className="cursor-pointer">
                <EllipsisVertical size={18} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setOpen(true)}>
                Add friend
              </DropdownMenuItem>

              <DropdownMenuItem>Pending requests</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
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
                    <p className="mt-2 text-red-400">
                      {errors.username.message}
                    </p>
                  )}
                  {/* list searched users */}
                  <SearchedUsers users={users} />
                </form>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>

        <div className="relative">
          <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <Input placeholder="Search conversations..." className="pl-9" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b p-4">
        <Tabs defaultValue="chats">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="chats">
              <MessageCircle className="mr-2 h-4 w-4" />
              Chats
            </TabsTrigger>

            <TabsTrigger value="groups">
              <Users className="mr-2 h-4 w-4" />
              Groups
            </TabsTrigger>

            <TabsTrigger value="calls">
              <Phone className="mr-2 h-4 w-4" />
              Calls
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Chat List */}
      <ChatList />
    </div>
  )
}

export default ChatSidebar
