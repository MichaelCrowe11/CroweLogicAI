"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Image from "next/image"

export default function Home() {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex min-h-screen flex-col">
        <main className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="mx-auto w-24 h-24 relative rounded-full border-4 border-earth-mushroom overflow-hidden bg-gray-200 animate-pulse">
            </div>
            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="mx-auto w-24 h-24 relative rounded-full border-4 border-earth-mushroom overflow-hidden">
            <Image src="/images/crowe-avatar.png" alt="Crowe Logic AI" fill className="object-cover" />
          </div>

          <h1 className="text-3xl font-bold">Crowe Logic AI</h1>

          <p className="text-xl">Expert AI for mycology, environmental intelligence, and business strategy.</p>

          <p className="text-sm text-muted-foreground">By Michael Crowe</p>

          <div className="pt-4">
            <Link href="/chat">
              <Button size="lg" className="w-full">
                Start Chatting
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="pt-2">
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="w-full">
                Go to Dashboard
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground pt-6">First Edition 2025 [^3]</p>
        </div>
      </main>
    </div>
  )
}