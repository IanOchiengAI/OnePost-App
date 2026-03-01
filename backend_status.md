# OnePost Backend Status 🚀

The backend infrastructure for Phase 1 is ready for the Frontend team.

## Supabase Configuration

- **Project URL:** (Set in `.env`)
- **Anon Key:** (Set in `.env`)

## Database Schema (Tables)

- `profiles`: User profiles linked to `auth.users`.
- `posts`: Main post table with `media_urls` (JSONB) and scheduling.
- `hashtag_groups`: User-defined hashtag sets.
- `social_accounts`: Stored credentials for linked social platforms.

## Authentication

- Handled via `services/authService.ts`.
- Methods: `signUp`, `signIn`, `signOut`, `onAuthStateChange`.

## Token Storage & Encryption (Phase 2)

- `social_accounts` now includes `is_encrypted` (boolean) and `key_id` (uuid) fields.
- **API Whisperer Note:** Handle encryption/decryption using Supabase `pgsodium` functions or the Vault API.

## Webhook Endpoints (Phase 2)

- **Meta Webhook:** `supabase/functions/meta-webhook/index.ts`
  - Implements verification logic and event logging.
- **TikTok Webhook:** `supabase/functions/tiktok-webhook/index.ts`
  - Implements event logging.

## Media Storage

- **Bucket Name:** `post-media`
- **Utility:** `services/storageService.ts` handles uploads.
- **Video Support:** Supports `.mp4` and `.mov` for TikTok and Reels.

## Analytics Pipeline (Phase 4)

- **Table:** `post_analytics` stores engagement metrics (reach, likes, etc.).
- **Worker:** `supabase/functions/analytics-sync/index.ts` syncs metrics daily via `pg_cron`.
- **Logic:** Uses `platform_post_ids` stored in the `posts` table to fetch platform-specific data.

## Automation Engine (Phase 3)

- **Publisher Edge Function:** `supabase/functions/publisher/index.ts`
  - Queries the database for posts with `status = 'scheduled'` and `scheduled_at <= NOW()`.
  - Automatically updates statuses and triggers publishing.
- **pg_cron Setup:**
  - Migration `20260301000003_cron_setup.sql` enables the required extensions.
  - Automation is designed to run once every 5 minutes.

## Analytics & Brand Voice (Phase 4)

- **Analytics Table:** `analytics_snapshots`
  - Stores time-series data for Reach, Engagement, and Likes.
  - Linked to `user_id` and optionally `post_id`.
- **Brand Voice:** `profiles` table now includes `brand_voice_prompt` (TEXT).
  - Use this to store and retrieve the custom AI persona for each user.

## Handoff Notes

- Run all SQL migrations in `supabase/migrations/`.
- Deploy edge functions: `supabase functions deploy publisher`, `supabase functions deploy meta-webhook`, `supabase functions deploy tiktok-webhook`.
- **CRITICAL:** To activate the cron job, run the `cron.schedule` command in `20260301000003_cron_setup.sql` using your specific Project Reference and Service Role Key.
- Ensure `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are correct for the frontend.
