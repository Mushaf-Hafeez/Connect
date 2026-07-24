import { Laptop, Moon, Sun, type LucideIcon } from "lucide-react"

import { useTheme } from "@/components/theme-provider"

import { Card, CardContent } from "@/components/ui/card"

interface Theme {
  title: string
  value: "light" | "dark" | "system"
  icon: LucideIcon
}

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme()

  const themes: Theme[] = [
    {
      title: "Light",
      value: "light",
      icon: Sun,
    },
    {
      title: "Dark",
      value: "dark",
      icon: Moon,
    },
    {
      title: "System",
      value: "system",
      icon: Laptop,
    },
  ]

  return (
    <Card>
      <CardContent className="space-y-8 p-6">
        <div>
          <h2 className="text-xl font-semibold">Appearance</h2>

          <p className="text-sm text-muted-foreground">
            Select your preferred theme.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {themes.map((item) => {
            const Icon = item.icon

            return (
              <button
                key={item.value}
                onClick={() => setTheme(item.value)}
                className={`cursor-pointer rounded-xl border p-2 transition-all ${
                  theme === item.value &&
                  "border-primary ring-4 ring-primary/20"
                }`}
              >
                <div className="flex flex-col items-center gap-1">
                  <Icon size={20} />

                  <p className="font-medium">{item.title}</p>
                </div>
              </button>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

export default AppearanceSettings
