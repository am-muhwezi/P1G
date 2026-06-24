---
name: Modern Pastoral
colors:
  surface: '#fff8f6'
  surface-dim: '#ffd0bf'
  surface-bright: '#fff8f6'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fff1ec'
  surface-container: '#ffe9e3'
  surface-container-high: '#ffe2d9'
  surface-container-highest: '#ffdbcf'
  on-surface: '#2e150b'
  on-surface-variant: '#40493d'
  inverse-surface: '#46291e'
  inverse-on-surface: '#ffede7'
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
  background: '#fff8f6'
  on-background: '#2e150b'
  surface-variant: '#ffdbcf'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '800'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
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
  label-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.05em
  caption:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
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
  stack-sm: 12px
  stack-md: 24px
  stack-lg: 48px
---

## Brand & Style
The design system for this marketplace embodies a "Modern Pastoral" aesthetic—a sophisticated blend of agricultural heritage and high-tech reliability. It targets farmers, wholesalers, and premium consumers, evoking a sense of grounded trust, organic growth, and commercial efficiency. 

The visual style is **Corporate Modern with Tactile Warmth**. It avoids the sterile coldness of typical fintech by using a nature-inspired palette, while maintaining professionalism through precise 12-column layouts and systematic spacing. Glassmorphism is used sparingly for high-level navigation to provide a sense of depth and modernity without sacrificing accessibility.

## Colors
This palette is rooted in the earth. The **Primary Green** represents growth and the agricultural heart of the business, while the **Dark Forest** provides the necessary gravitas for typography and branding. 

**Warm Beige** serves as the global background color to reduce eye strain and feel more organic than pure white. **Cream White** is reserved for card surfaces and interactive containers to create a clear visual "lift." **Accent Gold** is a functional color used exclusively for trust indicators, premium memberships, and verified escrow badges to signal value and security.

## Typography
Plus Jakarta Sans is the sole typeface, chosen for its modern geometric clarity and friendly open counters. 

The hierarchy is intentionally "top-heavy" to provide an editorial feel to the marketplace. Headlines use tighter letter-spacing and heavier weights to command authority. Body text maintains generous line-heights for readability in dense listing pages. Label styles are set in uppercase with slight tracking to differentiate metadata from interactive content.

## Layout & Spacing
The design system utilizes a **12-column fluid grid** for desktop and a **4-column grid** for mobile. 

We employ a "Soft Grid" philosophy where vertical rhythm is based on 8px increments. Large cards and sections are separated by `stack-lg` (48px) to allow the "Modern Pastoral" aesthetic to breathe. Content is centered in a max-width container of 1280px to ensure legibility on ultra-wide monitors. On mobile, margins are reduced to 20px, but gutters remain relatively wide (16-24px) to maintain a premium, non-cluttered feel.

## Elevation & Depth
This design system avoids harsh dropshadows. Depth is communicated through:
1.  **Subtle Layering:** Background surfaces use Warm Beige, while active cards use Cream White.
2.  **Ambient Shadows:** Elements use a "Natural Bloom" shadow—a low-opacity (8-12%) shadow with a large blur radius (20px+) tinted with a hint of Earth Brown (#795548) to keep it warm.
3.  **Glassmorphism:** Navigation bars and specific overlay modals use a backdrop-blur (12px) with a semi-transparent Cream White fill (80% opacity) to provide a high-tech, layered feel.

## Shapes
The shape language is "Approachable Geometric." Standard interactive elements like buttons and input fields use a **12px radius**. 

Feature cards and main containers use a **16px radius** (`rounded-lg`) to feel substantial and modern. Specialized elements, such as "Verified" badges or status chips, use a full pill-shape (100px) to distinguish them from actionable buttons.

## Components

### Buttons & Inputs
- **Primary Button:** Filled Primary Green with white text. High-contrast, 12px radius, minimal 2px hover elevation.
- **Secondary Button:** Outlined in Earth Brown or Primary Green.
- **Inputs:** Cream White backgrounds with Earth Brown borders (1px). Focus state uses a 2px Primary Green ring.

### Cards & Tables
- **Marketplace Cards:** Large Cream White containers with a 16px radius. Soft ambient shadows. Images should have a subtle 4px internal border-radius.
- **Modern Tables:** No vertical borders. Horizontal separators use a very faint version of Earth Brown (10% opacity). The header row is styled in `label-md` for clarity.

### Escrow & Trust Features
- **Escrow Timeline:** A vertical or horizontal stepper using Primary Green for completed steps and Accent Gold for the "In-Progress/Secured" status.
- **Trust Badges:** Always paired with the Accent Gold color and a "Verified" icon.
- **Bottom Navigation (Mobile):** A persistent glassmorphic bar with 15px backdrop-blur and Primary Green active states for thumb-friendly marketplace navigation.