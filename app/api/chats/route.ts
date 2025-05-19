import { getUser } from "@/lib/auth"
import { getUserChats } from "@/lib/redis"

export async function GET() {
  try {
    const { id: userId } = await getUser()
    const chats = await getUserChats(userId)

    return Response.json({ chats })
  } catch (error) {
    console.error("Error fetching chats:", error)
    return Response.json({ error: "Failed to fetch chats" }, { status: 500 })
  }
}
