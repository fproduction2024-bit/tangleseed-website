// Pattern Library JavaScript
// Handles pattern display, search, and filtering

let allPatterns = [];
let filteredPatterns = [];

// DOM Elements
const patternsGrid = document.getElementById('patterns-grid');
const searchInput = document.getElementById('search-input');
const difficultyFilter = document.getElementById('difficulty-filter');
const categoryFilter = document.getElementById('category-filter');
const filteredCount = document.getElementById('filtered-count');
const noResults = document.getElementById('no-results');
const loading = document.getElementById('loading');
const resetButton = document.getElementById('reset-filters');

// Load patterns on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadPatterns();

    // Check if we should show detail view (e.g., library.html?pattern=slug)
    const showingDetail = checkForDetailView();

    // Only initialize list view if not showing detail
    if (!showingDetail) {
        populateCategoryFilter();
        setupEventListeners();
        filterPatterns();
    }
});

// Load pattern data from JSON
async function loadPatterns() {
    try {
        const response = await fetch('js/data/patterns.json');
        if (!response.ok) {
            throw new Error('Failed to load patterns');
        }
        allPatterns = await response.json();
        console.log(`Loaded ${allPatterns.length} patterns`);
    } catch (error) {
        console.error('Error loading patterns:', error);
        showError('タングルの読み込みに失敗しました。');
    }
}

// Populate category filter with unique categories
function populateCategoryFilter() {
    const categories = new Set();
    allPatterns.forEach(pattern => {
        pattern.category.forEach(cat => categories.add(cat));
    });

    const sortedCategories = Array.from(categories).sort();
    sortedCategories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = getCategoryName(category);
        categoryFilter.appendChild(option);
    });
}

// Get Japanese category name
function getCategoryName(category) {
    const categoryNames = {
        'official': '公式タングル',
        'foundational': '基本タングル',
        'organic': '有機的',
        'geometric': '幾何学的',
        'flowing': '流れる',
        'fill': '塗りつぶし',
        'texture': 'テクスチャ',
        'weaving': '織り',
        'grid': 'グリッド',
        'floral': '花柄',
        'enhancement': '強化',
        'shading': 'シェーディング',
        'technique': 'テクニック',
        '3d': '3D',
        'illusion': '錯視',
        'featured': '注目',
        'hybrid': 'ハイブリッド',
        'simple': 'シンプル'
    };
    return categoryNames[category] || category;
}

// Setup event listeners
function setupEventListeners() {
    searchInput.addEventListener('input', debounce(filterPatterns, 300));
    difficultyFilter.addEventListener('change', filterPatterns);
    categoryFilter.addEventListener('change', filterPatterns);

    if (resetButton) {
        resetButton.addEventListener('click', resetFilters);
    }
}

// Filter patterns based on current filter settings
function filterPatterns() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    const difficulty = difficultyFilter.value;
    const category = categoryFilter.value;

    filteredPatterns = allPatterns.filter(pattern => {
        // Search filter
        const matchesSearch = !searchTerm ||
            pattern.name.toLowerCase().includes(searchTerm) ||
            pattern.nameJa.includes(searchTerm) ||
            pattern.description.toLowerCase().includes(searchTerm) ||
            pattern.descriptionJa.includes(searchTerm);

        // Difficulty filter
        const matchesDifficulty = difficulty === 'all' || pattern.difficulty === difficulty;

        // Category filter
        const matchesCategory = category === 'all' || pattern.category.includes(category);

        return matchesSearch && matchesDifficulty && matchesCategory;
    });

    displayPatterns();
}

// Display filtered patterns in grid
function displayPatterns() {
    // Hide loading
    if (loading) loading.style.display = 'none';

    // Update count
    if (filteredCount) {
        filteredCount.textContent = filteredPatterns.length;
    }

    // Clear grid
    patternsGrid.innerHTML = '';

    // Show or hide no results message
    if (filteredPatterns.length === 0) {
        if (noResults) noResults.style.display = 'block';
        return;
    } else {
        if (noResults) noResults.style.display = 'none';
    }

    // Create pattern cards
    filteredPatterns.forEach(pattern => {
        const card = createPatternCard(pattern);
        patternsGrid.appendChild(card);
    });
}

