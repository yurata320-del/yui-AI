/**
 * 「テストマスター」で使うデータの「かたち」と、決めごとをまとめたファイル。
 *
 * じっさいのテストの記録は、この中ではなく
 * ブラウザの中の保存場所(localStorage)に入る → storage.ts を見てね。
 */

// 使う人の名前
export const USER_NAME = 'ゆい';

// ごほうびに必要なポイント(ゴールドえんぴつアバター)
export const REWARD_NAME = 'ゴールドえんぴつアバター';
export const REWARD_GOAL_POINTS = 600;

/** テスト1枚ぶんの記録 */
export type TestRecord = {
  id: string; // ひとつひとつを見分けるための番号
  subject: '算数' | '理科' | '国語' | '社会';
  unit: string; // 例: '小数のかけ算・わり算'
  score: number; // 点数(0〜100)
  date: string; // 記録した日(例: '2026年9月5日')
  photo: string; // 撮った写真(小さくしたもの)。写真なしのときは空っぽ
};

/** リベンジクイズの1問(まちがえた問題から作る) */
export type RevengeQuestion = {
  unit: string;
  left: { top: string; bottom: string };
  right: { top: string; bottom: string };
  choices: string[];
  answerIndex: number;
  hintTitle: string;
  hintBody: string;
};

// リベンジクイズの問題。まちがえた問題から自動で作るしくみは、これから作るところ
export const REVENGE_QUESTIONS: RevengeQuestion[] = [];

/**
 * 教科ごとの見た目(1文字のマーク・色)。
 * Stitchのデザインで使われている色をそのまま入れてある。
 */
export const SUBJECT_STYLE = {
  算数: {
    mark: '算',
    markClass: 'bg-test-primary/10 text-test-primary',
    barClass: 'bg-test-primary',
  },
  理科: {
    mark: '理',
    markClass: 'bg-test-tertiary/10 text-test-tertiary',
    barClass: 'bg-test-tertiary',
  },
  国語: {
    mark: '国',
    markClass: 'bg-test-secondary/10 text-test-secondary',
    barClass: 'bg-test-secondary-container',
  },
  社会: {
    mark: '社',
    markClass: 'bg-test-outline-variant/30 text-test-on-surface-variant',
    barClass: 'bg-test-outline-variant',
  },
};

// 教科の一覧(えらぶボタンを作るときに使う)
export const SUBJECTS: TestRecord['subject'][] = ['算数', '理科', '国語', '社会'];
