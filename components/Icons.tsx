/**
 * アプリのアイコン。絵文字ではなく線で描いたアイコン(SVG)を使うと、
 * 大きくしてもぼやけず、色も自由に変えられる。
 *
 * 新しいアイコンを足すときは、下のどれかをコピーして中の <path> だけ描きかえるのが簡単。
 * className を受け取れるようにしてあるので、使う側で大きさや色を変えられる。
 */

export function CounterIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 12h8" strokeLinecap="round" />
      <path d="M12 8v8" strokeLinecap="round" />
    </svg>
  );
}

export function HandIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M9 11V5.5a1.5 1.5 0 0 1 3 0V11m0 0V4.5a1.5 1.5 0 0 1 3 0V11m0 0V6.5a1.5 1.5 0 0 1 3 0V14a6 6 0 0 1-6 6h-1a6 6 0 0 1-6-6v-2.5a1.5 1.5 0 0 1 3 0V13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function NoteIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <path d="M5 4h11l3 3v13a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Z" strokeLinejoin="round" />
      <path d="M8 10h8M8 14h5" strokeLinecap="round" />
    </svg>
  );
}

export function BirdIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      {/* からだ(まる) */}
      <ellipse cx="10" cy="13" rx="6.2" ry="5.6" />
      {/* はね */}
      <path d="M5 14.5c2.5-3.2 7-3.2 9-0.5" strokeLinecap="round" />
      {/* しっぽ */}
      <path d="M4.3 16.2 2.2 18.3M4.6 13.3 2.3 14.6" strokeLinecap="round" />
      {/* くちばし(ぬりつぶし) */}
      <path d="M15 12.4 20 11 16.2 15.2Z" fill="currentColor" stroke="none" />
      {/* 目(ぬりつぶし) */}
      <circle cx="12.8" cy="10.2" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

/** 新しいアプリを作るときの見本用アイコン(星)。 */
export function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
      className={className}
    >
      <path
        d="m12 4 2.4 5 5.6.8-4 3.9 1 5.5-5-2.7-5 2.7 1-5.5-4-3.9 5.6-.8L12 4Z"
        strokeLinejoin="round"
      />
    </svg>
  );
}
