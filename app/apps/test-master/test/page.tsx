'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TestBottomNav from '../components/TestBottomNav';
import { SUBJECT_STYLE, type TestRecord } from '../lib/data';
import { countPoints, loadTests, removeTest } from '../lib/storage';

/**
 * 【テストマスター】テスト詳細・解説の画面
 *
 * Stitch のデザイン「テスト詳細 ＆ まちがい解説 (シンプル版)」を、そのまま画面にしたもの。
 *
 * ここでやること:
 *   - えらんだテストの点数と、撮った写真を見せる
 *   - いらない記録を消せるようにする
 *   - まだ記録がないときは「まだ記録がないよ」と出す
 *
 * どのテストを見せるか:
 *   ホームでタップすると /apps/test-master/test#(番号) にうつるので、
 *   その「#のうしろの番号」でどのテストかを見分ける。番号がなければ、いちばん新しいテスト。
 */
export default function TestMasterDetailPage() {
  const [tests, setTests] = useState<TestRecord[]>([]);
  const [selectedId, setSelectedId] = useState('');
  // 答案スキャン画像を出しているかどうか(「表示/非表示」で切りかえる)
  const [isScanShown, setIsScanShown] = useState(true);

  // 画面が出たときに1回だけ、保存してある記録とURLの番号を読みこむ
  useEffect(() => {
    setTests(loadTests());
    setSelectedId(window.location.hash.replace('#', ''));
  }, []);

  const points = countPoints(tests);
  // URLの番号のテストをさがす。見つからなければ、いちばん新しいテスト
  const test = tests.find((item) => item.id === selectedId) ?? tests[0];

  // このテストの記録を消す
  function handleDelete() {
    if (!test) return;
    const rest = removeTest(test.id);
    setTests(rest);
    setSelectedId('');
  }

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
            <span>{points} pt</span>
          </div>
        </div>
      </header>

      <main className="test-pb-safe relative flex w-full flex-col bg-test-surface pt-16">
        <div className="mx-auto flex w-full max-w-md flex-1 flex-col gap-5 px-5 pb-36 pt-20">
          {test ? (
            <>
              {/* 1. テストの点数カード */}
              <section className="flex flex-col gap-3 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-test-s px-2 py-0.5 text-xs font-bold ${SUBJECT_STYLE[test.subject].markClass}`}
                    >
                      {test.subject}
                    </span>
                  </div>
                  <span className="text-xs text-test-on-surface-variant">{test.date}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex flex-col">
                    <h2 className="font-test-headline text-base font-black leading-snug text-test-on-surface">
                      {test.unit}
                    </h2>
                    <div className="mt-2 flex items-center gap-2.5 text-xs font-bold">
                      {test.correctCount >= 0 && (
                        <span className="flex items-center gap-0.5 text-test-tertiary">
                          <span className="material-symbols-outlined text-[15px]">check_circle</span>
                          {test.correctCount}問正解
                        </span>
                      )}
                      {test.wrongCount >= 0 && (
                        <span className="flex items-center gap-0.5 text-test-error">
                          <span className="material-symbols-outlined text-[15px]">cancel</span>
                          {test.wrongCount}問まちがい
                        </span>
                      )}
                      {test.readByAI && (
                        <span className="flex items-center gap-0.5 text-test-primary">
                          <span className="material-symbols-outlined text-[15px]">auto_awesome</span>AIが読みとり
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex h-16 w-16 flex-shrink-0 flex-col items-center justify-center rounded-test-xl bg-test-surface-container-low text-test-primary">
                    <span className="text-[10px] font-bold text-test-on-surface-variant">得点</span>
                    <div className="flex items-baseline">
                      <span className="font-test-headline text-2xl font-black leading-none text-test-primary">
                        {test.score}
                      </span>
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
                {isScanShown &&
                  (test.photo !== '' ? (
                    // 撮った写真。next/image は使わず、保存した画像データをそのまま出す
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={test.photo}
                      alt="答案の写真"
                      className="w-full rounded-test-l bg-test-surface-container-high object-contain"
                    />
                  ) : (
                    <div className="flex aspect-[16/9] w-full flex-col items-center justify-center gap-1 rounded-test-l bg-test-surface-container-high text-test-on-surface-variant">
                      <span className="material-symbols-outlined text-4xl">image</span>
                      <span className="text-xs font-bold">写真はないよ</span>
                    </div>
                  ))}
              </section>

              {/* 3. まちがえた問題とAI解説 */}
              <section className="flex flex-col gap-2.5">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[18px] text-test-primary">psychology</span>
                    <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">
                      まちがえた問題とAI解説
                    </h3>
                  </div>
                  {test.mistakes.length > 0 && (
                    <span className="rounded-full bg-test-error/10 px-2 py-0.5 text-xs font-bold text-test-error">
                      {test.mistakes.length}問
                    </span>
                  )}
                </div>

                {/* まちがえた問題を、1問ずつカードで出す */}
                {test.mistakes.map((mistake, index) => (
                  <div
                    key={index}
                    className="flex flex-col gap-4 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 shadow-sm"
                  >
                    {/* 問題 */}
                    <div className="rounded-test-l bg-test-surface-container-low p-3.5">
                      <span className="mb-1 block text-xs font-bold text-test-primary">
                        {mistake.questionNumber > 0 ? `【問${mistake.questionNumber}】` : '【まちがえた問題】'}
                      </span>
                      <div className="flex items-center justify-center py-2 text-center font-test-headline text-2xl font-black text-test-on-surface">
                        {mistake.question}
                      </div>
                    </div>

                    {/* あなたの解答 と 正解 をならべる */}
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="flex flex-col gap-1 rounded-test-l border border-test-error/20 bg-test-surface-container-low p-3">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-test-error">
                          <span className="material-symbols-outlined text-[14px]">close</span>あなたの解答
                        </span>
                        <span className="font-test-headline text-base font-black text-test-error">
                          {mistake.yourAnswer}
                        </span>
                        <span className="text-[11px] text-test-on-surface-variant">{mistake.why}</span>
                      </div>
                      <div className="flex flex-col gap-1 rounded-test-l border border-test-tertiary/20 bg-test-surface-container-low p-3">
                        <span className="flex items-center gap-1 text-[11px] font-bold text-test-tertiary">
                          <span className="material-symbols-outlined text-[14px]">check</span>正解
                        </span>
                        <span className="font-test-headline text-base font-black text-test-tertiary">
                          {mistake.correctAnswer}
                        </span>
                      </div>
                    </div>

                    {/* AI先生 */}
                    <div className="flex items-center gap-2 border-t border-test-outline-variant/20 pt-1">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-test-primary/10 text-sm font-black text-test-primary">
                        AI
                      </div>
                      <div>
                        <h4 className="font-test-headline text-sm font-bold text-test-on-surface">
                          AI先生のステップ解説
                        </h4>
                        <p className="text-[11px] text-test-on-surface-variant">
                          順序よく確認すればスッキリわかるよ！
                        </p>
                      </div>
                    </div>

                    {/* ステップ解説 */}
                    <div className="flex flex-col gap-2">
                      {mistake.steps.map((step, stepIndex) => (
                        <div
                          key={stepIndex}
                          className="flex items-start gap-2.5 rounded-test-l bg-test-surface-container-low p-3"
                        >
                          <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-test-primary text-xs font-bold text-test-on-primary">
                            {stepIndex + 1}
                          </span>
                          <div className="flex flex-col">
                            <span className="text-xs font-bold text-test-on-surface">{step.title}</span>
                            <p className="mt-0.5 text-xs leading-relaxed text-test-on-surface-variant">{step.body}</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* ワンポイント */}
                    <div className="flex items-start gap-2 rounded-test-l border border-test-secondary/20 bg-test-secondary-container/10 p-3">
                      <span className="material-symbols-outlined mt-0.5 flex-shrink-0 text-[18px] text-test-secondary">
                        lightbulb
                      </span>
                      <p className="text-xs font-medium leading-relaxed text-test-secondary">
                        <strong className="font-bold">ワンポイント：</strong>
                        {mistake.onePoint}
                      </p>
                    </div>
                  </div>
                ))}

                {/* まちがいが1つも見つからなかったとき */}
                {test.mistakes.length === 0 && (
                  <div className="flex flex-col items-center gap-1 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-6 text-center shadow-sm">
                    <span className="material-symbols-outlined text-3xl text-test-outline-variant">psychology</span>
                    <p className="mt-1 font-test-headline text-sm font-bold text-test-on-surface">
                      {test.readByAI ? 'まちがいは見つからなかったよ' : '解説はまだないよ'}
                    </p>
                    <p className="text-xs leading-relaxed text-test-on-surface-variant">
                      {test.readByAI
                        ? '全部正解だったのかも！すごい！'
                        : 'AIサーバーを動かして写真を撮ると、解説がつくよ。'}
                    </p>
                  </div>
                )}
              </section>

              {/* リベンジクイズへのボタン(問題があるときだけ) */}
              {test.quiz.length > 0 && (
                <Link
                  href="/apps/test-master/quiz"
                  className="flex w-full items-center justify-center gap-2 rounded-test-xl bg-test-primary py-3.5 font-test-headline text-sm font-bold text-test-on-primary shadow-sm transition-all hover:bg-test-primary/95 active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-xl">play_arrow</span>
                  <span>{test.quiz.length}問リベンジクイズに挑戦する (+50pt)</span>
                </Link>
              )}

              {/* この記録を消すボタン */}
              <button
                type="button"
                onClick={handleDelete}
                className="flex w-full items-center justify-center gap-1.5 rounded-test-l border border-test-error/30 bg-test-surface-container-lowest py-3 text-xs font-bold text-test-error transition-all hover:bg-test-error-container active:scale-[0.99]"
              >
                <span className="material-symbols-outlined text-[18px]">delete</span>
                <span>この記録を消す</span>
              </button>
            </>
          ) : (
            // まだ1件も記録がないとき
            <div className="flex flex-col items-center gap-1 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest p-8 text-center shadow-sm">
              <span className="material-symbols-outlined text-4xl text-test-outline-variant">description</span>
              <p className="mt-2 font-test-headline text-sm font-bold text-test-on-surface">
                まだテストの記録がないよ
              </p>
              <p className="text-xs leading-relaxed text-test-on-surface-variant">
                ホームでテストを撮ると、ここに出るよ。
              </p>
              <Link
                href="/apps/test-master"
                className="mt-4 flex items-center justify-center gap-2 rounded-test-xl bg-test-primary px-6 py-3 font-test-headline text-sm font-bold text-test-on-primary shadow-sm active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-xl">photo_camera</span>
                <span>テストを撮りにいく</span>
              </Link>
            </div>
          )}
        </div>
      </main>

      <TestBottomNav active="test" />
    </div>
  );
}
