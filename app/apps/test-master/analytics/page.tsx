'use client';

import { useState } from 'react';
import Link from 'next/link';
import TestBottomNav from '../components/TestBottomNav';

/**
 * 【テストマスター】教科別 成績・にがて分析の画面
 *
 * Stitch のデザイン「教科別 成績・にがて分析 (シンプル版)」を、そのまま画面にしたもの。
 *
 * ここでやること:
 *   - 4教科の平均点と、教科ごとの点数のバーを見せる
 *   - AI先生のアドバイスを見せる
 *   - 教科のタブ(すべて/算数/理科/国語/社会)を押すと、下の一覧をしぼりこむ
 */

// 教科ごとの点数バー(Stitchのデザインの数字と色のまま)
const SUBJECT_BARS = [
  { name: '理科', score: 92, barClass: 'bg-test-tertiary', scoreClass: 'text-test-primary' },
  { name: '算数', score: 88, barClass: 'bg-test-primary', scoreClass: 'text-test-primary' },
  { name: '国語', score: 85, barClass: 'bg-test-secondary-container', scoreClass: 'text-test-on-surface' },
  { name: '社会', score: 80, barClass: 'bg-test-outline-variant', scoreClass: 'text-test-on-surface' },
];

// 教科をえらぶタブ
const SUBJECT_TABS = ['すべて', '算数', '理科', '国語', '社会'];

// 直近のテスト
const RECENT_TESTS = [
  {
    subject: '算数',
    mark: '算',
    title: '算数テスト',
    unit: '小数のわり算・図形の角',
    score: 88,
    tag: '+13点 UP',
    markClass: 'bg-test-primary/10 text-test-primary',
    tagClass: 'bg-test-surface-container text-test-primary',
    scoreClass: 'text-test-primary',
  },
  {
    subject: '理科',
    mark: '理',
    title: '理科テスト',
    unit: '流れる水のはたらき',
    score: 92,
    tag: '好調',
    markClass: 'bg-test-tertiary/10 text-test-tertiary',
    tagClass: 'bg-test-tertiary-fixed text-test-on-tertiary-fixed',
    scoreClass: 'text-test-on-surface',
  },
  {
    subject: '国語',
    mark: '国',
    title: '国語テスト',
    unit: '言葉と漢字のまとめ',
    score: 85,
    tag: '安定',
    markClass: 'bg-test-secondary/10 text-test-secondary',
    tagClass: 'bg-test-surface-container text-test-on-surface-variant',
    scoreClass: 'text-test-on-surface',
  },
];

