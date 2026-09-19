import re, os, glob

# Unified Tailwind colors configuration for Dark Coffee + Caramel
COLORS_CONFIG = """            "secondary": "#D4C3B3",
            "on-primary": "#1C120D",
            "on-primary-fixed": "#1C120D",
            "on-surface": "#FFF4E6",
            "primary-fixed-dim": "#E4A853",
            "on-background": "#FFF4E6",
            "surface-tint": "#E4A853",
            "on-error": "#ffffff",
            "secondary-fixed": "#3B2A20",
            "background": "#1C120D",
            "surface-container-lowest": "#150D09",
            "on-error-container": "#ffdad6",
            "secondary-container": "#3B2A20",
            "on-primary-fixed-variant": "#241812",
            "on-secondary-container": "#FFF4E6",
            "on-secondary-fixed": "#FFF4E6",
            "surface-dim": "#150D09",
            "outline-variant": "#3B2A20",
            "on-secondary": "#1C120D",
            "on-tertiary-fixed": "#1C120D",
            "on-tertiary-container": "#1C120D",
            "tertiary": "#E4A853",
            "inverse-surface": "#FFF4E6",
            "on-tertiary": "#1C120D",
            "on-surface-variant": "#D4C3B3",
            "on-primary-container": "#FFF4E6",
            "surface": "#1C120D",
            "surface-container-low": "#241812",
            "primary-fixed": "#F2BE6B",
            "surface-container": "#2D1F18",
            "outline": "#4A3529",
            "inverse-primary": "#6F452B",
            "inverse-on-surface": "#1C120D",
            "on-secondary-fixed-variant": "#D4C3B3",
            "on-tertiary-fixed-variant": "#1C120D",
            "error-container": "#93000a",
            "tertiary-fixed": "#E4A853",
            "secondary-fixed-dim": "#2D1F18",
            "surface-container-high": "#3B2A20",
            "primary": "#FFF4E6",
            "tertiary-container": "#E4A853",
            "surface-container-highest": "#4A3529",
            "tertiary-fixed-dim": "#E4A853",
            "surface-bright": "#2D1F18",
            "error": "#ba1a1a",
            "primary-container": "#6F452B",
            "surface-variant": "#2D1F18",
            "brand-orange": "#E4A853",
            "brand-orange-hover": "#F2BE6B",
            "brand-caramel": "#E4A853",
            "brand-caramel-hover": "#F2BE6B",
            "brand-brown": "#6F452B" """

def update_tailwind_colors(content):
    # Match colors: { ... } in tailwind.config
    pattern = r'("?colors"?\s*:\s*\{)[^\}]+(\})'
    replacement = r'\1\n' + COLORS_CONFIG + r'\n          \2'
    return re.sub(pattern, replacement, content, count=1)

def apply_palette():
    files = glob.glob('**/*.html', recursive=True)
    for f in files:
        if 'node_modules' in f:
            continue
        with open(f, 'r', encoding='utf-8') as fp:
            content = fp.read()
        
        # Update colors if tailwind config exists
        if 'tailwind.config' in content or 'tailwind' in content:
            new_content = update_tailwind_colors(content)
            
            # Update orange button styles to caramel text-[#1C120D] for supreme contrast
            new_content = re.sub(r'bg-\[\#ef6e22\]\s+hover:bg-\[\#d85d18\]\s+text-white', 'bg-[#E4A853] hover:bg-[#F2BE6B] text-[#1C120D]', new_content)
            new_content = re.sub(r'bg-\[\#ef6e22\]\s+text-white', 'bg-[#E4A853] text-[#1C120D] font-bold', new_content)
            new_content = re.sub(r'text-\[\#ef6e22\]', 'text-[#E4A853]', new_content)
            new_content = re.sub(r'bg-\[\#ef6e22\]\/10', 'bg-[#E4A853]/15 border border-[#E4A853]/30', new_content)
            new_content = re.sub(r'bg-\[\#ef6e22\]\/20', 'bg-[#E4A853]/20 border border-[#E4A853]/30', new_content)
            new_content = re.sub(r'bg-\[\#ef6e22\]', 'bg-[#E4A853]', new_content)
            new_content = re.sub(r'hover:bg-\[\#d85d18\]', 'hover:bg-[#F2BE6B]', new_content)
            new_content = re.sub(r'focus:ring-\[\#ef6e22\]', 'focus:ring-[#E4A853]', new_content)

            with open(f, 'w', encoding='utf-8') as fp:
                fp.write(new_content)
            print(f"Updated: {f}")

apply_palette()
