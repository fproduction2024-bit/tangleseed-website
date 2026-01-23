# YouTube Integration Strategy for TangleSeed Official HP

## チャンネル概要
- **Channel**: [Midori Furuhashi CZT](https://www.youtube.com/@midorifuruhashiczt1152)
- **Description**: 
  - 日本語: ふるはし美鳥CZT（ゼンタングル認定講師）による動画チャンネル。楽しく、簡単にリラックスして美しい作品を描くメソッドを紹介。
  - English: Certified Zentangle Teacher (CZT) creating fun, easy, and relaxing drawing tutorials.

## 統合戦略

### 1. ホームページ（Home）
**目的**: ブランドの信頼性向上 + 初見ユーザーへの視覚的説得

- **Hero Video Section**: メインビジュアルの下に「始めてみよう」セクションとして、最新の入門動画を自動再生（ミュート）で埋め込み。
- **Featured Tutorials**: 「人気のチュートリアル」として厳選された3-4本の動画をカード形式で紹介。

### 2. 初心者ガイド（/guide）
**目的**: 7日間チャレンジの補完教材として動画を活用

- **Day別チュートリアル埋め込み**: 
  - Day 1: クレセントムーン解説動画
  - Day 2: ホリバー描き方動画
  - 各ステップに対応する動画があれば、直接埋め込み。
- **プレイリスト連携**: YouTubeの「初心者向けプレイリスト」があれば、全体をページ下部に表示。

### 3. アバウト/創業者ストーリー（/about）
**目的**: 美鳥先生の人柄と背景を伝える

- **プロフィール動画**: もし自己紹介や闘病とゼンタングルとの出会いを語る動画があれば、ページのメインコンテンツとして大きく配置。
- **代替案**: 動画がない場合、「美鳥先生からのメッセージ」セクションとして、最も視聴数の多いチュートリアルを掲載し、人柄を伝える。

### 4. タングル図鑑（/library/[pattern]）
**目的**: 各パターンの習得をサポート

- **ステップアウト動画**: 各タングルパターンの詳細ページに、該当する描き方動画があれば埋め込み。
- **関連動画リスト**: パターンカテゴリ（例: 幾何学系、オーガニック系）に応じた動画を自動推薦。

### 5. 新規ページ: 動画ギャラリー（/videos または /tutorials）
**目的**: YouTubeチャンネルへの誘導とコンテンツアーカイブ

- **カテゴリ別に整理**:
  - 初心者向け
  - パターン別チュートリアル
  - 応用・カラーテクニック
  - インスピレーション（作品紹介）
- **YouTube埋め込みプレイヤー**: 各動画をクリックするとモーダルまたは専用ページで再生。
- **チャンネル登録CTA**: ページ下部に「YouTubeでもっと見る」ボタンを配置し、チャンネル登録を促進。

## 技術的実装

### Next.js での YouTube 埋め込み
```tsx
// components/YouTubeEmbed.tsx
export default function YouTubeEmbed({ videoId }: { videoId: string }) {
  return (
    <div className="relative w-full pb-[56.25%]">
      <iframe
        className="absolute top-0 left-0 w-full h-full rounded-lg"
        src={`https://www.youtube.com/embed/${videoId}`}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
```

### YouTube Data API（オプション）
最新動画の自動取得、再生数の表示、関連動画の推薦機能などを実装する場合、YouTube Data API v3を利用可能。

## KPI（効果測定）
- **YouTube経由のサイト流入**: YouTubeの概要欄にHPリンクを追加し、流入数を計測。
- **動画再生数の増加**: HP埋め込みによる再生数の変化を追跡。
- **LINE登録率の向上**: 動画視聴後のLINE登録率を測定。

---
*この戦略により、動画コンテンツがHPの「信頼性」「教育価値」「エンゲージメント」を大幅に高めることが期待できます。*
