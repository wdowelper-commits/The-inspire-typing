# 04 — UI/UX Design Brief
## Project: Inspire Typing

---

## 1. Design Philosophy

Inspire Typing's design is **clean, modern, and trust-inspiring** — similar to Typing.com's aesthetic but elevated. The interface should feel:
- **Professional** — users trust it for real typing practice
- **Encouraging** — gamification elements feel rewarding, not distracting
- **Focused** — when typing, everything else fades away; the typing area is the hero
- **Bilingual-friendly** — layout gracefully handles both LTR (English) and RTL (Urdu)

---

## 2. Color Palette

| Token | Hex | Usage |
|-------|-----|-------|
| `--primary` | `#2563EB` | Primary buttons, active states, links, accents |
| `--primary-dark` | `#1D4ED8` | Hover state for primary |
| `--primary-light` | `#DBEAFE` | Background tints, chips, pill badges |
| `--secondary` | `#10B981` | Success states, correct character highlight, badges |
| `--error` | `#EF4444` | Wrong character highlight, error messages |
| `--warning` | `#F59E0B` | Streak badges, warning states |
| `--background` | `#F8FAFC` | Page background (very light blue-gray, like typing.com) |
| `--surface` | `#FFFFFF` | Cards, panels, modals |
| `--border` | `#E2E8F0` | Card borders, dividers |
| `--text-primary` | `#1E293B` | Main headings, body text |
| `--text-secondary` | `#64748B` | Subtitles, metadata, labels |
| `--text-muted` | `#94A3B8` | Placeholder, disabled states |

**Keyboard colors:**
| State | Color |
|-------|-------|
| Default key | `#F1F5F9` background, `#334155` text |
| Next key (highlight) | `#2563EB` background, white text + subtle glow |
| Correct (just pressed) | `#10B981` flash |
| Wrong (just pressed) | `#EF4444` flash |

---

## 3. Typography

| Element | Font | Weight | Size |
|---------|------|--------|------|
| Logo / Brand | Inter | 800 | 24px |
| H1 (Hero) | Inter | 700 | 48px / 36px mobile |
| H2 (Section) | Inter | 700 | 32px / 24px mobile |
| H3 (Card titles) | Inter | 600 | 20px |
| Body | Inter | 400 | 16px |
| Small / Meta | Inter | 400 | 14px |
| Typing target text (English) | `'Courier Prime', monospace` | 400 | 20px desktop, 16px mobile |
| Typing target text (Urdu) | `'Noto Nastaliq Urdu', serif` | 400 | 24px desktop, 20px mobile |
| Stats (WPM numbers) | Inter | 700 | 32px |

**Google Fonts imports:** Inter (100-900), Courier Prime (400,700), Noto Nastaliq Urdu (400,700).

---

## 4. Layout & Grid

- Max content width: **1280px**, centered.
- Side padding: `16px` mobile, `32px` tablet, `64px` desktop.
- Section vertical spacing: `80px` desktop, `48px` mobile.
- Card padding: `24px` desktop, `16px` mobile.
- Grid: 12-column CSS Grid for complex layouts; Flexbox for components.

---

## 5. Component Specifications

### 5.1 Navbar
- **Height:** 64px
- **Background:** White, `box-shadow: 0 1px 3px rgba(0,0,0,0.1)`
- **Sticky:** Yes (scrolls with page but stays on top)
- **Logo:** "Inspire Typing" in `--primary` color with keyboard icon
- **Nav links:** Inter 500, `--text-secondary`; active/hover → `--primary`
- **Language selector:** Dropdown pill — "🌐 English ▼"
- **CTA buttons:** "Login" (outlined) + "Sign Up" (filled primary)
- **Mobile:** Hamburger menu → full-screen slide-in nav

### 5.2 Hero Section
- Background: Soft gradient — `linear-gradient(135deg, #EFF6FF 0%, #F8FAFC 100%)`
- Left: Headline + subtext + 2 CTA buttons
- Right: Animated illustration (keyboard/typing visual)
- Mobile: Stacked, illustration below text

### 5.3 Typing Area
```
╔══════════════════════════════════════════════════════╗
║  [ Stats Bar: WPM | CPM | Accuracy | Mistakes | ⏱️ ] ║
╠══════════════════════════════════════════════════════╣
║                                                      ║
║  The quick brown fox jumps over the lazy dog.        ║
║  ───────────────────────────────────────────         ║
║  Gray = untyped | Green = correct | Red = wrong      ║
║                                                      ║
╚══════════════════════════════════════════════════════╝
```
- Background: White, `border: 1px solid --border`, `border-radius: 12px`
- Text area: `font-family: 'Courier Prime'` (English) or `'Noto Nastaliq Urdu'` (Urdu)
- Text displayed in 3 lines maximum (scrolls to current line)
- Cursor: blinking `|` in `--primary` color
- Font size: 20px
- Line height: 1.8 (comfortable reading + identifying characters)
- Urdu text: `dir="rtl"`, right-aligned, Nastaliq font

