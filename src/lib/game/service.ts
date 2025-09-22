import { prisma } from "@/lib/db/prisma"
import { spin, isWin, reward, shouldRerollForHouse } from "./engine"
import type { RollResult } from "@/lib/shared/types"

export async function createOrResumeSession(sid: string) {
  // use sid as user id to keep it simple
  await prisma.user.upsert({
    where: { id: sid },
    update: {},
    create: { id: sid },
  })
  let session = await prisma.session.findFirst({
    where: { userId: sid, active: true },
  })
  if (!session)
    session = await prisma.session.create({
      data: { userId: sid, credits: 10 },
    })
  return session
}

export async function rollOnce(sessionId: string): Promise<RollResult> {
  return prisma.$transaction(async (tx: any) => {
    const session = await tx.session.findUnique({ where: { id: sessionId } })
    if (!session || !session.active) throw new Error("No active session")

    const first = spin()
    const afterCheat =
      isWin(first) && shouldRerollForHouse(session.credits) ? spin() : first

    const delta = isWin(afterCheat) ? reward(afterCheat[0]) : -1
    const newCredits = session.credits + delta

    await tx.session.update({
      where: { id: session.id },
      data: { credits: newCredits },
    })

    return { symbols: afterCheat, delta, newCredits }
  })
}

export async function cashout(userId: string) {
  return prisma.$transaction(async (tx: any) => {
    const session = await tx.session.findFirst({
      where: { userId, active: true },
    })
    if (!session) throw new Error("No active session")
    const user = await tx.user.update({
      where: { id: userId },
      data: { accountBalance: { increment: session.credits } },
    })
    await tx.session.update({
      where: { id: session.id },
      data: { active: false, closedAt: new Date() },
    })
    return { balance: user.accountBalance }
  })
}
