'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import TestBottomNav from '../components/TestBottomNav';
import { collectQuiz, loadTests } from '../lib/storage';

/**
 * 【テストマスター】リベンジクイズの画面
 *
 * Stitch のデザイン「3問リベンジクイズ (シンプル版)」を、そのまま画面にしたもの。
 *
 * ここでやること:
 *   - AIがまちがえた問題から作ったクイズを、1問ずつ出す(多くても3問)
 *   - A〜Dから答えをえらんで「答え合わせをする」を押す
 *   - 正解なら次の問題へ。ぜんぶ終わったら「たいへんよくできました！」が出る
 *   - 「ヒントを見る」で、AI先生のヒントを出せる
 */

// A・B・C・D の文字
const CHOICE_LABELS = ['A', 'B', 'C', 'D'];

export default function TestMasterQuizPage() {
  // 保存してある記録から集めた、クイズの問題
  const [questions, setQuestions] = useState<ReturnType<typeof collectQuiz>>([]);
  // 記録を読みこみ終わったかどうか(読む前に「問題がないよ」と出さないため)
  const [isLoaded, setIsLoaded] = useState(false);
  // 今なん問目か(0からかぞえる)
  const [questionNumber, setQuestionNumber] = useState(0);
  // えらんでいる答えの番号。まだえらんでいないときは null
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  // ヒントを出しているかどうか
  const [isHintShown, setIsHintShown] = useState(false);
  // まちがえたときのメッセージ
  const [isWrong, setIsWrong] = useState(false);
  // ぜんぶ正解したかどうか(お祝いの画面を出す)
  const [isFinished, setIsFinished] = useState(false);

  // 画面が出たときに1回だけ、保存してある記録からクイズを集める
  useEffect(() => {
    setQuestions(collectQuiz(loadTests()));
    setIsLoaded(true);
  }, []);

  // 問題が1問もないときは、「まだ問題がないよ」の画面を出す
  if (isLoaded && questions.length === 0) {
    return (
      <div className="text-[14px] font-medium leading-[22px]">
        <header className="test-pt-safe fixed top-0 z-40 w-full border-b border-test-surface-variant/40 bg-test-surface/90 backdrop-blur-md">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-2">
              <Link
                href="/apps/test-master"
                aria-label="戻る"
                className="flex h-9 w-9 items-center justify-center rounded-full bg-test-surface-container-low text-test-on-surface transition-colors hover:bg-test-surface-container"
              >
                <span className="material-symbols-outlined text-xl">arrow_back</span>
              </Link>
              <span className="font-test-headline text-sm font-bold text-test-on-surface">リベンジクイズ</span>
            </div>
          </div>
        </header>

        <main className="mx-auto flex w-full max-w-md flex-col gap-4 px-5 pb-28 pt-20">
          <div className="flex flex-col items-center gap-1 rounded-test-s border border-test-outline-variant/30 bg-test-surface-container-lowest p-8 text-center shadow-sm">
            <span className="material-symbols-outlined text-4xl text-test-outline-variant">bolt</span>
            <p className="mt-2 font-test-headline text-sm font-bold text-test-on-surface">まだ問題がないよ</p>
            <p className="text-xs leading-relaxed text-test-on-surface-variant">
              テストを撮ると、まちがえた問題から
              <br />
              AIがクイズを作ってくれるよ。
            </p>
            <Link
              href="/apps/test-master"
              className="mt-4 flex items-center justify-center gap-2 rounded-test-xl bg-test-primary px-6 py-3 font-test-headline text-sm font-bold text-test-on-primary shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-xl">photo_camera</span>
              <span>テストを撮りにいく</span>
            </Link>
          </div>
        </main>

        <TestBottomNav active="revenge" />
      </div>
    );
  }

  const question = questions[questionNumber];

  // まだ読みこみ中のときは、何も出さない
  if (!question) return null;

  // 「答え合わせをする」を押したとき
  function handleCheckAnswer() {
    // まだえらんでいないときは、なにもしない
    if (selectedIndex === null) return;

    if (selectedIndex === question.answerIndex) {
      // 正解！ 最後の問題なら お祝い、まだなら次の問題へ
      if (questionNumber === questions.length - 1) {
        setIsFinished(true);
      } else {
        setQuestionNumber(questionNumber + 1);
        setSelectedIndex(null);
        setIsHintShown(false);
        setIsWrong(false);
      }
    } else {
      // まちがい。もういちど考えてもらう
      setIsWrong(true);
    }
  }

  return (
    // Stitchのデザインでは、この画面の文字は 14px・行間22px・太さ500 になっている
    <div className="text-[14px] font-medium leading-[22px]">
      {/* ヘッダー(もどるボタン + 教科 + ポイント) */}
      <header className="test-pt-safe fixed top-0 z-40 w-full border-b border-test-surface-variant/40 bg-test-surface/90 backdrop-blur-md">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <Link
              href="/apps/test-master"
              aria-label="戻る"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-test-surface-container-low text-test-on-surface transition-colors hover:bg-test-surface-container"
            >
              <span className="material-symbols-outlined text-xl">arrow_back</span>
            </Link>
            <div className="flex items-center gap-1.5">
              <span className="rounded-full bg-test-surface-container px-2 py-0.5 text-xs font-bold text-test-primary">
                {question.subject}
              </span>
              <span className="font-test-headline text-sm font-bold text-test-on-surface">リベンジクイズ</span>
            </div>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-test-secondary-container/15 px-3 py-1 text-xs font-bold text-test-secondary">
            <span className="material-symbols-outlined text-[15px] text-test-secondary">star</span>
            <span>+50 pt</span>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-md flex-1 flex-col gap-4 px-5 pb-28 pt-16">
        {/* 1. すすみぐあい */}
        <section className="mt-2 flex flex-col gap-2 rounded-test-s border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-test-on-surface-variant">{question.unit}</span>
            <span className="font-black text-test-primary">
              問 {questionNumber + 1}{' '}
              <span className="text-xs font-normal text-test-on-surface-variant">/ {questions.length}問</span>
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-test-surface-container">
            {/* バーの長さ = 今なん問目か */}
            <div
              className="h-full rounded-full bg-test-primary transition-all duration-300"
              style={{ width: `${((questionNumber + 1) / questions.length) * 100}%` }}
            />
          </div>
        </section>

        {/* 2. 問題 */}
        <section className="flex flex-col items-center rounded-test-s border border-test-outline-variant/30 bg-test-surface-container-lowest p-5 text-center shadow-sm">
          <span className="mb-2 self-start rounded-full bg-test-primary/10 px-2.5 py-0.5 text-xs font-bold text-test-primary">
            問題
          </span>
          <h2 className="mb-4 self-start text-left font-test-headline text-base font-black text-test-on-surface">
            正しい答えはどれかな？
          </h2>

          {/* 問題(AIがまちがえた問題から作ったもの) */}
          <div className="my-1 flex w-full items-center justify-center gap-3 rounded-test-xl bg-test-surface-container-low px-4 py-5 text-center font-test-headline text-2xl font-black leading-relaxed text-test-on-surface shadow-inner">
            {question.question}
          </div>

          {/* ヒントのボタン */}
          <div className="mt-3 flex w-full items-center justify-end">
            <button
              type="button"
              onClick={() => setIsHintShown(!isHintShown)}
              className="flex items-center gap-1 rounded-test-l px-2 py-1 text-xs font-bold text-test-primary transition-colors hover:bg-test-surface-container-low hover:underline"
            >
              <span className="material-symbols-outlined text-base">lightbulb</span>
              <span>ヒントを見る</span>
            </button>
          </div>

          {/* ヒントの中身(ボタンを押したときだけ出る) */}
          {isHintShown && (
            <div className="mt-2 flex w-full flex-col gap-1 rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-low p-3 text-left text-xs leading-relaxed text-test-on-surface-variant">
              <span className="flex items-center gap-1 font-bold text-test-primary">
                <span className="material-symbols-outlined text-sm">tips_and_updates</span> AI先生のヒント
              </span>
              <span>{question.hint}</span>
            </div>
          )}
        </section>

        {/* 3. 答えのせんたくし */}
        <section className="flex flex-col gap-2.5">
          <span className="px-1 text-xs font-bold text-test-on-surface-variant">正しい答えを選んでね</span>
          <div className="flex flex-col gap-2">
            {question.choices.map((choice, index) => {
              // 今えらんでいる答えかどうかで、見た目を変える
              const isSelected = selectedIndex === index;
              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => {
                    setSelectedIndex(index);
                    setIsWrong(false);
                  }}
                  className={
                    isSelected
                      ? 'flex w-full items-center justify-between rounded-test-xl border-2 border-test-primary bg-test-primary/10 px-4 py-3.5 text-left text-test-primary shadow-sm transition-all active:scale-[0.99]'
                      : 'flex w-full items-center justify-between rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-lowest px-4 py-3.5 text-left text-test-on-surface shadow-sm transition-all hover:bg-test-surface-container-low active:scale-[0.99]'
                  }
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={
                        isSelected
                          ? 'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-test-primary text-xs font-bold text-test-on-primary'
                          : 'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-test-surface-container text-xs font-bold text-test-on-surface-variant'
                      }
                    >
                      {CHOICE_LABELS[index]}
                    </span>
                    {isSelected ? (
                      <div className="flex items-center gap-2">
                        <span className="font-test-headline text-lg font-black text-test-primary">{choice}</span>
                        <span className="rounded-full bg-test-primary px-2 py-0.5 text-[11px] font-bold text-test-on-primary">
                          正解候補
                        </span>
                      </div>
                    ) : (
                      <span className="font-test-headline text-base font-bold">{choice}</span>
                    )}
                  </div>
                  <span
                    className={
                      isSelected
                        ? 'material-symbols-outlined text-2xl text-test-primary'
                        : 'material-symbols-outlined text-xl text-test-outline-variant'
                    }
                  >
                    {isSelected ? 'check_circle' : 'radio_button_unchecked'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* まちがえたときだけ出るメッセージ */}
          {isWrong && (
            <p className="px-1 text-xs font-bold text-test-error">
              おしい！ヒントを見て、もういちど考えてみよう。
            </p>
          )}
        </section>

        {/* 4. 答え合わせのボタン */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleCheckAnswer}
            className="flex w-full items-center justify-center gap-2 rounded-test-xl bg-test-primary py-4 font-test-headline text-base font-bold text-test-on-primary shadow-sm transition-all hover:bg-test-primary/95 active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-2xl">check_circle</span>
            <span>答え合わせをする</span>
          </button>
        </div>
      </main>

      {/* 3問ぜんぶ正解したときに出る、お祝いの画面 */}
      {isFinished && (
        <div className="test-pb-safe fixed inset-0 z-50 flex flex-col justify-end bg-test-inverse-surface/80 p-4 backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-md flex-col items-center gap-3 rounded-test-s bg-test-surface-container-lowest p-6 text-center shadow-lg">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-test-secondary-container/20 text-test-secondary">
              <span className="material-symbols-outlined text-4xl text-test-secondary">celebration</span>
            </div>
            <h3 className="font-test-headline text-xl font-black text-test-on-surface">たいへんよくできました！</h3>
            <p className="text-xs text-test-on-surface-variant">通分をマスターしてリベンジクイズを達成しました！</p>
            <div className="flex w-full items-center justify-between rounded-test-xl border border-test-outline-variant/30 bg-test-surface-container-low px-4 py-3">
              <span className="text-xs font-bold text-test-on-surface-variant">獲得リベンジボーナス</span>
              <span className="font-test-headline text-lg font-black text-test-secondary">+50 pt</span>
            </div>
            <div className="mt-2 flex w-full flex-col gap-2">
              <Link
                href="/apps/test-master"
                className="w-full rounded-test-xl bg-test-primary py-3 text-center text-sm font-bold text-test-on-primary shadow-sm"
              >
                ホームへもどる
              </Link>
            </div>
          </div>
        </div>
      )}

      <TestBottomNav active="revenge" />
    </div>
  );
}
