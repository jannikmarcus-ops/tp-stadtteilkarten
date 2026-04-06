#!/usr/bin/env python3
"""
Batch 2 Update: 24 neue interaktive Stadtteile + hamburg-altstadt -> altstadt Rename.
"""
import json
import re

JSX_PATH = '/Users/jannikmarcus/Projects/tp-stadtteilkarten/src/components/Map/HamburgSVG.jsx'
NEW_PATHS_JSON = '/Users/jannikmarcus/Projects/tp-stadtteilkarten/hamburg/missing-districts-4.json'

with open(JSX_PATH, 'r') as f:
    content = f.read()

with open(NEW_PATHS_JSON, 'r') as f:
    new_paths = json.load(f)

# ============================================================
# 1. Rename hamburg-altstadt -> altstadt in ALL_DISTRICTS
# ============================================================
content = content.replace("id: 'hamburg-altstadt'", "id: 'altstadt'")

# ============================================================
# 2. Add 7 new paths to ALL_DISTRICTS (before the closing ])
# ============================================================
# Find the last entry in ALL_DISTRICTS and add after it
new_entries = []
for district_id, data in new_paths.items():
    path_d = data['d']
    new_entries.append(f"  {{ id: '{district_id}', path: '{path_d}' }},")

new_entries_str = '\n'.join(new_entries)

# Find the closing ] of ALL_DISTRICTS - it's after the last { id: entry
# Look for the pattern of the last district entry followed by ]
# We'll find the line with the last closing ] that ends the ALL_DISTRICTS array
# The array ends with a line containing just ']'
# Find ALL_DISTRICTS array end
all_districts_match = re.search(r"(const ALL_DISTRICTS = \[.*?)(^\])", content, re.DOTALL | re.MULTILINE)
if all_districts_match:
    insert_pos = all_districts_match.end(1)
    # Insert before the closing ]
    content = content[:insert_pos] + new_entries_str + '\n' + content[insert_pos:]
    print("Added 7 new paths to ALL_DISTRICTS")
else:
    print("ERROR: Could not find ALL_DISTRICTS closing bracket")

# ============================================================
# 3. Update INTERACTIVE_IDS: Add 23 new IDs
# ============================================================
new_interactive = [
    'wohldorf-ohlstedt', 'steilshoop', 'dulsberg', 'marienthal', 'jenfeld',
    'tonndorf', 'farmsen-berne', 'altstadt', 'neustadt', 'st-pauli',
    'hafencity', 'hammerbrook', 'borgfelde', 'hamm', 'horn', 'billstedt',
    'rothenburgsort', 'lohbruegge', 'bergedorf', 'allermoehe',
    'neuallerm\u00f6he', 'billwerder', 'moorfleet',
]

# Find the current INTERACTIVE_IDS and add new entries
old_interactive_end = "  'altona', 'nienstedten', 'gross-flottbek', 'osdorf', 'lurup', 'iserbrook', 'suelldorf', 'rissen', 'eidelstedt', 'schnelsen', 'niendorf', 'gross-borstel', 'fuhlsbuettel', 'langenhorn', 'ohlsdorf', 'alsterdorf', 'hummelsbuettel', 'poppenbuettel', 'wellingbuettel', 'sasel', 'volksdorf', 'bergstedt', 'lemsahl-mellingstedt', 'duvenstedt',\n])"

new_interactive_line = "  '" + "', '".join(new_interactive) + "',"

new_interactive_block = "  'altona', 'nienstedten', 'gross-flottbek', 'osdorf', 'lurup', 'iserbrook', 'suelldorf', 'rissen', 'eidelstedt', 'schnelsen', 'niendorf', 'gross-borstel', 'fuhlsbuettel', 'langenhorn', 'ohlsdorf', 'alsterdorf', 'hummelsbuettel', 'poppenbuettel', 'wellingbuettel', 'sasel', 'volksdorf', 'bergstedt', 'lemsahl-mellingstedt', 'duvenstedt',\n" + new_interactive_line + "\n])"

