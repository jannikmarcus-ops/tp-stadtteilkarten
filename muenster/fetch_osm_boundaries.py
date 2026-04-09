#!/usr/bin/env python3
"""
Holt die Stadtteil-Grenzen von Muenster aus OpenStreetMap via Overpass API.
Speichert die Rohdaten als raw-boundaries.json.
Macht zwei separate Queries (level 10 und 11) um Timeouts zu vermeiden.
"""

import json
import os
import time
import requests

SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_FILE = os.path.join(SCRIPT_DIR, 'raw-boundaries.json')

OVERPASS_URL = 'https://overpass-api.de/api/interpreter'

QUERY_LEVEL_10 = """
[out:json][timeout:120];
area["name"="Münster"]["boundary"="administrative"]["admin_level"="6"]->.city;
(
  relation["boundary"="administrative"]["admin_level"="10"](area.city);
);
out body;
>;
out skel qt;
"""

QUERY_LEVEL_11 = """
[out:json][timeout:120];
area["name"="Münster"]["boundary"="administrative"]["admin_level"="6"]->.city;
(
  relation["boundary"="administrative"]["admin_level"="11"](area.city);
);
out body;
>;
out skel qt;
"""


def fetch_query(query, label):
    print(f"Sende Overpass-Query fuer {label}...")
    response = requests.post(OVERPASS_URL, data={'data': query}, timeout=180)
    response.raise_for_status()
    data = response.json()
    elements = data.get('elements', [])
    relations = [e for e in elements if e['type'] == 'relation']
    ways = [e for e in elements if e['type'] == 'way']
    nodes = [e for e in elements if e['type'] == 'node']
    print(f"  Empfangen: {len(relations)} Relations, {len(ways)} Ways, {len(nodes)} Nodes")
    for r in relations:
        name = r.get('tags', {}).get('name', '???')
        level = r.get('tags', {}).get('admin_level', '?')
        print(f"    - {name} (admin_level={level}, id={r['id']})")
    return elements


def main():
    # Erst Level 10
    elements_10 = fetch_query(QUERY_LEVEL_10, "admin_level=10")

    # 5 Sekunden warten (Overpass rate limit)
    print("\nWarte 5 Sekunden (Rate Limit)...\n")
    time.sleep(5)

    # Dann Level 11
    elements_11 = fetch_query(QUERY_LEVEL_11, "admin_level=11")

    # Zusammenfuegen (Duplikate bei Nodes/Ways entfernen)
    node_map = {}
    way_map = {}
    relations = []

    for e in elements_10 + elements_11:
        if e['type'] == 'node':
            node_map[e['id']] = e
        elif e['type'] == 'way':
            way_map[e['id']] = e
        elif e['type'] == 'relation':
            relations.append(e)

    combined = {
        'elements': relations + list(way_map.values()) + list(node_map.values())
    }

    total_rels = len(relations)
    total_ways = len(way_map)
    total_nodes = len(node_map)

    print(f"\nGesamt: {total_rels} Relations, {total_ways} Ways, {total_nodes} Nodes")

    with open(OUTPUT_FILE, 'w', encoding='utf-8') as f:
        json.dump(combined, f, ensure_ascii=False)

    print(f"Gespeichert: {OUTPUT_FILE} ({os.path.getsize(OUTPUT_FILE) / 1024:.0f} KB)")


if __name__ == '__main__':
    main()
