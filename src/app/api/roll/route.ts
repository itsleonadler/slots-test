export const runtime = "nodejs"
import { NextResponse } from "next/server"
import { readSid } from "@/lib/auth/cookies"
import {
  closeSession,
  createOrResumeSession,
  rollOnce,
} from "@/lib/game/service"

export async function POST() {
  try {
    const sid = readSid()
    if (!sid)
      return NextResponse.json({ message: "No session" }, { status: 400 })
    const session = await createOrResumeSession(sid)

    const result = await rollOnce(session.id)
    return NextResponse.json(result, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (e: any) {
    return NextResponse.json(
      { message: e.message ?? "Internal error" },
      { status: 500 }
    )
  }
}
