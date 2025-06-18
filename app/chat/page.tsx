import dynamic from 'next/dynamic'

const ChatInterface = dynamic(
  () => import("@/components/chat/chat-interface").then(mod => ({ default: mod.ChatInterface })),
  { ssr: false }
)

export default function ChatPage() {
  return <ChatInterface />
}