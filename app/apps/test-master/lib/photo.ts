/**
 * 撮った写真を「小さくする」ための部品。
 *
 * なぜ小さくするか:
 *   スマホの写真は1枚で3MB(メガバイト)くらいある。
 *   ブラウザの引き出し(localStorage)は5MBくらいしか入らないので、
 *   そのまま入れると すぐいっぱいになってしまう。
 *   よこ幅を最大800pxまで縮めて、軽くしてから保存する。
 */

const MAX_WIDTH = 800; // よこ幅の最大(px)
const QUALITY = 0.7; // 画質(1に近いほどきれいで重い)

/**
 * 選んだ写真ファイルを、小さくした画像データ(文字列)に変える。
 * この文字列をそのまま <img src={...}> に入れれば表示できる。
 */
export function shrinkPhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    // 1. ファイルを読みこむ
    reader.onload = () => {
      const image = new Image();

      // 2. 読みこんだ画像の大きさを計算して、小さく描きなおす
      image.onload = () => {
        // よこ幅が大きすぎるときだけ、比率をたもったまま縮める
        const scale = image.width > MAX_WIDTH ? MAX_WIDTH / image.width : 1;
        const width = Math.round(image.width * scale);
        const height = Math.round(image.height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('画像を小さくできませんでした'));
          return;
        }
        ctx.drawImage(image, 0, 0, width, height);

        // 3. 小さくした画像を、文字列にして返す
        resolve(canvas.toDataURL('image/jpeg', QUALITY));
      };

      image.onerror = () => reject(new Error('画像を読みこめませんでした'));
      image.src = reader.result as string;
    };

    reader.onerror = () => reject(new Error('ファイルを読みこめませんでした'));
    reader.readAsDataURL(file);
  });
}
