# Personal-V3 Design System

A comprehensive design system documenting the aesthetic, typography, colors, animations, and UI patterns from the Personal-V3 portfolio project.

What I'm going for: A minimal, classy look, retro types, within the design genre of Claude and Anthropic, with boxy containers, subtle colorful shadows etc, might build upon it more

---

## 🎨 Color Palette

### Light Mode (Default)
```css
--primary-bg: #fffffc;      /* Off-white/cream background */
--text-color: #1a1d21;      /* Near-black text */
--accent: #ffe0ad;          /* Soft peach/beige accent */
--gray: #eeeae6;            /* Light warm gray */
--dark-gray: #6c757d;       /* Medium gray */
```

### Dark Mode
```css
--primary-bg: #212529;      /* Charcoal background */
--text-color: #f8f9fa;      /* Off-white text */
--gray: #343a40;            /* Dark gray */
--dark-gray: #6c757d;       /* Medium gray (same as light) */
```

### Usage in Tailwind
```js
colors: {
  text: 'var(--text-color)',
  background: 'var(--primary-bg)',
  accent: 'var(--accent)',
  gray: 'var(--gray)',
  darkgray: 'var(--dark-gray)'
}
```

---

## 📝 Typography

### Font Families

#### Heading Font: **Libre Baskerville**
- Source: Google Fonts
- Weights: 400 (normal), 700 (bold)
- Supports italic variants
- Usage: Headings, titles, quotes, important text

```html
<link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap" rel="stylesheet" />
```

```css
font-family: 'Libre Baskerville', serif;
```

#### Body Font: **Kollektif**
- Source: Custom font file (needs `/fonts/Kollektif.ttf`, `/Kollketif.ttf`)
- Weight: 400 (normal) ONLY
- Usage: Body text, descriptions, UI elements, buttons, labels
- **NEVER bold**: Kollektif should always use font-normal (400 weight)
- **NEVER in headings**: Kollektif is exclusively for body text and UI elements

```css
@font-face {
  font-family: 'Kollektif';
  font-style: normal;
  font-display: swap;
  src: url(/fonts/Kollektif.ttf);
}
```

### Typography Scale
Harmonious scale based on 1rem base:

| Size | Value | Pixels (approx) | Usage |
|------|-------|-----------------|-------|
| `sm` | 0.750rem | 12px | Small text, captions |
| `base` | 1rem | 16px | Body text |
| `xl` | 1.333rem | 21px | Subheadings |
| `2xl` | 1.777rem | 28px | Section headings |
| `3xl` | 2.369rem | 38px | Page headings |
| `4xl` | 3.158rem | 51px | Hero headings |
| `5xl` | 4.210rem | 67px | Display text |

### Font Weights
```js
fontWeight: {
  normal: '400',
  bold: '700'
}
```

**Important**: Libre Baskerville should primarily use `font-normal` (400 weight). The `font-bold` (700) variant is too thick and should be avoided for headings. Use size and spacing for hierarchy instead.

---

## ✨ Animations & Transitions

### Keyframe Animations

#### 1. Float Animation
Gentle floating effect for decorative elements
```css
animation: float 6s ease-in-out infinite;
```

#### 2. Spin Slow
Slow continuous rotation (5s)
```css
@keyframes spin-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.animate-spin-slow {
  animation: spin-slow 5s linear infinite;
}
```

#### 3. Spin Slower
Very slow continuous rotation (10s)
```css
.animate-spin-slower {
  animation: spin-slow 10s linear infinite;
}
```

#### 4. Blink (Cursor Effect)
Blinking cursor for typing animations
```css
@keyframes blink {
  50% { opacity: 0; }
}
.customCursor::after {
  content: '|';
  font-style: italic;
  margin-left: 0.25rem;
  animation: blink 1.1s infinite step-start;
}
```

### Framer Motion Patterns

#### Fade In/Out with Y-axis
```jsx
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
exit={{ opacity: 0, y: -20 }}
transition={{ duration: 0.5 }}
```

