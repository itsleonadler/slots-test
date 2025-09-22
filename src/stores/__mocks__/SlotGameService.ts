import { vi } from "vitest"

const mockSession = { credits: 10, sessionId: "s1", accountBalance: 0 }
const mockRoll = { symbols: ["C", "C", "C"], delta: 10, newCredits: 20 }
const mockCashout = { balance: 20, cashed: 20 }

export const slotGameService = {
  createSession: vi.fn(async () => mockSession),
  roll: vi.fn(async () => mockRoll),
  cashout: vi.fn(async () => mockCashout),
}
