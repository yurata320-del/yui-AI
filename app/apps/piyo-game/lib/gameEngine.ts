/**
 * 「ぴよちゃんゲーム」のゲームルール(物理演算・当たり判定)だけをまとめたファイル。
 *
 * ここには画面の見た目(JSX)は書かない。
 * 「1フレーム(一瞬)ごとに、ぴよちゃんや土管がどう動くか」を計算する関数だけを置く。
 * こうしておくと、あとで見た目を変えたくなっても、ここは触らずにすむ。
 */

// ==== 調整できる数字(ゲームバランス) ====
export const GRAVITY = 1500; // 重力の強さ(下に落ちる速さがどんどん増える)
export const FLAP_VELOCITY = -430; // タップした瞬間の「ふわっ」と上がる速さ
export const MAX_FALL_SPEED = 640; // 落ちる速さの上限(これ以上は速くならない)
export const PIPE_WIDTH = 68; // 土管の横はば
export const PIPE_GAP = 220; // 上下の土管のあいだの、通り道の広さ
export const GROUND_HEIGHT = 56; // 下の地面の高さ
export const BIRD_X_RATIO = 0.28; // ぴよちゃんの横の位置(画面はばの何割か)
export const BIRD_RADIUS = 22; // ぴよちゃんの当たり判定の大きさ(半径)
export const COIN_RADIUS = 20; // コインの当たり判定の大きさ(半径)

// ---- だんだんむずかしくなる設定 ----
// 土管が流れる速さ: はじめは遅く、プレイ時間が長くなるほど少しずつ速くなり、上限で止まる
export const BASE_PIPE_SPEED = 150; // はじめの速さ
export const MAX_PIPE_SPEED = 260; // これ以上は速くならない上限
export const SPEED_RAMP_PER_SEC = 4; // 1秒プレイするごとに、これだけ速くなる

// 土管と土管のかんかく: はじめは広く、時間がたつほど少しずつせまくなる
export const BASE_PIPE_SPACING = 300; // はじめのかんかく
export const MIN_PIPE_SPACING = 210; // これ以上はせまくならない下限
export const SPACING_RAMP_SECONDS = 30; // このくらいの時間で、いちばんせまい所まで落ちつく

// 「連続で土管がくる」むずかしいパート。6本ごとに、さいごの2本だけ、うんとせまくする
export const BURST_PIPE_SPACING = 165; // 連続パート中の、せまいかんかく
export const BURST_CYCLE = 6; // 何本ごとに1回、連続パートを混ぜるか
export const BURST_LENGTH = 2; // 連続パートは何本つづくか

/** 今のプレイ時間(elapsed)から、今の土管の速さを計算する */
export function currentPipeSpeed(elapsed: number): number {
  return Math.min(BASE_PIPE_SPEED + SPEED_RAMP_PER_SEC * elapsed, MAX_PIPE_SPEED);
}

/** 今のプレイ時間から、「連続パートじゃないとき」の土管のかんかくを計算する */
function rampedPipeSpacing(elapsed: number): number {
  const progress = Math.min(elapsed / SPACING_RAMP_SECONDS, 1);
  return BASE_PIPE_SPACING - (BASE_PIPE_SPACING - MIN_PIPE_SPACING) * progress;
}

/**
 * 次(nextIndex本目)に出す土管が、「連続パート」に当たるかどうか。
 * 例: BURST_CYCLE=6, BURST_LENGTH=2 のときは、6本ごとの5本目・6本目がせまくなる。
 */
function isBurstPipe(nextIndex: number): boolean {
  const positionInCycle = ((nextIndex - 1) % BURST_CYCLE) + 1; // 1〜BURST_CYCLE
  return positionInCycle > BURST_CYCLE - BURST_LENGTH;
}

export interface Pipe {
  id: number;
  x: number; // 左はしの位置(px)
  gapTop: number; // すきまの上の位置(px)
  coinCollected: boolean;
}

export type GameStatus = 'ready' | 'playing' | 'paused' | 'over';

export interface GameState {
  birdY: number;
  velocity: number;
  pipes: Pipe[];
  coins: number; // 今回のプレイであつめたコイン
  distanceSinceSpawn: number; // 次の土管を出すまでの、たまった距離
  status: GameStatus;
  nextPipeId: number;
  elapsed: number; // 'playing' 状態だった時間の合計(秒)。むずかしさの計算に使う
  pipesSpawned: number; // これまでに出した土管の本数(連続パートの判定に使う)
}

export interface StageSize {
  width: number;
  height: number;
}

/** ゲームを始めたときの、はじめの状態 */
export function createInitialState(stage: StageSize): GameState {
  return {
    birdY: stage.height / 2,
    velocity: 0,
    pipes: [],
    coins: 0,
    distanceSinceSpawn: 0,
    status: 'ready',
    nextPipeId: 1,
    elapsed: 0,
    pipesSpawned: 0,
  };
}

