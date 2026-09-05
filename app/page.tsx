import Link from 'next/link';
import { BirdIcon, NoteIcon } from '@/components/Icons';

/**
 * ホーム画面(トップページ)。
 * 作ったアプリを「タイル」としてならべる場所。
 *
 * ★ 新しいアプリを作ったら、下の TILES に1つ追加するだけでここに出てくる ★
 *   href        … アプリのURL(/apps/なまえ)
 *   title       … タイルに出る名前
 *   description … 何ができるアプリかの短い説明
 *   accent      … タイルの色(ぜんたいの背景色になる)。POP_COLORS から選ぶ
 *   icon        … components/Icons.tsx にあるアイコン
 *
 * ※ counter / janken / memo は「お手本アプリ」として残してあるけど、
 *    ここでは あえてタイルに出していない(頼まれて外した)。
 *    URLを直接ひらけば、今までどおり遊べるよ:
 *      /apps/counter  /apps/janken  /apps/memo
 */

// タイルの色は、この中から選ぶ(小学生が見て楽しい、はっきりした色にしぼってある)
const POP_COLORS = {
  yellow: '#FFC93C', // サンシャインイエロー
  pink: '#FF6F91', // コーラルピンク
  blue: '#29B6F6', // スカイブルー
  green: '#7ED957', // きみどりグリーン
  purple: '#A66DD4', // グレープパープル
};

interface Tile {
  href: string;
  title: string;
  description: string;
  accent: string;
  icon: (props: { className?: string }) => JSX.Element;
}

const TILES: Tile[] = [
  {
    href: '/apps/piyo-game',
    title: 'ぴよちゃんゲーム',
    description: 'タップで空を飛んで、土管をよけながらコインをあつめるゲーム。',
    accent: POP_COLORS.blue,
    icon: BirdIcon,
  },
  {
    href: '/apps/test-master',
    title: 'テストマスター',
    description: 'テストを撮って、まちがえた問題を復習してポイントをためるアプリ。',
    accent: POP_COLORS.purple,
    icon: NoteIcon,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">🏭 ゆいAI工場</h1>
          <p className="mt-3 text-sm font-medium text-ink-500">ゲームや、べんりなものを、どんどん作っていくよ！</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {TILES.map((tile) => (
            <Link key={tile.href} href={tile.href} className="ui-tile" style={{ background: tile.accent }}>
              {/* 右上の、かざりの丸(シールみたいな雰囲気を出すため) */}
              <span
                className="pointer-events-none absolute -right-4 -top-4 h-16 w-16 rounded-full bg-white/10"
                aria-hidden="true"
              />
              <span className="ui-tile-icon">
                <tile.icon className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <h2 className="ui-tile-title">{tile.title}</h2>
                <p className="ui-tile-desc">{tile.description}</p>
              </div>
            </Link>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-ink-400">
          新しいアプリの作りかたは、README.md に書いてあるよ。
        </p>
      </div>
    </div>
  );
}
