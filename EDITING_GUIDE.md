# タングルシードサイト 編集ガイド

**最終更新**: 2026-01-23

このドキュメントでは、タングルシードサイトの文言修正やコンテンツ編集の方法を説明します。

---

## 🎯 編集可能な主要コンテンツ

### 1. ページの文言修正

#### 編集対象ファイル
```
index.html              # トップページ
about.html              # 会社概要
corporate.html          # 法人・提携案内
stories.html            # お客様の声
representative.html     # 代表メッセージ
library.html            # パターン図鑑
```

#### 編集方法
1. HTMLファイルをテキストエディタで開く
2. 修正したい文言を検索
3. 直接編集して保存
4. ブラウザでリロードして確認

**例**: トップページのキャッチコピーを変更
```html
<!-- index.html -->
<section class="hero">
  <h1>心を整える、ゼンタングルの世界へ</h1>
  <p>ここを編集すればキャッチコピーが変わります</p>
</section>
```

---

### 2. パターン図鑑の説明文編集

#### 編集対象ファイル
```
data/patterns.json
```

#### パターンの説明を修正する手順

1. **JSONファイルを開く**
```bash
# VS Code / Cursorで開く
code data/patterns.json
```

2. **修正したいパターンを検索**
   - 検索: `"name": "Crescent Moon"` など

3. **該当フィールドを編集**
```json
{
  "id": "1",
  "name": "Crescent Moon",
  "nameJa": "クレセントムーン",
  "descriptionJa": "ここに日本語の説明を書きます。\n\nMarkdown記法が使えます。\n\n## 見出し\n- リスト形式\n**太字**も可能",
  ...
}
```

4. **保存してブラウザで確認**
   - `http://localhost:3000/library.html?pattern=crescent-moon`

#### 編集可能なフィールド

| フィールド | 説明 | 例 |
|---|---|---|
| `nameJa` | パターンの日本語名 | `"クレセントムーン"` |
| `descriptionJa` | 日本語の説明文 | `"三日月の形を..."` |
| `difficulty` | 難易度 | `"beginner"` / `"intermediate"` / `"advanced"` |
| `category` | カテゴリ | `["organic", "official"]` |

**重要**: JSONの構文エラーに注意！
- カンマの付け忘れ/余分なカンマ
- クォートの閉じ忘れ
- 改行は `\n\n` で表現

---

### 3. スタイル（見た目）の変更

#### 編集対象ファイル
```
css/style.css
```

#### よくある変更例

**色の変更**:
```css
/* プライマリカラーを変更 */
:root {
  --primary-color: #2c5282;  /* ここを変更 */
}
```

**フォントサイズの変更**:
```css
/* 見出しのサイズを変更 */
h1 {
  font-size: 3rem;  /* ここを変更 */
}
```

**ボタンのスタイル変更**:
```css
.btn-primary {
  background-color: #2c5282;
  padding: 1rem 2rem;
  /* ここを調整 */
}
```

---

## 🔄 編集ワークフロー

### 推奨手順

```
1. ファイルを編集
   ↓
2. ブラウザでリロード（Cmd/Ctrl + R）
   ↓
3. 確認
   ↓
4. 問題なければGitにコミット（推奨）
```

### 開発サーバーの起動方法

```bash
cd /Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website
npx -y serve -l 3000
```

アクセス先: `http://localhost:3000`

---

## 📝 Markdown記法（パターン説明で使用可能）

パターンの`descriptionJa`では以下のMarkdown記法が使えます：

### 見出し
```markdown
## 大見出し
### 中見出し
```

### 太字
```markdown
**太字のテキスト**
```

### リスト
```markdown
- 項目1
- 項目2
- 項目3
```

### 番号付きリスト
```markdown
1. 最初のステップ
2. 次のステップ
3. 最後のステップ
```

### 改行
```markdown
段落1

段落2（2つの改行で段落が分かれます）
```

---

## ⚠️ 注意事項

### やってはいけないこと

1. **JSONの構文を壊さない**
   - カンマやクォートに注意
   - 編集後は必ずブラウザで確認

2. **ファイルパスを変更しない**
   - `css/style.css`などの場所を変えるとリンク切れの原因に

3. **画像ファイルを直接削除しない**
   - 不要な画像は`images/unused/`などに移動

### トラブルシューティング

**Q: ページが真っ白になった**
- HTML構文エラーの可能性。ブラウザの開発者ツールでエラー確認

**Q: パターン一覧が表示されない**
- `patterns.json`の構文エラーの可能性。JSON validatorでチェック
- https://jsonlint.com/

**Q: スタイルが反映されない**
- ブラウザキャッシュをクリア（Cmd/Ctrl + Shift + R）
- CSSファイルのパスを確認

---

## 🔧 便利なツール

### VS Code / Cursor の拡張機能

- **Prettier**: コードの自動整形
- **HTML CSS Support**: CSSクラス名の自動補完
- **Live Server**: リアルタイムプレビュー

### オンラインツール

- **JSON Lint**: https://jsonlint.com/ - JSON検証
- **Markdown Preview**: VS Code内蔵 - Markdown表示確認

---

## 📚 さらに詳しく

### HTMLの基本構造
```html
<!DOCTYPE html>
<html lang="ja">
<head>
  <!-- メタ情報、スタイルシート -->
</head>
<body>
  <!-- ページの内容 -->
</body>
</html>
```

### よく使うHTMLタグ
- `<h1>` ~ `<h6>`: 見出し
- `<p>`: 段落
- `<a href="...">`: リンク
- `<img src="..." alt="...">`: 画像
- `<section>`: セクション
- `<div>`: 汎用コンテナ

---

## 🚀 デプロイ前のチェックリスト

文言修正後、本番公開前に確認すべき項目：

- [ ] 全ページをブラウザで確認
- [ ] リンク切れがないか確認
- [ ] 誤字脱字のチェック
- [ ] モバイル表示の確認
- [ ] `patterns.json`の構文エラーチェック

---

**困ったときは**: このガイドを参照するか、開発チームに相談してください。

**作成日**: 2026-01-23  
**対象**: タングルシードサイト v1.1
