"use server"

import { openai } from "@ai-sdk/openai"
import { generateText } from "ai"

export async function generateTitle(userMessage: string, aiResponse: string): Promise<string> {
  try {
    const prompt = `
    Based on the following conversation, generate a short, descriptive title (3-5 words):
    
    User: ${userMessage}
    
    Assistant: ${aiResponse}
    
    Title:
    `

    const { text } = await generateText({
      model: openai("gpt-3.5-turbo"),
      prompt,
      temperature: 0.7,
      maxTokens: 20,
    })

    // Clean up the title
    let title = text.trim()

    // Remove quotes if present
    if ((title.startsWith('"') && title.endsWith('"')) || (title.startsWith("'") && title.endsWith("'"))) {
      title = title.substring(1, title.length - 1)
    }

    return title || "New Conversation"
  } catch (error) {
    console.error("Error generating title:", error)
    return "New Conversation"
  }
}

