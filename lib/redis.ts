import { Redis } from "@upstash/redis"
import { nanoid } from "nanoid"

// Initialize Redis client with fallback for development
const redis = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN 
  ? new Redis({
      url: process.env.KV_REST_API_URL,
      token: process.env.KV_REST_API_TOKEN,
    })
  : null

// In-memory fallback for development when Redis is not configured
const memoryStore = new Map()

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

// Helper functions for memory fallback
function getFromMemory(key: string) {
  return memoryStore.get(key)
}

function setInMemory(key: string, value: any) {
  memoryStore.set(key, value)
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

  if (redis) {
    await redis.hset(`chats:${userId}`, { [id]: JSON.stringify(chat) })
  } else {
    const userChats = getFromMemory(`chats:${userId}`) || {}
    userChats[id] = chat
    setInMemory(`chats:${userId}`, userChats)
  }
  
  return chat
}

export async function getChat(userId: string, chatId: string): Promise<Chat | null> {
  if (redis) {
    const chat = await redis.hget(`chats:${userId}`, chatId)
    return chat ? JSON.parse(chat as string) : null
  } else {
    const userChats = getFromMemory(`chats:${userId}`) || {}
    return userChats[chatId] || null
  }
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

  if (redis) {
    await redis.hset(`chats:${userId}`, { [chatId]: JSON.stringify(updatedChat) })
  } else {
    const userChats = getFromMemory(`chats:${userId}`) || {}
    userChats[chatId] = updatedChat
    setInMemory(`chats:${userId}`, userChats)
  }
}

export async function getUserChats(userId: string): Promise<Chat[]> {
  if (redis) {
    const chats = await redis.hgetall(`chats:${userId}`)
    return Object.values(chats || {})
      .map((chat) => JSON.parse(chat as string))
      .sort((a, b) => b.updatedAt - a.updatedAt)
  } else {
    const userChats = getFromMemory(`chats:${userId}`) || {}
    return Object.values(userChats)
      .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
  }
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

  if (redis) {
    await redis.hset(`tasks:${task.userId}`, { [id]: JSON.stringify(newTask) })
  } else {
    const userTasks = getFromMemory(`tasks:${task.userId}`) || {}
    userTasks[id] = newTask
    setInMemory(`tasks:${task.userId}`, userTasks)
  }
  
  return newTask
}

export async function getTask(userId: string, taskId: string): Promise<Task | null> {
  if (redis) {
    const task = await redis.hget(`tasks:${userId}`, taskId)
    return task ? JSON.parse(task as string) : null
  } else {
    const userTasks = getFromMemory(`tasks:${userId}`) || {}
    return userTasks[taskId] || null
  }
}

export async function updateTask(userId: string, taskId: string, task: Partial<Task>): Promise<void> {
  const existingTask = await getTask(userId, taskId)
  if (!existingTask) return

  const updatedTask = {
    ...existingTask,
    ...task,
    updatedAt: Date.now(),
  }

  if (redis) {
    await redis.hset(`tasks:${userId}`, { [taskId]: JSON.stringify(updatedTask) })
  } else {
    const userTasks = getFromMemory(`tasks:${userId}`) || {}
    userTasks[taskId] = updatedTask
    setInMemory(`tasks:${userId}`, userTasks)
  }
}

export async function getUserTasks(userId: string): Promise<Task[]> {
  if (redis) {
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
  } else {
    const userTasks = getFromMemory(`tasks:${userId}`) || {}
    return Object.values(userTasks)
      .sort((a: any, b: any) => {
        const statusOrder = { pending: 0, "in-progress": 1, completed: 2 }
        const statusDiff = statusOrder[a.status] - statusOrder[b.status]
        if (statusDiff !== 0) return statusDiff

        const priorityOrder = { high: 0, medium: 1, low: 2 }
        const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority]
        if (priorityDiff !== 0) return priorityDiff

        if (a.dueDate && b.dueDate) return a.dueDate - b.dueDate
        if (a.dueDate) return -1
        if (b.dueDate) return 1

        return a.createdAt - b.createdAt
      })
  }
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

  if (redis) {
    await redis.hset(`farms:${farm.userId}`, { [id]: JSON.stringify(newFarm) })
  } else {
    const userFarms = getFromMemory(`farms:${farm.userId}`) || {}
    userFarms[id] = newFarm
    setInMemory(`farms:${farm.userId}`, userFarms)
  }
  
  return newFarm
}

export async function getFarm(userId: string, farmId: string): Promise<Farm | null> {
  if (redis) {
    const farm = await redis.hget(`farms:${userId}`, farmId)
    return farm ? JSON.parse(farm as string) : null
  } else {
    const userFarms = getFromMemory(`farms:${userId}`) || {}
    return userFarms[farmId] || null
  }
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

  if (redis) {
    await redis.hset(`farms:${userId}`, { [farmId]: JSON.stringify(updatedFarm) })
  } else {
    const userFarms = getFromMemory(`farms:${userId}`) || {}
    userFarms[farmId] = updatedFarm
    setInMemory(`farms:${userId}`, userFarms)
  }
}

export async function getUserFarms(userId: string): Promise<Farm[]> {
  if (redis) {
    const farms = await redis.hgetall(`farms:${userId}`)
    return Object.values(farms || {})
      .map((farm) => JSON.parse(farm as string))
      .sort((a, b) => b.updatedAt - a.updatedAt)
  } else {
    const userFarms = getFromMemory(`farms:${userId}`) || {}
    return Object.values(userFarms)
      .sort((a: any, b: any) => b.updatedAt - a.updatedAt)
  }
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

  if (redis) {
    await redis.lpush(`analyses:${analysis.userId}`, JSON.stringify(newAnalysis))
  } else {
    const userAnalyses = getFromMemory(`analyses:${analysis.userId}`) || []
    userAnalyses.unshift(newAnalysis)
    setInMemory(`analyses:${analysis.userId}`, userAnalyses)
  }
  
  return newAnalysis
}

export async function getUserAnalyses(userId: string, limit = 10): Promise<Analysis[]> {
  if (redis) {
    const analyses = await redis.lrange(`analyses:${userId}`, 0, limit - 1)
    return analyses.map((analysis) => JSON.parse(analysis))
  } else {
    const userAnalyses = getFromMemory(`analyses:${userId}`) || []
    return userAnalyses.slice(0, limit)
  }
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
  if (redis) {
    await redis.lpush(`env:${farmId}`, JSON.stringify(environmentalData))
    // Keep only last 1000 readings
    await redis.ltrim(`env:${farmId}`, 0, 999)
  } else {
    const envHistory = getFromMemory(`env:${farmId}`) || []
    envHistory.unshift(environmentalData)
    if (envHistory.length > 1000) {
      envHistory.splice(1000)
    }
    setInMemory(`env:${farmId}`, envHistory)
  }
}

export async function getEnvironmentalHistory(farmId: string, limit = 100): Promise<EnvironmentalData[]> {
  if (redis) {
    const data = await redis.lrange(`env:${farmId}`, 0, limit - 1)
    return data.map((item) => JSON.parse(item))
  } else {
    const envHistory = getFromMemory(`env:${farmId}`) || []
    return envHistory.slice(0, limit)
  }
}