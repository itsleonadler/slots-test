'use client';
// import { useEffect } from 'react';
// import { useGameStore } from '@/stores/gameStore';
import SlotMachine from './SlotMachine';
import CreditsBadge from './CreditsBadge';
import Controls from './Controls';
import { SymbolKey, Status } from '@/lib/shared/types';
import { useGameStore } from '@/stores/gameStore';
import { useEffect } from 'react';

export default function Game() {
  const status   = useGameStore(s => s.status);
  const reels    = useGameStore(s => s.reels);
  const revealed = useGameStore(s => s.revealed);
  const credits  = useGameStore(s => s.credits);
  const canSpin  = useGameStore(s => s.canSpin);
  const error    = useGameStore(s => s.error);

  const initSession = useGameStore(s => s.initSession);
  const spin        = useGameStore(s => s.spin);
  const cashout     = useGameStore(s => s.cashout);
  const clearTimers = useGameStore(s => s.clearTimers);
  const resetError  = useGameStore(s => s.resetError);

  useEffect(() => { initSession(); }, [initSession]);
  useEffect(() => () => clearTimers(), [clearTimers]);
  useEffect(() => { if (error) { alert(error); resetError(); } }, [error, resetError]);

  return (
    <div className="mx-auto mt-[20%] h-full max-w-xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Casino Jackpot</h1>
        <CreditsBadge credits={credits} />
      </div>

      <SlotMachine
        reels={reels}
        isSpinningReel={(i) => 
          (status === Status.Spinning || status === Status.Revealing) && !revealed[i as 0|1|2]
        }
      />

      <Controls
        onSpin={spin}
        onCashout={cashout}
        disabled={!canSpin}
        ended={status === Status.Ended}
      />
    </div>
  );
}
