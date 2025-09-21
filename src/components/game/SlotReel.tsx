"use client"
import { SymbolKey } from "@/lib/shared/types"

export default function SlotReel({
  value,
  spinning,
}: {
  value: SymbolKey
  spinning: boolean
}) {
  const display = spinning ? "X" : value
  return (
    <div
      className={[
        "flex h-24 w-24 items-center justify-center rounded-2xl border text-4xl font-bold",
        "bg-white shadow-sm dark:bg-zinc-900 dark:border-zinc-700",
        spinning ? "animate-spin-slow select-none" : "",
      ].join(" ")}
      aria-live="polite"
      aria-label={spinning ? "Spinning" : `Symbol ${display}`}
    >
      {display}
    </div>
  )
}
