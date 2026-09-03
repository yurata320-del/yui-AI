import Link from 'next/link';

/**
 * /apps/ の中にあるアプリ全部で共通の「わく」。
 * どのアプリを開いても、上に「ホームへもどる」が出るようにしている。
 *
 * 新しくアプリを作るときは app/apps/なまえ/page.tsx を作るだけで、
 * このわくは自動でついてくる(自分で書かなくていい)。
 */
export default function AppsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-50">
      <nav className="border-b border-ink-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3">
          <span className="ui-eyebrow">MY APPS</span>
          <Link href="/" className="tap-target text-xs text-ink-500 transition-colors hover:text-ink-900">
            ホームへもどる
          </Link>
        </div>
      </nav>
      <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
    </div>
  );
}
