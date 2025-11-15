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

## ライセンス

ISC

## 関連リンク

- [GitHub Repository](https://github.com/Gashin0601/miterundesu-site)
- [公式X](https://x.com/miterundesu_jp)
- [公式Instagram](https://www.instagram.com/miterundesu_jp/)
