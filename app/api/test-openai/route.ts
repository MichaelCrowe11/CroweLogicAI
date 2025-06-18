import { testOpenAIConnection } from "@/lib/openai-config"

export async function GET() {
  try {
    const result = await testOpenAIConnection()
    
    if (result.success) {
      return Response.json({ 
        status: "success", 
        message: "OpenAI API key is working correctly",
        timestamp: new Date().toISOString()
      })
    } else {
      return Response.json({ 
        status: "error", 
        message: result.message 
      }, { status: 400 })
    }
  } catch (error) {
    console.error("OpenAI test error:", error)
    return Response.json({ 
      status: "error", 
      message: "Failed to test OpenAI connection" 
    }, { status: 500 })
  }
}