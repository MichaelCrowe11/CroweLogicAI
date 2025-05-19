import { Redis } from "@upstash/redis"
import { nanoid } from "nanoid"

// Initialize Redis client
const redis = new Redis({
  url: process.env.KV_REST_API_URL || "",
  token: process.env.KV_REST_API_TOKEN || "",
})

export default redis

// Types
export type Message = {
  id: string
  role: "user" | "assistant" | "system"
  content: string
  createdAt: number
}

export type Chat = {
  id: string
  title: string
  messages: Message[]
  createdAt: number
  updatedAt: number
  userId: string
}

export type Task = {
  id: string
  title: string
  description: string
  status: "pending" | "completed" | "in-progress"
  priority: "low" | "medium" | "high"
  dueDate?: number
  createdAt: number
  updatedAt: number
  userId: string
  farmId?: string
}

export type Farm = {
  id: string
  name: string
  description: string
  location: string
  size: string
  createdAt: number
  updatedAt: number
  userId: string
  strains: Strain[]
  environmentalData?: EnvironmentalData
}

export type Strain = {
  id: string
  name: string
  type: string
  description: string
  growthRate: string
  preferredSubstrate: string
  optimalConditions: {
    temperature: string
    humidity: string
    light: string
    co2: string
  }
  createdAt: number
  farmId: string
}

export type EnvironmentalData = {
  temperature: number
  humidity: number
  co2: number
  light: number
  timestamp: number
}

export type Analysis = {
  id: string
  type: "mycelium" | "substrate" | "fruiting" | "contamination"
  imageUrl: string
  results: any
  createdAt: number
  userId: string
  farmId?: string
  strainId?: string
}

// Chat functions
export async function createChat(userId: string): Promise<Chat> {
  const id = nanoid()
  const chat: Chat = {
    id,
    title: "New Chat",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
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
    updatedAt: Date.now(),
  }

  await redis.hset(`chats:${userId}`, { [chatId]: JSON.stringify(updatedChat) })
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  const chats = await redis.hgetall(`chats:${userId}`)
  return Object.values(chats || {})
    .map((chat) => JSON.parse(chat as string))
    .sort((a, b) => b.updatedAt - a.updatedAt)
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

// Task functions
export async function createTask(task: Omit<Task, "id" | "createdAt" | "updatedAt">): Promise<Task> {
  const id = nanoid()
  const newTask: Task = {
    id,
    ...task,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  await redis.hset(`tasks:${task.userId}`, { [id]: JSON.stringify(newTask) })
  return newTask
}

export async function getTask(userId: string, taskId: string): Promise<Task | null> {
  const task = await redis.hget(`tasks:${userId}`, taskId)
  return task ? JSON.parse(task as string) : null
}

export async function updateTask(userId: string, taskId: string, task: Partial<Task>): Promise<void> {
  const existingTask = await getTask(userId, taskId)
  if (!existingTask) return

  const updatedTask = {
    ...existingTask,
    ...task,
    updatedAt: Date.now(),
  }

  await redis.hset(`tasks:${userId}`, { [taskId]: JSON.stringify(updatedTask) })
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  const tasks = await redis.hgetall(`tasks:${userId}`)
  return Object.values(tasks || {})
    .map((task) => JSON.parse(task as string))
    .sort((a, b) => {
      // Sort by status first (pending, in-progress, completed)
      const statusOrder = { pending: 0, "in-progress": 1, completed: 2 }
      const statusDiff = statusOrder[a.status] - statusOrder[b.status]
      if (statusDiff !== 0) return statusDiff

      // Then by priority (high, medium, low)
      const priorityOrder = { high: 0, medium: 1, low: 2 }
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
      if (priorityDiff !== 0) return priorityDiff

      // Finally by due date (if available)
      if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate
      if (a.dueDate) return -1
      if (b.dueDate) return 1

      // Default to creation date
      return a.createdAt - b.createdAt
    })
}

// Farm functions
export async function createFarm(farm: Omit<Farm, "id" | "createdAt" | "updatedAt" | "strains">): Promise<Farm> {
  const id = nanoid()
  const newFarm: Farm = {
    id,
    ...farm,
    strains: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  await redis.hset(`farms:${farm.userId}`, { [id]: JSON.stringify(newFarm) })
  return newFarm
}

export async function getFarm(userId: string, farmId: string): Promise<Farm | null> {
  const farm = await redis.hget(`farms:${userId}`, farmId)
  return farm ? JSON.parse(farm as string) : null
}

export async function updateFarm(userId: string, farmId: string, farm: Partial<Farm>): Promise<void> {
  const existingFarm = await getFarm(userId, farmId)
  if (!existingFarm) return

  const updatedFarm = {
    ...existingFarm,
    ...farm,
    strains: farm.strains || existingFarm.strains,
    updatedAt: Date.now(),
  }

  await redis.hset(`farms:${userId}`, { [farmId]: JSON.stringify(updatedFarm) })
}

export async function getUserFarms(userId: string): Promise<Farm[]> {
  const farms = await redis.hgetall(`farms:${userId}`)
  return Object.values(farms || {})
    .map((farm) => JSON.parse(farm as string))
    .sort((a, b) => b.updatedAt - a.updatedAt)
}

// Strain functions
export async function addStrainToFarm(
  userId: string,
  farmId: string,
  strain: Omit<Strain, "id" | "createdAt" | "farmId">,
): Promise<Strain> {
  const farm = await getFarm(userId, farmId)
  if (!farm) throw new Error("Farm not found")

  const id = nanoid()
  const newStrain: Strain = {
    id,
    ...strain,
    createdAt: Date.now(),
    farmId,
  }

  const updatedStrains = [...farm.strains, newStrain]
  await updateFarm(userId, farmId, { strains: updatedStrains })

  return newStrain
}

// Analysis functions
export async function saveAnalysis(analysis: Omit<Analysis, "id" | "createdAt">): Promise<Analysis> {
  const id = nanoid()
  const newAnalysis: Analysis = {
    id,
    ...analysis,
    createdAt: Date.now(),
  }

  await redis.lpush(`analyses:${analysis.userId}`, JSON.stringify(newAnalysis))
  return newAnalysis
}

export async function getUserAnalyses(userId: string, limit = 10): Promise<Analysis[]> {
  const analyses = await redis.lrange(`analyses:${userId}`, 0, limit - 1)
  return analyses.map((analysis) => JSON.parse(analysis))
}

// Environmental data functions
export async function saveEnvironmentalData(
  userId: string,
  farmId: string,
  data: Omit<EnvironmentalData, "timestamp">,
): Promise<void> {
  const farm = await getFarm(userId, farmId)
  if (!farm) throw new Error("Farm not found")

  const environmentalData: EnvironmentalData = {
    ...data,
    timestamp: Date.now(),
  }

  await updateFarm(userId, farmId, { environmentalData })

  // Also save historical data
  await redis.lpush(`env:${farmId}`, JSON.stringify(environmentalData))
  // Keep only last 1000 readings
  await redis.ltrim(`env:${farmId}`, 0, 999)
}

export async function getEnvironmentalHistory(farmId: string, limit = 100): Promise<EnvironmentalData[]> {
  const data = await redis.lrange(`env:${farmId}`, 0, limit - 1)
  return data.map((item) => JSON.parse(item))
}
