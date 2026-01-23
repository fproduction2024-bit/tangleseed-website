// Pattern Data Extraction Script
// This script extracts pattern data from the external Next.js project
// and converts it to JSON format for use in the HTML/CSS/JS website

const fs = require('fs');
const path = require('path');

// Path to the external patterns.ts file
const PATTERNS_TS_PATH = '/Users/hiroshi/cursor/projects/tangleseed_hp_production/web/src/data/patterns/patterns.ts';
const OUTPUT_JSON_PATH = path.join(__dirname, 'data', 'patterns.json');

// Ensure output directory exists
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Read the TypeScript file
console.log('Reading patterns.ts...');
const tsContent = fs.readFileSync(PATTERNS_TS_PATH, 'utf-8');

// Extract the patterns array using regex
// Look for: export const patterns: Pattern[] = [
const patternsMatch = tsContent.match(/export const patterns: Pattern\[\] = \[([\s\S]*)\];/);

if (!patternsMatch) {
    console.error('Could not find patterns array in the TypeScript file');
    process.exit(1);
}

// Extract just the array content (without the 'export const patterns...' part)
let arrayContent = patternsMatch[1];

// We need to convert TypeScript object notation to valid JSON
// This is a simplified approach - we'll use a more robust method

try {
    // Add brackets back to create a valid JavaScript array
    const fullArrayString = `[${arrayContent}]`;

    // Use eval to parse the JavaScript/TypeScript array
    // Note: This works because the patterns array is pure data
    const patternsArray = eval(fullArrayString);

    console.log(`Successfully extracted ${patternsArray.length} patterns`);

    // Write to JSON file
    fs.writeFileSync(
        OUTPUT_JSON_PATH,
        JSON.stringify(patternsArray, null, 2),
        'utf-8'
    );

    console.log(`✅ Patterns data written to: ${OUTPUT_JSON_PATH}`);
    console.log(`   Total patterns: ${patternsArray.length}`);
    console.log(`   File size: ${(fs.statSync(OUTPUT_JSON_PATH).size / 1024).toFixed(2)} KB`);

    // Print sample pattern info
    if (patternsArray.length > 0) {
        const sample = patternsArray[0];
        console.log('\n📝 Sample pattern:');
        console.log(`   ID: ${sample.id}`);
        console.log(`   Name: ${sample.nameJa} (${sample.name})`);
        console.log(`   Difficulty: ${sample.difficulty}`);
        console.log(`   Categories: ${sample.category.join(', ')}`);
        console.log(`   Steps: ${sample.steps.length}`);
    }

} catch (error) {
    console.error('Error parsing patterns array:', error.message);
    console.error('\nTrying alternative extraction method...');

    // Alternative: Create a temporary .js file and require it
    const tempJsPath = path.join(__dirname, 'temp_patterns.js');

    try {
        // Create a JavaScript version by replacing TypeScript-specific syntax
        let jsContent = tsContent
            .replace(/export interface Pattern.*?\n}/gs, '') // Remove interfaces
            .replace(/export interface PatternStep.*?\n}/gs, '')
            .replace(/export const patterns: Pattern\[\] = /, 'module.exports = ')
            .replace(/: string/g, '')
            .replace(/: number/g, '')
            .replace(/: 'beginner' \| 'intermediate' \| 'advanced'/g, '')
            .replace(/\?:/g, ':'); // Remove optional markers

        fs.writeFileSync(tempJsPath, jsContent, 'utf-8');

        // Require the module
        const patternsArray = require(tempJsPath);

        console.log(`Successfully extracted ${patternsArray.length} patterns using alternative method`);

        // Write to JSON file
        fs.writeFileSync(
            OUTPUT_JSON_PATH,
            JSON.stringify(patternsArray, null, 2),
            'utf-8'
        );

        // Clean up temp file
        fs.unlinkSync(tempJsPath);

        console.log(`✅ Patterns data written to: ${OUTPUT_JSON_PATH}`);
        console.log(`   Total patterns: ${patternsArray.length}`);
        console.log(`   File size: ${(fs.statSync(OUTPUT_JSON_PATH).size / 1024).toFixed(2)} KB`);

    } catch (altError) {
        console.error('Alternative method also failed:', altError.message);
        process.exit(1);
    }
}
