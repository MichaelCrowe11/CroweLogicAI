import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crowe Logic AI - Mycology & Environmental Intelligence",
  description: "Expert AI for mycology, environmental intelligence, and business strategy",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-mycelium`}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <SidebarProvider>
            {children}
          </SidebarProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}