import type React from "react"
import { Sidebar } from "@/components/ui/sidebar"

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 lg:ml-64 p-6">{children}</div>
    </div>
  )
}
