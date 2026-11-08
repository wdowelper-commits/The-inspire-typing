# 01 — Product Requirements Document (PRD)
## Project: Inspire Typing

---

## 1. Project Overview

**Product Name:** Inspire Typing  
**Tagline:** Type Faster. Work Smarter. In English & Urdu.  
**Purpose:** A free, web-based typing tutor platform where general public (students, job seekers, freelancers, professionals) can learn and improve their typing speed and accuracy in both **English** and **Urdu** (Phonetic + Standard keyboard layouts).  
**Primary Goal:** Provide a world-class, structured typing learning experience similar to Typing.com but with full Urdu support — all accessible without mandatory registration.

---

## 2. Target Users

| User Type | Description |
|-----------|-------------|
| **Guest User** | Visits without login — can practice lessons and take tests; progress is NOT saved |
| **Registered User** | Creates a free account — progress, achievements, leaderboard rank, and certificates are saved |
| **Admin** | Manages site content, lessons, user reports, and platform settings |

---

## 3. User Roles & Permissions

| Feature | Guest | Registered | Admin |
|---------|-------|------------|-------|
| Take typing lessons | ✅ | ✅ | ✅ |
| Take typing tests (1m/2m/3m/5m/10m) | ✅ | ✅ | ✅ |
| Save progress & history | ❌ | ✅ | ✅ |
| Earn badges & achievements | ❌ | ✅ | ✅ |
| View leaderboard | ✅ | ✅ | ✅ |
| Download certificate | ❌ | ✅ | ✅ |
| View personal dashboard | ❌ | ✅ | ✅ |
| Manage lessons/content | ❌ | ❌ | ✅ |
| View all users & stats | ❌ | ❌ | ✅ |
| Manage badges & certificates | ❌ | ❌ | ✅ |

---

## 4. Core Features

### 4.1 Language Selection
- User can choose **English** or **Urdu** mode from home page or nav bar.
- For Urdu, user can further select keyboard layout: **Phonetic** or **Standard (Nastaliq)**.
- Selected language/layout persists in user session/localStorage.

### 4.2 Typing Lessons
- Lessons organized in **numbered format** (Lesson 1 → 1.1, 1.2, 1.3 | Lesson 2 → 2.1, 2.2, 2.3 ... up to Lesson 12).
- **English:** 12 lessons × 3 sub-lessons = 36 sub-lessons total.
- **Urdu Phonetic:** 12 lessons × 3 sub-lessons = 36 sub-lessons total.
- **Urdu Standard:** 12 lessons × 3 sub-lessons = 36 sub-lessons total.
- Each sub-lesson has:
  - Target text to type (displayed word by word or character by character).
  - Real-time WPM, CPM, Accuracy, Mistake counter.
  - On-screen animated keyboard showing next key to press.
  - Color-coded feedback: correct = green highlight, wrong = red highlight.
  - Timer (default 5 minutes per lesson, non-strict — just informational).
  - Completion screen: stats + "Next Lesson" button + badge if milestone reached.

### 4.3 Typing Tests
- Available for both English and Urdu.
- Durations: **1 min, 2 min, 3 min, 5 min, 10 min**.
- During test:
  - Random paragraph displayed.
  - Timer countdown.
  - Real-time WPM, CPM, Accuracy, Mistakes shown live.
  - No backspace after leaving a word (strict mode — same as standard typing tests).
- After test:
  - Results screen: Time, WPM, CPM, Accuracy %, Mistakes, Characters typed.
  - Option to retry, share result, or download certificate (registered users only).
  - Result saved to history (registered users).

### 4.4 On-Screen Keyboard
- Visual keyboard displayed below typing area.
- Highlights the **next key** to press in real time.
- For Urdu: shows Urdu character mapping on each key.
- For Phonetic: shows phonetic mapping.
- For Standard: shows standard Nastaliq mapping.
- Toggle to hide/show keyboard (user preference).

### 4.5 User Dashboard (Registered Users)
- Personal stats overview: Total lessons completed, average WPM, best WPM, best accuracy.
- **Progress charts:** WPM over time (line graph), accuracy over time.
- **Lesson progress:** Which lessons completed, which pending.
- **Test history:** All past tests with date, duration, language, WPM, accuracy.
- **Badges earned** section.
- **Certificate download** section.

