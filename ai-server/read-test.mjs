/**
 * 【テストマスター】テストの写真をAIに読んでもらう「中身」の部分。
 *
 * このファイルは、2つの場所から使われる:
 *   - server.mjs … 自分のパソコンで動かすとき(npm run ai)
 *   - worker.js  … インターネット上(Cloudflare Workers)で動かすとき
 *
 * どちらも同じ読みとりをしたいので、共通の部分だけをここに置いてある。
 * ライブラリは1つも使っていない(fetch は両方の場所にもともとある)。
 */

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

/**
 * クイズの選択肢の順番を、バラバラに入れかえる。
 *
 * なぜ必要か:
 *   AIに作ってもらうと、正解がいつも同じ場所(Bなど)にかたよることがある。
 *   それだと「いつもB」で当たってしまい、勉強にならない。
 *   ここで1回だけ混ぜて、正解の場所がバラバラになるようにする。
 */
function shuffleChoices(quiz) {
  return quiz.map((question) => {
    // 正解の文字をおぼえておく
    const correctText = question.choices[question.answerIndex];

    // 選択肢を混ぜる(うしろから1つずつ、ランダムな相手と入れかえる)
    const shuffled = [...question.choices];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    // 混ぜたあとの、正解の場所を探しなおす
    return { ...question, choices: shuffled, answerIndex: shuffled.indexOf(correctText) };
  });
}

/** AI(Claude)に写真を送って、読みとってもらう */
export async function askClaude(photoDataUrl, apiKey) {
  // "data:image/jpeg;base64,ABC..." を、種類とデータに分ける
  const match = photoDataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (!match) throw new Error('写真の形がおかしいよ');
  const [, mediaType, base64Data] = match;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      'x-api-key': apiKey,
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

  const result = JSON.parse(textBlock.text);
  // 正解の位置がかたよらないように、選択肢を混ぜる
  result.quiz = shuffleChoices(result.quiz);

  return {
    result,
    // 今回いくらぶんの文字を使ったか(お金の目安)
    usage: data.usage,
  };
}

