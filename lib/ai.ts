import { openai } from "@ai-sdk/openai"
import { streamText, generateText, generateObject } from "ai"
import { z } from "zod"
import type { Message } from "./redis"

// System prompts
const SYSTEM_PROMPT = `You are Crowe Logic AI, an expert assistant specializing in mushroom cultivation, mycelium analysis, and farm management.

Your expertise includes:
- Fungal species identification and cultivation techniques
- Mycelium growth patterns and health assessment
- Substrate preparation and sterilization
- Fruiting conditions optimization
- Contamination identification and prevention
- Harvest timing and techniques
- Farm workflow optimization

Provide detailed, scientifically accurate responses while making complex mycology topics accessible.
When discussing cultivation techniques, emphasize best practices for yield and contamination prevention.
For farm management questions, focus on efficiency and sustainability.

Your tone is calm, direct, and precise - like "Bob Ross meets an AI lab technician."
You should be helpful, educational, and practical in your advice.`

// Specialized analysis prompts
export const ANALYSIS_PROMPTS = {
  mycelium: `Analyze this mycelium image and provide a detailed assessment. Consider:
- Growth pattern (rhizomorphic vs tomentose)
- Color and appearance
- Signs of health or contamination
- Growth stage and estimated colonization percentage
- Recommendations for optimal conditions`,

  substrate: `Analyze this substrate image and provide a detailed assessment. Consider:
- Substrate composition and appearance
- Moisture level assessment
- Signs of contamination
- Suitability for intended mushroom variety
- Recommendations for improvement`,

  fruiting: `Analyze this fruiting body image and provide a detailed assessment. Consider:
- Species identification if possible
- Growth stage and development
- Quality assessment
- Harvest timing recommendations
- Potential issues or abnormalities`,

  contamination: `Analyze this image for contamination and provide a detailed assessment. Consider:
- Type of contamination (bacterial, mold, etc.)
- Severity and spread
- Potential causes
- Containment recommendations
- Prevention strategies for future grows`,
}

// Chat function
export async function getChatResponse(messages: Message[]) {
  const result = streamText({
    model: openai("gpt-4o"),
    messages: [
      { role: "system", content: SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
    ],
  })

  return result
}

// Analysis function
export async function analyzeImage(type: keyof typeof ANALYSIS_PROMPTS, imageUrl: string) {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `${ANALYSIS_PROMPTS[type]}\n\nImage URL: ${imageUrl}` },
      ],
    })

    return text
  } catch (error) {
    console.error("Error analyzing image:", error)
    throw new Error("Failed to analyze image")
  }
}

// Generate daily tasks
export async function generateDailyTasks(userId: string, farmContext: string) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        tasks: z.array(
          z.object({
            title: z.string(),
            description: z.string(),
            priority: z.enum(["low", "medium", "high"]),
            estimatedTime: z.string(),
          }),
        ),
        notes: z.string().optional(),
      }),
      prompt: `Generate a daily task list for a mushroom farm with the following context: ${farmContext}. 
      Include 3-5 prioritized tasks that should be completed today, with clear descriptions and estimated time.`,
    })

    return object
  } catch (error) {
    console.error("Error generating tasks:", error)
    throw new Error("Failed to generate tasks")
  }
}

// Generate strain recommendations
export async function recommendStrains(farmContext: string, goals: string) {
  try {
    const { object } = await generateObject({
      model: openai("gpt-4o"),
      schema: z.object({
        recommendations: z.array(
          z.object({
            name: z.string(),
            scientificName: z.string(),
            difficulty: z.enum(["beginner", "intermediate", "advanced"]),
            yieldPotential: z.enum(["low", "medium", "high"]),
            colonizationTime: z.string(),
            fruitingTime: z.string(),
            substrates: z.array(z.string()),
            optimalConditions: z.object({
              temperature: z.string(),
              humidity: z.string(),
              light: z.string(),
              co2: z.string(),
            }),
            notes: z.string(),
          }),
        ),
        explanation: z.string(),
      }),
      prompt: `Based on the following farm setup and goals, recommend 3 mushroom strains that would be most suitable.
      
      Farm context: ${farmContext}
      Goals: ${goals}
      
      Provide detailed recommendations with scientific names, difficulty levels, yield potential, timing expectations, 
      substrate preferences, optimal growing conditions, and any special notes.`,
    })

    return object
  } catch (error) {
    console.error("Error recommending strains:", error)
    throw new Error("Failed to recommend strains")
  }
}