### 4.6 Leaderboard
- Global leaderboard: Top 50 users ranked by best WPM.
- Filters: English / Urdu / All languages; 1min / 5min / 10min test duration.
- Shows: Rank, Username (or display name), WPM, Accuracy, Date.
- Visible to both guests and registered users.

### 4.7 Badges & Achievements
- Awarded to registered users on milestones:

| Badge Name | Trigger |
|------------|---------|
| First Keystroke | Complete first lesson |
| Speed Demon | Reach 40 WPM |
| Fast Fingers | Reach 60 WPM |
| Typing Pro | Reach 80 WPM |
| Accuracy Master | Achieve 98%+ accuracy in any test |
| Urdu Maestro | Complete all Urdu lessons |
| English Expert | Complete all English lessons |
| 7-Day Streak | Log in and practice 7 days in a row |
| 30-Day Streak | Log in and practice 30 days in a row |
| Century Club | Complete 100 typing tests |

### 4.8 Certificates
- Downloadable PDF certificate for registered users who:
  - Complete a full lesson track (English / Urdu Phonetic / Urdu Standard), OR
  - Achieve a specified WPM threshold in a timed test (e.g., 30+ WPM, 50+ WPM, 70+ WPM).
- Certificate includes: User name, achievement, WPM, date, Inspire Typing logo/seal.
- Generated client-side (HTML-to-canvas or jsPDF).

### 4.9 Authentication
- **Sign Up:** Email + password OR Google OAuth.
- **Login:** Email + password OR Google OAuth.
- **Guest mode:** Full access to lessons and tests WITHOUT login; no progress saved.
- **Prompt to register:** After completing a lesson/test as guest, a non-intrusive prompt "Save your progress — sign up free" appears.
- **Password reset** via email.

### 4.10 Admin Panel
- Accessible at `/admin` route (admin role only).
- **Dashboard:** Total users, active users today, total tests taken, total lessons completed, top WPM scores.
- **Lesson Manager:** View, edit lesson text content; add/remove sub-lessons; reorder lessons.
- **User Manager:** View all users, see their stats, disable/enable accounts.
- **Badge Manager:** Create/edit badge definitions and trigger rules.
- **Leaderboard Manager:** Reset leaderboard, remove spam/fake entries.
- **Site Settings:** Maintenance mode toggle, announcement banner text.

---

## 5. Business Rules

1. Guest users cannot save progress, earn badges, or download certificates.
2. Leaderboard only includes registered users.
3. Lessons are freely accessible (no paywall).
4. Admin account is seeded at database setup (not creatable via public signup).
5. No ads, no paid plans — fully free public platform.
6. Urdu keyboard layout preference is saved per user (or in localStorage for guests).
7. A user can retake any lesson or test unlimited times.
8. Certificates are generated on-demand; not stored as files in Supabase storage.
9. Backspace is tracked as a mistake in test mode (strict typing test standard).
10. WPM calculation: (Characters typed correctly / 5) / minutes elapsed.

---

## 6. Non-Functional Requirements

| Requirement | Detail |
|-------------|--------|
| **Performance** | Page load < 2s; typing engine latency < 50ms |
| **Responsiveness** | Fully responsive — desktop, tablet, mobile |
| **Accessibility** | ARIA labels on interactive elements; keyboard navigable |
| **Browser Support** | Chrome, Firefox, Safari, Edge (latest 2 versions) |
| **Language Support** | English UI + Urdu RTL text rendering (Noto Nastaliq Urdu font) |
| **Security** | Auth via Supabase; no plaintext passwords; RLS on all tables |
| **Uptime** | Cloudflare Pages CDN — high availability |

---

## 7. Scope & Exclusions

**In Scope:**
- English + Urdu typing lessons and tests
- Guest + registered user experience
- Badges, leaderboard, certificates, dashboard
- Admin panel
- Phonetic + Standard Urdu keyboard layouts

**Out of Scope (v1):**
- Mobile app (iOS/Android)
- Paid/premium plans
- Multi-language UI (UI is in English; Urdu typing content is Urdu)
- Teacher/classroom management portal
- Social features (friends, challenges)
- Offline mode
