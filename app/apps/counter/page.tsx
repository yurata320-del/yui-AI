'use client';

import { useState } from 'react';

/**
 * 【アプリ1】カウンター
 *
 * ここで覚えること: 「状態(state)」の使いかた
 *
 * いちばん上の 'use client' は、
 * 「このページはブラウザの中で動くよ(ボタンを押したら反応するよ)」という合図。
 * ボタンを押して画面が変わるアプリには、かならず必要。
 *
 * useState は「おぼえておく箱」。
 *   const [count, setCount] = useState(0);
 *        ↑今の数     ↑数を変える命令   ↑さいしょの数
 * setCount(...) を呼ぶと、画面がじどうで書きかわる。
 */
export default function CounterPage() {
  const [count, setCount] = useState(0);

  return (
    <div className="space-y-6">
      <div>
        <p className="ui-eyebrow">App 01</p>
        <h1 className="ui-page-title mt-1">カウンター</h1>
        <p className="mt-2 text-sm text-ink-500">ボタンをおすと数がふえたりへったりするよ。</p>
      </div>

      <div className="ui-card p-8 text-center">
        <p className="ui-section-title">いまの数</p>
        <p className="ui-number mt-3">{count}</p>

        <div className="mt-8 flex justify-center gap-3">
          <button type="button" className="ui-btn-secondary" onClick={() => setCount(count - 1)}>
            −1 へらす
          </button>
          <button type="button" className="ui-btn-primary" onClick={() => setCount(count + 1)}>
            +1 ふやす
          </button>
        </div>

        <button
          type="button"
          className="ui-link mt-6 text-xs"
          onClick={() => setCount(0)}
          // 0のときは押しても意味がないので、押せなくしておく
          disabled={count === 0}
        >
          0にもどす
        </button>
      </div>

      <div className="ui-card p-5">
        <p className="ui-section-title">やってみよう</p>
        <ul className="mt-3 space-y-2 text-sm text-ink-600">
          <li>・「+1 ふやす」を「+10 ふやす」に変えてみる</li>
          <li>・数が10をこえたら「すごい!」と出してみる</li>
          <li>・マイナスにならないようにしてみる</li>
        </ul>
      </div>
    </div>
  );
}
