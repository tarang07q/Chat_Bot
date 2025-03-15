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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Download, Loader2 } from "lucide-react"
import type { Chat } from "@/lib/store/chatStore"
import { exportChatToText, exportChatToJSON, exportChatToHTML } from "@/lib/actions/export-chat"

interface ExportChatDialogProps {
  chat: Chat
}

export function ExportChatDialog({ chat }: ExportChatDialogProps) {
  const [format, setFormat] = useState<"text" | "json" | "html">("text")
  const [isExporting, setIsExporting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const handleExport = async () => {
    if (!chat) return

    setIsExporting(true)

    try {
      let content: string
      let mimeType: string
      let fileExtension: string

      switch (format) {
        case "text":
          content = await exportChatToText(chat)
          mimeType = "text/plain"
          fileExtension = "txt"
          break
        case "json":
          content = await exportChatToJSON(chat)
          mimeType = "application/json"
          fileExtension = "json"
          break
        case "html":
          content = await exportChatToHTML(chat)
          mimeType = "text/html"
          fileExtension = "html"
          break
        default:
          content = await exportChatToText(chat)
          mimeType = "text/plain"
          fileExtension = "txt"
      }

      // Create a blob and download it
      const blob = new Blob([content], { type: mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${chat.title.replace(/\s+/g, "_")}.${fileExtension}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)

      setIsOpen(false)
    } catch (error) {
      console.error("Error exporting chat:", error)
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-4 w-4" />
          Export
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Chat</DialogTitle>
          <DialogDescription>Choose a format to export your conversation.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <RadioGroup
            value={format}
            onValueChange={(value) => setFormat(value as "text" | "json" | "html")}
            className="space-y-3"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="text" id="text" />
              <Label htmlFor="text">Text (.txt)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="json" id="json" />
              <Label htmlFor="json">JSON (.json)</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="html" id="html" />
              <Label htmlFor="html">HTML (.html)</Label>
            </div>
          </RadioGroup>
        </div>
        <DialogFooter>
          <Button type="button" variant="secondary" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

