'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TestBottomNav from '../components/TestBottomNav';
import {
  REWARD_GOAL_POINTS,
  REWARD_NAME,
  SUBJECTS,
  SUBJECT_STYLE,
  USER_NAME,
  type TestRecord,
} from '../lib/data';
import { countPoints, loadTests } from '../lib/storage';

/**
 * 【テストマスター】教科別 成績・にがて分析の画面
 *
 * Stitch のデザイン「教科別 成績・にがて分析 (シンプル版)」を、そのまま画面にしたもの。
 *
 * ここでやること:
 *   - 保存してあるテストから、平均点と教科ごとの点数を計算して見せる
 *   - 教科のタブ(すべて/算数/理科/国語/社会)を押すと、下の一覧をしぼりこむ
 *   - まだ記録がないときは「まだ記録がないよ」と出す
 */
export default function TestMasterAnalyticsPage() {
  const [tests, setTests] = useState<TestRecord[]>([]);
  // 今えらんでいる教科のタブ
  const [selectedSubject, setSelectedSubject] = useState('すべて');

  // 画面が出たときに1回だけ、保存してある記録を読みこむ
  useEffect(() => {
    setTests(loadTests());
  }, []);

  const points = countPoints(tests);

  // ぜんぶの平均点(小数第1位まで)
  const average =
    tests.length > 0 ? Math.round((tests.reduce((sum, test) => sum + test.score, 0) / tests.length) * 10) / 10 : 0;

  // 教科ごとの平均点。その教科のテストが1件もなければ入れない
  const subjectAverages = SUBJECTS.map((subject) => {
    const subjectTests = tests.filter((test) => test.subject === subject);
    if (subjectTests.length === 0) return null;
    return {
      subject,
      score: Math.round(subjectTests.reduce((sum, test) => sum + test.score, 0) / subjectTests.length),
    };
  })
    // 点数の高いじゅんにならべる
    .filter((item) => item !== null)
    .sort((a, b) => b!.score - a!.score);

  // 一覧にならべるテスト(タブでしぼりこむ)
  const shownTests =
    selectedSubject === 'すべて' ? tests.slice(0, 3) : tests.filter((test) => test.subject === selectedSubject);

  // ごほうびまで あと何ポイントか
  const restPoints = Math.max(REWARD_GOAL_POINTS - points, 0);
  const rewardPercent = Math.min((points / REWARD_GOAL_POINTS) * 100, 100);

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
              {USER_NAME}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex items-center gap-1.5 rounded-full bg-test-secondary-container/15 px-3 py-1 text-sm font-bold text-test-secondary">
              <span className="material-symbols-outlined text-[16px] text-test-secondary">star</span>
              <span>{points} pt</span>
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
                <span className="text-xs font-bold tracking-wider text-test-on-surface-variant">
                  {subjectAverages.length}教科 総合へいきん
                </span>
                <div className="mt-1 flex items-baseline gap-1">
                  <span className="font-test-headline text-3xl font-black tracking-tight text-test-primary">
                    {tests.length > 0 ? average : '--'}
                  </span>
                  <span className="text-xs font-bold text-test-on-surface-variant">点</span>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <span className="inline-flex items-center gap-1 rounded-full bg-test-surface-container px-2.5 py-1 text-xs font-bold text-test-on-surface-variant">
                  <span className="material-symbols-outlined text-[14px]">description</span>
                  {tests.length}枚 記録ずみ
                </span>
                <span className="text-[11px] text-test-on-surface-variant">テストを撮るたびに +30pt</span>
              </div>
            </div>

            {/* 教科別進捗バー */}
            {subjectAverages.length > 0 ? (
              <div className="flex flex-col gap-2.5 border-t border-test-surface-container pt-2">
                {subjectAverages.map((item) => (
                  <div key={item!.subject} className="flex flex-col gap-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-test-on-surface">{item!.subject}</span>
                      <span className="font-bold text-test-primary">{item!.score}点</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-test-surface-container-low">
                      {/* バーの長さ = 点数(%) */}
                      <div
                        className={`h-full rounded-full ${SUBJECT_STYLE[item!.subject].barClass}`}
                        style={{ width: `${item!.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="border-t border-test-surface-container pt-3 text-center text-xs text-test-on-surface-variant">
                テストを記録すると、教科ごとの点数がここにならぶよ。
              </p>
            )}
          </section>

          {/* 2. 教科スイッチャー */}
          <section className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 py-1">
            {['すべて', ...SUBJECTS].map((tab) => (
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
              {subjectAverages.length > 0 ? (
                <>
                  <p className="font-test-headline text-sm font-bold leading-snug text-test-on-surface">
                    いま いちばん とくいなのは「{subjectAverages[0]!.subject}」だね！
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-test-on-surface-variant">
                    のばしたいのは「{subjectAverages[subjectAverages.length - 1]!.subject}」。
                    つぎのテストでねらってみよう！
                  </p>
                </>
              ) : (
                <>
                  <p className="font-test-headline text-sm font-bold leading-snug text-test-on-surface">
                    まだアドバイスできないよ
                  </p>
                  <p className="mt-1 text-xs leading-relaxed text-test-on-surface-variant">
                    テストを記録すると、とくいな教科とにがてな教科を教えるよ。
                  </p>
                </>
              )}
            </div>
          </section>

          {/* 4. 直近のテスト推移 */}
          <section className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">直近のテスト推移</h3>
              <span className="text-xs text-test-on-surface-variant">{shownTests.length}件</span>
            </div>
            <div className="flex flex-col gap-2">
              {shownTests.map((test) => (
                <Link
                  key={test.id}
                  href={`/apps/test-master/test#${test.id}`}
                  className="flex items-center justify-between rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm transition-all hover:bg-test-surface-container-low"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-test-l font-test-headline text-sm font-black ${SUBJECT_STYLE[test.subject].markClass}`}
                    >
                      {SUBJECT_STYLE[test.subject].mark}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-test-headline text-sm font-bold text-test-on-surface">
                          {test.subject}テスト
                        </p>
                        <span className="rounded-test-s bg-test-surface-container px-1.5 py-0.5 text-[10px] font-bold text-test-on-surface-variant">
                          {test.date}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-test-on-surface-variant">{test.unit}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-test-headline text-xl font-black text-test-on-surface">
                      {test.score}
                      <span className="ml-0.5 text-xs font-normal text-test-on-surface-variant">点</span>
                    </span>
                  </div>
                </Link>
              ))}

              {/* えらんだ教科のテストがまだ無いとき */}
              {shownTests.length === 0 && (
                <p className="rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 text-center text-xs text-test-on-surface-variant shadow-sm">
                  {selectedSubject === 'すべて' ? 'まだテストの記録がないよ。' : `${selectedSubject}のテストは、まだ記録がないよ。`}
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
              <span className="text-xs font-bold text-test-primary">あと {restPoints} pt</span>
            </div>
            <p className="font-test-headline text-sm font-bold text-test-on-surface">{REWARD_NAME}まで</p>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-test-surface-container-low">
              <div className="h-full rounded-full bg-test-primary" style={{ width: `${rewardPercent}%` }} />
            </div>
            <div className="flex items-center justify-between pt-1 text-xs text-test-on-surface-variant">
              <span>現在: {points} pt</span>
              <span>目標: {REWARD_GOAL_POINTS} pt</span>
            </div>
          </section>
        </div>
      </main>

      <TestBottomNav active="analytics" />
    </div>
  );
}
