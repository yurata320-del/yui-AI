/**
 * 【テストマスター】AIにテストの写真を読んでもらう、小さなサーバー。
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
 * ※ このファイルは Next.js とは別に動く。ライブラリは1つも使っていない
 *   (Node.js にもともと入っている機能だけで書いてある)。
 */

import { createServer } from 'node:http';
import { readFileSync } from 'node:fs';

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

/**
 * AIに「こういう形で答えてね」と伝える設計図。
 * この形以外では返ってこないので、あとの処理が楽になる。
 */
const ANSWER_SHAPE = {
  type: 'object',
  properties: {
    subject: { type: 'string', enum: ['算数', '理科', '国語', '社会'] },
    unit: { type: 'string', description: 'なんの単元か。例: 分数のわり算' },
    score: { type: 'number', description: '点数。読みとれないときは -1' },
    correctCount: { type: 'number', description: '正解した問題の数。わからなければ -1' },
    wrongCount: { type: 'number', description: 'まちがえた問題の数。わからなければ -1' },
    mistakes: {
      type: 'array',
      description: 'まちがえた問題。多くても3問まで',
      items: {
        type: 'object',
        properties: {
          questionNumber: { type: 'number', description: '何問目か。わからなければ 0' },
          question: { type: 'string', description: '問題の文や式' },
          yourAnswer: { type: 'string', description: '答案に書いてあった答え' },
          correctAnswer: { type: 'string', description: '正しい答え' },
          why: { type: 'string', description: 'なぜまちがえたか。ひとことで' },
          steps: {
            type: 'array',
            description: '正しい解きかたの手順。2〜3ステップ',
            items: {
              type: 'object',
              properties: {
                title: { type: 'string', description: 'そのステップの短い見出し' },
                body: { type: 'string', description: 'やさしい説明' },
              },
              required: ['title', 'body'],
              additionalProperties: false,
            },
          },
          onePoint: { type: 'string', description: '次に気をつけることを1文で' },
        },
        required: ['questionNumber', 'question', 'yourAnswer', 'correctAnswer', 'why', 'steps', 'onePoint'],
        additionalProperties: false,
      },
    },
    quiz: {
      type: 'array',
      description: 'まちがえた問題と同じ考えかたで解ける、にた問題を3問',
      items: {
        type: 'object',
        properties: {
          question: { type: 'string', description: '問題の文や式' },
          choices: { type: 'array', items: { type: 'string' }, description: 'えらぶ答え。かならず4つ' },
          answerIndex: { type: 'number', description: '正解が何番目か(0からかぞえる)' },
          hint: { type: 'string', description: '解きかたのヒント' },
        },
        required: ['question', 'choices', 'answerIndex', 'hint'],
        additionalProperties: false,
      },
    },
  },
  required: ['subject', 'unit', 'score', 'correctCount', 'wrongCount', 'mistakes', 'quiz'],
  additionalProperties: false,
};

// AIへのお願いの文
const INSTRUCTION = `この写真は、小学生のテストの答案です。写真を見て、次のことを読みとってください。

1. 教科(算数・理科・国語・社会のどれか)
2. 単元(なんの勉強か)
3. 点数(赤ペンで書かれていることが多い)
4. 正解した数と、まちがえた数
5. まちがえた問題(赤いバツがついている問題や、答えがまちがっている問題)を、多くても3問
   - その問題の式や文、答案に書いてある答え、正しい答え、なぜまちがえたか
   - 正しい解きかたを2〜3ステップで
6. まちがえた問題と同じ考えかたで解ける「にた問題」を3問

大事なこと:
- 説明は小学生にわかる、やさしい日本語で書く
- 写真から読みとれないことは、むりに作らない(点数が読めないときは -1)
- まちがいが見つからないときは、mistakes と quiz を空っぽ([])にする`;

/** AI(Claude)に写真を送って、読みとってもらう */
async function askClaude(photoDataUrl) {
  // "data:image/jpeg;base64,ABC..." を、種類とデータに分ける
  const match = photoDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error('写真の形がおかしいよ');
  const [, mediaType, base64Data] = match;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-opus-5',
      max_tokens: 16000,
      system: 'あなたは小学生の勉強を助ける、やさしい先生です。むずかしい言葉は使いません。',
      messages: [
        {
          role: 'user',
          content: [
            { type: 'image', source: { type: 'base64', media_type: mediaType, data: base64Data } },
            { type: 'text', text: INSTRUCTION },
          ],
        },
      ],
      // 決めた形(ANSWER_SHAPE)のJSONで答えてもらう
      output_config: { format: { type: 'json_schema', schema: ANSWER_SHAPE } },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AIからエラーが返ってきたよ (${response.status}): ${errorText.slice(0, 200)}`);
  }

  const data = await response.json();

  // 考えごと(thinking)のブロックも混ざるので、文章のブロックだけ取り出す
  const textBlock = data.content.find((block) => block.type === 'text');
  if (!textBlock) throw new Error('AIの答えが読みとれなかったよ');

  return {
    result: JSON.parse(textBlock.text),
    // 今回いくらぶんの文字を使ったか(お金の目安)
    usage: data.usage,
  };
}

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

      const { result, usage } = await askClaude(photo);

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
