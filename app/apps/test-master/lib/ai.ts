import type { Mistake, RevengeQuestion, TestRecord } from './data';

/**
 * AIサーバー(ai-server/server.mjs)に「この写真を読んで」とお願いする部品。
 *
 * かぎ(APIキー)はこのファイルには書かない。かぎを持っているのはサーバーだけ。
 * だから、アプリのコードが人に見られても安全。
 */

// 自分のパソコンで動かすときのAIサーバー(npm run ai)
const LOCAL_AI_URL = 'http://localhost:8787/read-test';

/**
 * インターネット上のAIサーバー(Cloudflare Workers)の住所。
 * ビルドするときに NEXT_PUBLIC_AI_URL から入る。
 * まだ置いていないときは空っぽで、そのときは自分で入力する形になる。
 */
const CLOUD_AI_URL = process.env.NEXT_PUBLIC_AI_URL ?? '';

/** 今いる場所が「自分のパソコン」かどうか */
function isLocal(): boolean {
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
}

/** どのAIサーバーに話しかけるかを決める。使えないときは空っぽ */
function aiServerUrl(): string {
  return isLocal() ? LOCAL_AI_URL : CLOUD_AI_URL;
}

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
 * AIが使えるかどうか。
 *
 * - 自分のパソコン … npm run ai で動かしたサーバーを使う
 * - 公開ページ     … インターネット上のAIサーバー(Worker)を使う
 *   (まだ置いていないときは使えないので、自分で入力する形になる)
 */
export function canUseAI(): boolean {
  return aiServerUrl() !== '';
}

/**
 * 写真をAIサーバーに送って、読みとってもらう。
 * うまくいかなかったときは null を返す(そのときは自分で入力してもらう)。
 */
export async function readTestPhoto(photo: string): Promise<AiReadResult | null> {
  const url = aiServerUrl();
  if (url === '') return null;

  try {
    const response = await fetch(url, {
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
