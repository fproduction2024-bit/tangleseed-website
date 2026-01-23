# タングルシード 公式サイト

**最終更新**: 2026-01-23  
**バージョン**: v1.1 (統合版)

---

## 🌐 開発サーバー情報

### 起動方法

```bash
npm run dev
# または
npx -y serve -l 3000
```

- **URL**: http://localhost:3000 （ポートは状況により変動）
- **ディレクトリ**: `/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website`
- **状態**: 本番公開準備完了

---

## 📁 プロジェクト構成

### 主要ファイル

```
tangleseed-website/
├── index.html              # ホームページ
├── about.html              # 会社概要
├── corporate.html          # 法人・提携案内
├── stories.html            # お客様の声
├── representative.html     # 代表メッセージ
├── library.html           # ★ パターン図鑑一覧ページ
├── css/
│   └── style.css          # スタイリング
├── js/
│   ├── library.js         # パターン図鑑ロジック
│   └── data/
│       └── patterns.json  # ★ パターンデータ (160パターン)
└── images/
    └── patterns/          # パターン画像
```

---

## 📖 パターン図鑑アクセス方法

### 一覧ページ
http://localhost:54681/library.html

### 詳細ページ (URLパラメータ方式)
http://localhost:54681/library.html?pattern={slug}

**例**:
- Jonqal: http://localhost:54681/library.html?pattern=jonqal
- Purk: http://localhost:54681/library.html?pattern=purk
- Flux: http://localhost:54681/library.html?pattern=flux
- Tipple: http://localhost:54681/library.html?pattern=tipple
- Mooka: http://localhost:54681/library.html?pattern=mooka
- Paradox: http://localhost:54681/library.html?pattern=paradox

---

## ✨ 最新アップデート (2026-01-23)

### Phase 1: 基本8タングルの日本語説明充実化 ✅

**完了内容**:
- ID 4-10 の日本語説明を**600-1700文字の詳細説明**に拡充
- 歴史、特徴、描き方のコツ、プロジェクトパックでの使用例を追加

| ID | パターン名 | 文字数 | 内容 |
|---|---|---:|---|
| 4 | Jonqal | 1207字 | Maria Thomasのデコンストラクト、3D錯視 |
| 5 | Purk | 1571字 | 2011年CHAショー、8つのプロジェクトパック |
| 6 | Flux | 1374字 | **ゼンタングル誕生の魔法の瞬間** |
| 7 | Tipple | 1706字 | Maria's 22 Techniques、最多使用 |
| 9 | Mooka | 1158字 | Alphonse Muchaインスピレーション |
| 10 | Paradox | 1206字 | 直線のみで3D錯視、上級パターン |

**データソース**: `data/patterns.json` (160パターン)

---

## 📝 編集ガイド

文言やコンテンツを修正する方法は、[EDITING_GUIDE.md](EDITING_GUIDE.md) をご覧ください。

開発スクリプトの詳細は、[scripts/README.md](scripts/README.md) をご覧ください。

---

## 📊 データ統計

- **総パターン数**: 160パターン
- **充実化済み**: 基本8タングル他
- **データサイズ**: patterns.json ~211KB

---

**作成者**: Antigravity AI  
**プロジェクト**: タングルシード公式サイト  
**バージョン**: v1.1 (統合版)
