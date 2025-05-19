"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Calendar, Clock } from "lucide-react"
import type { Task } from "@/lib/redis"

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchTasks() {
      try {
        const response = await fetch("/api/tasks")
        const data = await response.json()
        if (data.tasks) {
          setTasks(data.tasks)
        }
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching tasks:", error)
        setIsLoading(false)
      }
    }

    fetchTasks()
  }, [])

  const handleTaskStatusChange = async (taskId: string, completed: boolean) => {
    try {
      const status = completed ? "completed" : "pending"
      await fetch("/api/tasks", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          status,
        }),
      })

      setTasks((prevTasks) => prevTasks.map((task) => (task.id === taskId ? { ...task, status } : task)))
    } catch (error) {
      console.error("Error updating task:", error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    )
  }

  const pendingTasks = tasks.filter((task) => task.status !== "completed")
  const completedTasks = tasks.filter((task) => task.status === "completed")

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Farm Tasks</h2>
          <p className="text-muted-foreground">Manage your daily mushroom farm operations</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Generate Daily Tasks</Button>
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <p className="text-muted-foreground mb-4">No tasks yet. Create your first task to get started.</p>
            <Button>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add Your First Task
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Pending Tasks ({pendingTasks.length})</CardTitle>
              <CardDescription>Tasks that need your attention</CardDescription>
            </CardHeader>
            <CardContent>
              {pendingTasks.length > 0 ? (
                <div className="space-y-4">
                  {pendingTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <Checkbox
                        checked={task.status === "completed"}
                        onCheckedChange={(checked) => handleTaskStatusChange(task.id, !!checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{task.title}</h4>
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        {task.dueDate && (
                          <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                            <div className="flex items-center">
                              <Calendar className="h-3 w-3 mr-1" />
                              {new Date(task.dueDate).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {new Date(task.dueDate).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center py-4 text-muted-foreground">No pending tasks</p>
              )}
            </CardContent>
          </Card>

          {completedTasks.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Completed Tasks ({completedTasks.length})</CardTitle>
                <CardDescription>Tasks you've finished</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {completedTasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 transition-colors opacity-70"
                    >
                      <Checkbox
                        checked={true}
                        onCheckedChange={(checked) => handleTaskStatusChange(task.id, !!checked)}
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium line-through">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-through">{task.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  )
}
