"use client"

import { useEffect, useState } from "react"
import { io, type Socket } from "socket.io-client"
import { useChatStore } from "@/lib/store/chatStore"

let socket: Socket | null = null

export function useSocket() {
  const [isConnected, setIsConnected] = useState(false)
  const { addMessage, setIsTyping } = useChatStore()

  useEffect(() => {
    // Initialize socket connection
    if (!socket) {
      const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:5000"
      socket = io(socketUrl, {
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      })
    }

    // Socket event handlers
    function onConnect() {
      setIsConnected(true)
      console.log("Socket connected")
    }

    function onDisconnect() {
      setIsConnected(false)
      console.log("Socket disconnected")
    }

    function onNewMessage(data: any) {
      addMessage(data.chatId, {
        id: data.id,
        content: data.message,
        role: data.role,
        createdAt: new Date(data.timestamp),
      })
    }

    function onUserTyping(data: any) {
      if (data.isTyping) {
        setIsTyping(true)
      } else {
        setIsTyping(false)
      }
    }

    // Register event listeners
    socket.on("connect", onConnect)
    socket.on("disconnect", onDisconnect)
    socket.on("new-message", onNewMessage)
    socket.on("user-typing", onUserTyping)

    // Clean up event listeners on unmount
    return () => {
      socket?.off("connect", onConnect)
      socket?.off("disconnect", onDisconnect)
      socket?.off("new-message", onNewMessage)
      socket?.off("user-typing", onUserTyping)
    }
  }, [addMessage, setIsTyping])

  // Join a chat room
  const joinChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit("join-chat", chatId)
    }
  }

  // Leave a chat room
  const leaveChat = (chatId: string) => {
    if (socket && isConnected) {
      socket.emit("leave-chat", chatId)
    }
  }

  // Send a message
  const sendMessage = (chatId: string, message: string, userId: string) => {
    if (socket && isConnected) {
      socket.emit("send-message", {
        chatId,
        message,
        userId,
        timestamp: new Date(),
      })
    }
  }

  // Send typing indicator
  const sendTyping = (chatId: string, userId: string, isTyping: boolean) => {
    if (socket && isConnected) {
      socket.emit("typing", {
        chatId,
        userId,
        isTyping,
      })
    }
  }

  return {
    isConnected,
    joinChat,
    leaveChat,
    sendMessage,
    sendTyping,
  }
}

