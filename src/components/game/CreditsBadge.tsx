"use client"
export default function CreditsBadge({
  credits,
  balance,
}: {
  credits: number
  balance?: number
}) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm shadow-sm">
      <span className="font-medium">Credits:</span>
      <span className="tabular-nums">{credits}</span>
      {balance ? (
        <>
          <span className="opacity-50">·</span>
          <span className="font-medium">Balance:</span>
          <span className="tabular-nums">{balance}</span>
        </>
      ) : null}
    </div>
  )
}
