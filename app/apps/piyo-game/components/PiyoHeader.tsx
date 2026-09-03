import Link from 'next/link';
import PiyoBird from './PiyoBird';

/**
 * ぴよちゃんゲームの、画面いちばん上のバー。
 * どの画面でも同じものが出るように、部品として切り出してある。
 */
export default function PiyoHeader({ points }: { points: number }) {
  return (
    <header className="piyo-pt-safe fixed inset-x-0 top-0 z-50 bg-piyo-surface/85 shadow-[0_4px_20px_rgba(0,101,141,0.06)] backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between gap-piyo-xs px-piyo-hud-safe-side">
        <div className="flex items-center gap-piyo-xs">
          <PiyoBird size={32} />
          <div className="flex flex-col leading-none">
            <span className="font-piyo-label text-piyo-label-md text-piyo-primary">そらとぶ！</span>
            <span className="font-piyo-headline text-piyo-label-lg tracking-tight text-piyo-on-surface">
              ピヨちゃん
            </span>
          </div>
        </div>
        <div className="flex items-center gap-piyo-xs">
          <div className="flex items-center gap-piyo-xxs rounded-piyo-xl bg-piyo-surface-container px-piyo-sm py-piyo-xxs">
            <span className="material-symbols-outlined text-[18px] text-piyo-secondary-container">
              monetization_on
            </span>
            <span className="font-piyo-label text-piyo-label-md font-bold text-piyo-on-surface">{points}</span>
          </div>
          {/* ぴよちゃんゲームの外(アプリ一覧)へもどるリンク */}
          <Link
            href="/"
            aria-label="アプリ一覧へもどる"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-piyo-primary text-piyo-on-primary"
          >
            <span className="material-symbols-outlined text-[18px]">home</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
