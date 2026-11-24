#!/usr/bin/env python3
"""
CLI Tool to switch the active Home layout and Color Theme for leleonp.github.io
Usage:
    python3 scripts/switch_layout.py <layout_number> [theme_number]

Examples:
    python3 scripts/switch_layout.py 1           # Layout 1 (Split-Hero), mantiene paleta actual
    python3 scripts/switch_layout.py 1 2         # Layout 1 + Paleta 2 (Nordic Navy)
    python3 scripts/switch_layout.py 2 3         # Layout 2 (Bento Grid) + Paleta 3 (Emerald Biotech)
    python3 scripts/switch_layout.py 3 10        # Layout 3 (Dossier) + Paleta 10 (Dark Executive)

Layouts disponibles:
    1: Split-Hero Ejecutivo & Métricas (Default)
    2: Bento Grid Dashboard Moderno
    3: Dossier Académico & Research Story
    4: Interactive Compact Hub

Paletas disponibles (1 al 10):
    1: Slate & Teal Científico (Default)
    2: Nordic Navy & Deep Blue
    3: Emerald & Biotech Green
    4: Modern Indigo & Graph
    5: Oceanic Deep Cyan
    6: Academic Graphite & Amber
    7: Royal Violet & Slate
    8: Midnight & Crimson Tech
    9: Forest & Warm Copper
   10: Executive Obsidian Dark
"""

import os
import sys
import json
import shutil
from switch_theme import set_theme, THEMES

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

VARIANTS = {
    '1': {
        'name': 'Variante 1: Split-Hero Ejecutivo & Métricas',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_1_split_hero.html')
    },
    'split_hero': {
        'name': 'Variante 1: Split-Hero Ejecutivo & Métricas',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_1_split_hero.html')
    },
    '2': {
        'name': 'Variante 2: Bento Grid Dashboard Moderno',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_2_bento_grid.html')
    },
    'bento_grid': {
        'name': 'Variante 2: Bento Grid Dashboard Moderno',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_2_bento_grid.html')
    },
    '3': {
        'name': 'Variante 3: Dossier Académico & Research Story',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_3_academic_dossier.html')
    },
    'academic_dossier': {
        'name': 'Variante 3: Dossier Académico & Research Story',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_3_academic_dossier.html')
    },
    '4': {
        'name': 'Variante 4: Interactive Compact Hub',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_4_interactive_hub.html')
    },
    'interactive_hub': {
        'name': 'Variante 4: Interactive Compact Hub',
        'file': os.path.join(ROOT_DIR, 'variants', 'variant_4_interactive_hub.html')
    }
}

def switch(variant_key, theme_key=None):
    key = str(variant_key).lower().strip()
    if key not in VARIANTS:
        print(f"Error: Variante '{key}' no válida.")
        print("Opciones válidas: 1 (Split-Hero), 2 (Bento Grid), 3 (Academic Dossier), 4 (Interactive Hub)")
        sys.exit(1)

    target_info = VARIANTS[key]
    source_file = target_info['file']
    dest_file = os.path.join(ROOT_DIR, 'index.html')

    if not os.path.exists(source_file):
        print(f"Error: No se encuentra el archivo fuente: {source_file}")
        sys.exit(1)

    # 1. Update index.html
    shutil.copyfile(source_file, dest_file)
    print(f"✓ Éxito: 'index.html' actualizado con: {target_info['name']}")

    # 2. Update config.json
    config_file = os.path.join(ROOT_DIR, 'config.json')
    if os.path.exists(config_file):
        try:
            with open(config_file, 'r', encoding='utf-8') as f:
                config = json.load(f)
            v_num = 1 if key in ['1', 'split_hero'] else 2 if key in ['2', 'bento_grid'] else 3 if key in ['3', 'academic_dossier'] else 4
            config['home_variant'] = v_num
            config['home_variant_name'] = target_info['name']
            with open(config_file, 'w', encoding='utf-8') as f:
                json.dump(config, f, indent=2, ensure_ascii=False)
            print(f"✓ 'config.json' actualizado ('home_variant': {v_num}).")
        except Exception as e:
            print(f"Aviso: No se pudo actualizar config.json: {e}")

    # 3. If a 2nd parameter for theme is provided, update style.css as well
    if theme_key is not None:
        print(f"\n--- Aplicando paleta de color ({theme_key}) ---")
        set_theme(theme_key)

if __name__ == '__main__':
    if len(sys.argv) < 2:
        print(__doc__)
        sys.exit(0)
    
    layout_arg = sys.argv[1]
    theme_arg = sys.argv[2] if len(sys.argv) >= 3 else None
    switch(layout_arg, theme_arg)
