"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { Send, Bot, User, Plus, Info } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { v4 as uuidv4 } from "uuid"
import { useChatStore, type Message as ChatMessage } from "@/lib/store/chatStore"
import { useAuthStore } from "@/lib/store/authStore"
import { useSocket } from "@/lib/hooks/useSocket"
import { useSearchParams, useRouter } from "next/navigation"
import { ExportChatDialog } from "@/components/export-chat-dialog"
import { VoiceInput } from "@/components/voice-input"
import { ShareChatDialog } from "@/components/share-chat-dialog"
import { ChatSettingsDialog } from "@/components/chat-settings-dialog"
import { toast } from "@/components/ui/use-toast"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [mounted, setMounted] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const { chats, activeChat, addChat, addMessage, setActiveChat, isTyping, updateChatTitle } = useChatStore()

  const { user, isAuthenticated } = useAuthStore()
  const { isConnected, joinChat, sendMessage, sendTyping } = useSocket()

  // Add state for chat settings
  const [fontSize, setFontSize] = useState(16)
  const [messageBubbles, setMessageBubbles] = useState(true)
  const [soundEffects, setSoundEffects] = useState(false)
  const [showModelInfo, setShowModelInfo] = useState(true)

  // Handle chat ID from URL
  useEffect(() => {
    if (mounted) {
      const chatId = searchParams.get("id")
      if (chatId && chats.some((chat) => chat.id === chatId)) {
        setActiveChat(chatId)
      }
    }
  }, [mounted, searchParams, chats, setActiveChat])

  // Create a new chat if there's no active chat
  useEffect(() => {
    if (mounted && !activeChat && chats.length === 0) {
      const newChatId = uuidv4()
      addChat({
        id: newChatId,
        title: "New Conversation",
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      setActiveChat(newChatId)
    }
  }, [mounted, activeChat, chats, addChat, setActiveChat])

  // Join the active chat room
  useEffect(() => {
    if (mounted && activeChat && isConnected) {
      joinChat(activeChat)
    }
  }, [mounted, activeChat, isConnected, joinChat])

  // Handle input change for typing indicator
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value)

    if (activeChat && isAuthenticated && user) {
      sendTyping(activeChat, user.id, e.target.value.length > 0)
    }
  }

  // Generate a simulated AI response based on user input
  const generateSimulatedResponse = (userInput: string): Promise<string> => {
    return new Promise((resolve) => {
      // Simple response mapping for common questions
      const responses: Record<string, string> = {
        hello: "Hello! How can I help you today?",
        hi: "Hi there! What can I do for you?",
        "how are you": "I'm functioning well, thank you for asking! How can I assist you?",
        "what can you do":
          "I can answer questions, provide information, assist with tasks, generate content, and engage in conversations on a wide range of topics including science, history, technology, and more.",
        "who are you":
          "I'm NexusTalk, an AI assistant designed to be helpful, informative, and engaging. I'm here to assist you with various tasks and answer your questions.",
        help: "I'd be happy to help! You can ask me questions, request information, or just chat. What would you like assistance with?",
      }

      // Default response for inputs that don't match predefined patterns
      let response =
        "Thank you for your message. I'm here to help with any questions or tasks you might have. Feel free to ask me anything!"

      // Check for matches in our simple response mapping
      const lowercaseInput = userInput.toLowerCase()
      for (const key in responses) {
        if (lowercaseInput.includes(key)) {
          response = responses[key]
          break
        }
      }

      // If the input contains a question about a specific topic
      if (lowercaseInput.includes("weather")) {
        response =
          "I don't have access to real-time weather data, but I can suggest checking a weather service or app for the most current forecast in your area."
      } else if (lowercaseInput.includes("time")) {
        response = `I don't have access to your local time, but you can check the time on your device. The current UTC time is approximately ${new Date().toUTCString()}.`
      } else if (lowercaseInput.includes("joke")) {
        const jokes = [
          "Why don't scientists trust atoms? Because they make up everything!",
          "Why did the scarecrow win an award? Because he was outstanding in his field!",
          "What do you call a fake noodle? An impasta!",
          "How does a penguin build its house? Igloos it together!",
          "Why don't eggs tell jokes? They'd crack each other up!",
        ]
        response = jokes[Math.floor(Math.random() * jokes.length)]
      } else if (lowercaseInput.includes("thank")) {
        response = "You're welcome! If you have any more questions or need further assistance, feel free to ask."
      }

      // Simulate network delay
      setTimeout(() => {
        resolve(response)
      }, 1000)
    })
  }

  // Generate a title based on the conversation
  const generateSimulatedTitle = (userInput: string): Promise<string> => {
    return new Promise((resolve) => {
      // Extract key words from the user input
      const words = userInput.split(" ")
      let title = "New Conversation"

      if (words.length > 2) {
        // Use the first few words to create a title
        title = words.slice(0, 3).join(" ")
        // Capitalize first letter of each word
        title = title
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")

        // Add ellipsis if the title is from a longer message
        if (words.length > 3) {
          title += "..."
        }
      } else if (userInput.length > 0) {
        // If the input is short, use it as is
        title = userInput.charAt(0).toUpperCase() + userInput.slice(1)
      }

      // Simulate network delay
      setTimeout(() => {
        resolve(title)
      }, 500)
    })
  }

  // Custom submit handler to store messages in Zustand and send via socket
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!input.trim() || !activeChat || isProcessing) return

    // Add user message to Zustand store
    const messageId = uuidv4()
    const userMessage: ChatMessage = {
      id: messageId,
      content: input,
      role: "user",
      createdAt: new Date(),
    }

    addMessage(activeChat, userMessage)

    // Send message via socket if connected
    if (isConnected && isAuthenticated && user) {
      sendMessage(activeChat, input, user.id)
    }

    // Clear input and set processing state
    const userInput = input
    setInput("")
    setIsProcessing(true)

    try {
      // Generate AI response
      const response = await generateSimulatedResponse(userInput)

      // Add AI message to store
      const assistantMessage: ChatMessage = {
        id: uuidv4(),
        content: response,
        role: "assistant",
        createdAt: new Date(),
      }

      addMessage(activeChat, assistantMessage)

      // Generate title for new chats after the first exchange
      const currentChat = chats.find((chat) => chat.id === activeChat)
      if (currentChat && currentChat.title === "New Conversation" && currentChat.messages.length === 0) {
        try {
          const title = await generateSimulatedTitle(userInput)
          if (title) {
            updateChatTitle(activeChat, title)
          }
        } catch (error) {
          console.error("Failed to generate title:", error)
        }
      }

      // Play sound effect if enabled
      if (soundEffects) {
        const audio = new Audio("/message-sent.mp3")
        audio.play().catch((err) => console.error("Failed to play sound:", err))
      }
    } catch (error) {
      console.error("Error generating response:", error)
      toast({
        title: "Error",
        description: "Failed to generate a response. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [chats, activeChat])

  // Set mounted to true after component mounts
  useEffect(() => {
    setMounted(true)
  }, [])

  // Don't render anything until after mount to prevent hydration issues
  if (!mounted) return null

  // Find the current active chat
  const currentChat = chats.find((chat) => chat.id === activeChat)
  const chatMessages = currentChat?.messages || []

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] p-4 bg-gray-50 dark:bg-gray-900">
      <Card className="w-full max-w-3xl h-[80vh] flex flex-col">
        <CardHeader className="border-b">
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Bot className="mr-2 h-5 w-5" />
              {currentChat?.title || "New Conversation"}
            </div>
            <div className="flex items-center gap-2">
              <ChatSettingsDialog
                fontSize={fontSize}
                setFontSize={setFontSize}
                messageBubbles={messageBubbles}
                setMessageBubbles={setMessageBubbles}
                soundEffects={soundEffects}
                setSoundEffects={setSoundEffects}
              />
              {currentChat && currentChat.messages.length > 0 && (
                <>
                  <ShareChatDialog chat={currentChat} />
                  <ExportChatDialog chat={currentChat} />
                </>
              )}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
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
                }}
              >
                <Plus className="h-5 w-5" />
                <span className="sr-only">New Chat</span>
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4">
          {/* AI Model Capabilities Info */}
          {showModelInfo && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-4 rounded-lg bg-muted/50 border border-border"
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Info className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium mb-1">AI Assistant Capabilities</h3>
                  <p className="text-sm text-muted-foreground">
                    This AI assistant can answer questions, provide information, assist with tasks, generate content,
                    and engage in natural conversations. It has knowledge about a wide range of topics including
                    science, history, technology, arts, and more. The assistant can also help with coding, math
                    problems, and creative writing.
                  </p>
                  <div className="flex justify-end mt-2">
                    <Button variant="ghost" size="sm" onClick={() => setShowModelInfo(false)} className="text-xs">
                      Dismiss
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <AnimatePresence initial={false}>
            {chatMessages.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center h-full text-center text-gray-500"
              >
                <Bot className="h-12 w-12 mb-4" />
                <h3 className="text-lg font-medium">Welcome to NexusTalk</h3>
                <p className="max-w-md">
                  Start a conversation with our AI assistant. Ask questions, get information, or just chat!
                </p>
              </motion.div>
            ) : (
              chatMessages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex items-start gap-3 mb-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {message.role !== "user" && (
                    <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </Avatar>
                  )}
                  <div
                    className={`${messageBubbles ? "rounded-lg px-4 py-2" : "px-2 py-1"} max-w-[80%] ${
                      message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 bg-gray-500">
                      <User className="h-4 w-4" />
                    </Avatar>
                  )}
                </motion.div>
              ))
            )}
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-start gap-3 mb-4 justify-start"
              >
                <Avatar className="h-8 w-8 bg-primary text-primary-foreground">
                  <Bot className="h-4 w-4" />
                </Avatar>
                <div className="rounded-lg px-4 py-2 bg-muted">
                  <div className="flex space-x-1">
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    ></div>
                    <div
                      className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    ></div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-4">
          <form onSubmit={handleSubmit} className="flex w-full gap-2">
            <Input
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="flex-1"
              disabled={isProcessing}
            />
            <VoiceInput onTranscript={(transcript) => setInput(transcript)} isDisabled={isProcessing} />
            <Button type="submit" disabled={isProcessing || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </form>
        </CardFooter>
      </Card>
    </div>
  )
}

