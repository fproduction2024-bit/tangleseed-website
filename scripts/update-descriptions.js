// Script to extract enriched Japanese descriptions from Next.js patterns.ts
// and update the static site patterns.json

const fs = require('fs');
const path = require('path');

// Read the patterns.ts file
const patternsTs = fs.readFileSync(
    '/Users/hiroshi/cursor/projects/tangleseed_hp_production/web/src/data/patterns/patterns.ts',
    'utf8'
);

// Read the patterns.json file
const patternsJson = JSON.parse(
    fs.readFileSync(
        '/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website/js/data/patterns.json',
        'utf8'
    )
);

// Extract descriptionJa for patterns ID 4-10
const patterns = {};

// Regular expression to extract descriptionJa content between backticks
const extractDescriptionJa = (id) => {
    const regex = new RegExp(
        `id: '${id}',\\s*name:[^}]+?descriptionJa: \`([^\`]+)\``,
        's'
    );
    const match = patternsTs.match(regex);
    return match ? match[1].trim() : null;
};

// Extract for IDs 4-10
[4, 5, 6, 7, 9, 10].forEach(id => {
    const descriptionJa = extractDescriptionJa(id);
    if (descriptionJa) {
        patterns[id] = descriptionJa;
        console.log(`✓ Extracted description for ID ${id} (${descriptionJa.length} characters)`);
    } else {
        console.log(`✗ Failed to extract description for ID ${id}`);
    }
});

// Update patterns.json
patternsJson.forEach(pattern => {
    const id = parseInt(pattern.id);
    if ([4, 5, 6, 7, 9, 10].includes(id) && patterns[id]) {
        pattern.descriptionJa = patterns[id];
        console.log(`✓ Updated pattern ${id} (${pattern.name})`);
    }
});

// Write back to patterns.json
fs.writeFileSync(
    '/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website/js/data/patterns.json',
    JSON.stringify(patternsJson, null, 2),
    'utf8'
);

console.log('\n✅ Successfully updated patterns.json with enriched descriptions!');
console.log('\nUpdated patterns:');
[4, 5, 6, 7, 9, 10].forEach(id => {
    const pattern = patternsJson.find(p => parseInt(p.id) === id);
    if (pattern) {
        console.log(`  - ID ${id}: ${pattern.nameJa} (${pattern.descriptionJa.length} characters)`);
    }
});
