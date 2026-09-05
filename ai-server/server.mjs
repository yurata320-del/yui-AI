/**
 * 【テストマスター】自分のパソコンで動かす、AIサーバー。
 *
 * なぜこれが必要か:
 *   AIを使うには「APIキー(かぎ)」がいる。
 *   でも、かぎをブラウザ(アプリの画面)に置くと、世界中の人に見えてしまう。
 *   だから、かぎはこのサーバーの中だけに置いて、
 *   アプリは「この写真を読んで」とこのサーバーにお願いするだけにする。
 *
 * 使いかた:
 *   1. .env.local に ANTHROPIC_API_KEY=(かぎ) を書く
 *   2. ターミナルで  npm run ai   と打つ
 *   3. べつのターミナルで  npm run dev  と打って、アプリを開く
 *
 * 読みとりの中身は read-test.mjs にある(スマホ用のworker.jsと共通)。
 */

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';
import { askClaude } from './read-test.mjs';

const PORT = 8787;

// アプリ(http://localhost:3000)からのお願いだけを受けつける
const ALLOWED_ORIGIN = 'http://localhost:3000';

/** .env.local から APIキー(かぎ)を読む */
function loadApiKey() {
  try {
    const text = readFileSync(new URL('../.env.local', import.meta.url), 'utf8');
    for (const line of text.split('\n')) {
      const [name, ...rest] = line.split('=');
      if (name.trim() === 'ANTHROPIC_API_KEY') {
        return rest.join('=').trim();
      }
    }
  } catch {
    // ファイルが無いときは、パソコンの環境変数から探す
  }
  return process.env.ANTHROPIC_API_KEY ?? '';
}

const API_KEY = loadApiKey();

const server = createServer(async (request, response) => {
  // ブラウザからのお願いを受けつけるための、おやくそく(CORS)
  response.setHeader('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
  response.setHeader('Access-Control-Allow-Headers', 'content-type');
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

  if (request.method === 'OPTIONS') {
    response.writeHead(204).end();
    return;
  }

  if (request.method !== 'POST' || !request.url?.startsWith('/read-test')) {
    response.writeHead(404, { 'content-type': 'application/json' });
    response.end(JSON.stringify({ ok: false, message: 'そのお願いには答えられないよ' }));
    return;
  }

  if (API_KEY === '') {
    response.writeHead(500, { 'content-type': 'application/json' });
    response.end(
      JSON.stringify({ ok: false, message: '.env.local に ANTHROPIC_API_KEY が書かれていないよ' })
    );
    return;
  }

  // 送られてきた写真データを受けとる
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
  });

  request.on('end', async () => {
    try {
      const { photo } = JSON.parse(body);
      console.log('📸 写真を受けとったよ。AIに読んでもらっています…');

      const { result, usage } = await askClaude(photo, API_KEY);

      console.log(`✅ 読みとれた: ${result.subject} ${result.score}点 / まちがい ${result.mistakes.length}問`);
      console.log(`   つかった文字: 入力 ${usage.input_tokens} / 出力 ${usage.output_tokens}`);

      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ ok: true, result }));
    } catch (error) {
      console.error('❌ うまくいかなかった:', error.message);
      response.writeHead(500, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ ok: false, message: error.message }));
    }
  });
});

server.listen(PORT, () => {
  console.log(`🤖 AIサーバーが動きだしたよ → http://localhost:${PORT}`);
  if (API_KEY === '') {
    console.log('⚠️  .env.local に ANTHROPIC_API_KEY がないよ。書いてから、もう一度動かしてね。');
  } else {
    console.log('   かぎ(APIキー)は見つかったよ。アプリから写真を送ってみてね。');
  }
});
