export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { ensureSid } from "@/lib/auth/cookies"
import { createOrResumeSession } from "@/lib/game/service"

export async function POST() {
  try {
    const sid = ensureSid()
    const session = await createOrResumeSession(sid)
    return NextResponse.json(
      { credits: session.credits, sessionId: session.id },
      { headers: { "Cache-Control": "no-store" } }
    )
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: "Internal error" }, { status: 500 })
  }
}
