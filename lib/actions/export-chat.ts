"use server"

import type { Chat } from "@/lib/store/chatStore"

export async function exportChatToText(chat: Chat): Promise<string> {
  let exportText = `# ${chat.title}\n`
  exportText += `Date: ${new Date(chat.createdAt).toLocaleString()}\n\n`

  chat.messages.forEach((message) => {
    const role = message.role === "user" ? "You" : "AI Assistant"
    exportText += `${role}: ${message.content}\n\n`
  })

  return exportText
}

export async function exportChatToJSON(chat: Chat): Promise<string> {
  return JSON.stringify(chat, null, 2)
}

export async function exportChatToHTML(chat: Chat): Promise<string> {
  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>${chat.title}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        h1 { color: #333; }
        .message { margin-bottom: 20px; padding: 10px; border-radius: 5px; }
        .user { background-color: #e6f7ff; text-align: right; }
        .assistant { background-color: #f0f0f0; }
        .meta { color: #888; font-size: 12px; margin-bottom: 5px; }
      </style>
    </head>
    <body>
      <h1>${chat.title}</h1>
      <p class="meta">Exported on ${new Date().toLocaleString()}</p>
      <div class="chat">
  `

  chat.messages.forEach((message) => {
    const className = message.role === "user" ? "user" : "assistant"
    const role = message.role === "user" ? "You" : "AI Assistant"
    const time = new Date(message.createdAt).toLocaleTimeString()

    html += `
      <div class="message ${className}">
        <div class="meta">${role} - ${time}</div>
        <div class="content">${message.content.replace(/\n/g, "<br>")}</div>
      </div>
    `
  })

  html += `
      </div>
    </body>
    </html>
  `

  return html
}

