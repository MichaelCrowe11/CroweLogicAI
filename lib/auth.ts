import { cookies } from "next/headers"
import { nanoid } from "nanoid"

export async function getUser() {
  const cookieStore = cookies()
  let userId = cookieStore.get("userId")?.value

  if (!userId) {
    userId = nanoid()
    cookies().set("userId", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: "/",
    })
  }

  return { id: userId }
}
