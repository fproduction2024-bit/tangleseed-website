const fs = require('fs');
const path = require('path');

const OFFICIAL_VIDEOS_PATH = path.join(__dirname, '../official_videos.json');
const PATTERNS_PATH = path.join(__dirname, '../data/patterns.json');

const officialVideos = JSON.parse(fs.readFileSync(OFFICIAL_VIDEOS_PATH, 'utf8'));
const patterns = JSON.parse(fs.readFileSync(PATTERNS_PATH, 'utf8'));

const officialIds = new Set(officialVideos.map(v => v.id));

// Manual overrides for known spelling/naming differences
const MANUAL_MATCHES = {
    "Icanthis": "JTGMdV6j3l0", // Pattern says アイキャンシス, Video says アイキャンディス
    "Mooka": "2sGbRFwwgfg",    // Ensure primary Mooka video
    "Flux": "VzMSoj2vOyo",      // Ensure official Flux
    "Cadent": "jLVBjlOXdnI"     // Ensure official Cadent
};

console.log(`Loaded ${officialVideos.length} official videos.`);
console.log(`Loaded ${patterns.length} patterns.`);

let removedCount = 0;
let restoredCount = 0;
let keptCount = 0;

patterns.forEach(p => {
    const currentId = p.youtubeVideoId;

    // Check for manual overrides first
    if (MANUAL_MATCHES[p.name]) {
        if (p.youtubeVideoId !== MANUAL_MATCHES[p.name]) {
            console.log(`[OVERRIDE/RESTORE] ${p.name}: ${currentId || 'none'} -> ${MANUAL_MATCHES[p.name]}`);
            p.youtubeVideoId = MANUAL_MATCHES[p.name];
            restoredCount++;
        } else {
            keptCount++;
        }
        return;
    }

    // Check if current ID is official
    if (currentId && officialIds.has(currentId)) {
        keptCount++;
        return;
    }

    // If not official, try to find a match in official videos
    let foundMatch = null;

    if (p.nameJa) {
        // Search by Japanese name (most reliable)
        foundMatch = officialVideos.find(v => v.title.includes(p.nameJa));
    }

    if (!foundMatch && p.name) {
        // Search by English name (look for "Tangle Name" or similar)
        foundMatch = officialVideos.find(v => v.title.toLowerCase().includes(p.name.toLowerCase()));
    }

    if (foundMatch) {
        if (currentId !== foundMatch.id) {
            console.log(`[RESTORED/UPDATED] ${p.name}: ${currentId || 'none'} -> ${foundMatch.id} (${foundMatch.title})`);
            p.youtubeVideoId = foundMatch.id;
            restoredCount++;
        } else {
            // Already correct but maybe I missed it in the Set check? 
            // Should not happen if officialIds is correct.
            keptCount++;
        }
    } else if (currentId) {
        console.log(`[REMOVED] ${p.name}: ${currentId} (Not found in official channel)`);
        p.youtubeVideoId = "";
        removedCount++;
    }
});

fs.writeFileSync(PATTERNS_PATH, JSON.stringify(patterns, null, 2));

console.log('--- Audit Summary ---');
console.log(`Kept: ${keptCount}`);
console.log(`Restored/Updated: ${restoredCount}`);
console.log(`Removed: ${removedCount}`);
console.log('---------------------');
