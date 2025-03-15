"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowRight, Bot, MessageSquare, Shield, Zap, Code, Globe, Brain } from "lucide-react"
import { useAuthStore } from "@/lib/store/authStore"
import { useRouter } from "next/navigation"

export default function HomePage() {
  const { isAuthenticated } = useAuthStore()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="flex flex-col min-h-[calc(100vh-4rem)]">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
            <motion.div
              className="flex flex-col justify-center space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none">
                  Welcome to NexusTalk
                </h1>
                <p className="max-w-[600px] text-muted-foreground md:text-xl">
                  Your AI-powered conversation companion. Ask questions, get information, or just chat with our advanced
                  AI assistant.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="gap-2">
                  <Link href={isAuthenticated ? "/chat" : "/login"}>
                    Start Chatting <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link href="#features">Learn More</Link>
                </Button>
              </div>
            </motion.div>
            <motion.div
              className="mx-auto w-full max-w-[500px] lg:max-w-none"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="aspect-video overflow-hidden rounded-xl bg-background shadow-xl">
                <div className="flex h-full flex-col">
                  <div className="flex h-12 items-center border-b px-4">
                    <div className="flex items-center gap-2">
                      <Bot className="h-5 w-5 text-primary" />
                      <span className="font-medium">NexusTalk Assistant</span>
                    </div>
                  </div>
                  <div className="flex-1 p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-sm">
                        Hello! I'm your AI assistant. How can I help you today?
                      </div>
                    </div>
                    <div className="flex items-start justify-end gap-3">
                      <div className="rounded-lg bg-primary p-3 text-sm text-primary-foreground">
                        Can you tell me about the features of NexusTalk?
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
                        <MessageSquare className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </div>
                      <div className="rounded-lg bg-muted p-3 text-sm">
                        NexusTalk offers real-time AI conversations, voice input, chat export, and much more!
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Features</div>
              <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need</h2>
              <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                NexusTalk combines cutting-edge AI with a seamless user experience to provide the best conversational AI
                platform.
              </p>
            </div>
          </div>
          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
            <motion.div
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Brain className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Advanced AI</h3>
              <p className="text-center text-muted-foreground">
                Powered by state-of-the-art language models for intelligent, context-aware responses.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Real-time Chat</h3>
              <p className="text-center text-muted-foreground">
                Instant responses with real-time typing indicators and message delivery.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Shield className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Secure & Private</h3>
              <p className="text-center text-muted-foreground">
                Your conversations are secure and your data remains private.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Code className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Code Assistance</h3>
              <p className="text-center text-muted-foreground">
                Get help with coding problems, debugging, and learning new programming concepts.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Globe className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Knowledge Base</h3>
              <p className="text-center text-muted-foreground">
                Access a vast knowledge base covering a wide range of topics and subjects.
              </p>
            </motion.div>
            <motion.div
              className="flex flex-col items-center space-y-2 rounded-lg border p-6 shadow-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <MessageSquare className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Voice Input</h3>
              <p className="text-center text-muted-foreground">
                Speak to your AI assistant with voice input for a more natural interaction.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Ready to Get Started?</h2>
              <p className="max-w-[600px] text-muted-foreground md:text-xl">
                Join thousands of users already enhancing their productivity with NexusTalk.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link href={isAuthenticated ? "/chat" : "/login"}>
                  Start Chatting <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-6 border-t">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:gap-6">
            <p className="text-center text-sm text-muted-foreground">
              © {new Date().getFullYear()} NexusTalk. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

