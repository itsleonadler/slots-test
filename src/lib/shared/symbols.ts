import { SymbolKey } from "./types"

export const SYMBOLS: SymbolKey[] = [
  SymbolKey.C,
  SymbolKey.L,
  SymbolKey.O,
  SymbolKey.W,
]
export const REWARDS: Record<SymbolKey, number> = {
  [SymbolKey.C]: 10,
  [SymbolKey.L]: 20,
  [SymbolKey.O]: 30,
  [SymbolKey.W]: 40,
}
