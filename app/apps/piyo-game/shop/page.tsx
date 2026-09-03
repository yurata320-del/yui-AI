'use client';

import { useEffect, useState } from 'react';
import PiyoBird, { type AccessorySlot } from '../components/PiyoBird';
import PiyoHeader from '../components/PiyoHeader';
import PiyoBottomNav from '../components/PiyoBottomNav';
import { loadPiyoData, savePiyoData, type PiyoSaveData } from '../lib/storage';
import { ACCESSORIES } from '../lib/accessories';

/**
 * 【ぴよちゃんゲーム】ショップ画面
 *
 * ここでやること:
 *   - 持っているポイントで、アクセサリーを買う
 *   - 買ったアクセサリーを「つける」「はずす」「別のものに変える」
 *   - 買った・つけている情報は保存する(閉じても消えない)
 *
 * 見た目だけが変わる(強くはならない)アクセサリーなので、
 * ここではポイントを引くだけで、ゲームバランスは何もいじらない。
 */
export default function PiyoShopPage() {
  const [saved, setSaved] = useState<PiyoSaveData | null>(null);

  useEffect(() => {
    setSaved(loadPiyoData());
  }, []);

  function handlePurchase(id: string, price: number) {
    setSaved((prev) => {
      if (!prev) return prev;
      if (prev.purchasedAccessoryIds.includes(id)) return prev; // もう持ってる
      if (prev.points < price) return prev; // ポイントが足りない(ボタン側でも止めてある)
      const updated: PiyoSaveData = {
        ...prev,
        points: prev.points - price,
        purchasedAccessoryIds: [...prev.purchasedAccessoryIds, id],
        equippedAccessoryId: id, // 買ったらそのまま身につける
      };
      savePiyoData(updated);
      return updated;
    });
  }

  function handleEquip(id: string) {
    setSaved((prev) => {
      if (!prev) return prev;
      const updated: PiyoSaveData = { ...prev, equippedAccessoryId: id };
      savePiyoData(updated);
      return updated;
    });
  }

  function handleUnequip() {
    setSaved((prev) => {
      if (!prev) return prev;
      const updated: PiyoSaveData = { ...prev, equippedAccessoryId: null };
      savePiyoData(updated);
      return updated;
    });
  }

  const points = saved?.points ?? 0;
  const equippedId = saved?.equippedAccessoryId ?? null;
  const equippedItem = ACCESSORIES.find((a) => a.id === equippedId);

  return (
    <>
      <PiyoHeader points={points} />

      <main className="min-h-screen w-full bg-piyo-surface pb-32 pt-20">
        {!saved ? (
          <p className="p-piyo-md text-center text-piyo-label-md text-piyo-on-surface-variant">読みこみ中…</p>
        ) : (
          <div className="flex w-full flex-col gap-piyo-md px-piyo-hud-safe-side">
            <div>
              <h1 className="font-piyo-headline text-piyo-headline-lg-mobile text-piyo-primary">
                アクセサリーショップ
              </h1>
              <p className="mt-piyo-xxs font-piyo-body text-piyo-body-md text-piyo-on-surface-variant">
                ポイントでぴよちゃんをおしゃれにかざろう！(見た目だけで、つよさは変わらないよ)
              </p>
            </div>

            {/* 試着プレビュー */}
            <div className="flex flex-col items-center gap-piyo-sm rounded-piyo-lg bg-piyo-surface-container-low p-piyo-lg shadow-sm">
              <div className="flex items-center gap-piyo-xxs rounded-full bg-piyo-primary px-piyo-sm py-piyo-xxs text-piyo-on-primary shadow-sm">
                <span className="material-symbols-outlined text-[16px]">checkroom</span>
                <span className="font-piyo-label text-piyo-label-sm">
                  {equippedItem ? `そうび中: ${equippedItem.name}` : 'なにもつけてないよ'}
                </span>
              </div>
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-piyo-surface-container-lowest shadow-md">
                <PiyoBird size={112} accessory={equippedId as AccessorySlot} />
              </div>
              {equippedItem && (
                <button
                  type="button"
                  onClick={handleUnequip}
                  className="flex items-center gap-piyo-xxs rounded-full bg-piyo-surface-container-highest px-piyo-md py-piyo-xs font-piyo-label text-piyo-label-md text-piyo-on-surface shadow-sm active:translate-y-1"
                >
                  <span className="material-symbols-outlined text-[18px]">close</span>
                  はずす
                </button>
              )}
            </div>

            {/* アクセサリー一覧 */}
            <div className="flex flex-col gap-piyo-xs pb-piyo-md">
              {ACCESSORIES.map((item) => {
                const owned = saved.purchasedAccessoryIds.includes(item.id);
                const equipped = equippedId === item.id;
                const affordable = points >= item.price;

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-piyo-sm rounded-piyo bg-piyo-surface-container-lowest p-piyo-sm shadow-sm"
                  >
                    <div className="flex min-w-0 items-center gap-piyo-sm">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-piyo bg-piyo-surface-container-high text-[28px] shadow-inner">
                        {item.emoji}
                      </div>
                      <div className="flex min-w-0 flex-col">
                        <span className="truncate font-piyo-headline text-piyo-label-lg text-piyo-on-surface">
                          {item.name}
                        </span>
                        <span className="truncate font-piyo-body text-piyo-label-sm text-piyo-on-surface-variant">
                          {item.description}
                        </span>
                        <div className="mt-piyo-xxs flex items-center gap-piyo-xxs text-piyo-secondary">
                          <span className="material-symbols-outlined text-[16px]">monetization_on</span>
                          <span className="font-piyo-headline text-piyo-label-md font-bold">{item.price}</span>
                          <span className="font-piyo-label text-piyo-label-sm text-piyo-outline">コイン</span>
                        </div>
                      </div>
                    </div>

                    {equipped ? (
                      <button
                        type="button"
                        onClick={handleUnequip}
                        className="flex shrink-0 items-center gap-piyo-xxs rounded-full bg-piyo-tertiary-container px-piyo-md py-piyo-sm font-piyo-label text-piyo-label-md text-piyo-on-tertiary-container shadow-sm active:translate-y-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">check_circle</span>
                        そうび中
                      </button>
                    ) : owned ? (
                      <button
                        type="button"
                        onClick={() => handleEquip(item.id)}
                        className="flex shrink-0 items-center gap-piyo-xxs rounded-full bg-piyo-primary px-piyo-md py-piyo-sm font-piyo-label text-piyo-label-md text-piyo-on-primary shadow-sm active:translate-y-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">checkroom</span>
                        そうびする
                      </button>
                    ) : affordable ? (
                      <button
                        type="button"
                        onClick={() => handlePurchase(item.id, item.price)}
                        className="flex shrink-0 items-center gap-piyo-xxs rounded-full bg-piyo-secondary-container px-piyo-md py-piyo-sm font-piyo-label text-piyo-label-md text-piyo-on-secondary-container shadow-sm active:translate-y-1"
                      >
                        <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                        こうにゅう！
                      </button>
                    ) : (
                      <span className="shrink-0 rounded-full bg-piyo-surface-dim px-piyo-md py-piyo-sm font-piyo-label text-piyo-label-md text-piyo-on-surface-variant">
                        コインが足りない
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <PiyoBottomNav active="shop" />
    </>
  );
}
