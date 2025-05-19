"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Menu, RefreshCw } from "lucide-react"

interface ChatHeaderProps {
  onMenuToggle: () => void
}

export function ChatHeader({ onMenuToggle }: ChatHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-white border-b">
      <Button variant="ghost" size="icon" onClick={onMenuToggle}>
        <Menu className="h-5 w-5" />
      </Button>

      <Link href="/" className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Crowe Logic AI</h1>
      </Link>

      <Button variant="ghost" size="icon">
        <RefreshCw className="h-5 w-5" />
      </Button>
    </header>
  )
}
