import Link from 'next/link';

/**
 * 画面のいちばん下にある、3つのタブ。
 * どの画面でも同じものが出るように、部品として切り出してある。
 *
 * active = 今いる画面。その文字だけ青色(test-primary)になる。
 *   'home'     … ホーム
 *   'test'     … テスト(詳細・解説)
 *   'revenge'  … リベンジクイズ中(まん中が「テスト」ではなく「リベンジ」になる)
 *   'analytics'… 分析
 */
export default function TestBottomNav({
  active,
}: {
  active: 'home' | 'test' | 'revenge' | 'analytics';
}) {
  // 今いる画面かどうかで、文字の色を変える
  function colorOf(name: string) {
    return active === name ? 'text-test-primary' : 'text-test-on-surface-variant hover:text-test-primary';
  }

  return (
    <nav className="test-pb-safe fixed bottom-0 z-40 w-full border-t border-test-surface-variant/40 bg-test-surface-container-lowest/95 backdrop-blur-lg">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around px-6">
        <Link href="/apps/test-master" className={`flex flex-col items-center justify-center ${colorOf('home')}`}>
          <span className="material-symbols-outlined text-2xl">home</span>
          <span className="mt-0.5 text-[11px] font-bold">ホーム</span>
        </Link>

        {/* まん中は、クイズ中だけ「リベンジ」になる(Stitchのデザインのとおり) */}
        {active === 'revenge' ? (
          <Link href="/apps/test-master/quiz" className="flex flex-col items-center justify-center text-test-primary">
            <span className="material-symbols-outlined text-2xl">bolt</span>
            <span className="mt-0.5 text-[11px] font-bold">リベンジ</span>
          </Link>
        ) : (
          <Link href="/apps/test-master/test" className={`flex flex-col items-center justify-center ${colorOf('test')}`}>
            <span className="material-symbols-outlined text-2xl">description</span>
            <span className="mt-0.5 text-[11px] font-bold">テスト</span>
          </Link>
        )}

        <Link
          href="/apps/test-master/analytics"
          className={`flex flex-col items-center justify-center ${colorOf('analytics')}`}
        >
          <span className="material-symbols-outlined text-2xl">insights</span>
          <span className="mt-0.5 text-[11px] font-bold">分析</span>
        </Link>
      </div>
    </nav>
  );
}
