"use client"
import BaseApiService from "./BaseApiService"
import type { RollResult, SessionPayload } from "@/lib/shared/types"

class SlotGameService extends BaseApiService {
  createSession() {
    return this.api.post<SessionPayload>("/session").then((r) => r.data)
  }
  roll() {
    return this.api.post<RollResult>("/roll").then((r) => r.data)
  }
  cashout() {
    return this.api.post<{ balance: number }>("/cashout").then((r) => r.data)
  }
}

export const slotGameService = new SlotGameService() // singleton
