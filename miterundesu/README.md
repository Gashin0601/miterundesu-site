# ミテルンデス 公式Webサイト

ミテルンデスiOSアプリの公式Webサイト

## 技術スタック

### フロントエンド
- HTML5
- CSS3 (Flexbox / Grid)
- TypeScript

### バックエンド
- Node.js (18.x+)
- TypeScript (5.x+)
- Express.js (4.x)

### その他
- dotenv (環境変数管理)

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

### ビルドと実行

```bash
npm run build
npm start
```

## npm scripts

- `npm run build` - TypeScriptをコンパイル
- `npm start` - 本番モードでサーバーを起動
- `npm run dev` - 開発モードでサーバーを起動（ホットリロード）
- `npm run clean` - distディレクトリを削除
- `npm run rebuild` - クリーン後に再ビルド

## プロジェクト構造

```
miterundesu-site/
├── src/                 # TypeScriptソースコード
│   ├── app.ts          # Expressアプリケーション設定
│   ├── server.ts       # サーバー起動ファイル
│   ├── config/         # 設定ファイル
│   ├── routes/         # ルートハンドラー
│   └── types/          # TypeScript型定義
├── public/             # 静的ファイル
│   ├── css/           # CSSファイル
│   ├── js/            # JavaScriptファイル
│   ├── images/        # 画像ファイル
│   └── index.html     # メインHTMLファイル
├── views/              # ビューファイル
├── dist/               # コンパイル済みJavaScript（自動生成）
├── tsconfig.json       # TypeScript設定
├── package.json        # プロジェクト設定
└── .env               # 環境変数（.gitignoreに含む）
```

## ライセンス

ISC

## 関連リンク

- [GitHub Repository](https://github.com/Gashin0601/miterundesu-site)
- [公式X](https://x.com/miterundesu_jp)
- [公式Instagram](https://www.instagram.com/miterundesu_jp/)
