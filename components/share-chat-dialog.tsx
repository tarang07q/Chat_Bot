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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Share2, Copy, Check, Loader2 } from "lucide-react"
import type { Chat } from "@/lib/store/chatStore"
import { toast } from "@/components/ui/use-toast"

interface ShareChatDialogProps {
  chat: Chat
}

export function ShareChatDialog({ chat }: ShareChatDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [isSharing, setIsSharing] = useState(false)

  // In a real app, this would generate a unique URL on the server
  // For demo purposes, we'll create a dummy share URL
  const shareUrl = `${window.location.origin}/shared/${chat.id}`

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl)
      setIsCopied(true)
      toast({
        title: "Link copied",
        description: "Share link has been copied to clipboard",
      })

      setTimeout(() => {
        setIsCopied(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to copy:", error)
      toast({
        title: "Copy failed",
        description: "Could not copy the link to clipboard",
        variant: "destructive",
      })
    }
  }

  const handleShare = async () => {
    setIsSharing(true)

    try {
      // In a real app, this would call an API to create a shareable link
      // For demo purposes, we'll simulate a delay
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Check if Web Share API is available
      if (navigator.share) {
        await navigator.share({
          title: `NexusTalk Chat: ${chat.title}`,
          text: `Check out this conversation about ${chat.title}`,
          url: shareUrl,
        })
        setIsOpen(false)
      } else {
        // Fallback to copy if Web Share API is not available
        await handleCopyLink()
      }
    } catch (error) {
      console.error("Error sharing:", error)
      toast({
        title: "Share failed",
        description: "Could not share the conversation",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share conversation</DialogTitle>
          <DialogDescription>Anyone with the link will be able to view this conversation.</DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2 py-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" value={shareUrl} readOnly className="w-full" />
          </div>
          <Button type="button" size="sm" className="px-3 gap-2" onClick={handleCopyLink} disabled={isCopied}>
            {isCopied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy
              </>
            )}
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <Button type="button" variant="secondary" className="gap-2" onClick={handleShare} disabled={isSharing}>
            {isSharing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4" />
                Share
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

