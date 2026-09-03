import type { AccessorySlot } from '../components/PiyoBird';

/**
 * ショップで売っている、ぴよちゃん用アクセサリーの一覧。
 * 見た目だけを変えるもので、ゲームを有利にする効果はない(仕様どおり)。
 */

export interface Accessory {
  id: NonNullable<AccessorySlot>;
  name: string;
  price: number;
  emoji: string; // 一覧にならぶ、小さいアイコン(仮素材として絵文字を使う)
  description: string;
}

export const ACCESSORIES: Accessory[] = [
  { id: 'ribbon', name: 'リボン', price: 5, emoji: '🎀', description: 'かわいいワンポイント' },
  { id: 'hat', name: 'ぼうし', price: 10, emoji: '👒', description: 'かぶるとおしゃれ' },
  { id: 'glasses', name: 'メガネ', price: 20, emoji: '🕶️', description: 'ちょっとクールに' },
  { id: 'crown', name: 'おうかん', price: 50, emoji: '👑', description: '王さまみたいにゴージャス' },
  { id: 'feather', name: 'とくべつなはねかざり', price: 100, emoji: '🪶', description: 'レアなかざり' },
];
