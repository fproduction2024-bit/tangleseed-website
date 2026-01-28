import json
import os

OFFICIAL_CHANNEL_IDS = [] # Currently empty as none of the initial 160 IDs match
JSON_PATH = '/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website/data/patterns.json'
JS_DATA_PATH = '/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website/js/data/patterns.json'

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    for item in data:
        if item.get('youtubeVideoId'):
            # Since confirmed none are official, we clear them all
            print(f"Removing video ID {item['youtubeVideoId']} from {item['name']}")
            item['youtubeVideoId'] = ""
            modified = True
            
    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {path}")

process_file(JSON_PATH)
process_file(JS_DATA_PATH)
