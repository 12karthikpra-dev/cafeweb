---
name: Artisanal Warmth
colors:
  surface: '#fcf9f1'
  surface-dim: '#dcdad2'
  surface-bright: '#fcf9f1'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3eb'
  surface-container: '#f1eee6'
  surface-container-high: '#ebe8e0'
  surface-container-highest: '#e5e2da'
  on-surface: '#1c1c17'
  on-surface-variant: '#504442'
  inverse-surface: '#31312b'
  inverse-on-surface: '#f3f1e9'
  outline: '#827472'
  outline-variant: '#d3c3c0'
  surface-tint: '#745853'
  primary: '#271310'
  on-primary: '#ffffff'
  primary-container: '#3e2723'
  on-primary-container: '#ae8d87'
  inverse-primary: '#e3beb8'
  secondary: '#605e56'
  on-secondary: '#ffffff'
  secondary-container: '#e3dfd5'
  on-secondary-container: '#64635a'
  tertiary: '#2f0e00'
  on-tertiary: '#ffffff'
  tertiary-container: '#501d00'
  on-tertiary-container: '#ef6e22'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#ffdad4'
  primary-fixed-dim: '#e3beb8'
  on-primary-fixed: '#2b1613'
  on-primary-fixed-variant: '#5b403c'
  secondary-fixed: '#e6e2d8'
  secondary-fixed-dim: '#cac6bc'
  on-secondary-fixed: '#1c1c15'
  on-secondary-fixed-variant: '#48473f'
  tertiary-fixed: '#ffdbcc'
  tertiary-fixed-dim: '#ffb693'
  on-tertiary-fixed: '#351000'
  on-tertiary-fixed-variant: '#7a3000'
  background: '#fcf9f1'
  on-background: '#1c1c17'
  surface-variant: '#e5e2da'
typography:
  display:
    fontFamily: Montserrat
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Montserrat
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Montserrat
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
  headline-md:
    fontFamily: Montserrat
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Montserrat
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Montserrat
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Montserrat
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: 0.05em
  label-sm:
    fontFamily: Montserrat
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system embodies a modern, neighborhood-focused café experience that feels both high-end and accessible. The aesthetic leans into a refined **Minimalism** blended with **Tactile** warmth, prioritizing generous whitespace to evoke the calm atmosphere of a quiet morning. 

The visual narrative focuses on "The Human Touch"—celebrating craft through soft edges, organic textures, and high-quality photography. The UI acts as a quiet frame for the product, using subtle transitions and a focused palette to guide the user toward tactile interactions. It should feel artisanal, welcoming, and grounded in the physical world.

## Colors
The palette is rooted in the earth and the craft of coffee making. 
- **Primary (Deep Coffee):** Used for typography and structural elements to provide a solid, grounded foundation.
- **Secondary (Cream/Off-White):** Serves as the primary canvas color, creating a softer alternative to pure white that feels warmer and more inviting.
- **Tertiary (Terracotta):** Reserved for primary calls to action, highlights, and status indicators. It provides a vibrant, clay-like warmth.
- **Neutral:** A slightly cooler beige used for secondary surfaces, dividers, and background layering to maintain depth without adding clutter.

## Typography
Montserrat is used across all levels to maintain a clean, geometric, yet friendly appearance. 
- **Headlines:** Use tighter letter-spacing and heavier weights to create an impactful hierarchy. 
- **Body Text:** Ample line-height (1.6) is essential to ensure readability and maintain the "airy" feel of the brand. 
- **Labels:** Small labels utilize increased letter-spacing and uppercase styling to provide a distinct architectural feel, contrasting with the fluid nature of the body copy.

## Layout & Spacing
The layout follows a **Fluid Grid** model with a focus on asymmetrical balance. 
- **Grid:** Use a 12-column grid for desktop and a 4-column grid for mobile. 
- **Rhythm:** Spacing follows an 8px base unit. Vertical rhythm should be generous—err on the side of "too much" space between sections to evoke a premium, relaxed cafe environment.
- **Margins:** Large outer margins (40px+) on desktop prevent content from feeling cramped against the edge of the viewport.

## Elevation & Depth
Depth is created through **Tonal Layers** rather than heavy shadows. 
- **Surfaces:** Use the Secondary (Cream) as the base, with the Neutral (Beige) used for "recessed" areas or secondary sections. 
- **Shadows:** When necessary, use extremely diffused "Ambient Shadows" (Blur: 32px, Opacity: 4%) with a hint of the Primary (Coffee) hex code mixed into the shadow color to avoid a "dirty" gray look.
- **Micro-elevation:** Hover states should involve a subtle upward shift (2-4px) rather than a significant change in shadow intensity, emphasizing a light, floaty feel.

## Shapes
The shape language is defined by a **Rounded** philosophy. 
- **Standard Elements:** Buttons and small inputs use a 0.5rem (8px) radius.
- **Containers:** Cards, modals, and featured imagery use a `rounded-xl` (1.5rem / 24px) radius to create a soft, friendly frame that mimics ceramic or organic forms. 
- **Imagery:** Photos should always carry the same roundedness as their parent containers, never leaving a sharp edge.

## Components
- **Buttons:** Primary buttons use the Terracotta background with Off-White text. They should have a "heavier" feel with horizontal padding at 2.5x the vertical padding.
- **Cards:** Cards should be borderless, using a subtle background color shift (Neutral) or the ambient shadow defined in the Elevation section. They are the primary vessel for photography.
- **Inputs:** Text fields use a solid Neutral background with no border in their default state, gaining a thin Primary (Coffee) border on focus.
- **Chips/Tags:** Used for flavor profiles or dietary icons. Use a semi-transparent version of the Primary color (10% opacity) with Primary colored text.
- **Lists:** Use generous vertical padding (16px+) between list items with a very faint divider line in the Neutral color.
- **Photography:** The most important component. All photos should have a warm temperature bias and soft natural lighting.