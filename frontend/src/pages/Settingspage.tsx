import { ArrowLeft, Palette, Shield, Trash2, User } from "lucide-react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import AccountSettings from "@/components/settings/AccountSettings"
import PasswordSettings from "@/components/settings/PasswordSettings"
import AppearanceSettings from "@/components/settings/AppearanceSettings"
import DangerZoneSettings from "@/components/settings/DangerZoneSettings"
import { Link } from "react-router-dom"

const Settingspage = () => {
  return (
    <div className="container mx-auto max-w-6xl p-4 md:p-8">
      <div className="mb-8 space-y-1">
        <Link
          to={"/chat"}
          className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground transition-all duration-200 hover:text-foreground"
        >
          <ArrowLeft size={14} />
          Go back to chat
        </Link>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account preferences.
        </p>
      </div>

      <Tabs defaultValue="account" className="flex flex-col gap-6 md:flex-row">
        <TabsList className="h-fit w-full gap-2 bg-transparent p-0 md:w-64 md:flex-col">
          <TabsTrigger
            value="account"
            className="w-full cursor-pointer justify-start gap-2 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:!text-foreground data-[state=active]:shadow-sm data-[state=active]:[&_svg]:!text-foreground"
          >
            <User size={18} />
            Account
          </TabsTrigger>

          <TabsTrigger
            value="password"
            className="w-full cursor-pointer justify-start gap-2 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:!text-foreground data-[state=active]:shadow-sm data-[state=active]:[&_svg]:!text-foreground"
          >
            <Shield size={18} />
            Password
          </TabsTrigger>

          <TabsTrigger
            value="appearance"
            className="w-full cursor-pointer justify-start gap-2 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-accent hover:text-foreground data-[state=active]:bg-muted data-[state=active]:font-semibold data-[state=active]:!text-foreground data-[state=active]:shadow-sm data-[state=active]:[&_svg]:!text-foreground"
          >
            <Palette size={18} />
            Appearance
          </TabsTrigger>

          <TabsTrigger
            value="danger"
            className="w-full cursor-pointer justify-start gap-2 rounded-lg px-4 py-2 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive data-[state=active]:bg-destructive/10 data-[state=active]:font-semibold data-[state=active]:!text-destructive data-[state=active]:shadow-sm data-[state=active]:[&_svg]:!text-destructive"
          >
            <Trash2 size={18} />
            Danger Zone
          </TabsTrigger>
        </TabsList>

        <div className="flex-1">
          <TabsContent value="account">
            <AccountSettings />
          </TabsContent>

          <TabsContent value="password">
            <PasswordSettings />
          </TabsContent>

          <TabsContent value="appearance">
            <AppearanceSettings />
          </TabsContent>

          <TabsContent value="danger">
            <DangerZoneSettings />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

export default Settingspage
