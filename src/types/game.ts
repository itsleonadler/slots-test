export enum SymbolKey {
  C = "C",
  L = "L",
  O = "O",
  W = "W",
}

export interface RollResult {
  symbols: SymbolKey[]
  delta: number
  newCredits: number
}

export interface SessionPayload {
  credits: number
  sessionId: string
}

export type SymbolsTriple = [SymbolKey, SymbolKey, SymbolKey]

export enum Status {
  Idle = "idle",
  Spinning = "spinning",
  Revealing = "revealing",
  Ended = "ended",
}
export type Index = 0 | 1 | 2
export type RevealedFlags = [boolean, boolean, boolean]
