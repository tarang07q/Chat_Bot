"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Settings, Check } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "next-themes"

interface ChatSettingsDialogProps {
  fontSize: number
  setFontSize: (size: number) => void
  messageBubbles: boolean
  setMessageBubbles: (enabled: boolean) => void
  soundEffects: boolean
  setSoundEffects: (enabled: boolean) => void
}

export function ChatSettingsDialog({
  fontSize,
  setFontSize,
  messageBubbles,
  setMessageBubbles,
  soundEffects,
  setSoundEffects,
}: ChatSettingsDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { theme, setTheme } = useTheme()

  const handleSave = () => {
    toast({
      title: "Settings saved",
      description: "Your chat settings have been updated",
    })
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Settings className="h-4 w-4" />
          <span className="sr-only">Chat Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Chat Settings</DialogTitle>
          <DialogDescription>Customize your chat experience</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="appearance" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
            <TabsTrigger value="behavior">Behavior</TabsTrigger>
          </TabsList>

          <TabsContent value="appearance" className="space-y-4">
            <div className="space-y-2">
              <Label>Theme</Label>
              <div className="flex gap-2">
                <Button
                  variant={theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("light")}
                  className="flex-1"
                >
                  Light
                  {theme === "light" && <Check className="ml-2 h-4 w-4" />}
                </Button>
                <Button
                  variant={theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("dark")}
                  className="flex-1"
                >
                  Dark
                  {theme === "dark" && <Check className="ml-2 h-4 w-4" />}
                </Button>
                <Button
                  variant={theme === "system" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setTheme("system")}
                  className="flex-1"
                >
                  System
                  {theme === "system" && <Check className="ml-2 h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <Label>Font Size</Label>
                <span className="text-sm">{fontSize}px</span>
              </div>
              <Slider value={[fontSize]} min={12} max={20} step={1} onValueChange={(value) => setFontSize(value[0])} />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="message-bubbles">Message Bubbles</Label>
              <Switch id="message-bubbles" checked={messageBubbles} onCheckedChange={setMessageBubbles} />
            </div>
          </TabsContent>

          <TabsContent value="behavior" className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="sound-effects">Sound Effects</Label>
              <Switch id="sound-effects" checked={soundEffects} onCheckedChange={setSoundEffects} />
            </div>

            <div className="space-y-2">
              <Label>Reset All Settings</Label>
              <Button
                variant="destructive"
                size="sm"
                className="w-full"
                onClick={() => {
                  setFontSize(16)
                  setMessageBubbles(true)
                  setSoundEffects(false)
                  setTheme("system")
                  toast({
                    title: "Settings reset",
                    description: "All settings have been reset to default values",
                  })
                }}
              >
                Reset to Defaults
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