export default function TestMasterAnalyticsPage() {
  // 今えらんでいる教科のタブ
  const [selectedSubject, setSelectedSubject] = useState('すべて');

  // 「すべて」ならぜんぶ、それ以外はその教科だけにしぼる
  const shownTests =
    selectedSubject === 'すべて'
      ? RECENT_TESTS
      : RECENT_TESTS.filter((test) => test.subject === selectedSubject);

  return (
    // Stitchのデザインでは、この画面の文字は 14px・行間22px・太さ500 になっている
    <div className="text-[14px] font-medium leading-[22px]">
      {/* ヘッダー(ホーム画面と同じかたち) */}
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

      <main className="relative flex w-full flex-col bg-test-surface pb-28 pt-20">
        <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-5">
          {/* 1. 総合平均点カード */}
          <section className="flex flex-col gap-4 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-xs font-bold tracking-wider text-test-on-surface-variant">4教科 総合へいきん</span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-test-headline text-3xl font-black tracking-tight text-test-primary">83.8</span>
                  <span className="text-xs font-bold text-test-on-surface-variant">点</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-test-tertiary-fixed px-2.5 py-1 text-xs font-bold text-test-on-tertiary-fixed">
                  <span className="material-symbols-outlined text-[14px]">trending_up</span>+5.2点 UP
                </span>
                <span className="text-[11px] text-test-on-surface-variant">目標 85点まで あと1.2点</span>
              </div>
            </div>

            {/* 教科別進捗バー */}
            <div className="flex flex-col gap-2.5 border-t border-test-surface-container pt-2">
              {SUBJECT_BARS.map((subject) => (
                <div key={subject.name} className="flex flex-col gap-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-test-on-surface">{subject.name}</span>
                    <span className={`font-bold ${subject.scoreClass}`}>{subject.score}点</span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-test-surface-container-low">
                    {/* バーの長さ = 点数(%) */}
                    <div className={`h-full rounded-full ${subject.barClass}`} style={{ width: `${subject.score}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 2. 教科スイッチャー */}
          <section className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 py-1">
            {SUBJECT_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => setSelectedSubject(tab)}
                className={
                  selectedSubject === tab
                    ? 'flex-shrink-0 rounded-test-xl bg-test-primary px-4 py-2 text-xs font-bold text-test-on-primary shadow-sm transition-all'
                    : 'flex-shrink-0 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest px-4 py-2 text-xs font-bold text-test-on-surface transition-all hover:bg-test-surface-container-low'
                }
              >
                {tab}
              </button>
            ))}
          </section>

          {/* 3. AIアドバイス / にがて克服 */}
          <section className="flex items-start gap-3 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm">
            <div className="mt-0.5 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-test-xl bg-test-primary/10 text-test-primary">
              <span className="material-symbols-outlined text-2xl">auto_awesome</span>
            </div>
            <div className="flex flex-col">
              <div className="mb-1 flex items-center gap-1.5">
                <span className="rounded-full bg-test-primary/10 px-2 py-0.5 text-[11px] font-bold text-test-primary">
                  AI先生の分析
                </span>
              </div>
              <p className="font-test-headline text-sm font-bold leading-snug text-test-on-surface">
                にがて克服: 分数の引き算マスター！
              </p>
              <p className="mt-1 text-xs leading-relaxed text-test-on-surface-variant">
                次は「平均・単位量」に挑戦して目標85点突破を目指そう！
              </p>
            </div>
          </section>

          {/* 4. 直近のテスト推移 */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">直近のテスト推移</h3>
              <span className="text-xs text-test-on-surface-variant">最新3件</span>
            </div>
            <div className="flex flex-col gap-2">
              {shownTests.map((test) => (
                <Link
                  key={test.title}
                  href="/apps/test-master/test"
                  className="flex items-center justify-between rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm transition-all hover:bg-test-surface-container-low"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-test-l font-test-headline text-sm font-black ${test.markClass}`}
                    >
                      {test.mark}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-test-headline text-sm font-bold text-test-on-surface">{test.title}</p>
                        <span className={`rounded-test-s px-1.5 py-0.5 text-[10px] font-bold ${test.tagClass}`}>
                          {test.tag}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-test-on-surface-variant">{test.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-test-headline text-xl font-black ${test.scoreClass}`}>
                      {test.score}
                      <span className="ml-0.5 text-xs font-normal text-test-on-surface-variant">点</span>
                    </span>
                  </div>
                </Link>
              ))}

              {/* えらんだ教科のテストがまだ無いとき */}
              {shownTests.length === 0 && (
                <p className="rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 text-center text-xs text-test-on-surface-variant shadow-sm">
                  {selectedSubject}のテストは、まだ記録がないよ。
                </p>
              )}
            </div>
          </section>

          {/* 5. ポイント交換・リワード */}
          <section className="flex flex-col gap-3 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-test-secondary">redeem</span>
                <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">ポイントごほうび</h3>
              </div>
              <span className="text-xs font-bold text-test-primary">あと 70 pt</span>
            </div>
            <p className="font-test-headline text-sm font-bold text-test-on-surface">ゴールドえんぴつアバターまで</p>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-test-surface-container-low">
              <div className="h-full rounded-full bg-test-primary" style={{ width: '88%' }} />
            </div>
            <div className="flex items-center justify-between pt-1 text-xs text-test-on-surface-variant">
              <span>現在: 530 pt</span>
              <span>目標: 600 pt</span>
            </div>
          </section>
        </div>
      </main>

      <TestBottomNav active="analytics" />
    </div>
  );
}
