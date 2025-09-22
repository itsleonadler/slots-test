import { cookies } from "next/headers"
import { randomUUID } from "crypto"
const NAME = "sid"
const AGE = 60 * 60 * 24 * 7

export function ensureSid(): string {
  const jar = cookies() as any
  const existing = jar.get(NAME)?.value
  if (existing) return existing
  const sid = randomUUID()
  jar.set(NAME, sid, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AGE,
  })
  return sid
}

export function readSid(): string | undefined {
  return (cookies() as any).get(NAME)?.value
}
