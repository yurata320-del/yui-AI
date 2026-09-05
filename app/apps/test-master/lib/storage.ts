import type { TestRecord } from './data';

/**
 * テストの記録の「保存」まわり。
 *
 * memoアプリ・ぴよちゃんゲームと同じように、
 * localStorage(ブラウザの中の小さな引き出し)にしまっておく。
 *
 * ※ localStorage はブラウザにしかないので、
 *   読み書きするのは useEffect の中(画面が出たあと)にする。
 */

const STORAGE_KEY = 'yui-test-master';

/** 保存してあるテストの記録を、ぜんぶ読みこむ(新しい順) */
export function loadTests(): TestRecord[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return [];
    const parsed = JSON.parse(saved);
    // 壊れたデータが来ても止まらないように、配列じゃなければカラッポを返す
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

/** テストの記録を、ぜんぶ保存する */
export function saveTests(tests: TestRecord[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tests));
  } catch {
    // 保存できないとき(引き出しがいっぱいなど)は、何もしないでおく
  }
}

/** テストを1件、いちばん新しい記録として足す */
export function addTest(newTest: TestRecord): TestRecord[] {
  const tests = [newTest, ...loadTests()];
  saveTests(tests);
  return tests;
}

/** テストを1件、消す */
export function removeTest(id: string): TestRecord[] {
  const tests = loadTests().filter((test) => test.id !== id);
  saveTests(tests);
  return tests;
}

/**
 * たまったポイントを計算する。
 * 今のルール: テストを1枚 記録するたびに 30pt。
 */
export function countPoints(tests: TestRecord[]): number {
  return tests.length * 30;
}

/**
 * ぜんぶの記録から、リベンジクイズの問題をあつめる(新しい順に、多くても3問)。
 * どのテストの問題かも分かるように、教科と単元をいっしょに返す。
 */
export function collectQuiz(tests: TestRecord[]) {
  const questions = [];
  for (const test of tests) {
    for (const question of test.quiz) {
      questions.push({ ...question, subject: test.subject, unit: test.unit });
      if (questions.length === 3) return questions;
    }
  }
  return questions;
}

/** 今日の日づけを「2026年9月5日」の形にする */
export function todayText(): string {
  const now = new Date();
  return `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日`;
}
