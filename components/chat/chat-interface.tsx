"use client"

import type React from "react"

import { useChat } from "ai/react"
import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Send, Mic, PaperclipIcon } from "lucide-react"
import Image from "next/image"

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
        router.push(`/chat?id=${newChatId}`)
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
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto">
      {messages.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-1 p-8">
          <div className="relative w-24 h-24 mb-4 rounded-full border-4 border-earth-mushroom overflow-hidden">
            <Image src="/images/crowe-avatar.png" alt="Crowe Logic AI" fill className="object-cover" />
          </div>
          <h2 className="text-xl font-semibold text-center">
            Expert AI for mycology, environmental intelligence, and business strategy.
          </h2>
          <p className="text-muted-foreground mt-2 text-center">By Michael Crowe</p>
          <div className="mt-8 max-w-md w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="flex items-start justify-start h-auto p-4 text-left"
                onClick={() => setInputValue("How do I identify contamination in my mycelium?")}
              >
                <div>
                  <p className="font-medium">Identify contamination</p>
                  <p className="text-sm text-muted-foreground">Learn to spot common contaminants</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-start justify-start h-auto p-4 text-left"
                onClick={() => setInputValue("What are the optimal fruiting conditions for oyster mushrooms?")}
              >
                <div>
                  <p className="font-medium">Fruiting conditions</p>
                  <p className="text-sm text-muted-foreground">Optimize for better yields</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-start justify-start h-auto p-4 text-left"
                onClick={() => setInputValue("How do I prepare hardwood substrate for shiitake cultivation?")}
              >
                <div>
                  <p className="font-medium">Substrate preparation</p>
                  <p className="text-sm text-muted-foreground">Learn proper techniques</p>
                </div>
              </Button>
              <Button
                variant="outline"
                className="flex items-start justify-start h-auto p-4 text-left"
                onClick={() => setInputValue("What's the best way to scale up my mushroom farm?")}
              >
                <div>
                  <p className="font-medium">Farm scaling</p>
                  <p className="text-sm text-muted-foreground">Grow your operation efficiently</p>
                </div>
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} ${
                index === 0 && message.role === "assistant" ? "pt-4" : ""
              }`}
            >
              {message.role === "assistant" && (
                <div className="relative w-8 h-8 mr-2 rounded-full overflow-hidden border-2 border-earth-mushroom flex-shrink-0">
                  <Image src="/images/crowe-avatar.png" alt="Crowe Logic AI" fill className="object-cover" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-lg p-4 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}

      <div className="p-4 border-t">
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
            placeholder="Ask about mycology, cultivation techniques, or farm management..."
            className="flex-1 min-h-[50px] max-h-[200px] resize-none"
          />
          <div className="flex gap-2">
            <Button type="button" variant="outline" size="icon" className="rounded-full">
              <PaperclipIcon className="h-5 w-5" />
            </Button>
            <Button type="button" variant="outline" size="icon" className="rounded-full">
              <Mic className="h-5 w-5" />
            </Button>
            <Button type="submit" className="rounded-full" disabled={isLoading || !inputValue.trim()}>
              <Send className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
