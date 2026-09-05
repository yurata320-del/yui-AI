/**
 * 【テストマスター】スマホからも使えるようにする、インターネット上のAIサーバー。
 *
 * Cloudflare Workers という「小さなサーバーを無料で置ける場所」で動く。
 *
 * なぜこれが必要か:
 *   公開ページ(https://...github.io)は、自分のパソコンの中のサーバー
 *   (http://localhost:8787)には話しかけられない。
 *   だから、インターネット側にも同じ役目のサーバーを置く。
 *
 * かぎ(APIキー)の置き場所:
 *   このファイルには書かない。Cloudflare に「シークレット」として預ける。
 *     npx wrangler secret put ANTHROPIC_API_KEY
 *
 * 動かしかた(くわしくは README.md):
 *   npx wrangler login    … Cloudflareにログイン
 *   npx wrangler deploy   … インターネットに置く
 */

import { askClaude } from './read-test.mjs';

// このアドレスから開いたアプリだけが使える(知らない人のページからは使えない)
const ALLOWED_ORIGINS = ['https://yurata320-del.github.io', 'http://localhost:3000'];

// 大きすぎる写真はことわる(いたずらでお金を使われないように)
const MAX_BODY_BYTES = 3_000_000; // 約3MB

/** ブラウザに返すときの、おやくそく(CORS)のヘッダーを作る */
function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers': 'content-type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'content-type': 'application/json',
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') ?? '';
    const headers = corsHeaders(origin);

    // ブラウザが本番の前に送ってくる「聞いてもいい?」への返事
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers });
    }

    // 知らないページからのお願いは、ことわる
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return new Response(JSON.stringify({ ok: false, message: 'このページからは使えないよ' }), {
        status: 403,
        headers,
      });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, message: 'そのお願いには答えられないよ' }), {
        status: 405,
        headers,
      });
    }

    if (!env.ANTHROPIC_API_KEY) {
      return new Response(
        JSON.stringify({ ok: false, message: 'かぎ(ANTHROPIC_API_KEY)が登録されていないよ' }),
        { status: 500, headers }
      );
    }

    try {
      const body = await request.text();

      // 写真が大きすぎるときは、ことわる
      if (body.length > MAX_BODY_BYTES) {
        return new Response(JSON.stringify({ ok: false, message: '写真が大きすぎるよ' }), {
          status: 413,
          headers,
        });
      }

      const { photo } = JSON.parse(body);
      const { result } = await askClaude(photo, env.ANTHROPIC_API_KEY);

      return new Response(JSON.stringify({ ok: true, result }), { status: 200, headers });
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, message: error.message }), {
        status: 500,
        headers,
      });
    }
  },
};
