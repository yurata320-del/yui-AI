'use client';

/**
 * なまはげ(赤おに)を描く部品。
 *
 * もとは黄色い「ひよこ」だったキャラクターを、なまはげに変更した。
 * 画像ファイルを使うかわりに、SVG(線と図形で絵をかく仕組み)で描いている。
 *
 * accessory を渡すと、頭の上あたりに簡単なアクセサリーを重ねて表示できる
 * (ショップで装着したものを、ゲーム中のなまはげにも反映するため)。
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
      aria-label="なまはげ"
    >
      {/* かみの毛(わらのみの風、顔のうしろ側にちらっと見える) */}
      <path
        d="M20 46 C18 30 30 18 50 18 C70 18 82 30 80 46 L74 38 L68 48 L62 36 L56 48 L50 34 L44 48 L38 36 L32 48 L26 38 Z"
        fill="#F4E7C1"
      />

      {/* かお(赤おにの顔) */}
      <circle cx="50" cy="56" r="30" fill="#D64545" />

      {/* つの(2本) */}
      <path d="M32 30 L27 8 L41 26 Z" fill="#EDE0C8" />
      <path d="M68 30 L73 8 L59 26 Z" fill="#EDE0C8" />

      {/* まゆげ(ギザギザで、おこった顔に) */}
      <path d="M30 42 L38 46 L44 40 L48 44" stroke="#2B2116" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      <path d="M70 42 L62 46 L56 40 L52 44" stroke="#2B2116" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

      {/* 目 */}
      <circle cx="40" cy="53" r="6" fill="#ffffff" />
      <circle cx="60" cy="53" r="6" fill="#ffffff" />
      <circle cx="41" cy="54" r="3" fill="#2B2116" />
      <circle cx="61" cy="54" r="3" fill="#2B2116" />

      {/* 大きく開けた口ときば */}
      <path d="M36 68 Q50 82 64 68 Q50 76 36 68 Z" fill="#7A1F1F" />
      <path d="M42 68 L45 74 L48 68 Z" fill="#ffffff" />
      <path d="M58 68 L55 74 L52 68 Z" fill="#ffffff" />

      {/* うで(タップすると上に動く) */}
      <ellipse
        cx="30"
        cy="62"
        rx="10"
        ry="7"
        fill="#B93A3A"
        transform={flap ? 'rotate(-40 30 62)' : 'rotate(-5 30 62)'}
        style={{ transition: 'transform 120ms ease-out' }}
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
