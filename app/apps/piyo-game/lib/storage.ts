/**
 * 「ぴよちゃんゲーム」のセーブデータ(保存データ)まわり。
 *
 * memoアプリと同じように localStorage(ブラウザの中の小さな引き出し)を使う。
 * ここに保存するのは4つだけ:
 *   - points               … 所持ポイント(コインを集めてためる数)
 *   - highScore            … ハイスコア(いままでの一番いい点数)
 *   - purchasedAccessoryIds … 買ったアクセサリーのID一覧
 *   - equippedAccessoryId   … 今つけているアクセサリーのID(なければ null)
 *
 * ゲーム中の位置などは保存しない(仕様どおり)。
 */

const STORAGE_KEY = 'yui-piyo-game';

export interface PiyoSaveData {
  points: number;
  highScore: number;
  purchasedAccessoryIds: string[];
  equippedAccessoryId: string | null;
}

// はじめて遊ぶ人の初期データ
export const INITIAL_DATA: PiyoSaveData = {
  points: 0,
  highScore: 0,
  purchasedAccessoryIds: [],
  equippedAccessoryId: null,
};

/**
 * 保存データを読みこむ。
 * localStorage はブラウザにしかないので、呼び出すのは useEffect の中(画面が出たあと)にする。
 */
export function loadPiyoData(): PiyoSaveData {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return { ...INITIAL_DATA };
    const parsed = JSON.parse(saved);
    // 壊れたデータが来ても止まらないように、足りない項目は初期値でおぎなう
    return {
      points: typeof parsed.points === 'number' ? parsed.points : 0,
      highScore: typeof parsed.highScore === 'number' ? parsed.highScore : 0,
      purchasedAccessoryIds: Array.isArray(parsed.purchasedAccessoryIds) ? parsed.purchasedAccessoryIds : [],
      equippedAccessoryId: typeof parsed.equippedAccessoryId === 'string' ? parsed.equippedAccessoryId : null,
    };
  } catch {
    // 読めなくても、初期データとして使えればOK
    return { ...INITIAL_DATA };
  }
}

/** 保存データを書きこむ */
export function savePiyoData(data: PiyoSaveData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // 保存できない設定のブラウザもある。そのときは画面の中だけで動かす
  }
}
