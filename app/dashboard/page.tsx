"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useChatStore } from "@/lib/store/chatStore"
import { useAuthStore } from "@/lib/store/authStore"
import { Bot, Search, Plus, Trash2, Calendar, MessageSquare } from "lucide-react"
import { motion } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { format } from "date-fns"

export default function DashboardPage() {
  const router = useRouter()
  const { user, isAuthenticated } = useAuthStore()
  const { chats, addChat, deleteChat, setActiveChat } = useChatStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    // Redirect to login if not authenticated
    if (mounted && !isAuthenticated) {
      router.push("/login")
    }
  }, [mounted, isAuthenticated, router])

  const handleCreateNewChat = () => {
    const newChatId = uuidv4()
    addChat({
      id: newChatId,
      title: "New Conversation",
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    })
    setActiveChat(newChatId)
    router.push(`/chat?id=${newChatId}`)
  }

  const handleOpenChat = (chatId: string) => {
    setActiveChat(chatId)
    router.push(`/chat?id=${chatId}`)
  }

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation()
    deleteChat(chatId)
  }

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  if (!mounted) return null

  if (!isAuthenticated) {
    return null // Will redirect to login
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Manage your conversations and start new ones.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="relative w-full sm:w-auto max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations..."
              className="pl-8 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button onClick={handleCreateNewChat} className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4" /> New Conversation
          </Button>
        </div>

        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="mt-6 text-xl font-semibold">No conversations yet</h2>
            <p className="mt-2 text-center text-muted-foreground max-w-sm">
              {searchQuery
                ? "No conversations match your search. Try a different query."
                : "Start a new conversation to chat with the AI assistant."}
            </p>
            {!searchQuery && (
              <Button onClick={handleCreateNewChat} className="mt-6 gap-2">
                <Plus className="h-4 w-4" /> Start a Conversation
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredChats.map((chat, index) => (
              <motion.div
                key={chat.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleOpenChat(chat.id)}
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <div className="flex items-center gap-2 truncate">
                        <Bot className="h-5 w-5 text-primary" />
                        <span className="truncate">{chat.title}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={(e) => handleDeleteChat(e, chat.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </CardTitle>
                    <CardDescription className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(chat.createdAt), "PPP")}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {chat.messages.length > 0 ? chat.messages[chat.messages.length - 1].content : "No messages yet"}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-2">
                    <div className="flex items-center text-xs text-muted-foreground">
                      <MessageSquare className="mr-1 h-3 w-3" />
                      {chat.messages.length} {chat.messages.length === 1 ? "message" : "messages"}
                    </div>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

