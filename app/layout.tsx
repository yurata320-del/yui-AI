import type { Metadata } from 'next';
import './globals.css';

/**
 * 全部の画面の「いちばん外側」。
 * どの画面を開いても、この中に表示される。
 * タブに出るタイトルはここで決めている。
 */

export const metadata: Metadata = {
  title: 'ゆいAI工場',
  description: 'ゲームや、べんりなものを作っていく場所',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
