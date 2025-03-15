import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import type { NextRequest } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 60 // 60 seconds timeout

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    // Define system message for the AI assistant
    const systemMessage = `You are NexusTalk, an advanced AI assistant designed to be helpful, informative, and engaging.
    
    Your capabilities include:
    - Answering questions on a wide range of topics
    - Providing detailed explanations and information
    - Assisting with problem-solving and creative tasks
    - Engaging in natural, conversational dialogue
    - Helping with coding and technical questions
    
    Always be respectful, accurate, and helpful. If you don't know something, be honest about it.
    Avoid generating harmful, illegal, unethical or deceptive content.
    
    Respond in a conversational, friendly tone while maintaining professionalism.`

    // Stream the response
    const result = streamText({
      model: openai("gpt-3.5-turbo"),
      messages,
      system: systemMessage,
      temperature: 0.7,
      maxTokens: 1000,
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process chat request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

