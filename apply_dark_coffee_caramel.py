import os, re, glob

# Dark Coffee + Caramel Palette Definition
# Background: #1C120D
# Text: #FFF4E6
# Primary: #6F452B
# Accent/CTA: #E4A853
# Hover: #F2BE6B
# Secondary Text: #D4C3B3
# Containers:
#   lowest: #150D09
#   low: #241812
#   default: #2D1F18
#   high: #3B2A20
#   highest: #4A3529
#   outline: #4A3529
#   outline-variant: #3B2A20

TAILWIND_COLORS_SNIPPET = """            "secondary": "#D4C3B3",
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

print("Palette configured.")
