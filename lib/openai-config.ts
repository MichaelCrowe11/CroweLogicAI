import { openai } from "@ai-sdk/openai"

// Validate OpenAI API key
if (!process.env.OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY environment variable is required")
}

// Export configured OpenAI instance
export const openaiClient = openai({
  apiKey: process.env.OPENAI_API_KEY,
})

// Test function to verify OpenAI connection
export async function testOpenAIConnection() {
  try {
    // Simple test to verify the API key works
    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
    })
    
    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} ${response.statusText}`)
    }
    
    return { success: true, message: "OpenAI connection successful" }
  } catch (error) {
    console.error("OpenAI connection test failed:", error)
    return { success: false, message: error instanceof Error ? error.message : "Unknown error" }
  }
}