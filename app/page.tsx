import Link from 'next/link';
import { CounterIcon, HandIcon, NoteIcon, BirdIcon } from '@/components/Icons';

/**
 * ホーム画面(トップページ)。
 * 作ったアプリを「タイル」としてならべる場所。
 *
 * ★ 新しいアプリを作ったら、下の TILES に1つ追加するだけでここに出てくる ★
 *   href        … アプリのURL(/apps/なまえ)
 *   title       … タイルに出る名前
 *   description … 何ができるアプリかの短い説明
 *   accent      … タイルの色(上の細い線とアイコンの色)
 *   icon        … components/Icons.tsx にあるアイコン
 */

interface Tile {
  href: string;
  title: string;
  description: string;
  accent: string;
  icon: (props: { className?: string }) => JSX.Element;
}

const TILES: Tile[] = [
  {
    href: '/apps/counter',
    title: 'カウンター',
    description: 'ボタンをおすと数がふえる。いちばんかんたんなアプリ。',
    accent: '#33415c', // ネイビー
    icon: CounterIcon,
  },
  {
    href: '/apps/janken',
    title: 'じゃんけん',
    description: 'コンピューターとじゃんけん。勝った回数もかぞえるよ。',
    accent: '#7a5c3e', // ブロンズ
    icon: HandIcon,
  },
  {
    href: '/apps/memo',
    title: 'メモ',
    description: '書いたことをブラウザに保存する。とじても消えない。',
    accent: '#5b8a72', // グリーン
    icon: NoteIcon,
  },
  {
    href: '/apps/piyo-game',
    title: 'ぴよちゃんゲーム',
    description: 'タップで空を飛んで、土管をよけながらコインをあつめるゲーム。',
    accent: '#5f7a94', // ブルー
    icon: BirdIcon,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-ink-50">
      <div className="mx-auto max-w-4xl px-4 py-14 sm:py-20">
        <div className="text-center">
          <h1 className="text-[22px] font-semibold uppercase tracking-[0.2em] text-ink-900 sm:text-[26px]">
            YUI&apos;S APPS
          </h1>
          <p className="mt-3 text-sm text-ink-500">じぶんで作ったアプリをならべる場所。</p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {TILES.map((tile) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group relative flex flex-col gap-2.5 overflow-hidden rounded-lg border border-ink-200 bg-white p-4 transition-all duration-150 hover:border-ink-300 hover:shadow-md"
            >
              {/* タイルの上にある細い色の線 */}
              <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: tile.accent }} aria-hidden="true" />
              <span
                className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-md"
                style={{ background: `${tile.accent}1a`, color: tile.accent }}
              >
                <tile.icon />
              </span>
              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-ink-900">{tile.title}</h2>
                <p className="mt-1 text-xs leading-relaxed text-ink-500">{tile.description}</p>
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
