import { getUser } from "@/lib/auth"
import { recommendStrains } from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const { farmContext, goals } = await req.json()
    const { id: userId } = await getUser()

    const recommendations = await recommendStrains(farmContext, goals)

    return Response.json({ recommendations })
  } catch (error) {
    console.error("Error recommending strains:", error)
    return Response.json({ error: "Failed to recommend strains" }, { status: 500 })
  }
}
