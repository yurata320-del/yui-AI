'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PiyoBird, { type AccessorySlot } from './components/PiyoBird';
import PiyoHeader from './components/PiyoHeader';
import PiyoBottomNav from './components/PiyoBottomNav';
import { loadPiyoData, type PiyoSaveData } from './lib/storage';

/**
 * 【ぴよちゃんゲーム】タイトル画面
 *
 * ここでやること:
 *   - 保存してある「所持ポイント」「ハイスコア」「装着中アクセサリー」を読みこんで表示する
 *   - タップするとぴよちゃんがはばたく、ちいさな演出をつける
 *   - 「ゲームスタート」でゲーム画面へ、下のナビで「ショップ」へ行けるようにする
 */
export default function PiyoTitlePage() {
  const [data, setData] = useState<PiyoSaveData | null>(null);
  const [flap, setFlap] = useState(false);

  // 画面が出たときに1回だけ、保存データを読みこむ
  useEffect(() => {
    setData(loadPiyoData());
  }, []);

  function handleTapBird() {
    if (flap) return;
    setFlap(true);
    // はねを一瞬あげてから、もとに戻す
    setTimeout(() => setFlap(false), 220);
  }

  const points = data?.points ?? 0;
  const highScore = data?.highScore ?? 0;
  const equippedAccessory = (data?.equippedAccessoryId ?? null) as AccessorySlot;

  return (
    <>
      <PiyoHeader points={points} />

      <main className="min-h-screen w-full bg-piyo-surface pb-32 pt-20">
        <div className="flex w-full select-none flex-col gap-piyo-md px-piyo-hud-safe-side">
          {/* 空のあいさつバナー */}
          <div className="relative w-full overflow-hidden rounded-piyo-lg bg-gradient-to-b from-piyo-primary-container/30 to-piyo-surface-container p-piyo-md shadow-sm">
            <div className="relative z-10 flex items-center justify-between gap-piyo-xs">
              <div className="flex flex-col">
                <div className="flex items-center gap-piyo-xxs">
                  <span className="material-symbols-outlined text-[20px] text-piyo-secondary">auto_awesome</span>
                  <span className="font-piyo-label text-piyo-label-sm tracking-wider text-piyo-secondary">
                    きょうもげんきに！
                  </span>
                </div>
                <h1 className="mt-piyo-xxs font-piyo-display text-piyo-display-hero-mobile leading-none tracking-tight text-piyo-primary">
                  そらとぶ！<span className="text-piyo-secondary-container">ピヨちゃん</span>
                </h1>
              </div>
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-piyo-secondary-container shadow-md">
                <span className="material-symbols-outlined text-[28px] text-piyo-on-secondary-container">
                  wb_sunny
                </span>
              </div>
            </div>
          </div>

          {/* ぴよちゃんが見える、空のステージ */}
          <div className="relative flex min-h-[260px] w-full flex-col items-center justify-center overflow-hidden rounded-piyo-lg bg-gradient-to-b from-piyo-primary-fixed to-piyo-tertiary-fixed-dim/40 p-piyo-lg shadow-md">
            {/* 雲(かざり) */}
            <div className="absolute left-6 top-4 flex items-center gap-1 opacity-90">
              <div className="h-10 w-10 rounded-full bg-piyo-surface-container-lowest shadow-sm" />
              <div className="-ml-4 h-14 w-14 rounded-full bg-piyo-surface-container-lowest shadow-sm" />
              <div className="-ml-3 h-8 w-8 rounded-full bg-piyo-surface-container-lowest shadow-sm" />
            </div>
            <div className="absolute right-4 top-10 flex items-center gap-1 opacity-80">
              <div className="h-8 w-8 rounded-full bg-piyo-surface-container-lowest shadow-sm" />
              <div className="-ml-3 h-12 w-12 rounded-full bg-piyo-surface-container-lowest shadow-sm" />
            </div>
            {/* 草原(かざり) */}
            <div className="absolute -bottom-16 -left-10 h-36 w-[130%] rounded-[100%] bg-piyo-tertiary-container opacity-95" />
            <div className="absolute -bottom-20 -right-8 h-36 w-[120%] rounded-[100%] bg-piyo-tertiary opacity-85" />

            {/* ぴよちゃん本体(タップすると動く) */}
            <button
              type="button"
              onClick={handleTapBird}
              aria-label="ぴよちゃんをタップする"
              className="relative z-20 flex flex-col items-center transition-transform duration-200 ease-out active:scale-95"
              style={{ transform: flap ? 'translateY(-18px)' : 'translateY(0)' }}
            >
              <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-piyo-surface-container-lowest p-1.5 shadow-xl">
                <PiyoBird size={96} flap={flap} accessory={equippedAccessory} />
              </div>
              <div className="mt-piyo-xs rounded-full bg-piyo-surface/90 px-piyo-md py-piyo-xxs shadow-sm backdrop-blur-sm">
                <span className="font-piyo-label text-piyo-label-md font-bold text-piyo-primary">
                  タップしてはばたこう！
                </span>
              </div>
            </button>
          </div>

          {/* ハイスコア・所持ポイント */}
          <div className="grid w-full grid-cols-2 gap-piyo-xs">
            <div className="flex items-center gap-piyo-xs rounded-piyo bg-piyo-surface-container-lowest p-piyo-sm shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-piyo-secondary-fixed shadow-inner">
                <span className="material-symbols-outlined text-[26px] text-piyo-secondary">military_tech</span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-piyo-label text-piyo-label-sm text-piyo-on-surface-variant">
                  ハイスコア
                </span>
                <div className="flex items-baseline gap-piyo-xxs">
                  <span className="font-piyo-headline text-piyo-headline-lg-mobile font-extrabold tabular-nums text-piyo-on-surface">
                    {highScore}
                  </span>
                  <span className="font-piyo-label text-piyo-label-sm text-piyo-outline">点</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-piyo-xs rounded-piyo bg-piyo-surface-container-lowest p-piyo-sm shadow-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-piyo-secondary-container shadow-inner">
                <span className="material-symbols-outlined text-[26px] text-piyo-on-secondary-container">
                  monetization_on
                </span>
              </div>
              <div className="flex min-w-0 flex-col">
                <span className="truncate font-piyo-label text-piyo-label-sm text-piyo-on-surface-variant">
                  所持ポイント
                </span>
                <div className="flex items-baseline gap-piyo-xxs">
                  <span className="font-piyo-headline text-piyo-headline-lg-mobile font-extrabold tabular-nums text-piyo-on-surface">
                    {points}
                  </span>
                  <span className="font-piyo-label text-piyo-label-sm text-piyo-outline">枚</span>
                </div>
              </div>
            </div>
          </div>

          {/* ゲームスタート ボタン */}
          <Link
            href="/apps/piyo-game/play"
            className="flex w-full flex-col items-center justify-center gap-piyo-xxs rounded-piyo-lg bg-piyo-secondary-container px-piyo-md py-piyo-lg font-piyo-headline text-piyo-headline-lg-mobile text-piyo-on-secondary-container shadow-lg transition-all duration-200 active:translate-y-1 active:shadow-md"
          >
            <div className="flex items-center justify-center gap-piyo-xs">
              <span className="material-symbols-outlined text-[32px]">play_arrow</span>
              <span className="font-extrabold tracking-wide">ゲームスタート！</span>
            </div>
            <span className="font-piyo-label text-piyo-label-sm uppercase tracking-widest text-piyo-secondary opacity-90">
              TAP TO FLY HIGH
            </span>
          </Link>
        </div>
      </main>

      <PiyoBottomNav active="home" />
    </>
  );
}
