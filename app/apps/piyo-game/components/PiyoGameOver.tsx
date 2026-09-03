import Link from 'next/link';
import PiyoBird from './PiyoBird';
import type { AccessorySlot } from './PiyoBird';

interface PiyoGameOverProps {
  runCoins: number; // 今回あつめたコイン
  highScore: number; // ハイスコア
  totalPoints: number; // 合計の所持ポイント
  equippedAccessory: AccessorySlot;
  onRetry: () => void;
}

/**
 * ゲームオーバーになったときに、ゲーム画面の上に重ねて出す結果パネル。
 * Stitchの「ゲーム結果画面」から、仕様書にある項目だけをのこしてある。
 */
export default function PiyoGameOver({ runCoins, highScore, totalPoints, equippedAccessory, onRetry }: PiyoGameOverProps) {
  const isNewHighScore = runCoins > 0 && runCoins >= highScore;

  return (
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center gap-piyo-sm bg-piyo-on-surface/40 p-piyo-md backdrop-blur-[2px]">
      <div className="flex w-full max-w-[360px] flex-col gap-piyo-sm rounded-piyo-lg bg-piyo-surface-container-lowest p-piyo-md shadow-2xl">
        {/* ぴよちゃんと見出し */}
        <div className="flex flex-col items-center gap-piyo-xxs text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-piyo-secondary-fixed shadow-md">
            <PiyoBird size={64} accessory={equippedAccessory} />
          </div>
          <div className="mt-piyo-xxs rounded-full bg-piyo-surface-container-high px-piyo-lg py-piyo-xs">
            <h2 className="font-piyo-headline text-piyo-headline-lg-mobile tracking-wide text-piyo-primary">
              ゲームオーバー！
            </h2>
          </div>
          {isNewHighScore && (
            <p className="font-piyo-body text-piyo-body-md font-bold text-piyo-secondary">
              ハイスコア更新！すごい！✨
            </p>
          )}
        </div>

        {/* スコアの数字 */}
        <div className="grid grid-cols-2 gap-piyo-xs">
          <div className="flex flex-col items-center justify-center rounded-piyo bg-piyo-surface-container-low p-piyo-sm text-center shadow-sm">
            <span className="font-piyo-label text-piyo-label-sm text-piyo-on-surface-variant">今回のスコア</span>
            <div className="flex items-baseline gap-piyo-xxs">
              <span className="font-piyo-score text-piyo-score-huge-mobile leading-none text-piyo-primary">
                {runCoins}
              </span>
              <span className="font-piyo-headline text-piyo-headline-md text-piyo-primary">点</span>
            </div>
          </div>
          <div className="flex flex-col items-center justify-center rounded-piyo bg-piyo-surface-container-low p-piyo-sm text-center shadow-sm">
            <span className="font-piyo-label text-piyo-label-sm text-piyo-on-surface-variant">ハイスコア</span>
            <div className="flex items-baseline gap-piyo-xxs">
              <span className="font-piyo-score text-piyo-score-huge-mobile leading-none text-piyo-secondary">
                {highScore}
              </span>
              <span className="font-piyo-headline text-piyo-headline-md text-piyo-secondary">点</span>
            </div>
          </div>
        </div>

        {/* あつめたコイン(合計) */}
        <div className="flex items-center justify-between rounded-piyo bg-piyo-surface-container p-piyo-sm">
          <div className="flex items-center gap-piyo-xs">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-piyo-secondary-fixed shadow-sm">
              <span
                className="material-symbols-outlined text-[20px] text-piyo-on-secondary-fixed"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                monetization_on
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-piyo-label text-piyo-label-sm text-piyo-on-surface-variant">あつめたコイン</span>
              <span className="font-piyo-headline text-piyo-headline-md font-bold text-piyo-on-surface">
                +{runCoins} 枚 ゲット！
              </span>
            </div>
          </div>
          <div className="flex items-center gap-piyo-xxs rounded-full bg-piyo-surface-container-lowest px-piyo-sm py-piyo-xxs shadow-sm">
            <span className="font-piyo-label text-piyo-label-sm font-bold text-piyo-on-surface">合計</span>
            <span className="font-piyo-label text-piyo-label-md font-bold text-piyo-primary">{totalPoints}</span>
          </div>
        </div>

        {/* ボタン */}
        <div className="flex flex-col gap-piyo-xs pt-piyo-xxs">
          <button
            type="button"
            onClick={onRetry}
            className="flex h-piyo-touch-min w-full items-center justify-center gap-piyo-xs rounded-piyo-xl bg-piyo-tertiary-container font-piyo-headline text-piyo-headline-lg-mobile text-piyo-on-primary shadow-md transition-all active:translate-y-1"
          >
            <span className="material-symbols-outlined text-[28px]">replay</span>
            <span>もう1回あそぶ！</span>
          </button>
          <div className="grid grid-cols-2 gap-piyo-xs">
            <Link
              href="/apps/piyo-game"
              className="flex h-piyo-touch-min items-center justify-center gap-piyo-xxs rounded-piyo bg-piyo-surface-container-highest font-piyo-label text-piyo-label-lg text-piyo-on-surface shadow-sm transition-all active:translate-y-1"
            >
              <span className="material-symbols-outlined text-piyo-on-surface-variant text-[20px]">cottage</span>
              <span>タイトルへ</span>
            </Link>
            <Link
              href="/apps/piyo-game/shop"
              className="flex h-piyo-touch-min items-center justify-center gap-piyo-xxs rounded-piyo bg-piyo-primary-container font-piyo-label text-piyo-label-lg text-piyo-on-primary-container shadow-sm transition-all active:translate-y-1"
            >
              <span className="material-symbols-outlined text-[20px]">storefront</span>
              <span>ショップへ</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
