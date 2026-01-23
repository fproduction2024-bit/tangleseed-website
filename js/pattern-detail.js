// Pattern Detail Page JavaScript
// Handles pattern detail view when accessed via URL parameter (?pattern=slug)

// Get pattern slug from URL
function getPatternSlugFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('pattern');
}

// Find pattern by slug
function findPatternBySlug(slug) {
    return allPatterns.find(p => p.slug === slug);
}

// Render pattern detail page
function renderPatternDetail(pattern) {
    const main = document.querySelector('body');

    const difficulty = difficultyConfig[pattern.difficulty];
    const hasVideo = pattern.youtubeVideoId;

    // Find related patterns (same category, different pattern)
    const relatedPatterns = allPatterns
        .filter(p => p.id !== pattern.id && p.category.some(c => pattern.category.includes(c)))
        .slice(0, 3);

    // Build detail page HTML
    const detailHTML = `
        <!-- Pattern Header -->
        <section class="pattern-detail-header">
            <div class="container">
                <div class="pattern-detail-header__content">
                    <a href="library.html" class="back-link">← タングル図鑑に戻る</a>
                    <span class="badge badge--${difficulty.color}">${difficulty.label}</span>
                    <h1 class="pattern-detail-header__title">${pattern.nameJa}</h1>
                    <p class="pattern-detail-header__subtitle">${pattern.name}</p>
                    <p class="pattern-detail-header__description">${pattern.descriptionJa}</p>
                    <div class="pattern-detail-header__tags">
                        ${pattern.category.map(cat =>
        `<span class="pattern-tag">${categoryNames[cat] || cat}</span>`
    ).join('')}
                    </div>
                </div>
            </div>
        </section>

        ${pattern.category.includes('official') ? `
        <!-- Official Pattern Info -->
        <section class="official-pattern-banner">
            <div class="container">
                <div class="official-pattern-banner__content">
                    <div class="official-pattern-banner__badges">
                        <span class="badge badge--gold">✨ 公式Zentangle®タングル</span>
                        ${pattern.category.includes('foundational') ?
                '<span class="badge badge--teal">📚 基本8タングル</span>' : ''}
                    </div>
                    <p class="official-pattern-banner__text">
                        このタングルは、<strong>Zentangle創始者のRick Roberts（リック・ロバーツ）とMaria Thomas（マリア・トーマス）</strong>によって生み出された公式タングルです。
                    </p>
                    ${pattern.category.includes('foundational') ? `
                    <p class="official-pattern-banner__text">
                        <strong>最初の8つの基本タングル</strong>の1つとして、初心者が最初に学ぶべきタングルとして推奨されています。
                    </p>
                    ` : ''}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Pattern Image -->
        <section class="pattern-image-section">
            <div class="container">
                <div class="pattern-image-placeholder">
                    <div class="pattern-image-placeholder__content">
                        <div class="pattern-image-placeholder__emoji">🎨</div>
                        <p class="pattern-image-placeholder__title">${pattern.nameJa}のタングル</p>
                        <p class="pattern-image-placeholder__note">画像はimages/patterns/${pattern.slug}.jpgに配置してください</p>
                    </div>
                </div>
            </div>
        </section>

        ${hasVideo ? `
        <!-- YouTube Tutorial -->
        <section class="youtube-section">
            <div class="container">
                <h2 class="section-title">動画チュートリアル</h2>
                <div class="youtube-embed">
                    <iframe
                        src="https://www.youtube.com/embed/${pattern.youtubeVideoId}"
                        title="${pattern.nameJa}の描き方"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        </section>
        ` : ''}

        <!-- Step-by-Step Instructions -->
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

        ${relatedPatterns.length > 0 ? `
        <!-- Related Patterns -->
        <section class="related-patterns-section">
            <div class="container">
                <h2 class="section-title">関連タングル</h2>
                <div class="library-grid">
                    ${relatedPatterns.map(p => createPatternCard(p)).join('')}
                </div>
            </div>
        </section>
        ` : ''}

        <!-- CTA Section -->
        <section class="cta">
            <div class="container">
                <div class="cta__content">
                    <h2 class="cta__title">もっと学びたい方へ</h2>
                    <p class="cta__description">
                        無料の7日間体験クラスで、さらに多くのタングルを学びましょう。
                    </p>
                    <a href="https://hxzk7sue.autosns.app/addfriend/s/KaGnyj5v0d/@255jknci" 
                       target="_blank" 
                       rel="noopener noreferrer" 
                       class="btn btn--primary btn--large">LINE友だち登録をして講座を受け取る</a>
                </div>
            </div>
        </section>
    `;

    // Replace page content
    // Find the main content area (everything between header and footer)
    const header = document.querySelector('.header');
    const footer = document.querySelector('.footer');

    // Remove all sections between header and footer
    let currentElement = header.nextElementSibling;
    while (currentElement && currentElement !== footer) {
        const next = currentElement.nextElementSibling;
        currentElement.remove();
        currentElement = next;
    }

    // Insert detail content
    footer.insertAdjacentHTML('beforebegin', detailHTML);

    // Update page title
    document.title = `${pattern.nameJa} | タングル図鑑 | タングルシード`;
}

// Check if we're viewing a specific pattern
async function checkForPatternDetail() {
    const patternSlug = getPatternSlugFromURL();

    if (patternSlug) {
        // We're viewing a pattern detail
        const pattern = findPatternBySlug(patternSlug);

        if (pattern) {
            renderPatternDetail(pattern);
        } else {
            // Pattern not found, redirect to library
            window.location.href = 'library.html';
        }
    }
}

// Override the init function to check for detail view
const originalInit = initLibrary;
initLibrary = async function () {
    try {
        // Load pattern data
        const response = await fetch('data/patterns.json');
        allPatterns = await response.json();

        // Check if we're viewing a detail page
        const patternSlug = getPatternSlugFromURL();

        if (patternSlug) {
            // Detail view
            const pattern = findPatternBySlug(patternSlug);
            if (pattern) {
                document.getElementById('loading').style.display = 'none';
                renderPatternDetail(pattern);
            } else {
                window.location.href = 'library.html';
            }
        } else {
            // List view - run original init
            filteredPatterns = [...allPatterns];
            document.getElementById('pattern-count').textContent = allPatterns.length;
            populateCategoryFilter();
            renderPatterns();
            document.getElementById('loading').style.display = 'none';
            setupEventListeners();
        }

    } catch (error) {
        console.error('Error loading patterns:', error);
        document.getElementById('loading').innerHTML =
            '<p style="color: var(--color-error);">タングルデータの読み込みに失敗しました。</p>';
    }
};
