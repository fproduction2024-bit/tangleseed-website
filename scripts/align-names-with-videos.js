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

const jaRegex = /ゼンタングル®︎?(?:タングル|パターン)[・。](.+)$/;

console.log('Aligning pattern names with official video titles...');

let updateCount = 0;

patterns.forEach(p => {
    if (!p.youtubeVideoId) return;

    const videoTitle = videoMap[p.youtubeVideoId];
    if (!videoTitle) return;

    let extractedJa = null;
    const match = videoTitle.match(jaRegex);

    if (match) {
        extractedJa = match[1].trim();
        extractedJa = extractedJa.replace(/\s+SD\s+480p$/, '');
    }

    if (extractedJa) {
        if (p.nameJa !== extractedJa) {
            console.log(`[UPDATE] ID ${p.id} (${p.name}): "${p.nameJa}" -> "${extractedJa}"`);
            p.nameJa = extractedJa;
            updateCount++;
        }
    }
});

fs.writeFileSync(PATTERNS_PATH, JSON.stringify(patterns, null, 2));

console.log(`\nAlignment complete. Updated ${updateCount} patterns.`);
