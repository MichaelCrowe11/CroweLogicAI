import { getUser } from "@/lib/auth"
import { createTask, getUserTasks, updateTask } from "@/lib/redis"
import { generateDailyTasks } from "@/lib/ai"

export async function GET() {
  try {
    const { id: userId } = await getUser()
    const tasks = await getUserTasks(userId)

    return Response.json({ tasks })
  } catch (error) {
    console.error("Error fetching tasks:", error)
    return Response.json({ error: "Failed to fetch tasks" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id: userId } = await getUser()

    // If generating tasks automatically
    if (body.generate) {
      const { farmContext } = body
      const generatedTasks = await generateDailyTasks(userId, farmContext)

      const tasks = []
      for (const task of generatedTasks.tasks) {
        const newTask = await createTask({
          title: task.title,
          description: task.description,
          status: "pending",
          priority: task.priority,
          userId,
          farmId: body.farmId,
        })
        tasks.push(newTask)
      }

      return Response.json({ tasks, notes: generatedTasks.notes })
    }

    // If creating a single task manually
    const task = await createTask({
      ...body,
      userId,
    })

    return Response.json({ task })
  } catch (error) {
    console.error("Error creating task:", error)
    return Response.json({ error: "Failed to create task" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { taskId, ...updates } = await req.json()
    const { id: userId } = await getUser()

    await updateTask(userId, taskId, updates)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error updating task:", error)
    return Response.json({ error: "Failed to update task" }, { status: 500 })
  }
}