content = content.replace(old_interactive_end, new_interactive_block)
print("Updated INTERACTIVE_IDS with 23 new entries")

# ============================================================
# 4. Update header comment
# ============================================================
content = content.replace(
    "// Hamburg SVG Karte (64 Stadtteile, 46 interaktiv)",
    "// Hamburg SVG Karte (71 Stadtteile, 69 interaktiv)"
)

# ============================================================
# 5. Update DARK_DISTRICTS: Add new dark districts (ETW >= 5000)
# ============================================================
new_dark = [
    'altstadt', 'neustadt', 'st-pauli', 'hafencity', 'hammerbrook',
    'borgfelde', 'hamm', 'dulsberg', 'marienthal', 'rothenburgsort',
    'wohldorf-ohlstedt',
]

old_dark_end = "  'altona', 'nienstedten', 'gross-flottbek', 'osdorf', 'iserbrook', 'suelldorf', 'rissen', 'gross-borstel', 'fuhlsbuettel', 'ohlsdorf', 'alsterdorf', 'poppenbuettel', 'wellingbuettel', 'sasel', 'volksdorf',\n])"

new_dark_line = "  '" + "', '".join(new_dark) + "',"

new_dark_block = "  'altona', 'nienstedten', 'gross-flottbek', 'osdorf', 'iserbrook', 'suelldorf', 'rissen', 'gross-borstel', 'fuhlsbuettel', 'ohlsdorf', 'alsterdorf', 'poppenbuettel', 'wellingbuettel', 'sasel', 'volksdorf',\n" + new_dark_line + "\n])"

content = content.replace(old_dark_end, new_dark_block)
print("Updated DARK_DISTRICTS with 11 new entries")

# ============================================================
# 6. Update ELBE_ADJACENT: Remove interactive districts, keep only billbrook
# ============================================================
old_elbe = """const ELBE_ADJACENT = new Set([
  'hafencity', 'hammerbrook', 'rothenburgsort', 'billbrook',
  'altstadt', 'neustadt',
])"""

new_elbe = """const ELBE_ADJACENT = new Set([
  'billbrook',
])"""

content = content.replace(old_elbe, new_elbe)
print("Updated ELBE_ADJACENT (only billbrook remains)")

# ============================================================
# 7. Move 17 grey labels to LABELS, add 7 new labels
# ============================================================

