'use client';
import SlotReel from './SlotReel';
import { SymbolKey } from '@/lib/shared/types';

export default function SlotMachine({
  reels,
  isSpinningReel,
}: {
  reels: [SymbolKey, SymbolKey, SymbolKey];
  isSpinningReel: (index: number) => boolean;
}) {
  return (
    <div className="flex gap-4 justify-center">
      {reels.map((r, i) => (
        <SlotReel key={i} value={r} spinning={isSpinningReel(i)} />
      ))}
    </div>
  );
}