import json
from datetime import datetime

base_url = "https://tangle-seed.co.jp/"
pages = [
    "",
    "about.html",
    "representative.html",
    "corporate.html",
    "stories.html",
    "library.html",
    "gift.html",
    "privacy.html",
    "legal.html"
]

patterns_file = "js/data/patterns.json"
today = datetime.now().strftime("%Y-%m-%d")

with open(patterns_file, "r", encoding="utf-8") as f:
    patterns = json.load(f)

xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'

# Add main pages
for page in pages:
    xml += '  <url>\n'
    xml += f'    <loc>{base_url}{page}</loc>\n'
    xml += f'    <lastmod>{today}</lastmod>\n'
    xml += '    <changefreq>weekly</changefreq>\n'
    xml += '    <priority>0.8</priority>\n'
    xml += '  </url>\n'

# Add pattern library subpages
for pattern in patterns:
    slug = pattern.get("slug")
    if slug:
        xml += '  <url>\n'
        xml += f'    <loc>{base_url}library.html?pattern={slug}</loc>\n'
        xml += f'    <lastmod>{today}</lastmod>\n'
        xml += '    <changefreq>monthly</changefreq>\n'
        xml += '    <priority>0.6</priority>\n'
        xml += '  </url>\n'

xml += '</urlset>'

with open("sitemap.xml", "w", encoding="utf-8") as f:
    f.write(xml)

print("sitemap.xml has been generated.")
