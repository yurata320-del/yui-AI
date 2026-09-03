import type { Config } from 'tailwindcss';

/**
 * 色や文字の大きさの「決めごと」をまとめたファイル。
 * ここに名前をつけて登録しておくと、画面のどこからでも同じ色が使える。
 * (例: bg-ink-50 と書くと、下の ink の 50 番の色が背景になる)
 *
 * 目に見えやすさ(コントラスト)を確保した色を選んであるので、
 * 基本はこの中の色を使うときれいにまとまる。
 */
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ink = 文字や背景に使う、白〜黒のグレー。数字が大きいほど濃い。
        ink: {
          50: '#f7f8fa',
          100: '#eceef2',
          200: '#d3d7e0',
          300: '#a9b0c0',
          400: '#77809a',
          500: '#535c76',
          600: '#3c4459',
          700: '#2b3143',
          800: '#1c202c',
          900: '#12141c',
        },
        // brand = このアプリの目立たせたい色(ボタンなど)
        brand: {
          50: '#eef4ff',
          100: '#d9e6ff',
          200: '#b3ccff',
          300: '#80a8ff',
          400: '#4d7fff',
          500: '#265ae0',
          600: '#1c46b3',
          700: '#163686',
          800: '#10275c',
          900: '#0a1a3d',
        },
        // piyo = 「ぴよちゃんゲーム」専用の色。
        // Stitch(デザインツール)で作った画面のコードから、そのままの数字をうつしてある。
        // 他のアプリ(counter/janken/memo)は ink/brand を使うので、こっちには影響しない。
        piyo: {
          primary: '#00658d',
          'primary-container': '#29b6f6',
          'primary-fixed': '#c6e7ff',
          'primary-fixed-dim': '#81cfff',
          'on-primary': '#ffffff',
          'on-primary-fixed': '#001e2d',
          'on-primary-fixed-variant': '#004c6b',
          'on-primary-container': '#004460',
          secondary: '#735c00',
          'secondary-container': '#fdd34d',
          'secondary-fixed': '#ffe087',
          'secondary-fixed-dim': '#ebc23e',
          'on-secondary': '#ffffff',
          'on-secondary-fixed': '#241a00',
          'on-secondary-fixed-variant': '#574500',
          'on-secondary-container': '#725b00',
          tertiary: '#126d27',
          'tertiary-container': '#68bd6c',
          'tertiary-fixed': '#9ff79f',
          'tertiary-fixed-dim': '#83da85',
          'on-tertiary': '#ffffff',
          'on-tertiary-fixed': '#002105',
          'on-tertiary-fixed-variant': '#005318',
          'on-tertiary-container': '#004a14',
          background: '#f3faff',
          'on-background': '#021f29',
          surface: '#f3faff',
          'surface-dim': '#c3deec',
          'surface-bright': '#f3faff',
          'surface-container-lowest': '#ffffff',
          'surface-container-low': '#e6f6ff',
          'surface-container': '#d8f2ff',
          'surface-container-high': '#d1ecfa',
          'surface-container-highest': '#cbe7f5',
          'surface-variant': '#cbe7f5',
          'on-surface': '#021f29',
          'on-surface-variant': '#3e4850',
          outline: '#6e7881',
          'outline-variant': '#bdc8d1',
          'inverse-surface': '#19343e',
          'inverse-on-surface': '#dff4ff',
          'inverse-primary': '#81cfff',
          error: '#ba1a1a',
          'error-container': '#ffdad6',
          'on-error': '#ffffff',
          'on-error-container': '#93000a',
        },
      },
      fontSize: {
        base: ['16px', '1.6'],
        lg: ['18px', '1.6'],
        xl: ['20px', '1.5'],
        // piyo-◯◯ = 「ぴよちゃんゲーム」専用の文字サイズ(Stitchのコードのまま)
        'piyo-display-hero-mobile': ['38px', { lineHeight: '46px', fontWeight: '900' }],
        'piyo-headline-lg-mobile': ['26px', { lineHeight: '32px', fontWeight: '800' }],
        'piyo-headline-md': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'piyo-body-lg': ['18px', { lineHeight: '26px', fontWeight: '700' }],
        'piyo-body-md': ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'piyo-label-lg': ['18px', { lineHeight: '24px', fontWeight: '800' }],
        'piyo-label-md': ['14px', { lineHeight: '18px', fontWeight: '700' }],
        'piyo-label-sm': ['12px', { lineHeight: '16px', fontWeight: '700' }],
        'piyo-score-huge-mobile': ['48px', { lineHeight: '52px', fontWeight: '900' }],
      },
      fontFamily: {
        // piyo-headline/label/display = 見出しやボタンの書体(Rubik)
        'piyo-headline': ['Rubik', 'sans-serif'],
        'piyo-label': ['Rubik', 'sans-serif'],
        'piyo-display': ['Rubik', 'sans-serif'],
        'piyo-score': ['Rubik', 'sans-serif'],
        // piyo-body = ふつうの文章の書体(Quicksand)
        'piyo-body': ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        // piyo-◯◯ = 「ぴよちゃんゲーム」専用の角丸み。既存の rounded-lg 等は変えない。
        piyo: '1rem',
        'piyo-lg': '2rem',
        'piyo-xl': '3rem',
      },
      spacing: {
        // スマホで指が届きやすい最小の大きさ(44px)。ボタンはこれ以上にする。
        tap: '44px',
        // piyo-◯◯ = 「ぴよちゃんゲーム」専用のあまり幅(Stitchのコードのまま)
        'piyo-xxs': '0.25rem',
        'piyo-xs': '0.5rem',
        'piyo-sm': '0.75rem',
        'piyo-md': '1rem',
        'piyo-lg': '1.5rem',
        'piyo-xl': '2rem',
        'piyo-2xl': '3rem',
        'piyo-touch-min': '3.5rem',
        'piyo-hud-safe-side': '1rem',
        'piyo-hud-safe-top': '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
