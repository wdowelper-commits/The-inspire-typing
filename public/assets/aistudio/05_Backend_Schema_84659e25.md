# 05 — Backend Schema Document
## Project: Inspire Typing

> **Important Note:** This document is a planning document only.
> The actual Supabase project, tables, and database will be created later by **ChatGPT using the Supabase plugin**, based on this schema and the actual codebase in GitHub.

---

## 1. Supabase Auth

Using **Supabase built-in Auth** (`auth.users` table managed by Supabase).

Providers enabled:
- Email + Password
- Google OAuth

---

## 2. Tables

### 2.1 `profiles`

Extends `auth.users`. Created automatically via trigger when a new user signs up.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, FK → `auth.users.id` ON DELETE CASCADE | Matches Supabase auth user ID |
| `display_name` | `text` | NOT NULL | User's display name |
| `email` | `text` | NOT NULL | User's email (copied from auth) |
| `avatar_url` | `text` | NULLABLE | URL to profile picture in Supabase Storage |
| `user_role` | `text` | NOT NULL, DEFAULT `'user'` | `'user'` or `'admin'` |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Account creation time |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Last profile update |

**Indexes:** `id` (PK), `user_role`

---

### 2.2 `lessons`

Stores all lesson definitions (metadata only — text content in `lesson_texts`).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | Unique lesson ID |
| `language` | `text` | NOT NULL | `'english'`, `'urdu-phonetic'`, `'urdu-standard'` |
| `lesson_number` | `integer` | NOT NULL | 1–12 |
| `sub_lesson_number` | `integer` | NOT NULL | 1–3 |
| `lesson_code` | `text` | NOT NULL, UNIQUE | e.g. `'english-1-1'`, `'urdu-phonetic-3-2'` |
| `title` | `text` | NOT NULL | e.g. "Home Row Keys" |
| `description` | `text` | NULLABLE | Brief description of what this lesson covers |
| `sort_order` | `integer` | NOT NULL | For ordering display |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `id` (PK), `lesson_code` (UNIQUE), `(language, lesson_number, sub_lesson_number)` (UNIQUE)

---

### 2.3 `lesson_texts`

Stores the actual typing text content for each lesson.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `lesson_id` | `uuid` | NOT NULL, FK → `lessons.id` ON DELETE CASCADE | |
| `content` | `text` | NOT NULL | The typing text for this lesson |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `lesson_id`

---

### 2.4 `test_paragraphs`

Random paragraphs used for typing tests.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `language` | `text` | NOT NULL | `'english'`, `'urdu-phonetic'`, `'urdu-standard'` |
| `content` | `text` | NOT NULL | The paragraph text |
| `word_count` | `integer` | NOT NULL | For selecting appropriate length paragraphs |
| `difficulty` | `text` | NOT NULL, DEFAULT `'medium'` | `'easy'`, `'medium'`, `'hard'` |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `language`, `(language, difficulty)`

---

### 2.5 `lesson_progress`

Tracks registered users' completion of each sub-lesson.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE | |
| `lesson_id` | `uuid` | NOT NULL, FK → `lessons.id` ON DELETE CASCADE | |
| `completed` | `boolean` | NOT NULL, DEFAULT `false` | |
| `best_wpm` | `integer` | NULLABLE | Best WPM achieved in this lesson |
| `best_accuracy` | `numeric(5,2)` | NULLABLE | Best accuracy % in this lesson |
| `attempts` | `integer` | NOT NULL, DEFAULT `0` | Number of times attempted |
| `last_attempted_at` | `timestamptz` | NULLABLE | |
| `completed_at` | `timestamptz` | NULLABLE | First time completed |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `user_id`, `lesson_id`, `(user_id, lesson_id)` (UNIQUE)

---

### 2.6 `test_results`