#### Spring Animation
Used for smooth, natural motion
```jsx
transition={{
  type: "spring",
  stiffness: 500,
  damping: 30
}}
```

#### Slide In Menu
```jsx
className={`transform transition-transform duration-300 ease-in-out ${
  isOpen ? 'translate-x-0' : '-translate-x-full'
}`}
```

---

## 🎴 Component Patterns

### Project Card with Dynamic Shadow

The signature effect: colored shadows that match project color on hover

```jsx
// Convert hex to RGB
const hexToRgb = (hex) => {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex.split('').map((c) => c + c).join('');
  }
  const bigint = parseInt(hex, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return `${r}, ${g}, ${b}`;
};

// Dynamic shadow
const rgbColor = hexToRgb(project.color);
const dynamicBoxShadow = isHovered
  ? `rgba(${rgbColor}, 0.1) 0px 1px 1px 0px inset, rgba(${rgbColor}, 0.25) 0px 50px 100px -20px, rgba(${rgbColor}, 0.3) 0px 30px 60px -30px`
  : ``;
```

**Style:**
```jsx
<div
  className="bg-gray p-6 cursor-pointer"
  style={{
    boxShadow: dynamicBoxShadow,
    transition: 'box-shadow 0.3s ease',
  }}
>
```

**Project Color Palette (Shadow Colors Only):**
These colors are EXCLUSIVELY used for dynamic box shadows on hover. NEVER use these colors for:
- Solid color circles, dots, or indicators
- Backgrounds
- Borders
- Large text blocks
- Any visual element except box shadows and tiny trend text

- Vibrant Yellow: `#ffbb00`
- Hot Pink: `#ff006f`
- Sky Blue: `#00b7ff`
- Lime Green: `#00ff33`
- Electric Purple: `#a855f7`
- Coral Orange: `#ff6b35`
- Cyan: `#06ffa5`
- Rose: `#fb5607`
- Violet: `#7209b7`
- Amber: `#ffd60a`

### Quote Block
Vertical border with hover effect, quotation mark icon, and auto-rotating quotes
```jsx
<div className="w-[300px] h-max-[120px] px-5 pt-2 pb-0 border-l-4 border-text rounded-md cursor-pointer hover:bg-[#eeeae67d]">
  <div className="flex space-x-4">
    <div className="flex-shrink-0">
      <svg className="h-8 w-8 text-text" fill="currentColor" viewBox="0 0 24 24">
        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
      </svg>
    </div>
    <div className="flex-grow">
      <AnimatePresence mode="wait">
        <motion.div
          key={key}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-body font-normal text-text mb-2 text-justify leading-5">{quote.text}</p>
          <p className="text-md font-heading font-normal text-darkgray text-right">~ {quote.author}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  </div>
</div>
```

**Features:**
- SVG quotation mark icon on the left
- Auto-rotates through quotes every 5 seconds using `useEffect`
- Smooth fade in/out with Y-axis movement
- Justified quote text in Kollektif
- Right-aligned author in Libre Baskerville
- Subtle background on hover

### Activity Feed (Bento Grid)
Asymmetric layout with large activity list and small stat cards
```jsx
<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {/* Large Card - 2/3 width */}
  <div className="md:col-span-2 bg-gray p-8">
    <h3 className="font-heading text-2xl font-normal mb-4">Recent Activity</h3>
    <div className="space-y-4">
      {activityItems.map((item, idx) => (
        <div key={idx} className="flex items-center gap-4 pb-4 border-b border-background last:border-0">
          <div className="flex-1">
            <p className="font-body text-text">{item.action}</p>
            <p className="font-body text-sm text-darkgray">{item.time}</p>
          </div>
        </div>
      ))}
    </div>
  </div>

  {/* Small Cards - 1/3 width stacked */}
  <div className="space-y-6">
    <div className="bg-gray p-6">
      <p className="font-body text-sm text-darkgray mb-2">Storage Used</p>
      <h3 className="font-heading text-3xl font-normal mb-3">68%</h3>
      <div className="w-full h-2 bg-background rounded-full overflow-hidden">
        <div className="h-full bg-text" style={{ width: '68%' }} />
      </div>
    </div>
    <div className="bg-gray p-6">
      <p className="font-body text-sm text-darkgray mb-2">Team Members</p>
      <h3 className="font-heading text-3xl font-normal">12</h3>
    </div>
  </div>
</div>
```