/** 新しい土管を1本、画面の右はしのすぐ外に作る */
function createPipe(id: number, stage: StageSize): Pipe {
  const groundY = stage.height - GROUND_HEIGHT;
  const margin = 60; // 上とグラウンドぎりぎりに隙間が来ないようにする、あそび
  const minGapTop = margin;
  const maxGapTop = Math.max(margin, groundY - margin - PIPE_GAP);
  const gapTop = minGapTop + Math.random() * Math.max(1, maxGapTop - minGapTop);
  return { id, x: stage.width + 40, gapTop, coinCollected: false };
}

/**
 * 1フレームぶん、ゲームをすすめる。
 * dt = 前のフレームからの経過時間(秒)。これを使うと、パソコンの速さが違っても同じ動きになる。
 */
export function stepGame(state: GameState, dt: number, stage: StageSize): GameState {
  if (state.status !== 'playing') return state;

  // プレイ時間をすすめて、今の「速さ」を決める(長く生きのこるほど、少しずつ速くなる)
  const elapsed = state.elapsed + dt;
  const speed = currentPipeSpeed(elapsed);

  // ぴよちゃんの上下移動(重力で落ちて、タップで上がる)
  let velocity = Math.min(state.velocity + GRAVITY * dt, MAX_FALL_SPEED);
  let birdY = state.birdY + velocity * dt;

  // 土管を左へ流す(速さは今の難易度しだい)
  let pipes = state.pipes
    .map((pipe) => ({ ...pipe, x: pipe.x - speed * dt }))
    .filter((pipe) => pipe.x + PIPE_WIDTH > -40);

  // 新しい土管を出すタイミングか確認する。
  // ふだんは時間とともに少しずつせまくなり、6本ごとに2本だけ「連続パート」でぐっとせまくなる。
  let distanceSinceSpawn = state.distanceSinceSpawn + speed * dt;
  let nextPipeId = state.nextPipeId;
  let pipesSpawned = state.pipesSpawned;
  const targetSpacing = isBurstPipe(pipesSpawned + 1) ? BURST_PIPE_SPACING : rampedPipeSpacing(elapsed);
  if (distanceSinceSpawn >= targetSpacing) {
    distanceSinceSpawn = 0;
    pipes = [...pipes, createPipe(nextPipeId, stage)];
    nextPipeId += 1;
    pipesSpawned += 1;
  }

  const birdX = stage.width * BIRD_X_RATIO;
  const groundY = stage.height - GROUND_HEIGHT;
  let collided = false;
  let coinsGained = 0;

  pipes = pipes.map((pipe) => {
    // 土管との当たり判定(横にかさなっていて、すきまの外にいたらアウト)
    const overlapsHorizontally = birdX + BIRD_RADIUS > pipe.x && birdX - BIRD_RADIUS < pipe.x + PIPE_WIDTH;
    if (overlapsHorizontally) {
      const hitsTopPipe = birdY - BIRD_RADIUS < pipe.gapTop;
      const hitsBottomPipe = birdY + BIRD_RADIUS > pipe.gapTop + PIPE_GAP;
      if (hitsTopPipe || hitsBottomPipe) collided = true;
    }

    // コインとの当たり判定(すきまのまん中にある。1回とったら消える)
    if (!pipe.coinCollected) {
      const coinX = pipe.x + PIPE_WIDTH / 2;
      const coinY = pipe.gapTop + PIPE_GAP / 2;
      const dx = birdX - coinX;
      const dy = birdY - coinY;
      const touchesCoin = dx * dx + dy * dy < (BIRD_RADIUS + COIN_RADIUS) ** 2;
      if (touchesCoin) {
        coinsGained += 1;
        return { ...pipe, coinCollected: true };
      }
    }
    return pipe;
  });

  // 地面に落ちたらゲームオーバー
  if (birdY + BIRD_RADIUS > groundY) {
    birdY = groundY - BIRD_RADIUS;
    collided = true;
  }
  // 天じょうより上には行けないようにする(ゲームオーバーにはしない)
  if (birdY - BIRD_RADIUS < 0) {
    birdY = BIRD_RADIUS;
    velocity = 0;
  }

  return {
    birdY,
    velocity,
    pipes,
    coins: state.coins + coinsGained,
    distanceSinceSpawn,
    nextPipeId,
    elapsed,
    pipesSpawned,
    status: collided ? 'over' : 'playing',
  };
}

/** タップ(またはスペースキー)されたときの処理。ふわっと上に飛ぶ */
export function applyFlap(state: GameState): GameState {
  // 一時停止中・ゲームオーバー中はタップしても飛ばない
  if (state.status === 'over' || state.status === 'paused') return state;
  return {
    ...state,
    status: 'playing',
    velocity: FLAP_VELOCITY,
  };
}

/** 一時停止 ⇔ 再開 の切りかえ */
export function togglePause(state: GameState): GameState {
  if (state.status === 'playing') return { ...state, status: 'paused' };
  if (state.status === 'paused') return { ...state, status: 'playing' };
  return state;
}
