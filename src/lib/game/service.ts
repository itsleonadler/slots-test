import { prisma } from "@/lib/db/prisma"
import { spin, isWin, reward, shouldRerollForHouse } from "./engine"
import type { RollResponse } from "@/lib/shared/types"

export async function createOrResumeSession(sid: string) {
  const INITIAL_CREDITS = 10
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
      data: { userId: sid, credits: INITIAL_CREDITS },
    })
  return session
}

export async function rollOnce(sessionId: string): Promise<RollResponse> {
  return prisma.$transaction(async (tx: any) => {
    const session = await tx.session.findUnique({ where: { id: sessionId } })
    if (!session || !session.active) throw new Error("No active session")
    if (session.credits <= 0) throw new Error("Out of credits")

    const first = spin()
    const afterCheat =
      isWin(first) && shouldRerollForHouse(session.credits) ? spin() : first

    const delta = isWin(afterCheat) ? reward(afterCheat[0]) : -1
    const newCredits = session.credits + delta

    if (newCredits <= 0) {
      await closeSession(sessionId)
    }

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

    const cashed = session.credits

    const user = await tx.user.update({
      where: { id: userId },
      data: { accountBalance: { increment: cashed } },
    })

    await tx.session.update({
      where: { id: session.id },
      data: { active: false, closedAt: new Date() },
    })

    return { balance: user.accountBalance, cashed }
  })
}

export async function closeSession(sessionId: string) {
  return prisma.session.update({
    where: { id: sessionId },
    data: { active: false, closedAt: new Date() },
  })
}

export async function getAccountBalance(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { accountBalance: true },
  })
  return user?.accountBalance ?? 0
}
