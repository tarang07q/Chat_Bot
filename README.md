# Chat Bot

## Overview
Chat Bot is an AI-powered conversational assistant built using **Next.js**, **React**, and **Framer Motion**. This project allows users to manage chat conversations, search through messages, and interact seamlessly with an AI assistant.

## Features
- 🔐 **User Authentication**: Secure login/logout functionality.
- 💬 **Chat Management**: Create, delete, and search for conversations.
- ⚡ **Real-time Updates**: Interactive UI powered by state management.
- 🎨 **Beautiful UI**: Styled with TailwindCSS and Framer Motion animations.

## Tech Stack
- **Frontend:** Next.js, React, TailwindCSS
- **State Management:** Zustand (`useChatStore`, `useAuthStore`)
- **Icons:** Lucide-react
- **Animation:** Framer Motion

## Installation & Setup
To get started, clone the repository and install dependencies:

```sh
# Clone the repository
git clone https://github.com/tarang07q/Chat_Bot.git

# Navigate into the project
cd Chat_Bot

# Install dependencies
npm install
```

## Running the App
To start the development server, run:

```sh
npm run dev
```
Then, open `http://localhost:3000` in your browser.

## Usage
1. **Login**: Authenticate yourself before accessing chats.
2. **Start a Conversation**: Click **New Conversation** to initiate a chat.
3. **Search Chats**: Use the search bar to find past conversations.
4. **Delete Chats**: Remove unwanted chats easily.

## Project Structure
```
.nexustalk/
├── .next/                 # Next.js build output
├── app/
│   ├── api/chat/          # API routes for chat
│   ├── dashboard/         # Dashboard components
│   ├── chat/
│   │   ├── loading.tsx
│   │   ├── page.tsx
│   ├── login/
│   │   ├── page.tsx
│   ├── signup/
│   │   ├── page.tsx
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Main layout file
│   ├── page.tsx           # Entry point
├── components/
│   ├── ui/
│   │   ├── chat-settings-dialog.tsx
│   │   ├── export-chat-dialog.tsx
│   │   ├── navbar.tsx
│   │   ├── providers.tsx
│   │   ├── share-chat-dialog.tsx
│   │   ├── theme-provider.tsx
│   │   ├── toaster.tsx
│   │   ├── voice-input.tsx
├── hooks/
│   ├── use-mobile.tsx
│   ├── use-toasts.ts
├── lib/
├── node_modules/
├── public/                # Static assets
├── styles/
├── .gitignore             # Git ignore file
├── components.json        # Component config
├── next-env.d.ts          # Next.js environment types
├── next.config.mjs        # Next.js configuration
├── package.json           # Project dependencies
├── postcss.config.js      # PostCSS configuration
├── README.md              # Project documentation
├── tailwind.config.ts     # TailwindCSS configuration
├── tsconfig.json          # TypeScript configuration
```

## Future Enhancements
- 🌍 **Multilingual Support**
- 🗂 **Chat Categories & Labels**
- 📊 **Chat Statistics & Insights**

## Contributing
Feel free to contribute! Fork the repo, make changes, and submit a PR.

## License
This project is open-source and available under the [MIT License](LICENSE).

---
### ⭐ Show Your Support
If you find this project helpful, please consider giving it a **star ⭐** on GitHub!