# New labels to add to LABELS (moved from grey + new districts)
new_labels = [
    # Moved from GREY_LABELS (with corrected names)
    "  { id: 'neustadt',        x: 457, y: 523, lines: ['Neustadt'],            size: 7 },",
    "  { id: 'altstadt',        x: 503, y: 543, lines: ['Altstadt'],            size: 7 },",
    "  { id: 'st-pauli',        x: 397, y: 488, lines: ['St. Pauli'],           size: 7 },",
    "  { id: 'hafencity',       x: 524, y: 572, lines: ['HafenCity'],           size: 7 },",
    "  { id: 'borgfelde',       x: 585, y: 523, lines: ['Borgfelde'],           size: 6 },",
    "  { id: 'hammerbrook',     x: 574.4, y: 547.4, lines: ['Hammer-', 'brook'], size: 7 },",
    "  { id: 'rothenburgsort',  x: 631, y: 600, lines: ['Rothen-', 'burgsort'], size: 7 },",
    "  { id: 'billstedt',       x: 794.0, y: 569.2, lines: ['Billstedt'],       size: 8 },",
    "  { id: 'dulsberg',        x: 652, y: 422, lines: ['Dulsberg'],            size: 8 },",
    "  { id: 'marienthal',      x: 693, y: 476, lines: ['Marienthal'],          size: 8 },",
    "  { id: 'hamm',            x: 633.4, y: 532.3, lines: ['Hamm'],            size: 8 },",
    "  { id: 'horn',            x: 702, y: 534, lines: ['Horn'],                size: 8 },",
    "  { id: 'steilshoop',      x: 639, y: 323, lines: ['Steilshoop'],          size: 8 },",
    "  { id: 'farmsen-berne',   x: 762, y: 326, lines: ['Farmsen-', 'Berne'],  size: 8 },",
    "  { id: 'tonndorf',        x: 764, y: 395, lines: ['Tonndorf'],            size: 8 },",
    "  { id: 'jenfeld',         x: 804, y: 443, lines: ['Jenfeld'],             size: 8 },",
    # New districts from missing-districts-4
    "  { id: 'wohldorf-ohlstedt', x: 840, y: 40, lines: ['Wohldorf-', 'Ohlstedt'], size: 7 },",
    "  { id: 'lohbruegge',      x: 912, y: 715, lines: ['Lohbr\\u00fcgge'],     size: 8 },",
    "  { id: 'bergedorf',       x: 940, y: 680, lines: ['Bergedorf'],           size: 8 },",
    "  { id: 'allermoehe',      x: 855, y: 720, lines: ['Allerm\\u00f6he'],     size: 7 },",
    "  { id: 'neuallerm\\u00f6he', x: 860, y: 750, lines: ['Neualler-', 'm\\u00f6he'], size: 7 },",
    "  { id: 'billwerder',      x: 810, y: 695, lines: ['Billwerder'],          size: 7 },",
    "  { id: 'moorfleet',       x: 735, y: 658, lines: ['Moorfleet'],           size: 7 },",
]

# Find the closing of LABELS array and add new entries before ]
# The LABELS array ends with the duvenstedt entry followed by ]
old_labels_end = "  { id: 'duvenstedt',      x: 736, y: -3,  lines: ['Duvenstedt'],           size: 8 },\n]"
new_labels_str = '\n'.join(new_labels)
new_labels_end = "  { id: 'duvenstedt',      x: 736, y: -3,  lines: ['Duvenstedt'],           size: 8 },\n  // Batch 2: 23 neue interaktive Stadtteile\n" + new_labels_str + "\n]"
content = content.replace(old_labels_end, new_labels_end)
print("Added 23 new labels to LABELS")

# ============================================================
# 8. Update GREY_LABELS: Remove all moved districts, keep only billbrook + hohenfelde
# ============================================================
old_grey = """const GREY_LABELS = [
  // Zentrum-Sued
  { id: 'neustadt',        x: 457, y: 523, lines: ['St. Pauli'],            size: 7 },
  { id: 'altstadt', x: 482, y: 535, lines: ['Neustadt'],            size: 7 },
  { id: 'altstadt-label',  x: 520, y: 550, lines: ['Altstadt'],             size: 7 },
  { id: 'hafencity',       x: 524, y: 572, lines: ['HafenCity'],            size: 7 },
  // Zentrum-Ost
  { id: 'hohenfelde',      x: 577.5, y: 498.5, lines: ['Hohenfelde'],      size: 6 },
  { id: 'borgfelde',       x: 585, y: 523, lines: ['Borgfelde'],            size: 6 },
  { id: 'hammerbrook',     x: 574.4, y: 547.4, lines: ['Hammer-', 'brook'], size: 7 },
  { id: 'rothenburgsort',  x: 631, y: 600, lines: ['Rothen-', 'burgsort'], size: 7 },
  { id: 'billbrook',       x: 720.8, y: 606.3, lines: ['Billbrook'],       size: 7 },
  { id: 'billstedt',       x: 794.0, y: 569.2, lines: ['Billstedt'],       size: 8 },
  // Osten
  { id: 'dulsberg',        x: 652, y: 422, lines: ['Dulsberg'],             size: 8 },
  { id: 'marienthal',      x: 693, y: 476, lines: ['Marienthal'],           size: 8 },
  { id: 'hamm',            x: 633.4, y: 532.3, lines: ['Hamm'],             size: 8 },
  { id: 'horn',            x: 702, y: 534, lines: ['Horn'],                 size: 8 },
  // Nordosten
  { id: 'steilshoop',      x: 639, y: 323, lines: ['Steilshoop'],           size: 8 },
  { id: 'farmsen-berne',   x: 762, y: 326, lines: ['Farmsen-', 'Berne'],   size: 8 },
  { id: 'tonndorf',        x: 764, y: 395, lines: ['Tonndorf'],             size: 8 },
  { id: 'jenfeld',         x: 804, y: 443, lines: ['Jenfeld'],              size: 8 },
]"""

