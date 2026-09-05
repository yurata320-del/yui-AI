# ゆいのアプリ

じぶんで作ったアプリを、タイルにならべていく場所。

---

## 1. さいしょの1回だけやること

ターミナルで、このフォルダを開いてから:

```
npm install
```

必要な部品をダウンロードする。数分かかるけど、最初の1回だけ。

---

## 2. アプリを動かす

```
npm run dev
```

そのあとブラウザで **http://localhost:3000** を開く。

- ファイルを保存すると、ブラウザがじどうで新しくなる（リロードしなくていい）
- 止めたいときは、ターミナルで `Ctrl` + `C`

---

## 3. 今あるアプリ

| アプリ | URL | おぼえられること |
| --- | --- | --- |
| カウンター | `/apps/counter` | 状態（useState）＝おぼえておく箱 |
| じゃんけん | `/apps/janken` | 配列・ランダム・じょうけん分け |
| メモ | `/apps/memo` | 保存（localStorage） |

まずはこの3つのコードを読んで、少し書きかえてみるのがおすすめ。
それぞれのページの下に「やってみよう」が書いてある。

### テストマスター（`/apps/test-master`）でAIを使うとき

テストの写真をAIに読ませる機能だけ、**もう1つターミナルが必要**。

1. `.env.local.example` を `.env.local` という名前でコピーする
2. その中に、Anthropicのかぎ（APIキー）を貼る
3. ターミナルを2つ開いて、それぞれで動かす

```bash
npm run ai    # ← AIサーバー（かぎを預かる係）
npm run dev   # ← アプリ本体
```

- かぎは `.env.local` の中だけ。GitHubには上がらない（`.gitignore`に書いてある）
- 写真1枚あたり **約5円**（`claude-opus-5` の実測: 入力3,228 / 出力719 tokens）。
  安くしたいときは `ai-server/read-test.mjs` の `model` を
  `claude-sonnet-5`（約2円）や `claude-haiku-4-5`（約1円）に変える

### スマホでもAIを使う（Cloudflare Workers）

公開ページはHTTPSなので `http://localhost` は呼べない。
インターネット側にもAIサーバー（`ai-server/worker.js`）を置く。

```bash
cd ai-server
npx wrangler login                        # Cloudflareにログイン（ブラウザが開く）
npx wrangler secret put ANTHROPIC_API_KEY # かぎを預ける（貼り付けは画面に出ない）
npx wrangler deploy                       # 公開。最後にURLが表示される
```

表示されたURL（例 `https://yui-test-master-ai.xxx.workers.dev`）を、
GitHubの **Settings > Secrets and variables > Actions > Variables** に
`AI_URL` という名前で登録する（末尾に `/read-test` は不要）。
登録後に `git push` すると、公開ページからAIが使えるようになる。

- Worker側は、決めたページ（GitHub Pages / localhost）からのお願いだけ受けつける
- 念のため、**Anthropic Console で利用上限（Spend limit）を設定しておく**こと

---

## 4. 新しいアプリの作りかた

### ステップ1: ページを作る

`app/apps/` の中に、アプリの名前のフォルダを作って、`page.tsx` を置く。

```
app/apps/しんきアプリ/page.tsx
```

中身は、いちばん簡単だとこれだけ:

```tsx
export default function Page() {
  return <h1 className="ui-page-title">はじめてのアプリ</h1>;
}
```

これだけで **http://localhost:3000/apps/しんきアプリ** が見られる。

> ボタンを押して画面が変わるアプリにしたいときは、
> ファイルのいちばん上に `'use client';` と書く。
> （カウンターやじゃんけんのコードを見てみて）

### ステップ2: ホームにタイルを出す

`app/page.tsx` を開いて、`TILES` に1つ足す:

```tsx
{
  href: '/apps/しんきアプリ',
  title: 'あたらしいアプリ',
  description: 'なにができるか、みじかく書く。',
  accent: POP_COLORS.green, // 下の「タイルの色」から選ぶ
  icon: StarIcon,
},
```

これでホームにタイルが出る。**この2ステップだけ。**

---

## 5. 見た目をそろえる

自分で色や大きさを決めなくても、名前を書くだけできれいになる部品がある
（中身は `app/globals.css`）。

| 名前 | なにに使う |
| --- | --- |
| `ui-card` | 白い箱 |
| `ui-page-title` | 大きい見出し |
| `ui-section-title` | 小さい見出し |
| `ui-number` | 大きい数字 |
| `ui-btn-primary` | 目立つボタン（黒） |
| `ui-btn-secondary` | ふつうのボタン（白） |
| `ui-input` | 文字を入力する欄 |
| `ui-link` | リンク |
| `ui-tile` | ホームのタイル(色をぬった、ポップなカード) |
| `ui-tile-icon` | タイルの中の、まるいアイコンバッジ |
| `ui-tile-title` | タイルの名前 |
| `ui-tile-desc` | タイルの説明文 |

使いかた:

```tsx
<div className="ui-card p-5">
  <p className="ui-section-title">タイトル</p>
</div>
```

タイルは背景いっぱいに色をぬった、ポップなカードになっている
（小学生が見て楽しいように、はっきりした色にしてある）。
色は `app/page.tsx` の `POP_COLORS` から選ぶ:

`#FFC93C` イエロー / `#FF6F91` ピンク / `#29B6F6` ブルー / `#7ED957` グリーン / `#A66DD4` パープル

---

## 6. こまったとき

- **画面がまっ白 / エラーが出た** → ターミナルに赤い字で理由が出ている。そのままAIに見せれば直せる
- **`npm run dev` が動かない** → `npm install` をやったか確認
- **前の状態にもどしたい** → `git status` で今の変更を見て、`git checkout .` で全部もどせる

---

## 7. やってはいけないこと

- **パスワードやAPIキーをコードに直接書かない。** `.env.local` に書く（このファイルはGitHubに上がらないようになっている）
- **じぶんや友だちの名前・住所・学校名を、アプリの中に書かない**
- **`node_modules` フォルダはさわらない**（自動で作られる場所）
