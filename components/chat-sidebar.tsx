"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import type { Chat } from "@/lib/chat-history"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatSidebar({ isOpen, onClose }: ChatSidebarProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentChatId = searchParams.get("id")
  const [chats, setChats] = useState<Chat[]>([])

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
    router.push("/")
    onClose()
  }

  return (
    <div
      className={`fixed inset-y-0 left-0 z-20 w-64 bg-white border-r transform transition-transform duration-300 ease-in-out ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex flex-col h-full p-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold">Chats</h2>
          <Button onClick={handleNewChat} variant="ghost" size="sm" className="flex items-center gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New</span>
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {chats.length > 0 ? (
            <ul className="space-y-2">
              {chats.map((chat) => (
                <li key={chat.id}>
                  <Link
                    href={`/?id=${chat.id}`}
                    onClick={onClose}
                    className={`flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 ${
                      currentChatId === chat.id ? "bg-gray-100" : ""
                    }`}
                  >
                    <MessageSquare className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center text-gray-500 py-4">No chats yet</div>
          )}
        </div>
      </div>
    </div>
  )
}
