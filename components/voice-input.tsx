"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff, Loader2 } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  isDisabled?: boolean
}

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}

export function VoiceInput({ onTranscript, isDisabled = false }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false)
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null)
  const [isSupported, setIsSupported] = useState(true)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    // Check if browser supports SpeechRecognition
    if (typeof window !== "undefined") {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

      if (SpeechRecognition) {
        const recognition = new SpeechRecognition()
        recognition.continuous = true
        recognition.interimResults = true
        recognition.lang = "en-US"

        recognition.onstart = () => {
          setIsListening(true)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognition.onerror = (event) => {
          console.error("Speech recognition error", event.error)
          setIsListening(false)
          toast({
            title: "Error",
            description: `Speech recognition error: ${event.error}`,
            variant: "destructive",
          })
        }

        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map((result) => result[0])
            .map((result) => result.transcript)
            .join("")

          if (event.results[0].isFinal) {
            onTranscript(transcript)
            stopListening()
          }
        }

        setRecognition(recognition)
      } else {
        setIsSupported(false)
        toast({
          title: "Not Supported",
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        })
      }
    }

    return () => {
      if (recognition) {
        recognition.abort()
      }
    }
  }, [onTranscript])

  const toggleListening = () => {
    if (isListening) {
      stopListening()
    } else {
      startListening()
    }
  }

  const startListening = () => {
    if (recognition && !isListening && !isDisabled) {
      try {
        setIsProcessing(true)
        recognition.start()
        toast({
          title: "Listening",
          description: "Speak now...",
        })
      } catch (error) {
        console.error("Error starting speech recognition:", error)
      } finally {
        setIsProcessing(false)
      }
    }
  }

  const stopListening = () => {
    if (recognition && isListening) {
      try {
        recognition.stop()
      } catch (error) {
        console.error("Error stopping speech recognition:", error)
      }
    }
  }

  if (!isSupported) {
    return null
  }

  return (
    <Button
      type="button"
      variant={isListening ? "destructive" : "outline"}
      size="icon"
      onClick={toggleListening}
      disabled={isDisabled || isProcessing}
      className={isListening ? "animate-pulse" : ""}
      title={isListening ? "Stop listening" : "Start voice input"}
    >
      {isProcessing ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : isListening ? (
        <MicOff className="h-4 w-4" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
      <span className="sr-only">{isListening ? "Stop voice input" : "Start voice input"}</span>
    </Button>
  )
}

