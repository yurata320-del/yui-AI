'use client';

import { useState } from 'react';
import Link from 'next/link';
import TestBottomNav from './components/TestBottomNav';

/**
 * 【テストマスター】ホーム画面(テストスキャン)
 *
 * Stitch のデザイン「ホーム ＆ テストスキャン (シンプル版)」を、そのまま画面にしたもの。
 * 色・余白・文字の大きさは、Stitch のコードの数字をそのまま使っている。
 *
 * ここでやること:
 *   - 「テストをパシャリと撮影」を押すと、撮影の画面(モーダル)が出る
 *   - シャッターを押すと、AIが読みとったことにして、お知らせを出す
 *   - いまのやること(リベンジクイズ)と、さいきんのテスト記録をならべる
 *
 * ※ まだ本物のカメラやAIにはつないでいない。見た目と動きの練習の段階。
 */

// さいきんのテスト記録。今はお手本のデータを直接書いている(あとで保存できるようにする)
const RECENT_TESTS = [
  {
    subject: '算数', // 教科の名前
    mark: '算', // まるいバッジに出す1文字
    title: '算数テスト',
    unit: '小数のかけ算・わり算',
    score: 88,
    // 教科ごとの色(Stitchのデザインのとおり)
    markClass: 'bg-test-primary/10 text-test-primary',
  },
  {
    subject: '理科',
    mark: '理',
    title: '理科テスト',
    unit: '流れる水のはたらき',
    score: 92,
    markClass: 'bg-test-tertiary/10 text-test-tertiary',
  },
  {
    subject: '国語',
    mark: '国',
    title: '国語テスト',
    unit: '言葉と漢字のまとめ',
    score: 85,
    markClass: 'bg-test-secondary/10 text-test-secondary',
  },
];

