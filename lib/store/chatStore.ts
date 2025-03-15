import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface Message {
  id: string
  content: string
  role: "user" | "assistant"
  createdAt: Date
}

export interface Chat {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatState {
  chats: Chat[]
  activeChat: string | null
  isTyping: boolean
  addChat: (chat: Chat) => void
  deleteChat: (id: string) => void
  updateChatTitle: (id: string, title: string) => void
  addMessage: (chatId: string, message: Message) => void
  setActiveChat: (id: string | null) => void
  setIsTyping: (isTyping: boolean) => void
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      chats: [],
      activeChat: null,
      isTyping: false,
      addChat: (chat) => set((state) => ({ chats: [...state.chats, chat] })),
      deleteChat: (id) =>
        set((state) => ({
          chats: state.chats.filter((chat) => chat.id !== id),
          activeChat: state.activeChat === id ? null : state.activeChat,
        })),
      updateChatTitle: (id, title) =>
        set((state) => ({
          chats: state.chats.map((chat) => (chat.id === id ? { ...chat, title, updatedAt: new Date() } : chat)),
        })),
      addMessage: (chatId, message) =>
        set((state) => ({
          chats: state.chats.map((chat) =>
            chat.id === chatId
              ? {
                  ...chat,
                  messages: [...chat.messages, message],
                  updatedAt: new Date(),
                }
              : chat,
          ),
        })),
      setActiveChat: (id) => set({ activeChat: id }),
      setIsTyping: (isTyping) => set({ isTyping }),
    }),
    {
      name: "chat-store",
    },
  ),
)