// Create a pattern card element
function createPatternCard(pattern) {
    const card = document.createElement('div');
    card.className = 'pattern-card';

    // Pattern image (with placeholder if not available)
    const imageUrl = pattern.imageUrl || '/images/patterns/placeholder.jpg';
    const patternUrl = `?pattern=${pattern.slug}`;

    card.innerHTML = `
        <a href="${patternUrl}" class="pattern-card__link">
            <div class="pattern-card__image">
                <img src="${imageUrl}" alt="${pattern.nameJa}" loading="lazy" 
                     onerror="this.src='/images/hero-zentangle.png'">
                ${pattern.youtubeVideoId ? '<span class="pattern-card__video-badge">▶ 動画あり</span>' : ''}
            </div>
            <div class="pattern-card__content">
                <h3 class="pattern-card__title">${pattern.nameJa}</h3>
                <div class="pattern-card__meta">
                    <span class="difficulty-badge difficulty-badge--${pattern.difficulty}">
                        ${getDifficultyName(pattern.difficulty)}
                    </span>
                    ${pattern.category.includes('official') ? '<span class="official-badge">公式</span>' : ''}
                </div>
                <p class="pattern-card__description">
                    ${truncateText(pattern.descriptionJa, 60)}
                </p>
            </div>
        </a>
    `;

    return card;
}

// Navigate to pattern detail page
function navigateToPattern(slug) {
    window.location.href = `?pattern=${slug}`;
}

// Get Japanese difficulty name
function getDifficultyName(difficulty) {
    const difficultyNames = {
        'beginner': '初級',
        'intermediate': '中級',
        'advanced': '上級'
    };
    return difficultyNames[difficulty] || difficulty;
}

