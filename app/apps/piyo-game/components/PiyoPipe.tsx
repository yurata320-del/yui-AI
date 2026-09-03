import type { Pipe } from '../lib/gameEngine';
import { PIPE_GAP, PIPE_WIDTH, GROUND_HEIGHT } from '../lib/gameEngine';

/**
 * 土管1本ぶん(上と下のセット)と、すきまにあるコインを描く部品。
 * 色や形は、Stitchで作ったデザインのコードをそのまま数字にしてある。
 */
export default function PiyoPipe({ pipe, stageHeight }: { pipe: Pipe; stageHeight: number }) {
  const bottomPipeHeight = Math.max(0, stageHeight - GROUND_HEIGHT - (pipe.gapTop + PIPE_GAP));

  return (
    <div className="pointer-events-none absolute inset-y-0 z-10" style={{ left: pipe.x, width: PIPE_WIDTH }}>
      {/* 上の土管(さかさま) */}
      <div
        className="absolute inset-x-0 top-0 overflow-hidden rounded-b-xl bg-[#4caf50] shadow-[inset_0_-8px_0_#2e7d32]"
        style={{ height: pipe.gapTop }}
      >
        <div className="absolute inset-y-0 left-2 w-3 rounded-full bg-[#a5d6a7]/70" />
      </div>

      {/* すきまのコイン(まだ取ってなければ表示) */}
      {!pipe.coinCollected && (
        <div
          className="absolute z-20 flex items-center justify-center"
          style={{
            left: PIPE_WIDTH / 2 - 22,
            top: pipe.gapTop + PIPE_GAP / 2 - 22,
            width: 44,
            height: 44,
          }}
        >
          <div className="absolute h-14 w-14 scale-110 rounded-full bg-piyo-secondary-fixed opacity-70 blur-sm" />
          <div className="relative flex h-11 w-11 items-center justify-center rounded-full bg-piyo-secondary-container shadow-[0_5px_0_#f57f17]">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fff59d]">
              <span
                className="material-symbols-outlined text-[22px] text-piyo-secondary"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                star
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 下の土管 */}
      <div
        className="absolute inset-x-0 overflow-hidden rounded-t-xl bg-[#4caf50] shadow-[inset_0_8px_0_#2e7d32]"
        style={{ height: bottomPipeHeight, bottom: GROUND_HEIGHT }}
      >
        <div className="absolute inset-y-0 left-2 w-3 rounded-full bg-[#a5d6a7]/70" />
      </div>
    </div>
  );
}
