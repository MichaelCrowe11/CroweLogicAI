"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic } from "lucide-react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"

export function ChatInterface() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const chatId = searchParams.get("id")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [inputValue, setInputValue] = useState("")

  const { messages, input, handleInputChange, handleSubmit, isLoading, setMessages } = useChat({
    api: "/api/chat",
    body: { chatId },
    onResponse: (response) => {
      // Get chat ID from response headers
      const newChatId = response.headers.get("X-Chat-Id")
      if (newChatId && !chatId) {
        router.push(`/?id=${newChatId}`)
      }
    },
  })

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle form submission
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputValue.trim()) {
      handleSubmit(e)
      setInputValue("")
    }
  }

  return (
    <div className="flex flex-col h-full pt-16 pb-20">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="relative w-24 h-24 mb-4 rounded-full border-4 border-amber-500 overflow-hidden">
            <Image src="/images/crowe-avatar.png" alt="Crowe Logic AI" fill className="object-cover" />
          </div>
          <h2 className="text-xl font-semibold text-center">
            Expert AI for mycology, environmental intelligence, and business strategy.
          </h2>
          <p className="text-gray-500 mt-2 text-center">By Michael Crowe</p>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4">
          {messages.map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
              {message.role === "assistant" && index === 1 && (
                <div className="flex items-center mb-2">
                  <div className="relative w-8 h-8 mr-2 rounded-full overflow-hidden border-2 border-amber-500">
                    <Image src="/images/crowe-avatar.png" alt="Crowe Logic AI" fill className="object-cover" />
                  </div>
                  <span className="text-sm font-medium">Crowe Logic AI</span>
                </div>
              )}
              <div
                className={`inline-block p-3 rounded-lg max-w-[80%] ${
                  message.role === "user"
                    ? "bg-purple-600 text-white rounded-tr-none"
                    : "bg-gray-100 text-gray-800 rounded-tl-none"
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t">
        <form onSubmit={onSubmit} className="flex items-end gap-2">
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                if (inputValue.trim()) {
                  handleSubmit(e as any)
                  setInputValue("")
                }
              }
            }}
            placeholder="How can Mycelium EI be applied to urban cooling?"
            className="flex-1 min-h-[50px] max-h-[200px] resize-none"
          />
          <div className="flex gap-2">
            <Button type="button" variant="ghost" size="icon" className="rounded-full">
              <Mic className="h-5 w-5" />
            </Button>
            <Button
              type="submit"
              className="rounded-full bg-purple-600 hover:bg-purple-700"
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
