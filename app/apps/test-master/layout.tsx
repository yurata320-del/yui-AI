import './test-master.css';

/**
 * 「テストマスター(テスト復習アプリ)」だけの、いちばん外側のわく。
 *
 * このアプリは Stitch(デザインツール)で作った、スマホいっぱいに広がるデザイン。
 * でも app/apps/layout.tsx(全アプリ共通のわく)は、まん中に細く箱を置くデザインになっている。
 * このままだと2つのデザインがぶつかってしまうので、
 * `fixed inset-0`(画面ぜんぶを覆う)を使って、このアプリの中だけ画面いっぱいに表示する。
 * (ぴよちゃんゲームと同じやりかた)
 *
 * ここでやっていること:
 *   1. デザインで使われている書体(フォント)とアイコンを読みこむ
 *   2. 画面いっぱいに広げるための箱を用意する
 */
export default function TestMasterLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Stitchのデザインで使われている書体とアイコンを読みこむ */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&family=Zen+Maru+Gothic:wght@700;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <div className="fixed inset-0 z-40 overflow-y-auto bg-test-surface font-test-body text-test-on-surface antialiased">
        {children}
      </div>
    </>
  );
}
