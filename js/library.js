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
        const rawPatterns = await response.json();
        // Only include patterns with videos
        allPatterns = rawPatterns.filter(pattern => !!pattern.youtubeVideoId);
        console.log(`Loaded ${allPatterns.length} video-enabled patterns (out of ${rawPatterns.length} total)`);
    } catch (error) {
        console.error('Error loading patterns:', error);
        showError('タングルの読み込みに失敗しました。');
    }
}

// Simplified Category Definitions
const CORE_CATEGORIES = {
    'organic': {
        label: '有機的',
        tags: ['organic', 'floral', 'botanical', 'nature', 'flowing', 'delicate', 'leaf', 'teardrop', 'vines', 'spring', 'gourd', 'circular', 'dynamic', 'movement', 'ripple', 'rolling', 'marine', 'organic']
    },
    'geometric': {
        label: '幾何学的',
        tags: ['geometric', '3d', 'illusion', 'angular', 'cubic', 'linear', 'starburst', 'architectural', 'crystalline', 'radiating', 'spiral']
    },
    'grid': {
        label: 'グリッド系',
        tags: ['grid', 'weaving', 'knots', 'w2-family', 'connected']
    },
    'texture': {
        label: 'テクスチャ・塗りつぶし',
        tags: ['texture', 'textured', 'fill', 'shading', 'hatching', 'dots', 'scattered']
    },
    'technique': {
        label: 'テクニック・装飾',
        tags: ['technique', 'enhancement', 'enhanced', 'decorative', 'featured', 'popular', 'artistic', 'bold', 'playful', 'energetic', 'complex', 'simple', 'paired', 'variation']
    }
};

// Populate category filter with core categories
function populateCategoryFilter() {
    // Clear existing options except "All"
    categoryFilter.innerHTML = '<option value="all">すべてのカテゴリ</option>';

    Object.entries(CORE_CATEGORIES).forEach(([id, info]) => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = info.label;
        categoryFilter.appendChild(option);
    });
}

