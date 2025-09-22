import BaseApiService from "./BaseApiService"
import type {
  RollResponse,
  SessionResponse,
  CashoutResponse,
} from "@/lib/shared/types"

class SlotGameService extends BaseApiService {
  createSession() {
    return this.api.post<SessionResponse>("/session").then((r) => r.data)
  }
  roll() {
    return this.api.post<RollResponse>("/roll").then((r) => r.data)
  }
  cashout() {
    return this.api.post<CashoutResponse>("/cashout").then((r) => r.data)
  }
}
export const slotGameService = new SlotGameService()