// Truncate text to specified length
function truncateText(text, maxLength) {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// Reset all filters
function resetFilters() {
    searchInput.value = '';
    difficultyFilter.value = 'all';
    categoryFilter.value = 'all';
    filterPatterns();
}

// Debounce function for search input
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Show error message
function showError(message) {
    if (loading) loading.style.display = 'none';
    patternsGrid.innerHTML = `
        <div class="error-message">
            <p>${message}</p>
        </div>
    `;
}

// Check if we're on a detail page (has ?pattern= in URL)
function checkForDetailView() {
    const urlParams = new URLSearchParams(window.location.search);
    const patternSlug = urlParams.get('pattern');

    if (patternSlug && allPatterns.length > 0) {
        // We have a pattern slug, load detail view
        loadPatternDetail(patternSlug);
        return true;
    }
    return false;
}

// Load pattern detail view
function loadPatternDetail(slug) {
    const pattern = allPatterns.find(p => p.slug === slug);

    if (!pattern) {
        showError('タングルが見つかりませんでした。');
        return;
    }

    // Hide list view elements
    document.querySelector('.library-hero')?.style.setProperty('display', 'none');
    document.querySelector('.library-filters')?.style.setProperty('display', 'none');
    document.querySelector('.library-grid-section')?.style.setProperty('display', 'none');

    // Create and show detail view
    const detailSection = document.createElement('section');
    detailSection.className = 'pattern-detail';
    detailSection.innerHTML = createPatternDetailHTML(pattern);

    // Insert detail section after header (since hero is now hidden)
    const header = document.querySelector('.header');
    header.after(detailSection);

    // Update page title
    document.title = `${pattern.nameJa} (${pattern.name}) | タングル図鑑 | タングルシード`;
}

// Convert Markdown-style text to HTML
function convertMarkdownToHTML(text) {
    if (!text) return '';

    // Split by double newlines to preserve paragraphs
    let html = text
        // Convert **text** to <strong>text</strong>
        .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
        // Convert headings at start of lines
        .replace(/^## (.+)$/gm, '<h3 class="section-subtitle">$1</h3>')
        // Convert bullet lists
        .replace(/^- \*\*(.+?)\*\*: (.+)$/gm, '<li><strong>$1</strong>: $2</li>')
        .replace(/^- (.+)$/gm, '<li>$1</li>')
        // Convert numbered lists  
        .replace(/^\d+\. \*\*(.+?)\*\*: (.+)$/gm, '<li><strong>$1</strong>: $2</li>')
        .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
        // Convert line breaks to <br>
        .replace(/\n\n/g, '</p><p>')
        .replace(/\n/g, '<br>');

    // Wrap consecutive <li> with <ul>
    html = html.replace(/(<li>.*?<\/li>)+/g, (match) => `<ul>${match}</ul>`);

    // Wrap in paragraph if not already wrapped
    if (!html.startsWith('<h3') && !html.startsWith('<ul')) {
        html = `<p>${html}</p>`;
    }

    return html;
}

// Create pattern detail HTML
function createPatternDetailHTML(pattern) {
    const isOfficial = pattern.category.includes('official');
    const isFoundational = pattern.category.includes('foundational');

    // Convert description from Markdown to HTML
    const descriptionHTML = convertMarkdownToHTML(pattern.descriptionJa);

    return `
        <div class="container">
            <!-- Pattern Header -->
            <section class="pattern-detail-header">
                <div class="pattern-detail-header__content">
                    <a href="?library" class="back-link">← 図鑑に戻る</a>
                    <span class="badge badge--${pattern.difficulty === 'beginner' ? 'green' : pattern.difficulty === 'intermediate' ? 'yellow' : 'red'}">
                        ${getDifficultyName(pattern.difficulty)}
                    </span>
                    <h1 class="pattern-detail-header__title">${pattern.nameJa}</h1>
                    <p class="pattern-detail-header__subtitle">${pattern.name}</p>
                    <div class="pattern-detail-header__description">${descriptionHTML}</div>
                    <div class="pattern-detail-header__tags">
                        ${pattern.category.map(cat => `<span class="badge badge-outline">${getCategoryName(cat)}</span>`).join('')}
                    </div>
                </div>
            </section>

            <!-- Official Pattern Banner -->
            ${isOfficial ? `
            <section class="official-pattern-banner">
                <div class="official-pattern-banner__content">
                    <div class="official-pattern-banner__badges">
                        <span class="badge badge--gold">
                            ✨ 公式Zentangle®タングル
                        </span>
                        ${isFoundational ? `
                        <span class="badge badge--teal">
                            📚 基本8タングル
                        </span>
                        ` : ''}
                    </div>
                    <p class="official-pattern-banner__text">
                        このパターンは、<strong style="color: var(--color-accent);">Zentangle創始者のRick Roberts（リック・ロバーツ）とMaria Thomas（マリア・トーマス）</strong>によって生み出された公式パターンです。
                    </p>
                    ${isFoundational ? `
                    <p class="official-pattern-banner__text">
                        <strong>最初の8つの基本タングル</strong>の1つとして、初心者が最初に学ぶべきタングルとして推奨されています。
                    </p>
                    ` : ''}
                </div>
            </section>
            ` : ''}

            <!-- YouTube Tutorial -->
            ${pattern.youtubeVideoId ? `
            <section class="youtube-section">
                <div class="container">
                    <h2 class="section-title">動画チュートリアル</h2>
                    <div class="youtube-embed">
                        <iframe 
                            src="https://www.youtube.com/embed/${pattern.youtubeVideoId}" 
                            frameborder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowfullscreen>
                        </iframe>
                    </div>
                </div>
            </section>
            ` : ''}
            
            <!-- Step-by-Step Instructions -->
            ${pattern.steps && pattern.steps.length > 0 ? `
            <section class="steps-section">
                <div class="container">
                    <h2 class="section-title">描き方のステップ</h2>
                    <div class="steps-grid">
                        ${pattern.steps.map(step => `
                        <div class="step-card">
                            <div class="step-card__number">${step.stepNumber}</div>
                            <div class="step-card__content">
                                <h3 class="step-card__title">${step.instructionJa}</h3>
                            </div>
                        </div>
                        `).join('')}
                    </div>
                </div>
            </section>
            ` : ''}
            
            <!-- CTA -->
            <section class="section bg-gradient-to-br from-accent-gold/10 to-accent-teal/10" style="background: linear-gradient(135deg, rgba(201, 168, 108, 0.1) 0%, rgba(90, 125, 124, 0.1) 100%); padding: var(--space-xl) 0;">
                <div class="container" style="max-width: 800px; text-align: center;">
                    <h2 class="section-title">もっと学びたい方へ</h2>
                    <p style="font-size: 1.125rem; color: var(--color-medium-gray); margin-bottom: var(--space-lg);">
                        無料の7日間体験クラスで、さらに多くのタングルを学びましょう。
                    </p>
                    <a href="https://hxzk7sue.autosns.app/addfriend/s/KaGnyj5v0d/@255jknci" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="btn btn--primary btn--large">
                        LINE友だち登録をして講座を受け取る
                    </a>
                </div>
            </section>
        </div>
    `;
}