Stores all typing test results for registered users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE | |
| `language` | `text` | NOT NULL | `'english'`, `'urdu-phonetic'`, `'urdu-standard'` |
| `duration_seconds` | `integer` | NOT NULL | 60, 120, 180, 300, 600 |
| `wpm` | `integer` | NOT NULL | Words per minute |
| `cpm` | `integer` | NOT NULL | Characters per minute |
| `accuracy` | `numeric(5,2)` | NOT NULL | Accuracy percentage |
| `mistakes` | `integer` | NOT NULL | Number of mistakes |
| `characters_typed` | `integer` | NOT NULL | Total characters typed |
| `completed_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | Test completion timestamp |

**Indexes:** `user_id`, `(language, wpm DESC)` for leaderboard queries, `completed_at`

---

### 2.7 `badges`

Badge definitions (managed by admin).

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `name` | `text` | NOT NULL, UNIQUE | e.g. "Speed Demon" |
| `description` | `text` | NOT NULL | Display description |
| `icon_name` | `text` | NOT NULL | Lucide icon name or emoji identifier |
| `trigger_type` | `text` | NOT NULL | `'wpm_threshold'`, `'lesson_complete_all'`, `'streak_days'`, `'tests_count'`, `'accuracy_threshold'` |
| `trigger_value` | `integer` | NOT NULL | e.g. 40 (for 40 WPM), 7 (for 7-day streak) |
| `trigger_language` | `text` | NULLABLE | NULL = any language; `'urdu-phonetic'` = Urdu only, etc. |
| `created_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `id` (PK), `trigger_type`

**Seed data:**
```
| Name               | trigger_type           | trigger_value | trigger_language |
|--------------------|------------------------|---------------|-----------------|
| First Keystroke    | lesson_complete_all    | 1             | NULL            |
| Speed Demon        | wpm_threshold          | 40            | NULL            |
| Fast Fingers       | wpm_threshold          | 60            | NULL            |
| Typing Pro         | wpm_threshold          | 80            | NULL            |
| Accuracy Master    | accuracy_threshold     | 98            | NULL            |
| Urdu Maestro       | lesson_complete_all    | 36            | urdu-phonetic   |
| English Expert     | lesson_complete_all    | 36            | english         |
| 7-Day Streak       | streak_days            | 7             | NULL            |
| 30-Day Streak      | streak_days            | 30            | NULL            |
| Century Club       | tests_count            | 100           | NULL            |
```

---

### 2.8 `user_badges`

Tracks which badges each registered user has earned.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE | |
| `badge_id` | `uuid` | NOT NULL, FK → `badges.id` ON DELETE CASCADE | |
| `earned_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `user_id`, `(user_id, badge_id)` (UNIQUE)

---

### 2.9 `user_streaks`

Tracks login/practice streaks for registered users.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK, DEFAULT `gen_random_uuid()` | |
| `user_id` | `uuid` | NOT NULL, FK → `profiles.id` ON DELETE CASCADE, UNIQUE | |
| `current_streak` | `integer` | NOT NULL, DEFAULT `0` | Current consecutive days |
| `longest_streak` | `integer` | NOT NULL, DEFAULT `0` | All-time best streak |
| `last_active_date` | `date` | NULLABLE | Last date user practiced |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

**Indexes:** `user_id` (UNIQUE)

---

### 2.10 `site_settings`

Key-value store for admin-managed site settings.

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `key` | `text` | PK | Setting key e.g. `'maintenance_mode'`, `'announcement_text'` |
| `value` | `text` | NULLABLE | Setting value |
| `updated_at` | `timestamptz` | NOT NULL, DEFAULT `now()` | |

---

## 3. Relationships Diagram

```
auth.users (Supabase)
    │
    └──► profiles (1:1)
              │
              ├──► lesson_progress (1:many) ──► lessons (1:1)
              │                                     └──► lesson_texts (1:1)
              ├──► test_results (1:many)
              ├──► user_badges (1:many) ──► badges (1:1)
              └──► user_streaks (1:1)

