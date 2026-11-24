#!/usr/bin/env python3
"""
CLI Tool to switch the active Color Theme for leleonp.github.io
Usage:
    python3 scripts/switch_theme.py <1..10|name>
Examples:
    python3 scripts/switch_theme.py 1               # 1. Slate & Teal (Default)
    python3 scripts/switch_theme.py 2               # 2. Nordic Navy
    python3 scripts/switch_theme.py 3               # 3. Emerald Biotech
    python3 scripts/switch_theme.py nordic_navy     # by name
"""

import os
import sys
import re
import json

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

THEMES = {
    '1': ('1_slate_teal', '1. Slate & Teal Científico (Default)'),
    'slate_teal': ('1_slate_teal', '1. Slate & Teal Científico (Default)'),
    '2': ('2_nordic_navy', '2. Nordic Navy & Deep Blue'),
    'nordic_navy': ('2_nordic_navy', '2. Nordic Navy & Deep Blue'),
    '3': ('3_emerald_biotech', '3. Emerald & Biotech Green'),
    'emerald_biotech': ('3_emerald_biotech', '3. Emerald & Biotech Green'),
    '4': ('4_minimal_indigo', '4. Modern Indigo & Graph'),
    'minimal_indigo': ('4_minimal_indigo', '4. Modern Indigo & Graph'),
    'indigo': ('4_minimal_indigo', '4. Modern Indigo & Graph'),
    '5': ('5_deep_cyan', '5. Oceanic Deep Cyan'),
    'deep_cyan': ('5_deep_cyan', '5. Oceanic Deep Cyan'),
    'cyan': ('5_deep_cyan', '5. Oceanic Deep Cyan'),
    '6': ('6_graphite_amber', '6. Academic Graphite & Amber'),
    'graphite_amber': ('6_graphite_amber', '6. Academic Graphite & Amber'),
    'amber': ('6_graphite_amber', '6. Academic Graphite & Amber'),
    '7': ('7_royal_purple', '7. Royal Violet & Slate'),
    'royal_purple': ('7_royal_purple', '7. Royal Violet & Slate'),
    'purple': ('7_royal_purple', '7. Royal Violet & Slate'),
    '8': ('8_midnight_crimson', '8. Midnight & Crimson Tech'),
    'midnight_crimson': ('8_midnight_crimson', '8. Midnight & Crimson Tech'),
    'crimson': ('8_midnight_crimson', '8. Midnight & Crimson Tech'),
    '9': ('9_forest_copper', '9. Forest & Warm Copper'),
    'forest_copper': ('9_forest_copper', '9. Forest & Warm Copper'),
    'copper': ('9_forest_copper', '9. Forest & Warm Copper'),
    '10': ('10_dark_executive', '10. Executive Obsidian Dark'),
    'dark_executive': ('10_dark_executive', '10. Executive Obsidian Dark'),
    'dark': ('10_dark_executive', '10. Executive Obsidian Dark'),
}

def set_theme(theme_key):
    key = str(theme_key).lower().strip()
    if key not in THEMES:
        print(f"Error: Tema '{key}' no reconocido.")
        print("Temas disponibles (1 al 10):")
        for num in range(1, 11):
            print(f"  {num}: {THEMES[str(num)][1]}")
        sys.exit(1)

    theme_file_stem, theme_display_name = THEMES[key]
    theme_css_path = os.path.join(ROOT_DIR, 'themes', f"{theme_file_stem}.css")
    style_css_path = os.path.join(ROOT_DIR, 'style.css')

    if not os.path.exists(theme_css_path):
        print(f"Error: No se encuentra el archivo del tema: {theme_css_path}")
        sys.exit(1)

    # Read :root block from theme file
    with open(theme_css_path, 'r', encoding='utf-8') as f:
        theme_content = f.read()

    root_match = re.search(r':root\s*\{[^}]*\}', theme_content, re.DOTALL)
    if not root_match:
        print("Error: No se pudo encontrar el bloque :root en el archivo del tema.")
        sys.exit(1)

    new_root_block = root_match.group(0)

    # Replace :root block in style.css
    with open(style_css_path, 'r', encoding='utf-8') as f:
        style_content = f.read()

    updated_style = re.sub(r':root\s*\{[^}]*\}', new_root_block, style_content, count=1, flags=re.DOTALL)
    
    # Also update the comment header in style.css
    updated_style = re.sub(r'\(Default:.*?\)', f'(Activo: {theme_display_name})', updated_style, count=1)

    with open(style_css_path, 'w', encoding='utf-8') as f:
        f.write(updated_style)

    print(f"✓ Éxito: 'style.css' actualizado con: {theme_display_name}")

    # Update config.json
    config_path = os.path.join(ROOT_DIR, 'config.json')
    if os.path.exists(config_path):
        try:
            with open(config_path, 'r', encoding='utf-8') as f:
                config = json.load(f)
            config['active_theme'] = theme_file_stem
            config['active_theme_name'] = theme_display_name
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            print(f"✓ 'config.json' sincronizado ('active_theme': '{theme_file_stem}').")
        except Exception as e:
            print(f"Aviso: config.json no se pudo actualizar: {e}")

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        print("Temas disponibles (1 al 10):")
        for num in range(1, 11):
            print(f"  {num}: {THEMES[str(num)][1]}")
        sys.exit(0)
    set_theme(sys.argv[1])
