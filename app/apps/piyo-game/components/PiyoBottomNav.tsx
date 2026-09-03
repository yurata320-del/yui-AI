import Link from 'next/link';

/**
 * ぴよちゃんゲームの、画面いちばん下のナビ(ゲーム/ショップの切りかえ)。
 */
export default function PiyoBottomNav({ active }: { active: 'home' | 'shop' }) {
  const items = [
    { key: 'home' as const, href: '/apps/piyo-game', label: 'ホーム', icon: 'sports_esports' },
    { key: 'shop' as const, href: '/apps/piyo-game/shop', label: 'ショップ', icon: 'storefront' },
  ];

  return (
    <nav className="piyo-pb-safe fixed inset-x-0 bottom-0 z-50 bg-piyo-surface/90 shadow-[0_-4px_20px_rgba(0,101,141,0.06)] backdrop-blur-xl">
      <div className="flex h-20 items-center justify-around px-piyo-xs">
        {items.map((item) => (
          <Link
            key={item.key}
            href={item.href}
            className={`flex h-piyo-touch-min min-w-piyo-touch-min flex-col items-center justify-center gap-piyo-xxs transition-all ${
              active === item.key ? 'scale-105 font-bold text-piyo-primary' : 'text-piyo-on-surface-variant'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">{item.icon}</span>
            <span className="font-piyo-label text-piyo-label-sm">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
