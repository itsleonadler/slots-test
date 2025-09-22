import { SymbolKey, type SymbolsTriple } from "@/lib/shared/types"
import { SYMBOLS, REWARDS } from "@/lib/shared/symbols"

export function spin(): SymbolsTriple {
  const pick = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]
  return [pick(), pick(), pick()]
}

export function isWin([a, b, c]: SymbolsTriple) {
  return a === b && b === c
}

export function reward(sym: SymbolKey) {
  return REWARDS[sym]
}

export function shouldRerollForHouse(currentCredits: number) {
  if (currentCredits < 40) return false
  const p = currentCredits <= 60 ? 0.3 : 0.6
  return Math.random() < p
}
