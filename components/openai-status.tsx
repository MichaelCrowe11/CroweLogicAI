"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export function OpenAIStatus() {
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState("")
  const [lastChecked, setLastChecked] = useState<string>("")

  const checkOpenAIStatus = async () => {
    setStatus("loading")
    try {
      const response = await fetch("/api/test-openai")
      const data = await response.json()
      
      if (data.status === "success") {
        setStatus("success")
        setMessage(data.message)
        setLastChecked(new Date().toLocaleTimeString())
      } else {
        setStatus("error")
        setMessage(data.message)
      }
    } catch (error) {
      setStatus("error")
      setMessage("Failed to connect to OpenAI API")
    }
  }

  useEffect(() => {
    checkOpenAIStatus()
  }, [])

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          OpenAI Integration Status
          {status === "loading" && <Loader2 className="h-4 w-4 animate-spin" />}
          {status === "success" && <CheckCircle className="h-4 w-4 text-green-500" />}
          {status === "error" && <XCircle className="h-4 w-4 text-red-500" />}
        </CardTitle>
        <CardDescription>
          Check if your OpenAI API key is properly configured
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Badge variant={status === "success" ? "default" : status === "error" ? "destructive" : "secondary"}>
            {status === "loading" ? "Checking..." : status === "success" ? "Connected" : "Error"}
          </Badge>
          {lastChecked && (
            <span className="text-sm text-muted-foreground">
              Last checked: {lastChecked}
            </span>
          )}
        </div>
        
        <p className="text-sm">{message}</p>
        
        <Button onClick={checkOpenAIStatus} disabled={status === "loading"} size="sm">
          {status === "loading" ? "Checking..." : "Test Connection"}
        </Button>

        {status === "error" && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <h4 className="font-medium text-red-800 mb-2">Troubleshooting Steps:</h4>
            <ul className="text-sm text-red-700 space-y-1">
              <li>1. Make sure your OpenAI API key is set in .env.local</li>
              <li>2. Verify the API key starts with "sk-"</li>
              <li>3. Check that you have credits available in your OpenAI account</li>
              <li>4. Restart your development server after adding the key</li>
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}