export default function TestMasterHomePage() {
  // 撮影の画面(モーダル)を出しているかどうか
  const [isScanOpen, setIsScanOpen] = useState(false);
  // 画面の上に出す、みじかいお知らせ。何もないときは空っぽ
  const [message, setMessage] = useState('');

  // シャッターを押したとき: 撮影の画面を閉じて、お知らせを出す
  function handleShutter() {
    setIsScanOpen(false);
    setMessage('📸 パシャ！AIがテストを解析しました！（算数 88点）');
  }

  // 「アルバムから選ぶ」を押したとき
  function handleAlbum() {
    setMessage('📷 アルバムからテスト写真を選択します');
  }

  return (
    <>
      {/* 1. シンプルなヘッダー */}
      <header className="test-pt-safe fixed top-0 z-40 w-full border-b border-test-surface-variant/40 bg-test-surface/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-5">
          <div className="flex items-center gap-2.5">
            <span className="font-test-headline text-xl font-black tracking-tight text-test-primary">
              テストマスター
            </span>
            <span className="rounded-full bg-test-surface-container px-2 py-0.5 text-xs font-medium text-test-on-surface-variant">
              ゆうき
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-full bg-test-secondary-container/15 px-3 py-1 text-sm font-bold text-test-secondary">
              <span className="material-symbols-outlined text-[16px] text-test-secondary">star</span>
              <span>530 pt</span>
            </div>
            {/* このアプリの外(ゆいAI工場のホーム)へもどるボタン */}
            <Link
              href="/"
              aria-label="アプリ一覧へもどる"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-test-primary text-test-on-primary"
            >
              <span className="material-symbols-outlined text-[18px]">home</span>
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-6 px-5 pb-28 pt-20">
        {/* お知らせ(ボタンを押したときだけ出る) */}
        {message !== '' && (
          <div className="flex items-center justify-between gap-3 rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-low p-4 text-sm font-bold text-test-on-surface">
            <span>{message}</span>
            <button
              type="button"
              onClick={() => setMessage('')}
              aria-label="お知らせを閉じる"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-test-on-surface-variant"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        )}

        {/* 2. メイン直感アクション：大きく押しやすいスキャンカード */}
        <section className="flex flex-col items-center rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-6 text-center shadow-sm">
          <div className="mb-3 flex h-16 w-16 items-center justify-center rounded-full bg-test-primary/10 text-test-primary">
            <span className="material-symbols-outlined text-4xl">photo_camera</span>
          </div>
          <h2 className="mb-1.5 font-test-headline text-xl font-black text-test-on-surface">テストを撮影する</h2>
          <p className="mb-5 max-w-xs text-xs leading-relaxed text-test-on-surface-variant">
            写真を撮るだけでAIが自動で教科・点数を判定するよ！
          </p>
          <div className="flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={() => setIsScanOpen(true)}
              className="flex w-full items-center justify-center gap-2 rounded-test-l bg-test-primary py-4 font-test-headline text-base font-bold text-test-on-primary shadow-sm transition-all hover:bg-test-primary/95 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-2xl">center_focus_strong</span>
              <span>テストをパシャリと撮影</span>
            </button>
            <button
              type="button"
              onClick={handleAlbum}
              className="flex w-full items-center justify-center gap-1.5 rounded-test-l bg-test-surface-container-low py-2.5 text-sm font-bold text-test-on-surface transition-all hover:bg-test-surface-container"
            >
              <span className="material-symbols-outlined text-lg text-test-on-surface-variant">photo_library</span>
              <span>アルバムから選ぶ</span>
            </button>
          </div>
        </section>

        {/* 3. やること / リベンジ（1件だけ大きくシンプルに） */}
        <section className="flex flex-col gap-2">
          <h3 className="px-1 text-xs font-bold tracking-wider text-test-on-surface-variant">いまのやること</h3>
          <div className="flex items-center justify-between gap-3 rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-test-l bg-test-secondary-container/20 text-test-secondary">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="rounded-test-s bg-test-surface-container px-1.5 py-0.5 text-xs font-bold text-test-primary">
                    算数
                  </span>
                  <span className="text-xs text-test-on-surface-variant">あと1問</span>
                </div>
                <span className="mt-0.5 font-test-headline text-sm font-bold text-test-on-surface">
                  まちがいリベンジクイズ
                </span>
              </div>
            </div>
            <Link
              href="/apps/test-master/quiz"
              className="flex shrink-0 items-center gap-1 rounded-test-m bg-test-secondary px-4 py-2.5 font-test-headline text-xs font-bold text-test-on-secondary shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              <span>挑戦する</span>
              <span className="text-[11px] opacity-90">(+50pt)</span>
            </Link>
          </div>
        </section>

        {/* 4. さいきんのテスト記録 */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">さいきんのテスト記録</h3>
            <span className="text-xs text-test-on-surface-variant">最新3件</span>
          </div>
          <div className="flex flex-col gap-2">
            {/* 押すと「テスト詳細・解説」の画面にうつる(今はどれも同じ見本の詳細が出る) */}
            {RECENT_TESTS.map((test) => (
              <Link
                key={test.title}
                href="/apps/test-master/test"
                className="flex items-center justify-between rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm transition-all hover:bg-test-surface-container-low active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-test-m font-test-headline text-sm font-black ${test.markClass}`}
                  >
                    {test.mark}
                  </div>
                  <div>
                    <p className="font-test-headline text-sm font-bold text-test-on-surface">{test.title}</p>
                    <p className="text-xs text-test-on-surface-variant">{test.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-test-headline text-xl font-black text-test-on-surface">
                    {test.score}
                    <span className="ml-0.5 text-xs font-normal text-test-on-surface-variant">点</span>
                  </span>
                  <span className="material-symbols-outlined text-lg text-test-outline-variant">chevron_right</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      {/* 撮影モーダル（シミュレーション）。「テストをパシャリと撮影」を押したときだけ出る */}
      {isScanOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-test-inverse-surface/85 p-6 backdrop-blur-md">
          <div className="test-pt-safe flex items-center justify-between text-test-on-primary">
            <button
              type="button"
              onClick={() => setIsScanOpen(false)}
              aria-label="撮影をやめる"
              className="flex h-10 w-10 items-center justify-center rounded-full bg-test-surface-container-lowest/20 active:scale-90"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
            <span className="text-sm font-bold">枠の中にテストを入れてね</span>
            <div className="w-10" />
          </div>

          {/* テストを合わせる、点線のわく */}
          <div className="relative mx-auto flex aspect-[3/4] w-full max-w-[320px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-test-on-primary/60 p-6 text-center text-test-on-primary">
            <span className="material-symbols-outlined mb-2 text-5xl opacity-80">document_scanner</span>
            <p className="text-base font-bold">テスト全体を写してね</p>
            <p className="mt-1 text-xs opacity-70">明るい場所でブレないように持とう</p>
          </div>

          {/* シャッターボタン */}
          <div className="test-pb-safe mb-4 flex items-center justify-center">
            <button
              type="button"
              onClick={handleShutter}
              aria-label="シャッター"
              className="h-20 w-20 rounded-full bg-test-on-primary p-1.5 shadow-lg transition-transform active:scale-95"
            >
              <div className="flex h-full w-full items-center justify-center rounded-full bg-test-primary text-test-on-primary">
                <span className="material-symbols-outlined text-3xl">photo_camera</span>
              </div>
            </button>
          </div>
        </div>
      )}

      {/* 5. 直感的なボトムナビゲーション */}
      <TestBottomNav active="home" />
    </>
  );
}
