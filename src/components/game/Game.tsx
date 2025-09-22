"use client"
import SlotMachine from "./SlotMachine"
import CreditsBadge from "./CreditsBadge"
import Controls from "./Controls"
import { Status } from "@/lib/shared/types"
import { useGameStore } from "@/stores/gameStore"
import { useEffect } from "react"

export default function Game() {
  const status = useGameStore((s) => s.status)
  const reels = useGameStore((s) => s.reels)
  const revealed = useGameStore((s) => s.revealed)
  const credits = useGameStore((s) => s.credits)
  const balance = useGameStore((s) => s.balance)
  const canSpin = useGameStore((s) => s.canSpin)
  const cashed = useGameStore((s) => s.lastCashoutAmount)
  const error = useGameStore((s) => s.error)

  const initSession = useGameStore((s) => s.initSession)
  const startNewSession = useGameStore((s) => s.startNewSession)
  const spin = useGameStore((s) => s.spin)
  const cashout = useGameStore((s) => s.cashout)
  const clearTimers = useGameStore((s) => s.clearTimers)
  const resetError = useGameStore((s) => s.resetError)

  useEffect(() => {
    initSession()
  }, [initSession])
  useEffect(() => () => clearTimers(), [clearTimers])
  useEffect(() => {
    if (error) {
      alert(error)
      resetError()
    }
  }, [error, resetError])

  return (
    <div className="mx-auto mt-[20%] h-full max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Casino Jackpot</h1>
        <CreditsBadge credits={credits} balance={balance} />
      </div>

      {status === Status.Ended && (
        <div className="rounded-xl border bg-green-50 p-4 text-green-900">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold">
                {credits > 0 ? "Congratulations!" : "Out of credits"}
              </p>
              {credits > 0 ? (
                <p>
                  You cashed out{" "}
                  <span className="font-bold">{cashed ?? 0}</span> credits.
                </p>
              ) : (
                <p>Try your luck next time!</p>
              )}
            </div>
            <button
              onClick={startNewSession}
              className="rounded-lg bg-green-700 px-3 py-2 text-white"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <SlotMachine
        reels={reels}
        isSpinningReel={(i) =>
          (status === Status.Spinning || status === Status.Revealing) &&
          !revealed[i as 0 | 1 | 2]
        }
      />

      <Controls
        onSpin={spin}
        onCashout={cashout}
        disabled={!canSpin}
        ended={status === Status.Ended}
      />
    </div>
  )
}
