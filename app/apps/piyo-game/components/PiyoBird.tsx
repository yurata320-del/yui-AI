'use client';

/**
 * ぴよちゃん(黄色い小鳥)を描く部品。
 *
 * 画像ファイルを使うかわりに、SVG(線と図形で絵をかく仕組み)で描いている。
 * 理由: 本物の画像素材がまだ無いので、CLAUDE.mdのルールにしたがって
 *       まずはCSS/SVGの仮素材で「動くところ」を確認できるようにするため。
 *
 * accessory を渡すと、頭の上あたりに簡単なアクセサリーを重ねて表示できる
 * (ショップで装着したものを、ゲーム中のぴよちゃんにも反映するため)。
 */

export type AccessorySlot = 'ribbon' | 'hat' | 'glasses' | 'crown' | 'feather' | null;

interface PiyoBirdProps {
  size?: number;
  flap?: boolean; // はばたき中(はねが上がっている)かどうか
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
      aria-label="ぴよちゃん"
    >
      {/* からだ */}
      <circle cx="50" cy="56" r="30" fill="#FFCB3D" />
      {/* おなか(すこし明るい黄色) */}
      <ellipse cx="46" cy="64" rx="18" ry="14" fill="#FFE28A" />
      {/* はね(タップすると上に動く) */}
      <ellipse
        cx="34"
        cy="58"
        rx="12"
        ry="8"
        fill="#F5B400"
        transform={flap ? 'rotate(-35 34 58)' : 'rotate(-5 34 58)'}
        style={{ transition: 'transform 120ms ease-out' }}
      />
      {/* くちばし */}
      <path d="M76 52 L92 57 L76 63 Z" fill="#FF8F3D" />
      {/* ほっぺ */}
      <circle cx="60" cy="63" r="5" fill="#FFB6B6" opacity="0.7" />
      {/* 目 */}
      <circle cx="64" cy="48" r="6" fill="#2B2116" />
      <circle cx="66" cy="46" r="1.6" fill="#ffffff" />

      {/* アクセサリー(装着中のものだけ表示) */}
      {accessory === 'ribbon' && (
        <path d="M44 34 L50 40 L56 34 L54 42 L60 46 L50 44 L40 46 L46 42 Z" fill="#FF6B9D" />
      )}
      {accessory === 'hat' && (
        <g>
          <rect x="34" y="20" width="28" height="8" rx="4" fill="#5B8AF0" />
          <path d="M38 22 L36 8 L58 8 L56 22 Z" fill="#5B8AF0" />
        </g>
      )}
      {accessory === 'glasses' && (
        <g stroke="#2B2116" strokeWidth="2.5" fill="none">
          <circle cx="56" cy="46" r="7" />
          <circle cx="72" cy="46" r="7" fill="#ffffff" fillOpacity="0.001" />
          <line x1="63" y1="46" x2="65" y2="46" />
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