test_paragraphs (standalone — no FK to users)
site_settings (standalone — admin only)
```

---

## 4. Row Level Security (RLS) Policies

### `profiles`
| Policy | Type | Condition |
|--------|------|-----------|
| Users read own profile | SELECT | `auth.uid() = id` |
| Users update own profile | UPDATE | `auth.uid() = id` |
| Admins read all profiles | SELECT | `(SELECT user_role FROM profiles WHERE id = auth.uid()) = 'admin'` |

### `lessons` + `lesson_texts`
| Policy | Type | Condition |
|--------|------|-----------|
| Anyone can read lessons | SELECT | `true` (public read) |
| Only admins can insert/update/delete | ALL | `(SELECT user_role FROM profiles WHERE id = auth.uid()) = 'admin'` |

### `test_paragraphs`
| Policy | Type | Condition |
|--------|------|-----------|
| Anyone can read | SELECT | `true` (public read) |
| Only admins can modify | ALL | admin check |

### `lesson_progress`
| Policy | Type | Condition |
|--------|------|-----------|
| Users read own progress | SELECT | `auth.uid() = user_id` |
| Users insert own progress | INSERT | `auth.uid() = user_id` |
| Users update own progress | UPDATE | `auth.uid() = user_id` |
| Admins read all | SELECT | admin check |

### `test_results`
| Policy | Type | Condition |
|--------|------|-----------|
| Users read own results | SELECT | `auth.uid() = user_id` |
| Users insert own results | INSERT | `auth.uid() = user_id` |
| Public read for leaderboard | SELECT | `true` (needed for leaderboard; select only wpm, accuracy, language, user_id, completed_at — not sensitive) |
| Admins read all | SELECT | admin check |

### `badges`
| Policy | Type | Condition |
|--------|------|-----------|
| Anyone can read | SELECT | `true` |
| Only admins can modify | ALL | admin check |

### `user_badges`
| Policy | Type | Condition |
|--------|------|-----------|
| Users read own badges | SELECT | `auth.uid() = user_id` |
| System can insert (via service role) | INSERT | Service role only |
| Public read (for leaderboard profile) | SELECT | `true` |

### `user_streaks`
| Policy | Type | Condition |
|--------|------|-----------|
| Users read/update own streak | ALL | `auth.uid() = user_id` |

### `site_settings`
| Policy | Type | Condition |
|--------|------|-----------|
| Anyone can read | SELECT | `true` |
| Only admins can modify | ALL | admin check |

---

## 5. Database Functions & Triggers

### Trigger: `on_auth_user_created`
- **When:** After INSERT on `auth.users`
- **Action:** Create matching row in `profiles` with `display_name` from metadata, `email`, `user_role = 'user'`
- **Also:** Create row in `user_streaks` for the new user

```sql
-- Function: handle_new_user()
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email, user_role)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)),
    new.email,
    'user'
  );
  INSERT INTO public.user_streaks (user_id) VALUES (new.id);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### Function: `update_updated_at_column()`
- Generic trigger function to auto-update `updated_at` on row modification.
- Applied to: `profiles`, `lesson_texts`, `user_streaks`, `site_settings`.

---

## 6. Storage Buckets

| Bucket Name | Access | Purpose |
|-------------|--------|---------|
| `avatars` | Private (user owns their own files) | User profile pictures |

**Storage Policies for `avatars`:**
- Users can upload to path `{user_id}/avatar.*`
- Users can read their own avatar
- Public read for displaying in leaderboard (optional — can be a signed URL)

---

## 7. Admin Account Setup

- Admin user created manually in Supabase Auth (via Supabase Dashboard or SQL seed).
- After creation, `profiles.user_role` set to `'admin'` via SQL update.
- **Never creatable through the public signup form.**

```sql
-- After creating admin in Supabase Auth dashboard:
UPDATE public.profiles SET user_role = 'admin' WHERE email = 'admin@inspirertyping.com';
```

---

## 8. Leaderboard Query

The leaderboard is computed from `test_results` with a JOIN to `profiles`:

```sql
SELECT
  p.display_name,
  p.avatar_url,
  tr.language,
  tr.duration_seconds,
  tr.wpm,
  tr.accuracy,
  tr.completed_at,
  RANK() OVER (
    PARTITION BY tr.language, tr.duration_seconds
    ORDER BY tr.wpm DESC, tr.accuracy DESC
  ) as rank
FROM test_results tr
JOIN profiles p ON tr.user_id = p.id
WHERE tr.language = $language  -- optional filter
  AND tr.duration_seconds = $duration  -- optional filter
ORDER BY tr.wpm DESC
LIMIT 50;
```
