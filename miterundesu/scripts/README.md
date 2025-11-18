# Migration Scripts

このディレクトリには、Supabaseデータベースのマイグレーションを実行するためのスクリプトが含まれています。

## マイグレーションの適用方法

### 前提条件

1. `.env`ファイルに以下の環境変数が設定されていること:
   - `SUPABASE_URL`: SupabaseプロジェクトのURL
   - `SUPABASE_DB_PASSWORD`: データベースのパスワード

### データベースパスワードの取得方法

1. Supabase Dashboardにアクセス: https://supabase.com/dashboard/project/saohpkchezarbhkuernf/settings/database
2. 「Connection string」セクションを探す
3. 「Connection pooling」の接続文字列からパスワードをコピー
4. `.env`ファイルに追加:
   ```
   SUPABASE_DB_PASSWORD=your_password_here
   ```

### マイグレーションの実行

```bash
# 最新のマイグレーションを適用
node scripts/apply-migration.js

# 特定のマイグレーションファイルを適用
node scripts/apply-migration.js supabase/migrations/20251118000000_add_position_to_press_applications.sql
```

### 実行例

```bash
$ node scripts/apply-migration.js

📄 Applying migration: 20251118000000_add_position_to_press_applications.sql

📝 SQL to execute:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
ALTER TABLE public.press_applications
ADD COLUMN IF NOT EXISTS position TEXT;

COMMENT ON COLUMN public.press_applications.position IS '役職・部署（任意フィールド）';
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔌 Connecting to Supabase database...
✅ Connected!
⚙️  Executing migration...
✅ Migration applied successfully!
```

## トラブルシューティング

### エラー: SUPABASE_DB_PASSWORD が設定されていない

```
❌ Error: SUPABASE_DB_PASSWORD must be set in .env file
```

**解決方法**: 上記の「データベースパスワードの取得方法」を参照してください。

### エラー: 接続できない

```
❌ Error applying migration: connection timeout
```

**解決方法**:
1. データベースパスワードが正しいか確認
2. ネットワーク接続を確認
3. Supabaseプロジェクトが稼働中か確認

### 代替方法: Supabase Studioで手動実行

1. https://supabase.com/dashboard/project/saohpkchezarbhkuernf/editor にアクセス
2. 「SQL Editor」を開く
3. マイグレーションファイルの内容をコピー&ペースト
4. 「Run」ボタンをクリック