**Features:**
- Bento box layout (2:1 column ratio)
- Clean activity list without colored dots
- Simple dividers between items
- Progress bar with text color fill
- No hover effects - static display

### Hover Overlay Pattern
```jsx
<div className={`absolute inset-0 bg-gray transition-opacity duration-300 ${
  isHovered ? "opacity-50" : "opacity-0"
}`}></div>
```

### Skills Grid (Expandable)
```jsx
<div className={`transition-all duration-200 ease-in-out ${
  isExpanded ? 'w-[250px] h-[250px] bg-white' : 'w-[200px] h-[200px]'
}`}>
  {/* 3x3 grid of skills */}
</div>
```

### Timeline Slider
Vertical interactive slider with smooth ball movement
- Uses Framer Motion `useMotionValue`, `useSpring`, `useTransform`
- Damping: 20, Stiffness: 300
- Ball position transforms from 0% to 100%

---

## 📐 Layout & Spacing

### Container Widths
```css
/* Desktop */
.container { width: 75%; margin: 0 auto; }

/* Mobile */
.container-mobile { width: 90%; margin: 0 auto; }
```

### Common Spacing
- Hero section margin: `my-[250px]`
- Section bottom margin: `mb-[50px]`
- Grid gaps: `gap-6` (24px for project grid)
- Padding: `p-6` (24px for cards)

### Responsive Grid
```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Project cards */}
</div>
```

---

## 🎭 UI Elements

### Form Inputs
- **Default state**: `border-2 border-gray`
- **Focus state**: `focus:border-darkgray` (NEVER use --text-color or black)
- **Background**: Always use `bg-background`
- **Padding**: `px-4 py-3` for consistent sizing
- **Transition**: `transition-colors duration-200`
- **Outline**: Always `outline-none` (rely on border for focus indication)

### Buttons
- **Primary**: `bg-text text-background font-body font-normal` with `hover:opacity-80`
- **Secondary**: `bg-background border-2 border-darkgray font-body font-normal` with `hover:opacity-80`
- **Font**: Always use `font-body font-normal` (Kollektif at 400 weight)
- **NEVER bold**: Button text should never be bold
- **NEVER accent color**: Never use `hover:bg-accent` - use opacity changes only
- **Transition**: `transition-opacity duration-200`

### Custom Scrollbar
```css
.tweetContainer::-webkit-scrollbar {
  width: 1px;
  background-color: transparent;
}

.tweetContainer::-webkit-scrollbar-thumb {
  background-color: rgba(0, 0, 0, 0.2);
}
```

### Hamburger Menu
- Position: `fixed top-20 right-20`
- Full-screen overlay with slide transition
- Navigation items: 4xl font, bold, hover italic

### Social Links
- Plain text links with no background or boxes
- Font: `font-body font-normal`
- Color: `text-text`
- Hover: `hover:opacity-60` for subtle fade effect
- Spacing: `gap-6` between links
- NEVER use backgrounds, boxes, borders, or accent colors
- Transition: `transition-opacity duration-200`

---

## 🖼️ Background Images

### Desktop
```js
backgroundImage: {
  'backround-desktop': "url('/background1.png')"
}
```

### Mobile
```js
backgroundImage: {
  'gr': "url('/mobile-background1.png')"
}
```

---

## 🎯 Implementation Guide

