'use client';

import { useEffect } from 'react';

/**
 * 【テストマスター】画面がこわれたときに出るページ。
 *
 * これがないと「Application error」とだけ出て、何が起きたか分からない。
 * ここでは、何が起きたかを画面に出して、やり直せるボタンを用意する。
 *
 * よくある原因:
 *   アプリを新しくしたあと、スマホが古いページをおぼえていると、
 *   もう無いファイルを読もうとしてこわれる。→「新しく読みこむ」で直る。
 */
export default function TestMasterError({ error, reset }: { error: Error; reset: () => void }) {
  // 何が起きたかを、開発者用の記録(コンソール)にも残しておく
  useEffect(() => {
    console.error('テストマスターでエラー:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-test-surface p-6 text-center">
      <span className="material-symbols-outlined text-5xl text-test-error">error</span>
      <h1 className="font-test-headline text-lg font-black text-test-on-surface">ごめん、うまく開けなかったよ</h1>
      <p className="max-w-xs text-xs leading-relaxed text-test-on-surface-variant">
        アプリを新しくしたときに、こうなることがあるよ。
        <br />
        下のボタンを押すと、たいてい直るよ。
      </p>

      <div className="flex w-full max-w-xs flex-col gap-2">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="w-full rounded-test-l bg-test-primary py-4 font-test-headline text-base font-bold text-test-on-primary shadow-sm active:scale-[0.98]"
        >
          新しく読みこむ
        </button>
        <button
          type="button"
          onClick={reset}
          className="w-full rounded-test-l bg-test-surface-container-low py-3 text-sm font-bold text-test-on-surface"
        >
          もう一度ためす
        </button>
      </div>

      {/* 何が起きたかの中身(なおすときの手がかり) */}
      <details className="mt-2 w-full max-w-xs text-left">
        <summary className="cursor-pointer text-[11px] text-test-on-surface-variant">くわしい内容を見る</summary>
        <pre className="mt-2 overflow-x-auto whitespace-pre-wrap break-words rounded-test-m bg-test-surface-container-low p-3 text-[11px] text-test-on-surface-variant">
          {error.message}
        </pre>
      </details>
    </div>
  );
}
