import { Camera } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const AccountSettings = () => {
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
            <AvatarImage src="" />
            <AvatarFallback>MH</AvatarFallback>
          </Avatar>

          <Button variant="outline">
            <Camera />
            Change Picture
          </Button>
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
