import { describe, it, expect, vi } from "vitest"
import { spin, isWin, reward, shouldRerollForHouse } from "./engine"
import { SymbolKey } from "@/lib/shared/types"

describe("engine", () => {
  it("isWin detects triples", () => {
    expect(isWin([SymbolKey.C, SymbolKey.C, SymbolKey.C])).toBe(true)
    expect(isWin([SymbolKey.C, SymbolKey.C, SymbolKey.L])).toBe(false)
  })

  it("reward returns correct amounts", () => {
    expect(reward(SymbolKey.C)).toBe(10)
    expect(reward(SymbolKey.L)).toBe(20)
    expect(reward(SymbolKey.O)).toBe(30)
    expect(reward(SymbolKey.W)).toBe(40)
  })

  it("shouldRerollForHouse thresholds", () => {
    vi.spyOn(Math, "random").mockReturnValue(0.0)
    expect(shouldRerollForHouse(39)).toBe(false)
    expect(shouldRerollForHouse(40)).toBe(true) // 0.0 < 0.3
    expect(shouldRerollForHouse(61)).toBe(true) // 0.0 < 0.6

    vi.spyOn(Math, "random").mockReturnValue(0.59)
    expect(shouldRerollForHouse(60)).toBe(false) // 0.59 !< 0.3
    expect(shouldRerollForHouse(61)).toBe(true) // 0.59 < 0.6

    vi.spyOn(Math, "random").mockRestore()
  })

  it("spin returns 3 symbols", () => {
    const s = spin()
    expect(s).toHaveLength(3)
  })
})
