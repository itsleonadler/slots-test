'use client';
interface Props {
  onSpin: () => void;
  onCashout: () => void;
  disabled: boolean;
  ended: boolean;
}
export default function Controls({ onSpin, onCashout, disabled, ended }: Props) {
  return (
    <div className="flex justify-center items-center gap-3">
      <button
        onClick={onSpin}
        disabled={disabled || ended}
        className="rounded-xl bg-black px-4 py-2 text-white disabled:opacity-40"
      >
        Spin
      </button>
      <button
        onClick={onCashout}
        disabled={ended}
        className="rounded-xl border px-4 py-2"
      >
        Cash Out
      </button>
    </div>
  );
}
