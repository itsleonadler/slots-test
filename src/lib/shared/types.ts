export enum SymbolKey {
  C = "C",
  L = "L",
  O = "O",
  W = "W",
}

export interface RollResponse {
  symbols: SymbolKey[]
  delta: number
  newCredits: number
}

export interface SessionResponse {
  credits: number
  sessionId: string
  accountBalance: number
}

export interface CashoutResponse {
  balance: number
  cashed: number
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
