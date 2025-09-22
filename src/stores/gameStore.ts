"use client"

import { create } from "zustand"
import {
  SymbolKey,
  type SymbolsTriple,
  type RollResponse,
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
  balance: number
  lastCashoutAmount?: number
}

type GameActions = {
  initSession: () => Promise<void>
  spin: () => Promise<void>
  cashout: () => Promise<void>
  clearTimers: () => void
  resetError: () => void
  startNewSession: () => Promise<void>
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  status: Status.Idle,
  reels: [SymbolKey.C, SymbolKey.L, SymbolKey.O],
  revealed: [true, true, true],
  credits: 0,
  balance: 0,
  canSpin: false,
  error: undefined,
  timers: [],

  async initSession() {
    try {
      const s = await slotGameService.createSession()
      set(
        {
          credits: s.credits,
          balance: s.accountBalance,
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

  async startNewSession() {
    get().clearTimers()
    set({
      status: Status.Idle,
      revealed: [true, true, true],
      lastCashoutAmount: undefined,
    })
    await get().initSession()
  },

  async spin() {
    const { canSpin, status, credits } = get()
    if (!canSpin || status !== Status.Idle || credits <= 0) {
      if (credits <= 0) set({ status: Status.Ended, canSpin: false })
      return
    }

    set(
      {
        status: Status.Spinning,
        canSpin: false,
        error: undefined,
        revealed: [false, false, false],
      },
      false
    )

    let result: RollResponse
    try {
      result = await slotGameService.roll()
    } catch (e: any) {
      const msg = e.message ?? "Roll failed"
      set({
        error: msg,
        status: Status.Idle,
        canSpin: false,
        revealed: [true, true, true],
      })
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
      const nextCredits = result.newCredits
      if (nextCredits <= 0) {
        set({ credits: 0, status: Status.Ended, canSpin: false })
      } else {
        set({ credits: nextCredits, status: Status.Idle, canSpin: true })
      }
    }, 3000)
    timers.push(applyId)

    set({ timers }, false)
  },

  async cashout() {
    try {
      const amount = get().credits
      const { balance, cashed } = await slotGameService.cashout()
      get().clearTimers()
      set({
        status: Status.Ended,
        canSpin: false,
        balance,
        lastCashoutAmount: cashed ?? amount,
      })
    } catch (e: any) {
      set({ error: e.message ?? "Cashout failed" })
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