### 5.4 On-Screen Keyboard
- Full QWERTY layout in SVG/HTML
- Rows: Number row + 3 letter rows + Space bar
- Key size: `48px × 48px` (larger keys for special keys)
- `border-radius: 6px`, subtle `box-shadow`
- Next key animation: `transform: translateY(-2px)` + blue background + glow effect
- Mobile: scaled down (80% size), still usable
- For Urdu: Urdu character shown in top-right corner of each key (smaller font)
- Toggle button: "⌨️ Show/Hide Keyboard"

### 5.5 Stats Bar
```
[ ⚡ 45 WPM ] [ 🔤 225 CPM ] [ 🎯 96% ] [ ❌ 2 ] [ ⏱️ 2:34 ]
```
- Cards with icon + number + label
- Numbers animate (count-up) for first reveal
- WPM/CPM: `font-weight: 700`, `font-size: 28px`
- Background: White cards, blue accent border on bottom

### 5.6 Buttons

| Variant | Style |
|---------|-------|
| Primary | `bg-primary`, white text, `border-radius: 8px`, hover: darken + subtle scale |
| Secondary | White bg, `border: 2px solid --primary`, primary text |
| Ghost | No border/bg, `--text-secondary`, hover: light gray bg |
| Danger | `bg-error`, white text |
| Disabled | `opacity: 0.5`, `cursor: not-allowed` |
| Icon button | 40px circle, icon centered |

All buttons: `padding: 10px 20px`, `font-weight: 600`, `font-size: 15px`, transition 150ms.

### 5.7 Cards
- Background: White
- Border: `1px solid --border`
- Border-radius: `12px`
- Box-shadow: `0 1px 3px rgba(0,0,0,0.08)`
- Hover (interactive cards): `box-shadow: 0 4px 12px rgba(37,99,235,0.12)`

### 5.8 Badge Component
- Circular badge: 80px × 80px
- Earned: Full color icon + name below
- Locked: Grayscale + 🔒 overlay
- Tooltip on hover: badge description + how to earn

### 5.9 Result Modal
- Overlay: `rgba(0,0,0,0.5)` backdrop
- Modal: White, `border-radius: 16px`, `max-width: 480px`
- Sections: Performance title (e.g., "Great job! 🎉") + stats grid + action buttons
- If badge earned: animated badge popup before result modal

### 5.10 Certificate
- A4 landscape orientation
- Blue gradient border frame
- Logo centered top
- "Certificate of Achievement" in serif heading
- User name prominent (32px bold)
- Achievement text, WPM, date
- Official seal/badge graphic

---

## 6. Responsive Behavior

| Breakpoint | Width | Behavior |
|------------|-------|----------|
| Mobile | < 640px | Single column; hamburger nav; keyboard scaled to 80%; stats bar scrollable horizontal |
| Tablet | 640–1024px | 2-column layouts; full keyboard visible |
| Desktop | > 1024px | Full layout; keyboard full size |

---

## 7. Animations & Transitions

| Element | Animation |
|---------|-----------|
| Page transitions | Fade in (200ms opacity) |
| Key press | Scale down (95%) + color flash → restore (100ms) |
| Character highlight | Instant color change (no delay — critical for feel) |
| Stats update (WPM) | Smooth number transition (150ms) |
| Badge earned | Bounce-in pop + confetti burst (3-second show) |
| Modal open/close | Scale + fade (200ms) |
| Leaderboard rank change | Slide + highlight |
| Result reveal | Staggered stat cards fade-in (100ms each) |

---

## 8. Accessibility

- All interactive elements have ARIA labels.
- Color contrast: minimum 4.5:1 for normal text, 3:1 for large text.
- Keyboard navigation: full tab support; focus visible outlines.
- Screen reader support: typing area announces progress periodically.
- Reduced motion: `@media (prefers-reduced-motion)` disables animations.

---

## 9. Icon Direction

- Icon library: **Lucide React** (clean, consistent, open-source).
- Urdu keyboard icon: Custom SVG (shows Arabic/Urdu characters on keys).
- Badge icons: Custom SVG icons per badge (or emoji-based for MVP).
- Logo: Keyboard icon + "Inspire Typing" text in `--primary`.
- No heavy icon packs — keep bundle lean.

---

## 10. Dark Mode (Future / Optional)

Not in v1 scope. CSS variables (`--background`, `--surface`, etc.) are structured to support dark mode override in a future update. No implementation in v1.
