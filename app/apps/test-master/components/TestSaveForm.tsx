'use client';

import { useState } from 'react';
import { SUBJECTS, type TestRecord } from '../lib/data';
import { todayText } from '../lib/storage';

/**
 * 写真をえらんだあとに出る、「テストを記録する」入力画面。
 *
 * 本当はAIが写真から教科と点数を読みとる予定だけど、それはまだ作れていないので、
 * いまは自分で えらんで・入力してもらう。
 *
 * photo    … 撮った写真(小さくしたもの)
 * onSave   … 「記録する」を押したときに呼ばれる
 * onCancel … 「やめる」を押したときに呼ばれる
 */
export default function TestSaveForm({
  photo,
  onSave,
  onCancel,
}: {
  photo: string;
  onSave: (test: TestRecord) => void;
  onCancel: () => void;
}) {
  const [subject, setSubject] = useState<TestRecord['subject']>('算数');
  const [unit, setUnit] = useState('');
  const [score, setScore] = useState('');

  // 点数が0〜100の数字で入っているかどうか
  const scoreNumber = Number(score);
  const isScoreOk = score !== '' && !Number.isNaN(scoreNumber) && scoreNumber >= 0 && scoreNumber <= 100;

  function handleSave() {
    if (!isScoreOk) return;
    onSave({
      id: String(Date.now()), // 記録した時刻を、見分けるための番号にする
      subject,
      unit: unit === '' ? 'たんげん未記入' : unit,
      score: scoreNumber,
      date: todayText(),
      photo,
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end bg-test-inverse-surface/80 p-4 backdrop-blur-sm">
      <div className="test-pb-safe mx-auto flex w-full max-w-md flex-col gap-4 rounded-test-l bg-test-surface-container-lowest p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <h3 className="font-test-headline text-lg font-black text-test-on-surface">テストを記録する</h3>
          <button
            type="button"
            onClick={onCancel}
            aria-label="やめる"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-test-surface-container-low text-test-on-surface-variant"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* 撮った写真 */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photo}
          alt="撮ったテストの写真"
          className="max-h-40 w-full rounded-test-m bg-test-surface-container-low object-contain"
        />

        {/* 教科をえらぶ */}
        <div className="flex flex-col gap-2">
          <span className="text-xs font-bold tracking-wider text-test-on-surface-variant">教科</span>
          <div className="flex gap-2">
            {SUBJECTS.map((name) => (
              <button
                key={name}
                type="button"
                onClick={() => setSubject(name)}
                className={
                  subject === name
                    ? 'flex-1 rounded-test-m bg-test-primary py-2 text-xs font-bold text-test-on-primary shadow-sm'
                    : 'flex-1 rounded-test-m border border-test-outline-variant/30 bg-test-surface-container-lowest py-2 text-xs font-bold text-test-on-surface'
                }
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* 単元(なんの勉強か) */}
        <div className="flex flex-col gap-2">
          <label htmlFor="unit" className="text-xs font-bold tracking-wider text-test-on-surface-variant">
            なんの勉強？（れい: 分数のわり算）
          </label>
          <input
            id="unit"
            type="text"
            value={unit}
            onChange={(event) => setUnit(event.target.value)}
            placeholder="分数のわり算"
            className="min-h-tap rounded-test-m border border-test-outline-variant/40 bg-test-surface-container-lowest px-4 text-base text-test-on-surface focus:border-test-primary"
          />
        </div>

        {/* 点数 */}
        <div className="flex flex-col gap-2">
          <label htmlFor="score" className="text-xs font-bold tracking-wider text-test-on-surface-variant">
            点数（0〜100）
          </label>
          <input
            id="score"
            type="number"
            inputMode="numeric"
            min={0}
            max={100}
            value={score}
            onChange={(event) => setScore(event.target.value)}
            placeholder="85"
            className="min-h-tap rounded-test-m border border-test-outline-variant/40 bg-test-surface-container-lowest px-4 text-base text-test-on-surface focus:border-test-primary"
          />
        </div>

        {/* 記録するボタン。点数が入っていないときは押せない */}
        <button
          type="button"
          onClick={handleSave}
          disabled={!isScoreOk}
          className="flex w-full items-center justify-center gap-2 rounded-test-l bg-test-primary py-4 font-test-headline text-base font-bold text-test-on-primary shadow-sm transition-all hover:bg-test-primary/95 active:scale-[0.98] disabled:bg-test-outline-variant disabled:text-test-surface-container-lowest"
        >
          <span className="material-symbols-outlined text-2xl">check_circle</span>
          <span>この内容で記録する (+30pt)</span>
        </button>
      </div>
    </div>
  );
}
