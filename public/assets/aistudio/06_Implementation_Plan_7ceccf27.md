# 06 — Implementation Plan
## Project: Inspire Typing

> **Note for Google AI Studio:** This is an internal build execution plan.
> Build the entire website in ONE pass following this order.
> Do NOT ask for phase-by-phase prompts. Build everything described here completely.

---

## 1. Project Initialization

### 1.1 Vite + React + TypeScript Setup
```bash
npm create vite@latest inspire-typing -- --template react-ts
cd inspire-typing
npm install
```

### 1.2 Dependencies to Install
```bash
# Routing
npm install react-router-dom

# State management
npm install zustand

# Styling
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Supabase
npm install @supabase/supabase-js

# Charts
npm install recharts

# PDF/Certificate
npm install jspdf html2canvas

# Icons
npm install lucide-react

# Class utilities
npm install clsx tailwind-merge
```

### 1.3 Config Files

**`tailwind.config.js`** — extend with custom colors from Design Brief:
```js
// Colors: primary #2563EB, secondary #10B981, error #EF4444, etc.
// fontFamily: inter, courierPrime, notoNastaliqUrdu
```

**`index.html`** — Google Fonts preload:
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<!-- Inter, Courier Prime, Noto Nastaliq Urdu -->
```

**`.env.example`**:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

**`public/_redirects`**:
```
/* /index.html 200
```

**`.npmrc`** (repo root):
```
legacy-peer-deps=true
```

**`package.json`** — ensure:
```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  }
}
```

---

## 2. Build Order (AI Studio Internal Execution Plan)

### Phase A: Foundation & Design System

**A1. Tailwind + CSS Variables Setup**
- Configure `tailwind.config.js` with all custom colors as CSS variables.
- Set up `index.css` with base styles, Urdu font import, CSS custom properties.
- Ensure `--primary`, `--secondary`, `--error`, `--background`, etc. all defined.

**A2. Core UI Components (src/components/ui/)**
- `Button.tsx` — all variants (primary, secondary, ghost, danger) with size prop.
- `Input.tsx` — styled text input with label, error state.
- `Card.tsx` — reusable card wrapper.
- `Modal.tsx` — overlay modal with backdrop click dismiss.
- `Badge.tsx` — colored badge/chip component.
- `Spinner.tsx` — loading spinner.
- `Toast.tsx` — notification toast (success/error/info).
- `Avatar.tsx` — circular user avatar with fallback initials.
- `Skeleton.tsx` — loading skeleton placeholder.
- `Tabs.tsx` — tab navigation component.

**A3. Layout Components (src/components/layout/)**
- `Navbar.tsx` — sticky navbar with logo, nav links, language selector, auth buttons.
  - Language selector dropdown (English / Urdu Phonetic / Urdu Standard).
  - Guest: Login + Sign Up buttons.
  - Logged in: Dashboard link + Avatar dropdown (Profile, Sign Out).
  - Mobile: Hamburger → slide-in menu.
- `Footer.tsx` — simple footer with links.
- `PageWrapper.tsx` — applies consistent padding/max-width/background.
- `ProtectedRoute.tsx` — redirects guest to `/login` with return URL.
- `AdminRoute.tsx` — redirects non-admin to home.

**A4. App Router Setup (App.tsx)**
- All routes defined (see TRD Section 4).
- `React.lazy` for all pages.
- `Suspense` with `Spinner` fallback.
- `ProtectedRoute` and `AdminRoute` wrappers applied.

---

### Phase B: Supabase Integration

**B1. Supabase Client (src/lib/supabase.ts)**
```typescript
import { createClient } from '@supabase/supabase-js';
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

**B2. Auth Store (src/stores/authStore.ts)**
- Zustand store: `user`, `session`, `loading`.
- `signIn(email, password)`, `signUp(email, password, displayName)`.
- `signInWithGoogle()`, `signOut()`.
- `useEffect` to listen to `supabase.auth.onAuthStateChange`.
- Fetch `profiles` row on auth state change to get `user_role` and `display_name`.

**B3. Settings Store (src/stores/settingsStore.ts)**
- Zustand + localStorage persistence.
- `language`: `'english'` | `'urdu-phonetic'` | `'urdu-standard'`.
- `showKeyboard`: boolean (default true).

**B4. TypeScript Types (src/types/index.ts)**
```typescript
interface Profile { id, display_name, email, avatar_url, user_role, created_at }
interface Lesson { id, language, lesson_number, sub_lesson_number, lesson_code, title, description, sort_order }
interface LessonText { id, lesson_id, content }
interface LessonProgress { id, user_id, lesson_id, completed, best_wpm, best_accuracy, attempts, last_attempted_at }
interface TestResult { id, user_id, language, duration_seconds, wpm, cpm, accuracy, mistakes, characters_typed, completed_at }
interface Badge { id, name, description, icon_name, trigger_type, trigger_value, trigger_language }
interface UserBadge { id, user_id, badge_id, earned_at }
interface UserStreak { id, user_id, current_streak, longest_streak, last_active_date }
interface TestParagraph { id, language, content, word_count, difficulty }
```

---

### Phase C: Lesson Data Seed Files

**C1. English Lessons Data (src/data/englishLessons.ts)**
- 36 sub-lessons (12 lessons × 3).
- Lesson 1 (1.1-1.3): Home row keys — asdf jkl;
- Lesson 2 (2.1-2.3): Top row keys — qwer uiop
- Lesson 3 (3.1-3.3): Bottom row keys — zxcv nm,./
- Lesson 4 (4.1-4.3): Capital letters + shift
- Lesson 5 (5.1-5.3): Numbers row
- Lesson 6 (6.1-6.3): Punctuation — . , ; : ' "
- Lesson 7 (7.1-7.3): Common words (the, and, that, have, for...)
- Lesson 8 (8.1-8.3): Short sentences
- Lesson 9 (9.1-9.3): Medium paragraphs
- Lesson 10 (10.1-10.3): Advanced vocabulary
- Lesson 11 (11.1-11.3): Numbers in context
- Lesson 12 (12.1-12.3): Full paragraphs — final speed test

**C2. Urdu Phonetic Lessons Data (src/data/urduPhoneticLessons.ts)**
- 36 sub-lessons covering Urdu characters systematically via phonetic layout.
- Group 1 (Lessons 1-3): Common Urdu letters (ا ب پ ت ٹ ث ج چ ح خ)
- Group 2 (Lessons 4-6): More letters (د ڈ ذ ر ڑ ز ژ س ش ص)
- Group 3 (Lessons 7-9): Advanced letters (ض ط ظ ع غ ف ق ک گ ل م)
- Group 4 (Lessons 10-12): Full Urdu words, sentences, paragraphs

**C3. Urdu Standard Lessons Data (src/data/urduStandardLessons.ts)**
- Same 36-lesson structure but for standard Nastaliq keyboard layout.
- Key mapping follows standard Urdu layout (not phonetic).

**C4. Test Paragraphs Data (src/data/testParagraphs.ts)**
- 20+ English paragraphs (varied length, easy/medium/hard)
- 20+ Urdu phonetic paragraphs
- 20+ Urdu standard paragraphs

---

### Phase D: Typing Engine

**D1. Core Hook (src/hooks/useTypingEngine.ts)**
```typescript
// Props: targetText, mode ('lesson' | 'test'), language
// Returns: typedText, currentIndex, mistakes, wpm, cpm, accuracy,
//          isStarted, isComplete, startTyping, resetEngine, getCharState(index)
//
// Logic:
// - keydown listener
// - In 'test' mode: backspace = mistake, word lock after space
// - In 'lesson' mode: backspace allowed
// - Urdu mode: handle RTL input composition events
// - WPM = (correctChars / 5) / elapsedMinutes
// - CPM = correctChars / elapsedMinutes  
// - Accuracy = (correctChars / (correctChars + mistakes)) * 100
```

**D2. Timer Hook (src/hooks/useTimer.ts)**
```typescript
// Props: initialSeconds, mode ('countdown' | 'countup'), onComplete callback
// Returns: timeLeft, timeElapsed, isRunning, start, pause, reset
```

**D3. Keyboard Hook (src/hooks/useKeyboard.ts)**
```typescript
// Props: targetText, currentIndex, language, layout
// Returns: nextPhysicalKey (the key to highlight on on-screen keyboard)
// Logic: maps next Unicode character in targetText to physical keyboard key
//        using urduKeyboardMap.ts for Urdu layouts
```

**D4. Urdu Keyboard Map (src/lib/urduKeyboardMap.ts)**
```typescript
// phoneticMap: { 'a': 'ا', 'b': 'ب', ... } — full phonetic mapping
// standardMap: { 'a': 'ا', 's': 'س', ... } — standard layout mapping
// reversePhoneticMap: { 'ا': 'a', ... } — for keyboard highlighting
// reverseStandardMap: { 'ا': 'a', ... }
```

---

### Phase E: Core Typing Components

**E1. TypingArea.tsx (src/components/typing/TypingArea.tsx)**
- Receives: `targetText`, `mode`, `language`
- Renders: Text display with per-character color coding.
- Hidden `<input>` or transparent overlay captures keystrokes.
- `dir="rtl"` and Nastaliq font for Urdu.
- Current position cursor (blinking).
- Calls `useTypingEngine`.

**E2. StatsBar.tsx**
- Displays: WPM, CPM, Accuracy%, Mistakes, Timer.
- Animated number transitions.

**E3. Keyboard.tsx**
- Full QWERTY layout rendered as HTML/CSS.
- Receives `nextKey` prop and `language` prop.
- Highlights the correct key with animation.
- Shows Urdu character mapping for Urdu modes.

**E4. ResultModal.tsx**
- Shows after lesson/test completion.
- Stats display: WPM, CPM, Accuracy, Mistakes, Time.
- Performance tier badge.
- Guest: Sign up prompt.
- Registered: Save result + badge check + certificate check.
- Buttons: Retry, Next Lesson (lesson mode), Try Again (test mode).

---

### Phase F: Pages

**F1. Home Page**
- Hero section with animated headline.
- Two CTA buttons: English Lessons, Urdu Lessons.
- Stats strip (fetch from Supabase: total test results count, etc.).
- Features grid.
- How it works (3 steps).
- Leaderboard preview (top 5, fetch from Supabase).
- Testimonial or info section.
- CTA to sign up.

**F2. Lessons Page (`/lessons/:language`)**
- Language tabs: English | Urdu Phonetic | Urdu Standard.
- Accordion lesson list (Lesson 1–12).
- Each sub-lesson row: title, completion status, last WPM.
- Fetch lesson list from Supabase `lessons` table.
- Fetch user progress from `lesson_progress` (if logged in).

**F3. Lesson Detail Page (`/lessons/:language/:lessonId`)**
- Fetch lesson text from `lesson_texts` by `lesson_code`.
- Full typing interface: StatsBar + TypingArea + Keyboard.
- Restart button.
- On complete: save to `lesson_progress` (if logged in), show ResultModal.
- Badge check on completion (compare progress stats to `badges` trigger rules).

**F4. Test Page (`/test`)**
- Settings bar: language selector + duration selector.
- "Start Test" button → load random paragraph from `test_paragraphs`.
- Full typing interface.
- On timer end: show results screen.
- Save to `test_results` (if logged in).
- Show leaderboard position (if logged in).
- Certificate button if WPM threshold met.

**F5. Leaderboard Page (`/leaderboard`)**
- Filter bar: language + duration.
- Fetch from Supabase leaderboard query (see Backend Schema).
- Table with rank, avatar, name, WPM, accuracy, language, date.
- Top 3 special styling.
- Pagination (25 per page).
- Guest: "Sign up to appear" CTA.

**F6. Auth Page (`/login` + `/signup`)**
- Tabbed: Login | Sign Up.
- Email/password form.
- Google OAuth button.
- Forgot password link.
- Redirect handling with `?redirect=` param.

**F7. Dashboard Page (`/dashboard`)**
- Protected route.
- Fetch: profile, test_results, lesson_progress, user_badges, user_streaks.
- Render: stats overview, WPM chart (Recharts), accuracy chart, lesson progress, recent tests, badges grid, certificates section.

**F8. Certificate Page (`/certificate/:type`)**
- Protected route.
- Uses `certificateGenerator.ts` to generate jsPDF certificate.
- Shows preview + download button.

**F9. 404 Page**
- Friendly message + "Go Home" button.

---

### Phase G: Admin Panel

**G1. Admin Layout**
- Sidebar with navigation: Dashboard, Users, Lessons, Badges.
- Mobile: collapsible sidebar.
- Admin role check guard (`AdminRoute.tsx`).

**G2. Admin Dashboard (`/admin`)**
- Summary cards: Total users, New today, Tests today, Lessons completed today.
- Fetch from Supabase with admin-level queries.

**G3. Admin Users (`/admin/users`)**
- Fetch all profiles (admin RLS policy).
- Table: email, name, role, join date, tests count, best WPM.
- Actions: Disable/enable, View.

**G4. Admin Lessons (`/admin/lessons`)**
- Accordion list of all lessons.
- Click → edit `lesson_texts.content` inline.
- Save → `supabase.from('lesson_texts').update(...)`.
- Add/remove sub-lesson functionality.

**G5. Admin Badges (`/admin/badges`)**
- List all badges.
- Form to add/edit badge: name, description, icon, trigger type/value.

---

### Phase H: Polish & QA

**H1. Loading States**
- All Supabase fetches: show Skeleton components.
- Page transitions: fade in.

**H2. Error States**
- Network errors: Toast notification.
- Empty states: Friendly messages with CTAs.

**H3. Guest Prompts**
- After lesson/test completion as guest: Modal "Save your progress — Sign Up Free".

**H4. Responsive Testing**
- All pages: mobile (375px), tablet (768px), desktop (1280px).
- Keyboard: scale on mobile.
- Urdu RTL: verify rendering on all breakpoints.

**H5. Performance**
- All page lazy loaded with React.lazy.
- Heavy libs (jsPDF, html2canvas, Recharts) lazy imported.

**H6. Final Checklist**
- [ ] `public/_redirects` present (`/* /index.html 200`)
- [ ] `.npmrc` present with `legacy-peer-deps=true`
- [ ] `package-lock.json` present (no bun.lock)
- [ ] No hardcoded Supabase keys — only `import.meta.env.VITE_SUPABASE_URL` etc.
- [ ] All routes work (no broken navigation)
- [ ] English typing: Courier Prime monospace font renders correctly
- [ ] Urdu typing: Noto Nastaliq Urdu font loads; RTL direction correct
- [ ] Phonetic keyboard map: all Urdu characters mapped
- [ ] Standard keyboard map: all Urdu characters mapped
- [ ] TypeScript: no `any` types; no TS errors
- [ ] `npm run build` completes without errors
- [ ] `dist/` folder generated
- [ ] All environment variables documented in `.env.example`

---

## 3. Data Architecture Note for AI Studio

**Lessons & Paragraphs:**
AI Studio should create complete, realistic lesson text content in `src/data/`:
- English lessons: actual typing practice text (home row, top row, common words, sentences).
- Urdu phonetic lessons: actual Urdu Unicode text appropriate for each lesson stage.
- Urdu standard lessons: actual Urdu Unicode text for standard keyboard layout.
- Test paragraphs: meaningful English + Urdu paragraphs (at least 5 per language per difficulty).

The Supabase code should be structured so this data can be seeded into the database later (but seeding itself happens after ChatGPT sets up Supabase).

---

## 4. Code Quality Standards

- TypeScript strict mode enabled.
- No `any` types.
- All components have proper prop types.
- Functions documented with JSDoc where complex.
- Consistent naming: camelCase functions/vars, PascalCase components, kebab-case files.
- Tailwind: no inline styles; all via className with Tailwind utilities.
- No unused imports.
- Error boundaries around typing engine component.
