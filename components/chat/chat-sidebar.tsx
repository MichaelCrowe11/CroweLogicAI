"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare, Search } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import type { Chat } from "@/lib/redis"

export function ChatSidebar() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentChatId = searchParams.get("id")
  const [chats, setChats] = useState<Chat[]>([])
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    async function fetchChats() {
      try {
        const response = await fetch("/api/chats")
        const data = await response.json()
        if (data.chats) {
          setChats(data.chats)
        }
      } catch (error) {
        console.error("Error fetching chats:", error)
      }
    }

    fetchChats()
  }, [currentChatId])

  const handleNewChat = () => {
    router.push("/chat")
  }

  const filteredChats = chats.filter((chat) => chat.title.toLowerCase().includes(searchQuery.toLowerCase()))

  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 border-b">
        <Button onClick={handleNewChat} className="w-full" variant="default">
          <PlusCircle className="h-4 w-4 mr-2" />
          New Chat
        </Button>
      </div>

      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredChats.length > 0 ? (
          <div className="space-y-1">
            {filteredChats.map((chat) => (
              <Link
                key={chat.id}
                href={`/chat?id=${chat.id}`}
                className={`flex items-center gap-2 p-2 rounded-md hover:bg-muted ${
                  currentChatId === chat.id ? "bg-muted" : ""
                }`}
              >
                <MessageSquare className="h-4 w-4 flex-shrink-0" />
                <span className="truncate text-sm">{chat.title}</span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-4">
            {searchQuery ? "No chats found" : "No chats yet"}
          </div>
        )}
      </div>
    </div>
  )
}
