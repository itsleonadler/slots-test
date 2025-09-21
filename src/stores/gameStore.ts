"use client"

import { create } from "zustand"
import {
  SymbolKey,
  type SymbolsTriple,
  type RollResult,
  Status,
  RevealedFlags,
} from "@/lib/shared/types"
import { slotGameService } from "@/lib/api/SlotGameService"

type GameState = {
  status: Status
  reels: SymbolsTriple
  revealed: RevealedFlags
  credits: number
  canSpin: boolean
  error?: string
  timers: number[]
}

type GameActions = {
  initSession: () => Promise<void>
  spin: () => Promise<void>
  cashout: () => Promise<void>
  clearTimers: () => void
  resetError: () => void
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  status: Status.Idle,
  reels: [SymbolKey.C, SymbolKey.L, SymbolKey.O],
  revealed: [true, true, true],
  credits: 0,
  canSpin: false,
  error: undefined,
  timers: [],

  async initSession() {
    try {
      const s = await slotGameService.createSession()
      set(
        {
          credits: s.credits,
          status: Status.Idle,
          canSpin: true,
          error: undefined,
        },
        false
      )
    } catch (e: any) {
      set(
        { error: e.message ?? "Failed to start session", canSpin: false },
        false
      )
    }
  },

  async spin() {
    const { canSpin, status } = get()
    if (!canSpin || status !== Status.Idle) return

    set(
      {
        status: Status.Spinning,
        canSpin: false,
        error: undefined,
        revealed: [false, false, false],
      },
      false
    )

    let result: RollResult
    try {
      result = await slotGameService.roll()
    } catch (e: any) {
      set(
        {
          error: e.message ?? "Roll failed",
          status: Status.Idle,
          canSpin: true,
          revealed: [true, true, true],
        },
        false
      )
      return
    }

    set({ reels: result.symbols as SymbolsTriple }, false)

    const timers: number[] = []
    const indices = [0, 1, 2]

    for (const i of indices) {
      const id = window.setTimeout(() => {
        const { revealed, status } = get()
        const nextRevealed: RevealedFlags = [...revealed]
        nextRevealed[i] = true

        set(
          {
            revealed: nextRevealed,
            status: i < 2 ? Status.Revealing : status,
          },
          false
        )
      }, (i + 1) * 1000)
      timers.push(id)
    }

    const applyId = window.setTimeout(() => {
      set(
        (s) => ({
          credits: result.newCredits,
          status: s.status === Status.Ended ? Status.Ended : Status.Idle,
          canSpin: true,
        }),
        false
      )
    }, 3000)
    timers.push(applyId)

    set({ timers }, false)
  },

  async cashout() {
    try {
      await slotGameService.cashout()
      set({ status: Status.Ended, canSpin: false }, false)
    } catch (e: any) {
      set({ error: e.message ?? "Cashout failed" }, false)
    }
  },

  clearTimers() {
    const ids = get().timers
    ids.forEach(clearTimeout)
    set({ timers: [] }, false)
  },

  resetError() {
    set({ error: undefined }, false)
  },
}))
