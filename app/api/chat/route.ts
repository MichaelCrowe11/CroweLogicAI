import { getUser } from "@/lib/auth"
import { getChatResponse } from "@/lib/ai"
import { addMessageToChat, createChat, getChat } from "@/lib/redis"

export const maxDuration = 60

export async function POST(req: Request) {
  try {
    const { messages, chatId } = await req.json()
    const { id: userId } = await getUser()

    // Get or create chat
    let currentChatId = chatId
    if (!currentChatId) {
      const newChat = await createChat(userId)
      currentChatId = newChat.id
    }

    // Add user message to chat
    const userMessage = messages[messages.length - 1]
    await addMessageToChat(userId, currentChatId, {
      role: "user",
      content: userMessage.content,
    })

    // Get chat history for context
    const chat = await getChat(userId, currentChatId)
    if (!chat) {
      return Response.json({ error: "Chat not found" }, { status: 404 })
    }

    // Stream the response
    const result = await getChatResponse(chat.messages)

    // Save assistant response to chat history
    result.text.then(async (content) => {
      await addMessageToChat(userId, currentChatId, {
        role: "assistant",
        content,
      })
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
  } catch (error) {
    console.error("Error in chat API:", error)
    return Response.json({ error: "Failed to process chat request" }, { status: 500 })
  }
}
