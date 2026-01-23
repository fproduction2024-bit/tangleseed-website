# 開発スクリプト集

このフォルダには、タングルシードサイトの開発・データ管理に使用するスクリプトが格納されています。

---

## 📝 スクリプト一覧

### 1. `extract-patterns.js`

**用途**: Next.jsプロジェクトからパターンデータを抽出

**使用方法**:
```bash
cd /Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website
node scripts/extract-patterns.js
```

**機能**:
- Next.jsプロジェクトの`patterns.ts`からデータを読み込み
- JSON形式に変換して`data/patterns.json`に出力
- 160パターン全てを処理

**注意**: Next.jsプロジェクトがアーカイブされた場合、このスクリプトは使用不可

---

### 2. `update-descriptions.js`

**用途**: Next.jsプロジェクトから充実化された説明文を同期

**使用方法**:
```bash
node scripts/update-descriptions.js
```

**機能**:
- Next.jsプロジェクトの最新`descriptionJa`を取得
- 静的サイトの`patterns.json`を更新
- 特定パターンのみの更新も可能

**注意**: Next.jsプロジェクトがアーカイブされた場合、このスクリプトは使用不可

---

### 3. `convert-patterns.js`

**用途**: パターンデータの変換・フォーマット調整

**使用方法**:
```bash
node scripts/convert-patterns.js
```

**機能**:
- データフォーマットの変換
- 特定フィールドの一括更新
- データ検証

---

### 4. `remove_quotes.py`

**用途**: 日本語説明文から不要な引用符（「」）を削除

**使用方法**:
```bash
python3 scripts/remove_quotes.py
```

**機能**:
- `patterns.json`内の全パターンの`descriptionJa`から「」を削除
- 自然な日本語に変換
- バックアップを自動作成

---

## 🔧 今後のスクリプト開発

### 必要になる可能性のあるスクリプト

1. **validate-patterns.js** - パターンデータの検証
   - 必須フィールドのチェック
   - データ整合性の確認
   - 重複チェック

2. **generate-sitemap.js** - サイトマップ自動生成
   - 全ページのURLリスト作成
   - SEO対策

3. **optimize-images.js** - 画像最適化の自動化
   - WebP変換
   - サイズ最適化

---

## 📂 関連ファイル

- **データソース**: `data/patterns.json`
- **デバッグ出力**: `dev/debug-patterns.txt`
- **メインサイト**: ルートディレクトリの`.html`ファイル

---

**作成日**: 2026-01-23  
**管理者**: Tangleseed Development Team
