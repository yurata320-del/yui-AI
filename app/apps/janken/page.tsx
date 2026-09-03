'use client';

import { useState } from 'react';

/**
 * 【アプリ2】じゃんけん
 *
 * ここで覚えること: 「配列(はいれつ)」と「ランダム」と「じょうけん分け」
 *
 * - HANDS は「グー・チョキ・パー」を入れた配列(リスト)。
 * - Math.random() は 0〜1 のあいだのてきとうな数を出す命令。
 *   これを使うとコンピューターの手をランダムに決められる。
 * - judge() は「勝ち・負け・あいこ」を決める関数(かんすう)。
 *   計算のルールは、画面の見た目とは分けて書いておくと、あとで直しやすい。
 */

const HANDS = ['グー', 'チョキ', 'パー'] as const;
type Hand = (typeof HANDS)[number];

type Result = 'win' | 'lose' | 'draw';

/**
 * じぶんの手とコンピューターの手から、勝ち負けを決める。
 * じゃんけんは3つの手が輪になっているので、番号のひき算で判定できる。
 *   (じぶん - あいて + 3) を 3 で割ったあまりが
 *     0 → あいこ / 1 → 負け / 2 → 勝ち
 */
function judge(mine: Hand, theirs: Hand): Result {
  const diff = (HANDS.indexOf(mine) - HANDS.indexOf(theirs) + 3) % 3;
  if (diff === 0) return 'draw';
  if (diff === 1) return 'lose';
  return 'win';
}

const RESULT_TEXT: Record<Result, string> = {
  win: 'かち!',
  lose: 'まけ…',
  draw: 'あいこ',
};

export default function JankenPage() {
  // 「まだ1回もやっていない」を表すために null を入れておく
  const [mine, setMine] = useState<Hand | null>(null);
  const [theirs, setTheirs] = useState<Hand | null>(null);
  const [wins, setWins] = useState(0);

  const result = mine && theirs ? judge(mine, theirs) : null;

  function play(hand: Hand) {
    // コンピューターの手をランダムに1つえらぶ
    const computerHand = HANDS[Math.floor(Math.random() * HANDS.length)];
    setMine(hand);
    setTheirs(computerHand);
    if (judge(hand, computerHand) === 'win') {
      setWins((w) => w + 1); // 勝ったときだけ勝ち数を1ふやす
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="ui-eyebrow">App 02</p>
        <h1 className="ui-page-title mt-1">じゃんけん</h1>
        <p className="mt-2 text-sm text-ink-500">コンピューターとじゃんけんしよう。</p>
      </div>

      <div className="ui-card p-8 text-center">
        {result === null ? (
          <p className="py-6 text-sm text-ink-400">下のボタンから手をえらんでね</p>
        ) : (
          <>
            <p className="ui-number">{RESULT_TEXT[result]}</p>
            <p className="mt-4 text-sm text-ink-600">
              じぶん <span className="font-semibold text-ink-900">{mine}</span>
              <span className="mx-2 text-ink-300">vs</span>
              あいて <span className="font-semibold text-ink-900">{theirs}</span>
            </p>
          </>
        )}

        <div className="mt-8 flex justify-center gap-3">
          {HANDS.map((hand) => (
            <button key={hand} type="button" className="ui-btn-primary" onClick={() => play(hand)}>
              {hand}
            </button>
          ))}
        </div>
      </div>

      <div className="ui-card flex items-center justify-between p-5">
        <span className="ui-section-title">かった回数</span>
        <span className="text-xl font-semibold tabular-nums text-ink-900">{wins}</span>
      </div>

      <div className="ui-card p-5">
        <p className="ui-section-title">やってみよう</p>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          <li>・まけた回数、あいこの回数もかぞえてみる</li>
          <li>・3回勝ったら「チャンピオン!」と出してみる</li>
          <li>・グー・チョキ・パーを絵文字にしてみる</li>
        </ul>
      </div>
    </div>
  );
}
