---
name: Agricultural Excellence Marketplace
colors:
  surface: '#e8fff0'
  surface-dim: '#b8e4cc'
  surface-bright: '#e8fff0'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#d1fee5'
  surface-container: '#ccf8df'
  surface-container-high: '#c6f2da'
  surface-container-highest: '#c1ecd4'
  on-surface: '#002114'
  on-surface-variant: '#40493d'
  inverse-surface: '#0e3727'
  inverse-on-surface: '#cffbe2'
  outline: '#707a6c'
  outline-variant: '#bfcaba'
  surface-tint: '#1b6d24'
  primary: '#0d631b'
  on-primary: '#ffffff'
  primary-container: '#2e7d32'
  on-primary-container: '#cbffc2'
  inverse-primary: '#88d982'
  secondary: '#006e1c'
  on-secondary: '#ffffff'
  secondary-container: '#91f78e'
  on-secondary-container: '#00731e'
  tertiary: '#6e5100'
  on-tertiary: '#ffffff'
  tertiary-container: '#8c6800'
  on-tertiary-container: '#ffefd7'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#a3f69c'
  primary-fixed-dim: '#88d982'
  on-primary-fixed: '#002204'
  on-primary-fixed-variant: '#005312'
  secondary-fixed: '#94f990'
  secondary-fixed-dim: '#78dc77'
  on-secondary-fixed: '#002204'
  on-secondary-fixed-variant: '#005313'
  tertiary-fixed: '#ffdfa0'
  tertiary-fixed-dim: '#f6be39'
  on-tertiary-fixed: '#261a00'
  on-tertiary-fixed-variant: '#5c4300'
  background: '#e8fff0'
  on-background: '#002114'
  surface-variant: '#c1ecd4'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: 60px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 8px
  container-max: 1280px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 20px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system for this premium marketplace centers on a "Modern Agricultural" aesthetic. It balances the grounded, tactile nature of high-quality farming with the sophisticated, frictionless experience of a high-end SaaS platform. The UI must evoke reliability, abundance, and premium quality to build trust between farmers and commercial buyers.

The style is a blend of **Minimalism** and **Tactile Modernism**. It utilizes expansive white space (using the Cream White base) to ensure clarity, while employing subtle textures and "warm" surface layers to avoid a cold, clinical corporate feel. Visual metaphors should lean into "farm-to-table" sophistication—precise, clean, but rooted in the earth.

## Colors
The palette is deeply rooted in natural, fertile tones.
- **Primary Green (#2E7D32):** Used for primary actions, success states, and key branding moments. It represents growth and vitality.
- **Secondary Green (#4CAF50):** Used for supporting elements, iconography, and progress indicators.
- **Gold Accent (#D4A017):** Reserved for "Premium" tiers, trust badges, verified seller icons, and high-value highlights.
- **Dark Forest (#1B4332):** The primary text color. It provides better legibility and a more "organic" feel than pure black.
- **Cream & Beige (#FAFAF7, #F5F0E6):** These form the structural layers, providing a warm, high-end paper-like quality to the background and card surfaces.
- **Earth (#795548):** Used sparingly for secondary navigation elements or specific category labels related to livestock.

## Typography
Plus Jakarta Sans is the sole typeface, chosen for its modern geometry and friendly terminals. 
- **Headlines:** Use Semi-Bold (600) or Bold (700) with slight negative letter-spacing for a "tight," premium editorial look.
- **Body Text:** Use Regular (400) weight. The line height is generous (1.5x - 1.6x) to ensure high readability for product descriptions and legal terms.
- **Labels:** Use Medium (500) or Semi-Bold (600) for metadata, tags, and small navigation items to maintain hierarchy even at small scales.
- **Mobile scaling:** Display sizes drop by approximately 25% on mobile to maintain optimal line lengths.

## Layout & Spacing
The layout follows a **Fixed-Fluid Hybrid Grid**. 
- **Desktop:** A 12-column grid with a maximum container width of 1280px. Gutters are set at 24px to provide ample "air" between product cards.
- **Tablet:** 8-column grid with 20px gutters.
- **Mobile:** 4-column grid with 16px gutters and 20px side margins.

Spacing follows an 8px linear scale. Vertical rhythm should be generous; use `stack-lg` (32px) between major sections (e.g., between "Featured Farmers" and "Recent Listings") to maintain the premium, unhurried feel.

## Elevation & Depth
This design system uses **Tonal Layering** combined with **Ambient Shadows** to create a sophisticated sense of depth.
- **Level 0 (Background):** Cream White (#FAFAF7).
- **Level 1 (Cards/Surface):** Warm Beige (#F5F0E6) or White. Use a very soft, diffused shadow: `0px 4px 20px rgba(27, 67, 50, 0.06)`. The tint of the shadow uses the Dark Forest color at very low opacity to feel more natural than a gray shadow.
- **Level 2 (Hover/Active):** Slightly more pronounced shadow: `0px 8px 30px rgba(27, 67, 50, 0.10)`.
- **Dividers:** Use low-contrast lines (1px) in a slightly darker shade of the surface color to define boundaries without breaking the visual flow.

## Shapes
The shape language is "Approachable Geometric." 
- **Cards & Primary Containers:** Use a consistent 16px (`rounded-lg`) corner radius. This conveys friendliness and modern quality.
- **Buttons & Inputs:** Use 8px (`rounded-md`) for a slightly more structured, "trustworthy" feel.
- **Tags & Badges:** Use full-radius (pill-shaped) for organic categorization.
- **Iconography:** Use a 2px stroke width with rounded caps and joins to match the typography's softness.

## Components
- **Buttons:**
  - *Primary:* Solid Primary Green (#2E7D32) with white text. High contrast for CTA.
  - *Secondary:* Ghost style with Primary Green border and text.
  - *Tertiary:* Dark Forest text with no border for low-priority actions.
- **Product Cards:** Must include a high-fidelity image with 16px rounded corners, a "Verified" badge in Gold (#D4A017) if applicable, and clear pricing in Dark Forest.
- **Trust Indicators:** A specific "Escrow Protected" badge using a Secondary Green background and a shield icon.
- **Input Fields:** Warm Beige background (#F5F0E6) with a subtle 1px border that turns Primary Green on focus. 
- **Chips/Filters:** Use a "pill" shape. Selected state: Primary Green background. Unselected state: Transparent with a thin Earth (#795548) border.
- **Status Indicators:** 
  - *Available:* Secondary Green.
  - *Reserved:* Earth.
  - *Sold:* Dark Forest (low opacity).