# But wait - the rename already happened, so hamburg-altstadt is now altstadt
# Check what the actual content looks like after rename
new_grey = """const GREY_LABELS = [
  { id: 'hohenfelde',      x: 577.5, y: 498.5, lines: ['Hohenfelde'],      size: 6 },
  { id: 'billbrook',       x: 720.8, y: 606.3, lines: ['Billbrook'],       size: 7 },
]"""

content = content.replace(old_grey, new_grey)
print("Updated GREY_LABELS (only hohenfelde + billbrook remain)")

# ============================================================
# 9. Update STAGGER_ORDER: Add 23 new IDs
# ============================================================
new_stagger = [
    'wohldorf-ohlstedt', 'steilshoop', 'dulsberg', 'marienthal', 'jenfeld',
    'tonndorf', 'farmsen-berne', 'altstadt', 'neustadt', 'st-pauli',
    'hafencity', 'hammerbrook', 'borgfelde', 'hamm', 'horn', 'billstedt',
    'rothenburgsort', 'lohbruegge', 'bergedorf', 'allermoehe',
    'neuallerm\u00f6he', 'billwerder', 'moorfleet',
]

old_stagger_end = "  'altona', 'nienstedten', 'gross-flottbek', 'osdorf', 'lurup', 'iserbrook', 'suelldorf', 'rissen', 'eidelstedt', 'schnelsen', 'niendorf', 'gross-borstel', 'fuhlsbuettel', 'langenhorn', 'ohlsdorf', 'alsterdorf', 'hummelsbuettel', 'poppenbuettel', 'wellingbuettel', 'sasel', 'volksdorf', 'bergstedt', 'lemsahl-mellingstedt', 'duvenstedt',\n]"

new_stagger_line = "  '" + "', '".join(new_stagger) + "',"

new_stagger_block = "  'altona', 'nienstedten', 'gross-flottbek', 'osdorf', 'lurup', 'iserbrook', 'suelldorf', 'rissen', 'eidelstedt', 'schnelsen', 'niendorf', 'gross-borstel', 'fuhlsbuettel', 'langenhorn', 'ohlsdorf', 'alsterdorf', 'hummelsbuettel', 'poppenbuettel', 'wellingbuettel', 'sasel', 'volksdorf', 'bergstedt', 'lemsahl-mellingstedt', 'duvenstedt',\n" + new_stagger_line + "\n]"

content = content.replace(old_stagger_end, new_stagger_block)
print("Updated STAGGER_ORDER with 23 new entries")

# ============================================================
# 10. Update ViewBox
# ============================================================
content = content.replace(
    'viewBox="-30 -20 1060 680"',
    'viewBox="-30 -20 1100 820"'
)

# Also update elbe-clip rect to match
content = content.replace(
    '<rect x="-30" y="-20" width="1060" height="680" />',
    '<rect x="-30" y="-20" width="1100" height="820" />'
)
print("Updated viewBox and elbe-clip to -30 -20 1100 820")

# ============================================================
# Write output
# ============================================================
with open(JSX_PATH, 'w') as f:
    f.write(content)

print("\nDone! All changes written to HamburgSVG.jsx")
