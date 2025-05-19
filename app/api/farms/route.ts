import { getUser } from "@/lib/auth"
import { createFarm, getUserFarms, updateFarm } from "@/lib/redis"

export async function GET() {
  try {
    const { id: userId } = await getUser()
    const farms = await getUserFarms(userId)

    return Response.json({ farms })
  } catch (error) {
    console.error("Error fetching farms:", error)
    return Response.json({ error: "Failed to fetch farms" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { id: userId } = await getUser()

    const farm = await createFarm({
      ...body,
      userId,
    })

    return Response.json({ farm })
  } catch (error) {
    console.error("Error creating farm:", error)
    return Response.json({ error: "Failed to create farm" }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  try {
    const { farmId, ...updates } = await req.json()
    const { id: userId } = await getUser()

    await updateFarm(userId, farmId, updates)

    return Response.json({ success: true })
  } catch (error) {
    console.error("Error updating farm:", error)
    return Response.json({ error: "Failed to update farm" }, { status: 500 })
  }
}