// Get Japanese category name (using simplified core categories)
function getCategoryName(idOrTag) {
    // If it's a core category ID, return its label
    if (CORE_CATEGORIES[idOrTag]) {
        return CORE_CATEGORIES[idOrTag].label;
    }

    // If it's a technical tag, find which core category it belongs to
    for (const [id, info] of Object.entries(CORE_CATEGORIES)) {
        if (info.tags.includes(idOrTag) || id === idOrTag) {
            return info.label;
        }
    }

    // Special labels for foundational/official tags if they need to be displayed
    const specialLabels = {
        'official': '公式',
        'foundational': '基本'
    };

    return specialLabels[idOrTag] || idOrTag;
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
        let matchesCategory = false;
        if (category === 'all') {
            matchesCategory = true;
        } else {
            // Check if any of the pattern's categories match the selected core category's tags
            const coreInfo = CORE_CATEGORIES[category];
            if (coreInfo) {
                matchesCategory = pattern.category.some(cat =>
                    coreInfo.tags.includes(cat) || cat === category
                );
            }
        }

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

    // Pattern image (prioritize specialized image, then YouTube thumbnail, then placeholder)
    let imageUrl = pattern.imageUrl;

    // If it's a default local path and we have a YouTube video, use the YouTube thumbnail instead
    // (Since we don't have local files for most patterns yet)
    const isLocalPath = imageUrl && imageUrl.startsWith('/images/patterns/');
    const isPlaceholder = imageUrl === '/images/patterns/placeholder.jpg';

    if (pattern.youtubeVideoId && (!imageUrl || isLocalPath || isPlaceholder)) {
        // Use medium quality YouTube thumbnail for cards
        imageUrl = `https://img.youtube.com/vi/${pattern.youtubeVideoId}/mqdefault.jpg`;
    }

    if (!imageUrl) {
        imageUrl = '/images/patterns/placeholder.jpg';
    }

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
    if (!text) return '';
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
    const pattern = allPatterns.find(p => p.slug === slug || String(p.id) === slug);

    if (!pattern) {
        showError('タングルが見つかりませんでした。');
        return;
    }

    // Hide list view elements and global CTA
    document.querySelector('.library-hero')?.style.setProperty('display', 'none');
    document.querySelector('.library-filters')?.style.setProperty('display', 'none');
    document.querySelector('.library-grid-section')?.style.setProperty('display', 'none');
    document.querySelector('.cta')?.style.setProperty('display', 'none');

    // Create and show detail view
    const detailSection = document.createElement('section');
    detailSection.className = 'pattern-detail';
    detailSection.innerHTML = createPatternDetailHTML(pattern);

    // Insert detail section after header
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
                    <a href="library.html" class="back-link">← 図鑑に戻る</a>
                    <span class="badge badge--${pattern.difficulty === 'beginner' ? 'green' : pattern.difficulty === 'intermediate' ? 'yellow' : 'red'}">
                        ${getDifficultyName(pattern.difficulty)}
                    </span>
                    <h1 class="pattern-detail-header__title">${pattern.nameJa}</h1>
                    <p class="pattern-detail-header__subtitle">${pattern.name}</p>
                    <div class="pattern-detail-header__tags">
                        ${[...new Set(pattern.category
        .map(cat => getCategoryName(cat))
        .filter(name => name !== '公式' && name !== '基本')
    )].map(name => `<span class="badge badge-outline">${name}</span>`).join('')}
                    </div>
                </div>
            </section>

            <div class="sidebar-layout">
                <div class="sidebar-content">
                    <!-- YouTube Tutorial -->
                    ${pattern.youtubeVideoId ? `
                    <section class="youtube-section" style="margin-top: 0;">
                        <div class="youtube-embed">
                            <iframe 
                                src="https://www.youtube.com/embed/${pattern.youtubeVideoId}" 
                                frameborder="0" 
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                allowfullscreen>
                            </iframe>
                        </div>
                    </section>
                    ` : ''}
                    
                    <!-- Pattern Description & Official Info -->
                    <section class="pattern-description-section" style="margin-bottom: var(--space-xl);">
                        <h2 class="section-title">タングルの解説</h2>
                        
                        ${isOfficial ? `
                        <div class="official-pattern-banner" style="margin-bottom: var(--space-lg); padding: var(--space-md); border-left: 4px solid var(--color-accent); background: rgba(201, 168, 108, 0.05);">
                            <div class="official-pattern-banner__badges" style="margin-bottom: 0.5rem;">
                                <span class="badge badge--gold">✨ 公式Zentangle®タングル</span>
                                ${isFoundational ? '<span class="badge badge--teal">📚 基本8タングル</span>' : ''}
                            </div>
                            <p class="official-pattern-banner__text" style="font-size: 0.95rem; opacity: 0.9;">
                                このパターンは、<strong>Zentangle創設者のRick RobertsとMaria Thomas</strong>によって生み出された公式パターンです。
                            </p>
                        </div>
                        ` : ''}

                        <div class="pattern-detail-header__description" style="line-height: 1.8;">
                            ${descriptionHTML}
                        </div>
                    </section>
                </div>

                <!-- Sidebar Sidebar -->
                <aside class="sidebar-sticky">
                    <div class="widget-gift">
                        <span class="widget-gift__badge">期間限定プレゼント</span>
                        <h3 class="widget-gift__title">15分の静寂で、<br>心を整える。</h3>
                        <div class="widget-gift__image">
                            <img src="images/gift-starter-guide.png" alt="無料ガイドプレビュー">
                        </div>
                        <p class="widget-gift__text">
                            ゼンタングルの基本が学べる初心者ガイド&動画をLINE登録で無料プレゼント中。
                        </p>
                        <a href="gift.html" class="btn btn--primary widget-gift__cta">無料で受け取る</a>
                    </div>
                </aside>
            </div>
        </div>
    `;
}
