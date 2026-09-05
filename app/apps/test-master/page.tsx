'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import TestBottomNav from './components/TestBottomNav';
import TestSaveForm from './components/TestSaveForm';
import { SUBJECT_STYLE, USER_NAME, type TestRecord } from './lib/data';
import { canUseAI, readTestPhoto, type AiReadResult } from './lib/ai';
import { shrinkPhoto } from './lib/photo';
import { addTest, countPoints, loadTests, collectQuiz, todayText } from './lib/storage';

/**
 * 【テストマスター】ホーム画面(テストスキャン)
 *
 * Stitch のデザイン「ホーム ＆ テストスキャン (シンプル版)」を、そのまま画面にしたもの。
 * 色・余白・文字の大きさは、Stitch のコードの数字をそのまま使っている。
 *
 * ここでやること:
 *   - 「テストをパシャリと撮影」でスマホのカメラを開き、テストの写真を撮る
 *   - 写真を撮ったら、教科・単元・点数を入力して記録する(ブラウザに保存)
 *   - 記録したテストを一覧にならべる。まだ無いときは「まだ記録がないよ」と出す
 */
export default function TestMasterHomePage() {
  // 保存してあるテストの記録
  const [tests, setTests] = useState<TestRecord[]>([]);
  // 撮ったばかりの写真。入力画面を出すときだけ中身が入る
  const [newPhoto, setNewPhoto] = useState('');
  // AIが読みとった結果。読みとれなかったときは null
  const [aiRead, setAiRead] = useState<AiReadResult | null>(null);
  // AIが読みとっているとちゅうかどうか
  const [isReading, setIsReading] = useState(false);
  // 読みとりを始めてから、何秒たったか(待っているあいだの目安)
  const [waitedSeconds, setWaitedSeconds] = useState(0);
  // 画面の上に出す、みじかいお知らせ
  const [message, setMessage] = useState('');

  // カメラ用と、アルバム用の「ファイルをえらぶ部品」を、あとから押すためにおぼえておく
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const albumInputRef = useRef<HTMLInputElement>(null);

  // 画面が出たときに1回だけ、保存してある記録を読みこむ
  useEffect(() => {
    setTests(loadTests());
  }, []);

  // 読みとり中だけ、1秒ごとに秒数を数える
  useEffect(() => {
    if (!isReading) return;
    const timer = setInterval(() => setWaitedSeconds((seconds) => seconds + 1), 1000);
    // 読みとりが終わったら、数えるのをやめる
    return () => clearInterval(timer);
  }, [isReading]);

  // 写真をえらんだ(撮った)ときに呼ばれる
  async function handlePhotoChosen(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // 同じ写真をもう一度えらべるように、えらんだ記録を消しておく
    event.target.value = '';
    if (!file) return;

    try {
      // 写真は大きいので、小さくしてから使う
      const smallPhoto = await shrinkPhoto(file);

      // AIが使えないときは、すぐに自分で入力する画面を出す
      if (!canUseAI()) {
        setAiRead(null);
        setNewPhoto(smallPhoto);
        return;
      }

      // AIに読みとってもらう(少し時間がかかる)
      setWaitedSeconds(0);
      setIsReading(true);
      const result = await readTestPhoto(smallPhoto);
      setIsReading(false);

      // 点数までちゃんと読めたときは、確認画面を出さずにそのまま記録する
      if (result !== null && result.score >= 0 && result.score <= 100) {
        saveTest({
          id: String(Date.now()),
          subject: result.subject,
          unit: result.unit === '' ? 'たんげん未記入' : result.unit,
          score: result.score,
          date: todayText(),
          photo: smallPhoto,
          correctCount: result.correctCount,
          wrongCount: result.wrongCount,
          mistakes: result.mistakes,
          quiz: result.quiz,
          readByAI: true,
        });
        return;
      }

      // 点数が読めなかった/AIが使えなかったときだけ、自分で入力してもらう
      setAiRead(result);
      setNewPhoto(smallPhoto);
      setMessage(
        result === null
          ? 'AIの読みとりが うまくいかなかったよ。自分で入力してね。'
          : '点数が読みとれなかったよ。自分で入れてね。'
      );
    } catch {
      setIsReading(false);
      setMessage('写真を読みこめなかったよ。もう一度ためしてみてね。');
    }
  }

  // テストを1件、記録する(AIが読めたときも、自分で入力したときも、ここを通る)
  function saveTest(test: TestRecord) {
    setTests(addTest(test));
    setNewPhoto('');
    setAiRead(null);
    const quizNote = test.quiz.length > 0 ? ` リベンジクイズが${test.quiz.length}問できたよ！` : '';
    setMessage(`✅ ${test.subject}「${test.unit}」${test.score}点 を記録したよ！ +30pt${quizNote}`);
  }

  // さいきんのテスト記録は、新しいものから3件だけ出す
  const recentTests = tests.slice(0, 3);
  const points = countPoints(tests);
  // リベンジクイズの問題(AIがまちがいから作ったもの)
  const quiz = collectQuiz(tests);

  return (
    <>
      {/*
        写真をえらぶ部品。画面には出さずに、ボタンから押してもらう。
        capture="environment" をつけると、スマホでは外側のカメラが開く。
      */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChosen}
        className="hidden"
      />
      <input ref={albumInputRef} type="file" accept="image/*" onChange={handlePhotoChosen} className="hidden" />

      {/* 1. シンプルなヘッダー */}
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
        {/* お知らせ(記録したときなどに出る) */}
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
            テストの写真を撮って、教科と点数を記録しよう！
          </p>
          <div className="flex w-full flex-col gap-2.5">
            <button
              type="button"
              onClick={() => cameraInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-2 rounded-test-l bg-test-primary py-4 font-test-headline text-base font-bold text-test-on-primary shadow-sm transition-all hover:bg-test-primary/95 active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-2xl">center_focus_strong</span>
              <span>テストをパシャリと撮影</span>
            </button>
            <button
              type="button"
              onClick={() => albumInputRef.current?.click()}
              className="flex w-full items-center justify-center gap-1.5 rounded-test-l bg-test-surface-container-low py-2.5 text-sm font-bold text-test-on-surface transition-all hover:bg-test-surface-container"
            >
              <span className="material-symbols-outlined text-lg text-test-on-surface-variant">photo_library</span>
              <span>アルバムから選ぶ</span>
            </button>
          </div>
        </section>

        {/* 3. やること / リベンジ */}
        <section className="flex flex-col gap-2">
          <h3 className="px-1 text-xs font-bold tracking-wider text-test-on-surface-variant">いまのやること</h3>

          {quiz.length > 0 ? (
            <div className="flex items-center justify-between gap-3 rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-test-l bg-test-secondary-container/20 text-test-secondary">
                  <span className="material-symbols-outlined text-2xl">bolt</span>
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-test-s bg-test-surface-container px-1.5 py-0.5 text-xs font-bold text-test-primary">
                      {quiz[0].subject}
                    </span>
                    <span className="text-xs text-test-on-surface-variant">あと{quiz.length}問</span>
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
          ) : (
            // まだリベンジする問題がないとき
            <div className="flex items-center gap-3 rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-test-l bg-test-surface-container-low text-test-on-surface-variant">
                <span className="material-symbols-outlined text-2xl">bolt</span>
              </div>
              <div className="flex flex-col">
                <span className="font-test-headline text-sm font-bold text-test-on-surface">
                  まだリベンジする問題はないよ
                </span>
                <span className="mt-0.5 text-xs text-test-on-surface-variant">
                  テストを撮ると、まちがえた問題からAIがクイズを作るよ。
                </span>
              </div>
            </div>
          )}
        </section>

        {/* 4. さいきんのテスト記録 */}
        <section className="flex flex-col gap-2.5">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold tracking-wider text-test-on-surface-variant">さいきんのテスト記録</h3>
            <span className="text-xs text-test-on-surface-variant">
              {tests.length > 0 ? `最新${recentTests.length}件` : '0件'}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            {/* 押すと「テスト詳細・解説」の画面にうつる */}
            {recentTests.map((test) => (
              <Link
                key={test.id}
                href={`/apps/test-master/test#${test.id}`}
                className="flex items-center justify-between rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-4 shadow-sm transition-all hover:bg-test-surface-container-low active:scale-[0.99]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-test-m font-test-headline text-sm font-black ${SUBJECT_STYLE[test.subject].markClass}`}
                  >
                    {SUBJECT_STYLE[test.subject].mark}
                  </div>
                  <div>
                    <p className="font-test-headline text-sm font-bold text-test-on-surface">{test.subject}テスト</p>
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

            {/* まだ1件も記録がないとき */}
            {tests.length === 0 && (
              <div className="flex flex-col items-center gap-1 rounded-test-l border border-test-outline-variant/30 bg-test-surface-container-lowest p-6 text-center shadow-sm">
                <span className="material-symbols-outlined text-3xl text-test-outline-variant">description</span>
                <p className="mt-1 font-test-headline text-sm font-bold text-test-on-surface">
                  まだテストの記録がないよ
                </p>
                <p className="text-xs leading-relaxed text-test-on-surface-variant">
                  上のボタンからテストを撮ると、ここにならぶよ。
                </p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* AIが写真を読みとっているあいだ、ぐるぐる待つ画面 */}
      {isReading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-4 bg-test-inverse-surface/80 p-6 text-center backdrop-blur-sm">
          <div className="flex flex-col items-center gap-3 rounded-test-l bg-test-surface-container-lowest p-8 shadow-lg">
            {/* くるくる回る輪(AIが考えているあいだの目じるし) */}
            <span className="h-10 w-10 animate-spin rounded-full border-4 border-test-surface-container border-t-test-primary" />
            <p className="font-test-headline text-sm font-bold text-test-on-surface">AIがテストを読んでいるよ…</p>
            <p className="text-xs leading-relaxed text-test-on-surface-variant">
              点数やまちがえた問題をさがしているところ。
              <br />
              読みおわったら、そのまま記録するよ。
            </p>
            <p className="font-test-headline text-2xl font-black text-test-primary">{waitedSeconds}秒</p>
          </div>
        </div>
      )}

      {/* 写真を撮ったあとに出る、入力画面 */}
      {newPhoto !== '' && !isReading && (
        <TestSaveForm
          photo={newPhoto}
          aiRead={aiRead}
          onSave={saveTest}
          onCancel={() => {
            setNewPhoto('');
            setAiRead(null);
          }}
        />
      )}

      {/* 5. 直感的なボトムナビゲーション */}
      <TestBottomNav active="home" />
    </>
  );
}
