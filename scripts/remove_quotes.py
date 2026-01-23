#!/usr/bin/env python3
"""
Script to remove quotation marks (「」) from Japanese text in patterns.json
"""
import json
import re

def remove_quotation_marks(text):
    """Remove Japanese quotation marks 「」 from text"""
    if not isinstance(text, str):
        return text
    
    # Remove 「 and 」
    text = text.replace('「', '')
    text = text.replace('」', '')
    
    return text

def process_pattern(pattern):
    """Process a single pattern object"""
    # Process descriptionJa
    if 'descriptionJa' in pattern:
        pattern['descriptionJa'] = remove_quotation_marks(pattern['descriptionJa'])
    
    # Process steps
    if 'steps' in pattern and isinstance(pattern['steps'], list):
        for step in pattern['steps']:
            if 'instructionJa' in step:
                step['instructionJa'] = remove_quotation_marks(step['instructionJa'])
    
    return pattern

def main():
    # Read the JSON file
    with open('js/data/patterns.json', 'r', encoding='utf-8') as f:
        patterns = json.load(f)
    
    # Process each pattern
    for pattern in patterns:
        process_pattern(pattern)
    
    # Write back to file with proper formatting
    with open('js/data/patterns.json', 'w', encoding='utf-8') as f:
        json.dump(patterns, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Successfully removed quotation marks from {len(patterns)} patterns")

if __name__ == '__main__':
    main()
