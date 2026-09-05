'use client';

import { useState } from 'react';
import Link from 'next/link';
import TestBottomNav from '../components/TestBottomNav';

/**
 * 【テストマスター】テスト詳細・解説の画面
 *
 * Stitch のデザイン「テスト詳細 ＆ まちがい解説 (シンプル版)」を、そのまま画面にしたもの。
 *
 * ここでやること:
 *   - テストの点数と、正解・まちがいの数を見せる
 *   - 答案の写真を見せる(「表示/非表示」で出したり隠したりできる)
 *   - まちがえた問題と、AI先生のステップ解説を見せる
 *   - 下のボタンから、リベンジクイズにうつる
 */
export default function TestMasterDetailPage() {
  // 答案スキャン画像を出しているかどうか(「表示/非表示」で切りかえる)
  const [isScanShown, setIsScanShown] = useState(true);

  return (
    // Stitchのデザインでは、この画面の文字は 14px・行間22px・太さ500 になっている
    <div className="text-[14px] font-medium leading-[22px]">
      {/* ヘッダー(もどるボタン + タイトル) */}
      <header className="test-pt-safe fixed top-0 z-40 w-full border-b border-test-surface-variant/40 bg-test-surface/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-md items-center justify-between px-5">
          <div className="flex items-center gap-2">
            <Link
              href="/apps/test-master"
              aria-label="戻る"
              className="flex h-9 w-9 items-center justify-center rounded-full text-test-on-surface transition-all hover:bg-test-surface-container active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">arrow_back_ios_new</span>
            </Link>
            <h1 className="font-test-headline text-lg font-black text-test-on-surface">テスト詳細・解説</h1>
          </div>
          <div className="flex items-center gap-1.5 rounded-full bg-test-secondary-container/15 px-3 py-1 text-sm font-bold text-test-secondary">
            <span className="material-symbols-outlined text-[16px] text-test-secondary">star</span>
            <span>530 pt</span>
          </div>
        </div>
      </header>

      <main className="test-pb-safe relative flex w-full flex-col bg-test-surface pt-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 pb-36 pt-20">
          {/* 1. テストの点数カード */}
          <section className="flex flex-col gap-3 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="rounded-test-s bg-test-primary/10 px-2 py-0.5 text-xs font-bold text-test-primary">
                  算数
                </span>
                <span className="text-xs font-medium text-test-on-surface-variant">小5 • ユニット4</span>
              </div>
              <span className="text-xs text-test-on-surface-variant">2025年5月14日</span>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div className="flex flex-col">
                <h2 className="font-test-headline text-base font-black leading-snug text-test-on-surface">
                  異分母の分数と小数の
                  <br />
                  たし算・ひき算
                </h2>
                <div className="mt-2 flex items-center gap-2.5 text-xs font-bold">
                  <span className="flex items-center gap-0.5 text-test-tertiary">
                    <span className="material-symbols-outlined text-[15px]">check_circle</span>8問正解
                  </span>
                  <span className="flex items-center gap-0.5 text-test-error">
                    <span className="material-symbols-outlined text-[15px]">cancel</span>2問まちがい
                  </span>
                </div>
              </div>
              <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-test-xl bg-test-surface-container-low text-test-primary">
                <span className="text-[10px] font-bold text-test-on-surface-variant">得点</span>
                <div className="flex items-baseline">
                  <span className="font-test-headline text-2xl font-black leading-none text-test-primary">75</span>
                  <span className="ml-0.5 text-[11px] text-test-on-surface-variant">点</span>
                </div>
              </div>
            </div>
          </section>

          {/* 2. 答案スキャン画像 */}
          <section className="flex flex-col gap-2.5 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-test-primary">description</span>
                <span className="font-test-headline text-sm font-bold text-test-on-surface">答案スキャン画像</span>
              </div>
              <button
                type="button"
                onClick={() => setIsScanShown(!isScanShown)}
                className="flex items-center gap-0.5 text-xs font-bold text-test-primary active:opacity-75"
              >
                <span className="material-symbols-outlined text-[16px]">unfold_more</span>
                <span>表示/非表示</span>
              </button>
            </div>
            {isScanShown && (
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-test-l bg-test-surface-container-high">
                {/* ※ まだ本物の写真は撮れないので、見本の絵をおいている */}
                <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-test-on-surface-variant">
                  <span className="material-symbols-outlined text-4xl">image</span>
                  <span className="text-xs font-bold">答案の写真（見本）</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest/90 px-2.5 py-1.5 backdrop-blur-md">
                  <span className="flex items-center gap-1 text-xs font-bold text-test-error">
                    <span className="h-2 w-2 rounded-full bg-test-error" />
                    問4 検出箇所
                  </span>
                  <span className="text-[11px] text-test-on-surface-variant">分数のひき算</span>
                </div>
              </div>
            )}
          </section>

          {/* 3. まちがえた問題とAI解説 */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-test-primary">psychology</span>
                <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">まちがえた問題とAI解説</h3>
              </div>
              <span className="rounded-full bg-test-error/10 px-2 py-0.5 text-xs font-bold text-test-error">
                問 4 / 全10問
              </span>
            </div>

            <div className="flex flex-col gap-4 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 shadow-sm">
              {/* 問題 */}
              <div className="rounded-test-l bg-test-surface-container-low p-3.5">
                <span className="mb-1 block text-xs font-bold text-test-primary">【問4】つぎの計算をしなさい</span>
                <div className="flex items-center justify-center gap-3 py-2 font-test-headline text-2xl font-black text-test-on-surface">
                  <span>3/4</span>
                  <span className="text-test-primary">−</span>
                  <span>2/5</span>
                  <span className="text-test-primary">=</span>
                  <span className="text-test-outline">？</span>
                </div>
              </div>

              {/* あなたの解答 と 正解 をならべる */}
              <div className="grid grid-cols-2 gap-2.5">
                <div className="flex flex-col gap-1 rounded-test-l border border-test-error/20 bg-test-surface-container-low p-3">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-test-error">
                    <span className="material-symbols-outlined text-[14px]">close</span>あなたの解答
                  </span>
                  <span className="font-test-headline text-base font-black text-test-error">1 / -1</span>
                  <span className="text-[11px] text-test-on-surface-variant">分母同士を直接引いたよ</span>
                </div>
                <div className="flex flex-col gap-1 rounded-test-l border border-test-tertiary/20 bg-test-surface-container-low p-3">
                  <span className="flex items-center gap-1 text-[11px] font-bold text-test-tertiary">
                    <span className="material-symbols-outlined text-[14px]">check</span>正解
                  </span>
                  <span className="font-test-headline text-base font-black text-test-tertiary">7 / 20</span>
                  <span className="text-[11px] text-test-on-surface-variant">通分してから計算！</span>
                </div>
              </div>

              {/* AI先生 */}
              <div className="flex items-center gap-2 border-t border-test-outline-variant/20 pt-1">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-test-primary/10 text-sm font-black text-test-primary">
                  AI
                </div>
                <div>
                  <h4 className="font-test-headline text-sm font-bold text-test-on-surface">AI先生のステップ解説</h4>
                  <p className="text-[11px] text-test-on-surface-variant">順序よく確認すればスッキリわかるよ！</p>
                </div>
              </div>

              {/* ステップ解説 */}
              <div className="flex flex-col gap-2">
                <div className="flex items-start gap-2.5 rounded-test-l bg-test-surface-container-low p-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-test-primary text-xs font-bold text-test-on-primary">
                    1
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-test-on-surface">通分（つうぶん）をしよう</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-test-on-surface-variant">
                      分母 4 と 5 の最小公倍数は <strong className="font-bold text-test-primary">20</strong>
                      。分母を20にそろえるよ。
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-test-l bg-test-surface-container-low p-3">
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-test-primary text-xs font-bold text-test-on-primary">
                    2
                  </span>
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-test-on-surface">分子同士を引き算しよう</span>
                    <p className="mt-0.5 text-xs leading-relaxed text-test-on-surface-variant">
                      15/20 − 8/20 = <strong className="font-bold text-test-primary">7/20</strong>
                      。分母はそのままで分子だけ引くよ！
                    </p>
                  </div>
                </div>
              </div>

              {/* ワンポイント */}
              <div className="flex items-start gap-2 rounded-test-l border border-test-secondary/20 bg-test-secondary-container/10 p-3">
                <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-[18px] text-test-secondary">
                  lightbulb
                </span>
                <p className="text-xs font-medium leading-relaxed text-test-secondary">
                  <strong className="font-bold">ワンポイント：</strong>
                  分数の足し算や引き算は、必ず通分してから計算しよう！
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* 下にくっついている、リベンジクイズへのボタン */}
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-test-surface-variant/40 bg-test-surface-container-lowest/95 px-5 py-3 backdrop-blur-md">
          <div className="mx-auto flex max-w-md flex-col items-center gap-1.5">
            <Link
              href="/apps/test-master/quiz"
              className="flex w-full items-center justify-center gap-2 rounded-test-xl bg-test-primary py-3.5 font-test-headline text-sm font-bold text-test-on-primary shadow-sm transition-all hover:bg-test-primary/95 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">play_arrow</span>
              <span>3問リベンジクイズに挑戦する (+50pt)</span>
            </Link>
          </div>
        </div>
      </main>

      <TestBottomNav active="test" />
    </div>
  );
}
