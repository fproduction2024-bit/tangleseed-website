const fs = require('fs');
const path = require('path');

// Read the TypeScript patterns file
const patternsPath = '/Users/hiroshi/cursor/projects/tangleseed_hp_production/web/src/data/patterns/patterns.ts';
let content = fs.readFileSync(patternsPath, 'utf8');

// Find just the patterns array and extract it
const patternsMatch = content.match(/export const patterns.*?=\s*(\[[^\]]*?\n\]);/s);

if (!patternsMatch) {
    // Try alternative pattern - find the full array including nested brackets
    const startMatch = content.match(/export const patterns.*?=\s*\[/);
    if (!startMatch) {
        console.error('Could not find patterns array start');
        process.exit(1);
    }

    const startIndex = startMatch.index + startMatch[0].length - 1;

    // Find matching closing bracket
    let bracketCount = 0;
    let endIndex = startIndex;
    for (let i = startIndex; i < content.length; i++) {
        if (content[i] === '[') bracketCount++;
        else if (content[i] === ']') {
            bracketCount--;
            if (bracketCount === 0) {
                endIndex = i + 1;
                break;
            }
        }
    }

    const arrayContent = content.substring(startIndex, endIndex);

    // Create a valid JavaScript file with just the array
    const jsContent = `const patterns = ${arrayContent};\nmodule.exports = { patterns };`;

    // Write temp file
    const tempFile = './temp-patterns.js';
    fs.writeFileSync(tempFile, jsContent);

    // Require it
    try {
        const { patterns } = require(path.resolve(tempFile));

        // Clean up
        fs.unlinkSync(tempFile);

        // Write JSON output
        const outputPath = './js/data/patterns.json';
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(patterns, null, 2));

        console.log(`Successfully converted ${patterns.length} patterns to JSON`);
        console.log(`Output: ${path.resolve(outputPath)}`);
        console.log(`File size: ${(fs.statSync(outputPath).size / 1024).toFixed(2)} KB`);
    } catch (error) {
        console.error('Error requiring temp file:', error.message);
        console.log('Temp file saved as temp-patterns.js for debugging');
        process.exit(1);
    }
}
