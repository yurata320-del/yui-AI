'use client';

import { useEffect, useState } from 'react';

/**
 * 【アプリ3】メモ
 *
 * ここで覚えること: 「保存(ほぞん)」の考えかた
 *
 * useState は画面を閉じると消えてしまう。
 * そこで localStorage という「ブラウザの中の小さな引き出し」に書いておくと、
 * ページを閉じても、パソコンを再起動しても残る。
 *
 * 大事なポイント:
 * - localStorage はブラウザにしか無いので、読むのは useEffect の中(画面が出たあと)。
 *   いきなり読むとエラーになることがある。
 * - try / catch は「もし失敗しても、アプリごと止まらないようにする」おまじない。
 * - この引き出しは自分のパソコンの中だけ。他の人には見えないし、送られたりもしない。
 */

const STORAGE_KEY = 'yui-memo';

interface Memo {
  id: number;
  text: string;
}

export default function MemoPage() {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [text, setText] = useState('');
  // 読みこみが終わるまでは「まだ空っぽ」と区別したいので、そのための目印
  const [loaded, setLoaded] = useState(false);

  // 画面が出たときに1回だけ、引き出しから読み出す
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setMemos(JSON.parse(saved));
    } catch {
      // 読めなくても、空のメモ帳として使えればOK
    }
    setLoaded(true);
  }, []);

  // メモが変わるたびに、引き出しに書きこむ
  useEffect(() => {
    if (!loaded) return; // 読みこむ前に書くと、中身を消してしまうので待つ
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memos));
    } catch {
      // 保存できない設定のブラウザもある。そのときは画面の中だけで動かす
    }
  }, [memos, loaded]);

  function addMemo() {
    const trimmed = text.trim();
    if (!trimmed) return; // 空っぽのメモは追加しない
    setMemos([{ id: Date.now(), text: trimmed }, ...memos]);
    setText('');
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="ui-eyebrow">App 03</p>
        <h1 className="ui-page-title mt-1">メモ</h1>
        <p className="mt-2 text-sm text-ink-500">書いたことは、ページを閉じても残るよ。</p>
      </div>

      <div className="ui-card p-5">
        <div className="flex gap-2">
          <input
            className="ui-input"
            value={text}
            placeholder="なにかメモする"
            onChange={(e) => setText(e.target.value)}
            // Enterキーでも追加できるようにする
            onKeyDown={(e) => {
              if (e.key === 'Enter') addMemo();
            }}
          />
          <button type="button" className="ui-btn-primary shrink-0" onClick={addMemo}>
            追加
          </button>
        </div>
      </div>

      {memos.length === 0 ? (
        <div className="ui-card p-10 text-center text-sm text-ink-400">
          {loaded ? 'まだメモがないよ。上から追加してみてね。' : '読みこみ中…'}
        </div>
      ) : (
        <ul className="ui-card divide-y divide-ink-100">
          {memos.map((memo) => (
            <li key={memo.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <span className="min-w-0 flex-1 break-words text-sm text-ink-900">{memo.text}</span>
              <button
                type="button"
                className="shrink-0 text-xs text-ink-400 transition-colors hover:text-ink-900"
                onClick={() => setMemos(memos.filter((m) => m.id !== memo.id))}
              >
                けす
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="ui-card p-5">
        <p className="ui-section-title">やってみよう</p>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          <li>・メモに書いた日にちも出してみる</li>
          <li>・「ぜんぶけす」ボタンをつけてみる</li>
          <li>・メモの数を上に出してみる</li>
        </ul>
      </div>
    </div>
  );
}
