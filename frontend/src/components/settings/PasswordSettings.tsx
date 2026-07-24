import { Eye, EyeOff } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const PasswordInput = ({ placeholder }: { placeholder: string }) => {
  const [show, setShow] = useState(false)

  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} placeholder={placeholder} />

      <button
        type="button"
        onClick={() => setShow((prev) => !prev)}
        className="absolute top-1/2 right-4 -translate-y-1/2 text-muted-foreground"
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  )
}

const PasswordSettings = () => {
  return (
    <Card>
      <CardContent className="space-y-8 p-6">
        <div>
          <h2 className="text-xl font-semibold">Change Password</h2>

          <p className="text-sm text-muted-foreground">
            Keep your account secure.
          </p>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label>Current Password</Label>
            <PasswordInput placeholder="********" />
          </div>

          <div className="space-y-2">
            <Label>New Password</Label>
            <PasswordInput placeholder="********" />
          </div>

          <div className="space-y-2">
            <Label>Confirm Password</Label>
            <PasswordInput placeholder="********" />
          </div>
        </div>

        <Button>Update Password</Button>
      </CardContent>
    </Card>
  )
}

export default PasswordSettings
