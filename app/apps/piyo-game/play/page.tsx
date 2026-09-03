'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import PiyoBird, { type AccessorySlot } from '../components/PiyoBird';
import PiyoPipe from '../components/PiyoPipe';
import PiyoGameOver from '../components/PiyoGameOver';
import { loadPiyoData, savePiyoData, type PiyoSaveData } from '../lib/storage';
import {
  createInitialState,
  stepGame,
  applyFlap,
  togglePause as togglePauseState,
  BIRD_X_RATIO,
  BIRD_RADIUS,
  GROUND_HEIGHT,
  type GameState,
  type StageSize,
} from '../lib/gameEngine';

/**
 * 【ぴよちゃんゲーム】ゲーム画面
 *
 * ここでやること:
 *   - タップ / スペースキーで、ぴよちゃんをふわっと飛ばす
 *   - 土管とコインを右から流す(lib/gameEngine.ts が計算する)
 *   - ぶつかったら「ゲームオーバー」を出して、ポイントとハイスコアを保存する
 *
 * 画面の大きさに合わせて動くように、はじめに画面(ステージ)の大きさを測ってから使う。
 */
export default function PiyoPlayPage() {
  const stageRef = useRef<HTMLDivElement>(null);
  const [stageSize, setStageSize] = useState<StageSize>({ width: 360, height: 640 });
  const [game, setGame] = useState<GameState>(() => createInitialState({ width: 360, height: 640 }));
  const [saved, setSaved] = useState<PiyoSaveData | null>(null);
  const savedResultRef = useRef(false); // ゲームオーバーの保存を1回だけにするための目印

  const lastTimeRef = useRef<number | undefined>(undefined);

  // 画面が出たときに1回、保存データを読みこむ
  useEffect(() => {
    setSaved(loadPiyoData());
  }, []);

  // ステージの大きさを測る(スマホでもパソコンでも、今の画面はばに合わせるため)
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    function measure() {
      const rect = el!.getBoundingClientRect();
      setStageSize({ width: rect.width, height: rect.height });
    }
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // ステージの大きさが決まったら、ぴよちゃんの初期位置をまん中にする
  useEffect(() => {
    setGame((prev) => (prev.status === 'ready' ? createInitialState(stageSize) : prev));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageSize.width, stageSize.height]);

  const handleFlap = useCallback(() => {
    setGame((prev) => applyFlap(prev));
  }, []);

  const handleTogglePause = useCallback(() => {
    setGame((prev) => togglePauseState(prev));
  }, []);

  const handleRetry = useCallback(() => {
    savedResultRef.current = false;
    setGame(createInitialState(stageSize));
  }, [stageSize]);

  // スペースキーでも、ぴよちゃんを飛ばせるようにする(PC用)
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space') {
        e.preventDefault();
        handleFlap();
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [handleFlap]);

  // ゲームのメインループ(1秒間に何回も呼ばれて、少しずつ動かす)
  useEffect(() => {
    if (game.status !== 'playing') {
      lastTimeRef.current = undefined;
      return;
    }
    let frameId: number;
    function tick(time: number) {
      if (lastTimeRef.current === undefined) lastTimeRef.current = time;
      const dt = Math.min((time - lastTimeRef.current) / 1000, 0.05);
      lastTimeRef.current = time;
      setGame((prev) => stepGame(prev, dt, stageSize));
      frameId = requestAnimationFrame(tick);
    }
    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [game.status, stageSize]);

  // ゲームオーバーになったら、ポイント・ハイスコアを保存する(1回だけ)
  useEffect(() => {
    if (game.status !== 'over' || savedResultRef.current) return;
    savedResultRef.current = true;
    const current = loadPiyoData();
    const updated: PiyoSaveData = {
      ...current,
      points: current.points + game.coins,
      highScore: Math.max(current.highScore, game.coins),
    };
    savePiyoData(updated);
    setSaved(updated);
  }, [game.status, game.coins]);

  const equippedAccessory = (saved?.equippedAccessoryId ?? null) as AccessorySlot;
  const birdX = stageSize.width * BIRD_X_RATIO;
  // 落ちてるときは下向き、上がってるときは上向きに、すこし回転させる(気持ちいい動きのため)
  const rotation = Math.max(-25, Math.min(70, (game.velocity / 500) * 45));

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-piyo-on-surface sm:p-piyo-md">
      <div
        ref={stageRef}
        onPointerDown={handleFlap}
        className="relative h-full w-full max-w-[440px] cursor-pointer select-none overflow-hidden bg-gradient-to-b from-[#62cdff] via-[#b3e5fc] to-[#e1f5fe] sm:h-[min(820px,100dvh)] sm:rounded-piyo-lg sm:shadow-2xl"
      >
        {/* 空のかざり(雲) */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-4 top-12 h-10 w-32 rounded-full bg-piyo-surface-container-lowest opacity-90 shadow-sm" />
          <div className="absolute -right-6 top-28 h-12 w-40 rounded-full bg-piyo-surface-container-lowest opacity-80 shadow-sm" />
          <div className="absolute -bottom-16 -left-10 h-36 w-[130%] rounded-[100%] bg-[#81c784] opacity-90" />
        </div>

        {/* 土管とコイン */}
        {game.pipes.map((pipe) => (
          <PiyoPipe key={pipe.id} pipe={pipe} stageHeight={stageSize.height} />
        ))}

        {/* 地面 */}
        <div
          className="absolute inset-x-0 bottom-0 z-30 bg-[#7cb342] shadow-[inset_0_6px_0_#9ccc65]"
          style={{ height: GROUND_HEIGHT }}
        >
          <div className="h-3 w-full bg-[#558b2f]" />
        </div>

        {/* ぴよちゃん */}
        <div
          className="absolute z-20"
          style={{
            left: birdX - 28,
            top: game.birdY - 28,
            transform: `rotate(${rotation}deg)`,
            transition: 'transform 80ms linear',
          }}
        >
          <PiyoBird size={56} flap={game.velocity < -200} accessory={equippedAccessory} />
        </div>

        {/* HUD(上のバー): もどる・コイン数・一時停止 */}
        <div className="absolute inset-x-0 top-0 z-40 flex items-center justify-between p-piyo-sm pt-piyo-hud-safe-top">
          <Link
            href="/apps/piyo-game"
            aria-label="タイトルへもどる"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-piyo-surface-container-lowest/90 text-piyo-primary shadow-sm"
          >
            <span className="material-symbols-outlined text-[22px]">arrow_back</span>
          </Link>
          <div className="flex items-center gap-piyo-xxs rounded-piyo-xl bg-piyo-surface-container-lowest/95 px-piyo-md py-piyo-xs shadow-[0_4px_0_rgba(0,101,141,0.15)]">
            <span
              className="material-symbols-outlined text-[22px] text-piyo-secondary"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              monetization_on
            </span>
            <span className="font-piyo-headline text-piyo-headline-md text-piyo-primary tabular-nums">
              {game.coins}
            </span>
          </div>
          <button
            type="button"
            aria-label="一時停止"
            onClick={(e) => {
              e.stopPropagation();
              handleTogglePause();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-piyo-secondary-container text-piyo-on-secondary-container shadow-sm"
          >
            <span className="material-symbols-outlined text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
              {game.status === 'paused' ? 'play_arrow' : 'pause'}
            </span>
          </button>
        </div>

        {/* タップして始める案内 */}
        {game.status === 'ready' && (
          <div className="absolute inset-x-0 bottom-24 z-30 flex justify-center">
            <div className="flex items-center gap-piyo-xs rounded-full bg-piyo-inverse-surface/85 px-piyo-md py-piyo-xs shadow-lg">
              <span className="material-symbols-outlined text-[20px] text-piyo-secondary-fixed">touch_app</span>
              <span className="font-piyo-body text-piyo-label-md text-piyo-inverse-on-surface">
                画面タップ(またはスペースキー)ではばたこう！
              </span>
            </div>
          </div>
        )}

        {/* 一時停止中の表示 */}
        {game.status === 'paused' && (
          <div className="absolute inset-0 z-40 flex items-center justify-center bg-piyo-on-surface/30">
            <div className="rounded-piyo-lg bg-piyo-surface-container-lowest px-piyo-xl py-piyo-lg text-center shadow-xl">
              <p className="font-piyo-headline text-piyo-headline-md text-piyo-primary">一時停止中</p>
              <p className="mt-piyo-xxs font-piyo-body text-piyo-label-md text-piyo-on-surface-variant">
                右上のボタンでさいかい
              </p>
            </div>
          </div>
        )}

        {/* ゲームオーバー */}
        {game.status === 'over' && saved && (
          <PiyoGameOver
            runCoins={game.coins}
            highScore={saved.highScore}
            totalPoints={saved.points}
            equippedAccessory={equippedAccessory}
            onRetry={handleRetry}
          />
        )}
      </div>
    </div>
  );
}
