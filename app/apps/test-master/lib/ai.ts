import type { Mistake, RevengeQuestion, TestRecord } from './data';

/**
 * AIサーバー(ai-server/server.mjs)に「この写真を読んで」とお願いする部品。
 *
 * かぎ(APIキー)はこのファイルには書かない。かぎを持っているのはサーバーだけ。
 * だから、アプリのコードが人に見られても安全。
 */

// AIサーバーの住所(npm run ai で動かしたときの場所)
const AI_SERVER_URL = 'http://localhost:8787/read-test';

/** AIが読みとった結果 */
export type AiReadResult = {
  subject: TestRecord['subject'];
  unit: string;
  score: number;
  correctCount: number;
  wrongCount: number;
  mistakes: Mistake[];
  quiz: RevengeQuestion[];
};

/**
 * AIサーバーが使える場所にいるかどうか。
 *
 * 公開ページ(https://...github.io)からは、パソコンの中のサーバーには話しかけられない。
 * なので、自分のパソコンで動かしているとき(localhost)だけ AI を使う。
 */
export function canUseAI(): boolean {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

/**
 * 写真をAIサーバーに送って、読みとってもらう。
 * うまくいかなかったときは null を返す(そのときは自分で入力してもらう)。
 */
export async function readTestPhoto(photo: string): Promise<AiReadResult | null> {
  if (!canUseAI()) return null;

  try {
    const response = await fetch(AI_SERVER_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ photo }),
    });

    const data = await response.json();
    if (!data.ok) {
      console.error('AIサーバーからのお返事:', data.message);
      return null;
    }
    return data.result as AiReadResult;
  } catch (error) {
    // サーバーが動いていないときも、ここに来る
    console.error('AIサーバーに話しかけられなかったよ:', error);
    return null;
  }
}
