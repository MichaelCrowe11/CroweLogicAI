import { getUser } from "@/lib/auth"
import { getChatResponse } from "@/lib/ai"
import { addMessageToChat, createChat, getChat } from "@/lib/redis"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()
    const { id: userId } = await getUser()

    // Validate input
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return Response.json({ error: "Messages are required" }, { status: 400 })
    }

    // Get or create chat
    let currentChatId = chatId
    if (!currentChatId) {
      const newChat = await createChat(userId)
      currentChatId = newChat.id
    }

    // Add user message to chat
    const userMessage = messages[messages.length - 1]
    if (!userMessage || !userMessage.content) {
      return Response.json({ error: "Invalid message format" }, { status: 400 })
    }

    await addMessageToChat(userId, currentChatId, {
      role: "user",
      content: userMessage.content,
    })

    // Get chat history for context
    const chat = await getChat(userId, currentChatId)
    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 })
    }

    // Check if OpenAI API key is configured
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your-openai-api-key-here') {
      // Return a helpful error message for missing API key
      const errorMessage = "I'm not fully configured yet. To enable chat functionality, please:\n\n1. Get an OpenAI API key from https://platform.openai.com/api-keys\n2. Add it to your .env.local file as OPENAI_API_KEY=your-key-here\n3. Restart the development server\n\nOnce configured, I'll be able to help you with mycology questions and farm management!"
      
      await addMessageToChat(userId, currentChatId, {
        role: "assistant",
        content: errorMessage,
      })

      return Response.json({ 
        error: "OpenAI API key not configured",
        message: errorMessage 
      }, { status: 503 })
    }

    try {
      // Stream the response
      const result = await getChatResponse(chat.messages)

      // Save assistant response to chat history
      result.text.then(async (content) => {
        await addMessageToChat(userId, currentChatId, {
          role: "assistant",
          content,
        })
      }).catch(error => {
        console.error("Error saving assistant message:", error)
      })

      // Return response with chat ID
      const responseStream = result.toDataStreamResponse()
      const headers = new Headers(responseStream.headers)
      headers.set("X-Chat-Id", currentChatId)

      return new Response(responseStream.body, {
        headers,
        status: responseStream.status,
        statusText: responseStream.statusText,
      })
    } catch (aiError) {
      console.error("AI Error:", aiError)
      
      // Provide a helpful fallback response
      const fallbackMessage = "I'm having trouble connecting to my AI service right now. This could be due to:\n\n1. Invalid or expired OpenAI API key\n2. Network connectivity issues\n3. OpenAI service temporarily unavailable\n\nPlease check your API key configuration and try again in a moment."
      
      await addMessageToChat(userId, currentChatId, {
        role: "assistant",
        content: fallbackMessage,
      })

      return Response.json({ 
        error: "AI service unavailable",
        message: fallbackMessage 
      }, { status: 503 })
    }
  } catch (error) {
    console.error("Error in chat API:", error)
    return Response.json({ 
      error: "Failed to process chat request",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
}