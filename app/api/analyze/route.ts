import { getUser } from "@/lib/auth"
import { analyzeImage } from "@/lib/ai"
import { saveAnalysis } from "@/lib/redis"

export async function POST(req: Request) {
  try {
    const { imageUrl, type, farmId, strainId } = await req.json()
    const { id: userId } = await getUser()

    if (!imageUrl || !type) {
      return Response.json({ error: "Image URL and analysis type are required" }, { status: 400 })
    }

    // Analyze the image
    const results = await analyzeImage(type, imageUrl)

    // Save the analysis
    const analysis = await saveAnalysis({
      type,
      imageUrl,
      results,
      userId,
      farmId,
      strainId,
    })

    return Response.json({ analysis })
  } catch (error) {
    console.error("Error in analysis API:", error)
    return Response.json({ error: "Failed to analyze image" }, { status: 500 })
  }
}
