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
          // ↓ この2つは「本当にまちがい？」を確かめるためのもの。
          //   思い込みで「まちがい」と決めつけるのを防ぐ。
          evidence: {
            type: 'string',
            description:
              'まちがいだと分かる、写真に写っている印。例:「赤い×がついている」「赤で正しい答えが書き直されている」。印が見あたらないなら「印なし」と書く',
          },
          isMarkedWrong: {
            type: 'boolean',
            description: '赤い×や書き直しなど、先生がまちがいとした印が写真にあるなら true',
          },
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
        required: [
          'questionNumber',
          'question',
          'yourAnswer',
          'correctAnswer',
          'evidence',
          'isMarkedWrong',
          'why',
          'steps',
          'onePoint',
        ],
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

5. まちがえた問題(多くても3問)

   ★ここが一番大事。まちがいの判定はきびしくすること。★

   「まちがえた問題」に入れてよいのは、写真に次のどれかが写っている問題だけ:
     - 赤い × や / (斜線)、チェックの取り消しがついている
     - 赤ペンで正しい答えに書き直されている
     - 「もう一度」「なおし」など、やり直しの指示が書かれている

   入れてはいけないもの:
     - ○(まる)がついている問題 → 正解なので絶対に入れない
     - 印が何もついていない問題 → 入れない
     - 答えが空欄の問題で、×もついていないもの → 入れない
     - 「自分で計算したら答えがちがう気がする」だけの問題 → 入れない

   入れる前に、かならず自分でも計算して確かめること。
   答案の答えが実際には正しいなら、×がついていても入れない。

   まちがいが1つも無いなら、mistakes は空っぽ([])にする。それが正しい答えです。

6. リベンジ問題
   - 5で挙げたまちがいがあるときだけ、同じ考えかたで解ける「にた問題」を3問つくる
   - まちがいが無いときは、quiz も空っぽ([])にする

大事なこと:
- 説明は小学生にわかる、やさしい日本語で書く
- 写真から読みとれないことは、むりに作らない(点数が読めないときは -1)
- 「たぶんまちがい」で入れない。確かな印があるものだけ入れる`;

/**
 * AIの答えの「つじつま」を合わせる。
 *
 * AIは、まちがっていない問題まで「まちがい」として挙げてしまうことがある。
 * お願いの文だけでは防ぎきれないので、ここでも機械的にふるいにかける。
 *
 * ふるいのルール:
 *   1. 先生の印(赤い×など)が無いものは、まちがいとして扱わない
 *   2. 点数が100点なら、まちがいは無いはず
 *   3. まちがいの数より多く挙がっていたら、多いぶんは捨てる
 *   4. まちがいが1つも無いなら、リベンジ問題も作らない
 */
function keepOnlyRealMistakes(result) {
  // 1. 印があるものだけ残す
  let mistakes = result.mistakes.filter((mistake) => mistake.isMarkedWrong === true);

  // 2. 100点なら、まちがいは無い
  if (result.score === 100) {
    mistakes = [];
  }

  // 3. 「まちがえた数」より多いときは、そのぶんだけにする
  if (typeof result.wrongCount === 'number' && result.wrongCount >= 0) {
    mistakes = mistakes.slice(0, result.wrongCount);
  }

  // 4. まちがいが無いなら、リベンジ問題も無し
  const quiz = mistakes.length === 0 ? [] : result.quiz;

  return { ...result, mistakes, quiz };
}

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
      output_config: {
        // 決めた形(ANSWER_SHAPE)のJSONで答えてもらう
        format: { type: 'json_schema', schema: ANSWER_SHAPE },
        // AIがどれくらい じっくり考えるか。
        // 写真から読みとる作業に「max」までは要らない。
        // 'medium' にすると待ち時間がぐっと短くなる(その分ねだんも安い)。
        effort: 'medium',
      },
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

  // まちがっていない問題を「まちがい」として拾っていないか、ふるいにかける
  const result = keepOnlyRealMistakes(JSON.parse(textBlock.text));
  // 正解の位置がかたよらないように、選択肢を混ぜる
  result.quiz = shuffleChoices(result.quiz);

  return {
    result,
    // 今回いくらぶんの文字を使ったか(お金の目安)
    usage: data.usage,
  };
}

