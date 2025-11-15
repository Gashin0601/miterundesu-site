# ミテルンデス 公式Webサイト

ミテルンデスiOSアプリの公式Webサイト

## 技術スタック

### フロントエンド
- HTML5 (セマンティックマークアップ)
- CSS3 (Flexbox / Grid、レスポンシブデザイン)
- TypeScript (ES2020、DOM操作)

### バックエンド
- Node.js (18.x+)
- TypeScript (5.x+)
- Express.js (5.x)

### その他
- dotenv (環境変数管理)
- WCAG 2.1 AA準拠のアクセシビリティ

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env`ファイルを作成:

```bash
cp .env.example .env
```

必要に応じて環境変数を編集してください。

### 3. TypeScriptのビルド

```bash
npm run build
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

開発サーバーが起動し、http://localhost:3000 でアクセスできます。
ファイルの変更を検知して自動的に再起動します。

### フロントエンドの開発（TypeScript）

別のターミナルで以下を実行すると、フロントエンドTypeScriptの変更を監視します:

```bash
npm run dev:frontend
```

### ビルドと実行

```bash
npm run build
npm start
```

## npm scripts

### ビルド
- `npm run build` - バックエンドとフロントエンド両方をビルド
- `npm run build:backend` - バックエンドTypeScriptをコンパイル
- `npm run build:frontend` - フロントエンドTypeScriptをコンパイル

### 開発
- `npm run dev` - バックエンド開発サーバーを起動（ホットリロード）
- `npm run dev:backend` - バックエンドのみ開発モード
- `npm run dev:frontend` - フロントエンドTypeScriptをウォッチモードでコンパイル

### その他
- `npm start` - 本番モードでサーバーを起動
- `npm run clean` - ビルドファイルを削除
- `npm run rebuild` - クリーン後に再ビルド

## プロジェクト構造

```
miterundesu-site/
├── src/                      # バックエンド TypeScriptソースコード
│   ├── app.ts               # Expressアプリケーション設定
│   ├── server.ts            # サーバー起動ファイル
│   ├── config/              # 設定ファイル
│   ├── routes/              # ルートハンドラー
│   └── types/               # TypeScript型定義
├── src-frontend/            # フロントエンド TypeScriptソースコード
│   └── main.ts              # メインJavaScriptロジック
├── public/                  # 静的ファイル（配信）
│   ├── css/
│   │   └── style.css        # メインスタイルシート
│   ├── js/                  # コンパイル済みフロントエンドJS（自動生成）
│   │   ├── main.js
│   │   └── main.js.map
│   ├── images/              # 画像ファイル
│   │   ├── logo/
│   │   ├── icons/
│   │   ├── posters/
│   │   └── usecases/
│   └── index.html           # メインHTMLファイル
├── views/                   # ビューファイル（将来使用）
├── dist/                    # コンパイル済みバックエンドJS（自動生成）
├── tsconfig.json            # バックエンド TypeScript設定
├── tsconfig.frontend.json   # フロントエンド TypeScript設定
├── package.json             # プロジェクト設定
└── .env                     # 環境変数（.gitignoreに含む）
```

## フロントエンド機能

現在実装されている機能:
- ✅ ハンバーガーメニューのトグル（モバイル対応）
- ✅ スムーススクロール（アンカーリンク）
- ✅ お問い合わせフォームバリデーション
- ✅ ヘッダースクロールエフェクト
- ✅ スクロールアニメーション（フェードイン効果）

## Phase 2 完了内容

### Phase 2: 基本HTML/CSS/TypeScript構造 ✅

1. **HTML構造** (public/index.html)
   - 全9セクション実装（ヘッダー、ヒーロー、説明、使い方、店舗施設、プレス、ニュース、お問い合わせ、フッター）
   - セマンティックHTML5マークアップ
   - OGPメタタグ設定
   - アクセシビリティ属性

2. **CSSスタイリング** (public/css/style.css - 879行)
   - カラーパレット定義（ミテルンデスグリーン、シアターオレンジ）
   - レスポンシブデザイン（モバイルファースト）
   - 全セクションのスタイリング
   - アニメーション効果
   - ハンバーガーメニューUI

3. **フロントエンドTypeScript** (src-frontend/main.ts - 261行)
   - ハンバーガーメニュー制御
   - スムーススクロール実装
   - フォーム送信処理
   - スクロールエフェクト
   - Intersection Observer API

4. **ビルドシステム**
   - フロントエンド/バックエンド分離ビルド
   - TypeScriptコンパイル設定
   - npm scripts整備

### Phase 3: ヘッダー ✅

1. **ロゴ配置**
   - ミテルンデスロングロゴ (logo-long.svg) を配置
   - ヘッダーとフッターに適用
   - ホバーエフェクト追加

2. **ヘッダーCSS最適化**
   - スクロール時の影効果とパディング変更
   - backdrop-filter によるぼかし効果
   - ロゴのホバー時スケールアニメーション
   - ナビゲーションリンクの下線アニメーション

3. **ハンバーガーメニュー改善**
   - CSSアニメーション（X字への変形）
   - activeクラスによる制御
   - ホバー時の背景色変更
   - アクティブ時のスケール効果

4. **モバイルメニューアニメーション**
   - スライドインアニメーション (max-height + opacity + transform)
   - メニューアイテムの順次フェードイン
   - cubic-bezier によるスムーズな遷移
   - 上部ボーダーのグリーン強調

5. **TypeScript機能強化**
   - activeクラスによるハンバーガーメニュー制御
   - スクロール時のheader.scrolledクラス追加
   - passive: trueによるパフォーマンス最適化

### Phase 4: ヒーローセクション ✅

1. **SVGイラスト作成**
   - 手持ちスマートフォンイラスト（Dynamic Island付き）
   - 白線ミニマルデザイン、ドロップシャドウ効果
   - 周囲の建物アイコン4種類（コンビニ、スーパー、美術館、映画館）

2. **レイアウト構築**
   - 中央に手持ちスマートフォンを配置
   - 周囲に建物を円形配置（top-left, top-right, bottom-left, bottom-right）
   - position: absolute による絶対配置システム

3. **アニメーション実装**
   - 手持ちスマートフォンのフローティングアニメーション（3秒周期）
   - 各建物の個別フローティングアニメーション（4秒周期、時間差開始）
   - hover時のスケール＆透明度変更
   - アプリアイコン＆App Storeボタンのhoverエフェクト

4. **アセット配置**
   - アプリアイコン (1024x1024) をiOSプロジェクトからコピー
   - App Store公式バッジSVG作成（Apple公式ガイドライン準拠）
   - ダウンロードリンクを実際のApp StoreURL (`https://apps.apple.com/jp/app/miterundesu/`) に設定

5. **レスポンシブデザイン**
   - タブレット (768px以下): 手持ちスマホ 220px, 建物 60px
   - モバイル (480px以下): 手持ちスマホ 180px, 建物 50px
   - アプリアイコンとApp Storeボタンのサイズ調整
   - min-height調整でモバイル表示最適化

6. **背景とスタイリング**
   - メイングリーン (#438247) グラデーション背景
   - overflow: hidden で要素はみ出し防止
   - ドロップシャドウとボックスシャドウで立体感演出

## ライセンス

ISC

## 関連リンク

- [GitHub Repository](https://github.com/Gashin0601/miterundesu-site)
- [公式X](https://x.com/miterundesu_jp)
- [公式Instagram](https://www.instagram.com/miterundesu_jp/)
