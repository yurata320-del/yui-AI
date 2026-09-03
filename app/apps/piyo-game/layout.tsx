import './piyo.css';

/**
 * 「ぴよちゃんゲーム」だけの、いちばん外側のわく。
 *
 * このゲームは Stitch(デザインツール)で作った、スマホいっぱいに広がるデザイン。
 * でも app/apps/layout.tsx(全アプリ共通のわく)は、まん中に細く箱を置くデザインになっている。
 * このままだと2つのデザインがぶつかってしまうので、
 * `fixed inset-0`(画面ぜんぶを覆う)を使って、ぴよちゃんゲームの中だけ画面いっぱいに表示する。
 *
 * ここでやっていること:
 *   1. ゲーム専用の書体(フォント)を読みこむ
 *   2. 画面いっぱいに広げるための箱を用意する
 */
export default function PiyoGameLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/* Stitchのデザインで使われている書体とアイコンを読みこむ */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Quicksand:wght@600;700&family=Rubik:wght@700;800;900&display=swap"
        rel="stylesheet"
      />
      <link
        href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
        rel="stylesheet"
      />
      <div className="fixed inset-0 z-40 overflow-y-auto bg-piyo-surface font-piyo-body text-piyo-on-surface">
        {children}
      </div>
    </>
  );
}