### 1. Tailwind Config Setup
```js
export default {
  content: ['./src/**/*.{mjs,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        text: 'var(--text-color)',
        background: 'var(--primary-bg)',
        accent: 'var(--accent)',
        gray: 'var(--gray)',
        darkgray: 'var(--dark-gray)'
      },
      fontSize: {
        sm: '0.750rem',
        base: '1rem',
        xl: '1.333rem',
        '2xl': '1.777rem',
        '3xl': '2.369rem',
        '4xl': '3.158rem',
        '5xl': '4.210rem'
      },
      fontFamily: {
        heading: 'Libre Baskerville',
        body: 'Kollektif'
      },
      fontWeight: {
        normal: '400',
        bold: '700'
      },
      animation: {
        float: 'float 6s ease-in-out infinite'
      }
    }
  },
  plugins: []
}
```

### 2. Global CSS Setup
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --primary-bg: #fffffc;
    --text-color: #1a1d21;
    --accent: #ffe0ad;
    --gray: #eeeae6;
    --dark-gray: #6c757d;
  }

  .dark {
    --primary-bg: #212529;
    --text-color: #f8f9fa;
    --gray: #343a40;
    --dark-gray: #6c757d;
  }

  @font-face {
    font-family: 'Kollektif';
    font-style: normal;
    font-display: swap;
    src: url(/fonts/Kollektif.ttf);
  }

  @keyframes spin-slow {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .animate-spin-slow {
    animation: spin-slow 5s linear infinite;
  }

  .animate-spin-slower {
    animation: spin-slow 10s linear infinite;
  }
}
```

### 3. Required Dependencies
```bash
npm install framer-motion react-type-animation
```

### 4. Font Files Needed
- **Libre Baskerville**: Auto-loaded from Google Fonts
- **Kollektif**: Place `Kollektif.ttf` in `/public/fonts/`

---

## 🎨 Design Principles

### Aesthetic Characteristics
1. **Warm & Minimal**: Cream backgrounds with warm grays create a soft, approachable feel
2. **Elegant Typography**: Serif headings (Libre Baskerville) paired with clean sans-serif body (Kollektif)
3. **Subtle Interactions**: Gentle animations and hover states that enhance without overwhelming
4. **Color-Coded Projects**: Each project has its own signature color that appears in shadows
5. **Bento Box Layout**: Asymmetric grid layouts with varying component sizes
6. **Smooth Transitions**: All state changes use smooth 200-300ms transitions
7. **No Decorative Shapes**: NEVER use random floating circles, squares, or geometric shapes. Keep the design clean and uncluttered

### Color Usage Guidelines
- **Background**: Always use the CSS variable for theme compatibility
- **Text**: High contrast (near-black on cream in light mode)
- **Accent**: NEVER use accent color (gold/peach) for hover states on cards or buttons
- **Gray**: Cards, dividers, and secondary backgrounds
- **Dark Gray**: Secondary text, icons, muted content
- **Vibrant Colors (Yellow, Pink, Blue, Purple, etc.)**: ONLY for dynamic box shadows and tiny text accents (like trend indicators). NEVER for borders, backgrounds, or large text blocks
- **NEVER**: Use colored left/right/top/bottom borders on dashboard cards or stat blocks
- **NEVER**: Use full black (#000000 or --text-color) for focus states, borders, or highlights on inputs. Use --dark-gray for subtle focus states instead
- **NEVER**: Use accent color on hover. Use opacity changes instead (e.g., `hover:opacity-80`)

### Animation Guidelines
- **Duration**: 200-500ms for UI, 5-10s for decorative
- **Easing**: `ease-in-out` for most, `linear` for continuous rotation
- **Purpose**: Every animation should serve a purpose (feedback, delight, or guidance)

---

## 📝 Notes

- All animations are performance-optimized (using transform/opacity)
- Color shadows are computed dynamically from hex colors
- The aesthetic is warm, minimal, and sophisticated
- Framer Motion is used for complex animations
- Responsive breakpoints: mobile (default), md, lg

