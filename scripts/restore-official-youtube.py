import json
import re

# Mapping of Pattern Name -> Video ID based on official channel audit
OFFICIAL_MAPPING = {
    "Crescent Moon": "BoXbXr5gGYc",
    "Hollibaugh": "te3PeKGjXO4",
    "Cadent": "jLVBjlOXdnI",
    "Jonqal": "MDAbWXU5V5A",
    "Flux": "VzMSoj2vOyo", # Multiple Flux videos, selecting one
    "Tipple": "xeadSd3UbfA",
    "Mooka": "2sGbRFwwgfg",
    "Paradox": "ezGwfUT8QmQ",
    "Huggins": "_zxwBTZ-VVU",
    "Doodah": "JVRnNpOkJFg",
    "Echoism": "8QZ8hQizs7Y",
    "Festune": "2GoW5kSOX5Y",
    "Jetties": "RzTdLnsTc7U",
    "Keeko": "9kCTeUzoPrA",
    "Static": "lMkVA0U16e4",
    "Printemps": "FJ8x7mkpY_M",
    "W2": "Au-01kqp3p4",
    "Aquafleur": "2qmoP3Iooz8",
    "Auraknot": "OAtECiSh6F0",
    "Indy-Rella": "FhTNzNidQ-4",
    "Ixorus": "h4p7Otdxyyc",
    "Beelight": "6Rmn58yZPYU",
    "Braze": "tu5ZUt_z7Hc",
    "Dewd": "431ctiv9jEY",
    "Eke": "GoakCj-KXNU",
    "Chainging": "V4J148mqRtE",
    "Cirquital": "_vypIn40iLM",
    "Enyshou": "tgs1pKUbWyU",
    "Evoke": "vyC5sEY0Q1k",
    "Fengle": "FlxlyG6j6f4",
    "Fife": "Z1Y1cQVwn5g",
    "Floo": "sq8gvDLh7yA",
    "Rixty": "mG4q6KyYvB0",
    "Flukes": "NwI3h9hvCtE",
    "Frondous": "fuTcK9pKY5w", # Inix / Frondous
    "Hollis": "R8qk3Bxyo6I",
    "Ibex": "43XKezNkXhQ",
    "Icanthis": "fssY6CekPp0",
    "Juke": "7jmElfvYytw",
    "Marasu": "7ArpkaQwL2w",
    "Meer": "UfD4q0XCiSA",
    "Munchin": "0EK-HtYGaeE",
    "Nipa": "S83o3HBt9Jc",
    "N'Zeppel": "R6JPbQKLcWE",
    "Onamato": "AfWr3SehLrA",
    "Opus": "hAVkzdo8qVA",
    "Pearlz": "Q9_O_Ggq9kY",
    "Pokeleaf": "eq4yhEFpOZE",
    "Quandary": "Cawcesnm-sk",
    "Rain": "CBnIeA7vw_A",
    "Ratoon": "n3kI8TeVK2g",
    "Ravel": "a5YkwoCN--Q",
    "Shattuck": "isyTrVswcMw",
    "Vega": "rpzijwCL0MI",
    "Snail": "Iu0CodfZ1IA",
    "Sez": "9rjeQCXPa2g",
    "Zip": "MFDlRFTd738",
    "Sprinkle": "muH_M7Uznug",
    "Nekton": "1gZxbZ1SEbM",
    "Auric": "0f84youdv94",
    "Squid": "dCzn28wIHyk",
    "Toodlez": "giDVNVZRmOg",
    "Zenith": "A6uJV1qfxP8",
    "Drawrings": "TQmDONaO7lc",
    "Striping": "0bpCJI4CiHY",
    "Tagh": "-SWKLRpSpIY",
    "Scarabough": "UdVzYNOs6Gs",
    "Y-Full": "3CIftLR0xes",
    "Swarm": "KjCEuYVlYVU",
    "Hybred": "B6HRHO5n1aw",
    "Tidings": "UlnlvUhIrr8",
    "Twing": "C78v-Y-bqdE",
    "Abrial": "Q5QewIt8VJY",
    "Nease": "q7JrP3Ylxkg",
    "Betruviuth": "4MIntv9ortw",
    "Rocher": "tJsBXWyhXR4",
    "Pepper": "K9YjpOImOdk",
    "Mysteria": "HYzcZdYEv4Q",
    "Spoken": "iPg3vKHu4pg",
    "Umble": "pVZyGDsWHBM",
    "Frankie": "MKKH5PB0fIs",
    "Sedgling": "EzmXd4PndOo",
    "Nuumlipahs": "kB0jrUbfQT4",
    "Tortuca": "DjyUvFN8agw",
    "Fandabout": "iWHOd9JdX-o",
    "Inix": "fuTcK9pKY5w",
    "Crool": "_FcHKA38oVk",
    "Coralan": "hJ_xFn-zfCk",
    "Arkos": "nyj0Qc2JMT8",
    "Quipple": "wFCLiiJcjig",
    "Patena": "9EDMrbW-bNU",
    "Calant": "wuazWrLyjOU", # Courant? (subagent list had Corant)
    "Purk": "ApCx3Bpysz0",
    "Dingsplatz": "QhnatQrW8n8",
    "Froze": "rVlXoPUs-rM",
    "Raddiox": "PtD5iBsGNa4",
    "Zephyr": "lp1e_Ot2oW0", # ゼアフォー
    "Drawber": "TQmDONaO7lc",
    "Coaster": "nyj0Qc2JMT8",
    "Florz": "rVlXoPUs-rM",
    "Ahh-solo": "lp1e_Ot2oW0",
    "Verdigogh": "MQB5U3BxmAI", # バーディゴー
    "Well": "YS3Nldee_Jo",
    "Keenees": "0bpCJI4CiHY",
    "Maryhill": "y1LAoucnEsY", # ドゥループ? y1LAoucnEsY was labeled Drupe in Step 288 audit. Let me check.
}

JSON_PATH = '/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website/data/patterns.json'
JS_DATA_PATH = '/Users/hiroshi/.gemini/antigravity/scratch/tangleseed-website/js/data/patterns.json'

def process_file(path):
    with open(path, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    modified = False
    for item in data:
        name = item['name']
        if name in OFFICIAL_MAPPING:
            new_id = OFFICIAL_MAPPING[name]
            if item.get('youtubeVideoId') != new_id:
                print(f"Restoring {new_id} for {name}")
                item['youtubeVideoId'] = new_id
                modified = True
            
    if modified:
        with open(path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f"Updated {path}")

process_file(JSON_PATH)
process_file(JS_DATA_PATH)
