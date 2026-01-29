const fs = require('fs');
const path = require('path');

const OFFICIAL_VIDEOS_PATH = path.join(__dirname, '../official_videos.json');
const PATTERNS_PATH = path.join(__dirname, '../data/patterns.json');

const officialVideos = JSON.parse(fs.readFileSync(OFFICIAL_VIDEOS_PATH, 'utf8'));
const patterns = JSON.parse(fs.readFileSync(PATTERNS_PATH, 'utf8'));

const videoMap = {};
officialVideos.forEach(v => {
    videoMap[v.id] = v.title;
});

console.log('Detecting name discrepancies between pattern data and official video titles...\n');

patterns.forEach(p => {
    if (!p.youtubeVideoId) return;

    const videoTitle = videoMap[p.youtubeVideoId];
    if (!videoTitle) return;

    // Try to extract the Japanese name from common prefixes
    // Examples:
    // "ゼンタングル®︎タングル・アイキャンディス" -> "アイキャンディス"
    // "ゼンタングル®︎パターン・サイム" -> "サイム"
    // "ゼンタングル®︎タングル・ポークルート・ポークリーフ" -> "ポークルート・ポークリーフ"
    // "ゼンタングル®︎タングル・アイソコア" -> "アイソコア"

    let extractedJa = null;
    const jaRegex = /ゼンタングル®︎?(?:タングル|パターン)[・。](.+)$/;
    const match = videoTitle.match(jaRegex);

    if (match) {
        extractedJa = match[1].trim();
    } else if (videoTitle.includes(' by ')) {
        // Handle cases like "Raku by Midori Furuhashi" -> maybe not Ja name but let's see
    }

    if (extractedJa) {
        // Remove common suffixes or cleanup
        extractedJa = extractedJa.replace(/\s+SD\s+480p$/, '');

        if (p.nameJa !== extractedJa) {
            console.log(`[DISCREPANCY] Pattern ID ${p.id} (${p.name}):`);
            console.log(`  Current NameJa: "${p.nameJa}"`);
            console.log(`  Video Title:    "${videoTitle}"`);
            console.log(`  Extracted Ja:   "${extractedJa}"`);
            console.log(`  Action: Suggest Update to "${extractedJa}"\n`);
        }
    }
});
