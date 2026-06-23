import { MessageCircle, Phone, Search, SquarePen, Users } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

import ChatList from "./ChatList"

const ChatSidebar = () => {
  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b p-4">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Messages</h1>

          {/* Todo: replace the icon with menu  */}
          <SquarePen className="h-5 w-5 cursor-pointer" />
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
