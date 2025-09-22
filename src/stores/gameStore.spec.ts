import { describe, it, expect, vi, beforeEach } from "vitest"
import { slotGameService } from "@/lib/api/SlotGameService"

vi.mock("@/lib/api/SlotGameService", async () => {
  const mock = await import("./__mocks__/SlotGameService")
  return mock
})

import { useGameStore } from "./gameStore"
import { Status, SymbolKey } from "@/lib/shared/types"

describe("gameStore", () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.clearAllMocks()
    const { getState, setState } = useGameStore
    setState(
      {
        ...getState(),
        status: Status.Idle,
        reels: [SymbolKey.C, SymbolKey.L, SymbolKey.O],
        revealed: [true, true, true],
        credits: 0,
        balance: 0,
        lastCashoutAmount: undefined,
        canSpin: false,
        error: undefined,
        timers: [],
      },
      true
    )
  })

  it("initSession sets credits and enables spin", async () => {
    await useGameStore.getState().initSession()
    const s = useGameStore.getState()
    expect(s.credits).toBe(10)
    expect(s.canSpin).toBe(true)
  })

  it("spin sets spinning state and reveals with delays, then applies credits", async () => {
    await useGameStore.getState().initSession()
    await useGameStore.getState().spin()

    let s = useGameStore.getState()
    expect(s.status).toBe(Status.Spinning)
    expect(s.canSpin).toBe(false)
    expect(s.revealed).toEqual([false, false, false])

    vi.advanceTimersByTime(1000)
    s = useGameStore.getState()
    expect(s.status).toBe(Status.Revealing)
    expect(s.revealed).toEqual([true, false, false])

    vi.advanceTimersByTime(1000)
    s = useGameStore.getState()
    expect(s.revealed).toEqual([true, true, false])

    vi.advanceTimersByTime(1000)
    s = useGameStore.getState()
    expect(s.revealed).toEqual([true, true, true])
    expect(s.credits).toBe(20)
    expect(s.status).toBe(Status.Idle)
    expect(s.canSpin).toBe(true)
  })

  it("ends game when credits reach 0", async () => {
    ;(slotGameService.roll as any).mockResolvedValueOnce({
      symbols: ["C", "L", "O"],
      delta: -1,
      newCredits: 0,
    })
    await useGameStore.getState().initSession()
    useGameStore.setState({ credits: 1 }, false)
    await useGameStore.getState().spin()

    vi.advanceTimersByTime(3000)
    const s = useGameStore.getState()
    expect(s.credits).toBe(0)
    expect(s.status).toBe(Status.Ended)
    expect(s.canSpin).toBe(false)
  })

  it("cashout sets Ended, stores lastCashoutAmount and updates balance", async () => {
    await useGameStore.getState().initSession()
    useGameStore.setState({ credits: 25 }, false)
    await useGameStore.getState().cashout()
    const s = useGameStore.getState()
    expect(s.status).toBe(Status.Ended)
    expect(s.lastCashoutAmount).toBe(20)
    expect(s.balance).toBe(20)
  })
})
