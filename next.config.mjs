/**
 * GitHub Pages(GitHubが無料でホームページを置いてくれる場所)に公開するための設定。
 *
 * GitHub Pagesは「決まった見た目のファイル(HTML/CSS/JS)を置くだけ」の場所で、
 * サーバー側でプログラムを動かす仕組みはない。
 * なので `output: 'export'` で、Next.jsに「サーバーなしでも動くファイル一式」を作ってもらう。
 *
 * GITHUB_PAGES という目印(環境変数)は、GitHub Actions(自動でビルドしてくれるロボット)の中でだけ
 * 'true' になるようにしてある(.github/workflows/deploy.yml を見てね)。
 * これで `npm run dev` でふだん作業するときは、今までどおり http://localhost:3000 で見られる。
 */
const isGithubPages = process.env.GITHUB_PAGES === 'true';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  // リポジトリ名(yui-AI)が、公開されるURLのいちばん最初につくので、それを教えておく
  basePath: isGithubPages ? '/yui-AI' : '',
  // フォルダ + index.html の形で書き出す(GitHub Pagesで確実に見られるようにするため)
  trailingSlash: true,
};

export default nextConfig;
