'use client';

/**
 * トイプードル(羽つき)を描く部品。
 *
 * もとは黄色い「ひよこ」だったキャラクターを、
 * なまはげ → トイプードル(かわいい羽つき)に変更した。
 * 画像ファイルを使うかわりに、SVG(線と図形で絵をかく仕組み)で描いている。
 *
 * accessory を渡すと、頭の上あたりに簡単なアクセサリーを重ねて表示できる
 * (ショップで装着したものを、ゲーム中のトイプードルにも反映するため)。
 */

export type AccessorySlot = 'ribbon' | 'hat' | 'glasses' | 'crown' | 'feather' | null;

interface PiyoBirdProps {
  size?: number;
  flap?: boolean; // うでを振り上げているかどうか
  accessory?: AccessorySlot;
  className?: string;
}

export default function PiyoBird({ size = 96, flap = false, accessory = null, className = '' }: PiyoBirdProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      role="img"
      aria-label="トイプードル"
    >
      {/* からだ(まるい体) */}
      <ellipse cx="50" cy="60" rx="28" ry="32" fill="#F5E6D3" />

      {/* あたま(まるくてかわいい) */}
      <circle cx="50" cy="38" r="22" fill="#F5E6D3" />

      {/* 耳の毛(ふわふわ感) */}
      <ellipse cx="32" cy="30" rx="10" ry="14" fill="#F5E6D3" />
      <ellipse cx="68" cy="30" rx="10" ry="14" fill="#F5E6D3" />

      {/* 耳の薄い部分 */}
      <ellipse cx="32" cy="32" rx="5" ry="8" fill="#FFC4D6" />
      <ellipse cx="68" cy="32" rx="5" ry="8" fill="#FFC4D6" />

      {/* 目(やさしい目) */}
      <circle cx="42" cy="35" r="4" fill="#2B2116" />
      <circle cx="58" cy="35" r="4" fill="#2B2116" />
      {/* 目のキラキラ */}
      <circle cx="43" cy="34" r="1.5" fill="#ffffff" />
      <circle cx="59" cy="34" r="1.5" fill="#ffffff" />

      {/* 鼻 */}
      <circle cx="50" cy="42" r="3" fill="#2B2116" />

      {/* 口(笑顔) */}
      <path d="M48 45 Q50 47 52 45" stroke="#2B2116" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* 後ろ足(うしろ側) */}
      <ellipse cx="62" cy="70" rx="7" ry="12" fill="#F5E6D3" />

      {/* 前足(タップすると上に動く) */}
      <ellipse
        cx="38"
        cy="70"
        rx="7"
        ry="12"
        fill="#F5E6D3"
        transform={flap ? 'rotate(-35 38 70)' : 'rotate(-5 38 70)'}
        style={{ transition: 'transform 120ms ease-out' }}
      />

      {/* 前足の肉球 */}
      <circle cx="38" cy="82" r="3" fill="#FFC4D6" />

      {/* 羽(背中の左側) - かなり大きくてかわいい翼 */}
      <path
        d="M20 58 Q5 42 0 20 Q10 55 38 65 Z"
        fill="#FFB3D9"
        stroke="#FF69B4"
        strokeWidth="1.5"
      />

      {/* 羽(背中の右側) - かなり大きくてかわいい翼 */}
      <path
        d="M80 58 Q95 42 100 20 Q90 55 62 65 Z"
        fill="#FFB3D9"
        stroke="#FF69B4"
        strokeWidth="1.5"
      />

      {/* アクセサリー(装着中のものだけ表示) */}
      {accessory === 'ribbon' && (
        <path d="M44 30 L50 36 L56 30 L54 38 L60 42 L50 40 L40 42 L46 38 Z" fill="#FF6B9D" />
      )}
      {accessory === 'hat' && (
        <g>
          <rect x="34" y="20" width="28" height="8" rx="4" fill="#5B8AF0" />
          <path d="M38 22 L36 8 L58 8 L56 22 Z" fill="#5B8AF0" />
        </g>
      )}
      {accessory === 'glasses' && (
        <g stroke="#2B2116" strokeWidth="2.5" fill="none">
          <circle cx="40" cy="53" r="7" />
          <circle cx="60" cy="53" r="7" />
          <line x1="47" y1="53" x2="53" y2="53" />
        </g>
      )}
      {accessory === 'crown' && (
        <path
          d="M36 26 L40 14 L47 22 L52 10 L57 22 L64 14 L68 26 Z"
          fill="#FFD34D"
          stroke="#E0A800"
          strokeWidth="1.5"
        />
      )}
      {accessory === 'feather' && (
        <path
          d="M52 24 C58 14 66 12 70 6 C66 16 66 24 60 30 Z"
          fill="#5FD3C4"
        />
      )}
    </svg>
  );
}
