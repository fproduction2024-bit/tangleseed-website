# TangleSeed Official HP: Detailed Page Design

This document provides a blueprint for the implementation of the primary pages, detailing UI components, data requirements, and content.

---

## 1. [Home Page] Detailed Design

### 1.1 Section: Hero (Visual Engagement)
- **UI Components**: 
  - Full-width background image (Clean Zen aesthetic).
  - Glassmorphic overlay for copy blocks.
  - Sticky navigation bar with "B2B / Partner" link styled differently (e.g., outlined button).
- **Core Strategy**: 
  - Immediately present Midori-sensei's authority (Kyoto City Univ. of Arts + CZT).
  - One clear CTA for direct conversion to LINE.
- **Micro-interactions**: 
  - Headline text fades in with a "pencil stroke" effect.

### 1.2 Section: The Social Proof (B2B/B2C Trust)
- **Data Points**:
  - `40,000+` Total Users (Animated counter).
  - `8 Years` NPO Activity (Badge/Icon).
  - `Alliance Logos` (Sakura Pigma, Maruman, etc.).
- **Content**: Brief summary of the "Zentangle as a Social Good" mission.

### 1.3 Section: Alliance Hub (B2B Lead gen)
- **Layout**: 3-Columns Grid.
- **Cards**:
  1. **Bookstore/Cafe**: Focus on "Store Traffic & Postcard Kits".
  2. **Medical/Welfare**: Focus on "Patient Care & Recovery Support".
  3. **Corporate**: Focus on "Employee Wellness & Creativity".
- **CTA**: Link to dedicated "Alliance Strategy" landing page with a contact form.

---

## 2. [Tangle Library] Detailed Design

### 2.1 Category & Search Interface
- **Filter Chips**: 
  - `Official` (Rick & Maria)
  - `CZT-Led` (Community)
  - `Tangle of the Year` (2025: Huggins)
  - `Geometric` / `Organic`
- **Real-time Search**: Search by name (Japanese/English) with instant results.

### 2.2 Pattern Detail Page Template
- **Header**: Pattern Name, Creator Name, Tag list.
- **Step-out Viewer**: 
  - Interactive gallery of 4-6 steps.
  - Option to toggle "Reference Grid" visibility.
- **Creator's Note**: Short text on the inspiration behind the pattern.
- **Curriculum Link**: If part of the Salon Subscription, show a "Learn this in Month X" badge.
- **Related Patterns**: Dynamic recommendation based on aesthetic similarity (e.g., other "Circular" tangles).

---

## 3. SEO & Technical Specs

### 3.1 Metadata Strategy
- **Home**: `タングルシード公式HP | TangleSeed Official`
- **Library Root**: `ゼンタングル・タングル図鑑 | 2000種類以上の描き方を網羅`
- **Library Tags**: `[Pattern Name] 描き方・手順 | ゼンタングル図鑑`

### 3.2 Performance Goals
- **Lighthouse Score**: Target 95+ for all metrics (FCP < 1.0s).
- **Architecture**: Next.js App Router with Static Site Generation (SSG) for pattern pages to ensure instant loading.

---

## 4. [NEW] B2B Alliance Detail Page (Lead Magnet)

### Purpose
To convert corporate decision-makers who want more information before contacting.

### Key Content Blocks
- **"Postcard QR Strategy" Explained**: Visual diagram showing how a physical card in a bookstore leads to digital engagement.
- **Business case study**: PDF link or high-level summary of a successful workshop.
- **Partner FAQ**: "How much work is required on our end?" (Ans: Almost zero, TangleSeed handles logistics).
