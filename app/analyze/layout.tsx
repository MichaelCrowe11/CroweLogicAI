import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function AnalyzeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-10 flex items-center p-4 bg-white border-b">
        <Link href="/">
          <Button variant="ghost" size="sm" className="flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Chat</span>
          </Button>
        </Link>
        <h1 className="text-xl font-semibold mx-auto">Crowe Logic AI</h1>
      </header>

      <main className="pt-16">{children}</main>
    </div>
  )
}
