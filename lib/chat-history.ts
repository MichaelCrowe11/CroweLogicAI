import redis from "./redis"
import { nanoid } from "nanoid"

export type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: number
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  userId: string
}

export async function createChat(userId: string): Promise<Chat> {
  const id = nanoid()
  const chat: Chat = {
    id,
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    userId,
  }

  await redis.hset(`chats:${userId}`, { [id]: JSON.stringify(chat) })
  return chat
}

export async function getChat(userId: string, chatId: string): Promise<Chat | null> {
  const chat = await redis.hget(`chats:${userId}`, chatId)
  return chat ? JSON.parse(chat as string) : null
}

export async function updateChat(userId: string, chatId: string, chat: Partial<Chat>): Promise<void> {
  const existingChat = await getChat(userId, chatId)
  if (!existingChat) return

  const updatedChat = {
    ...existingChat,
    ...chat,
    messages: chat.messages || existingChat.messages,
  }

  await redis.hset(`chats:${userId}`, { [chatId]: JSON.stringify(updatedChat) })
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const chats = await redis.hgetall(`chats:${userId}`)
  return Object.values(chats || {})
    .map((chat) => JSON.parse(chat as string))
    .sort((a, b) => b.createdAt - a.createdAt)
}

export async function addMessageToChat(
  userId: string,
  chatId: string,
  message: Omit<Message, "id" | "createdAt">,
): Promise<Message> {
  const chat = await getChat(userId, chatId)
  if (!chat) throw new Error("Chat not found")

  const newMessage: Message = {
    id: nanoid(),
    createdAt: Date.now(),
    ...message,
  }

  const updatedMessages = [...chat.messages, newMessage]

  // Update chat title if it's the first user message
  let title = chat.title
  if (chat.title === "New Chat" && message.role === "user") {
    title = message.content.slice(0, 100)
  }

  await updateChat(userId, chatId, {
    messages: updatedMessages,
    title,
  })

  return newMessage
}
