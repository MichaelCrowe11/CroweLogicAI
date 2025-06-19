import dynamic from 'next/dynamic'

const ChatInterface = dynamic(
  () => import("@/components/chat/chat-interface").then(mod => ({ default: mod.ChatInterface })),
  { 
    ssr: false,
    loading: () => (
      <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="relative w-24 h-24 mb-4 rounded-full border-4 border-earth-mushroom overflow-hidden bg-gray-200 animate-pulse">
          </div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-64 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded animate-pulse w-32"></div>
        </div>
        <div className="p-4 border-t">
          <div className="flex items-end gap-2">
            <div className="flex-1 h-[50px] bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
      </div>
    )
  }
)

export default function ChatPage() {
  return <ChatInterface />
}