import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Crowe Logic AI - Mycology & Environmental Intelligence",
  description: "Expert AI for mycology, environmental intelligence, and business strategy",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Disable MetaMask detection and other wallet providers
              if (typeof window !== 'undefined') {
                window.ethereum = undefined;
                window.web3 = undefined;
                // Prevent MetaMask injection
                Object.defineProperty(window, 'ethereum', {
                  value: undefined,
                  writable: false,
                  configurable: false
                });
              }
            `,
          }}
        />
      </head>
      <body className={`${inter.className} bg-mycelium`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light" suppressHydrationWarning>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}