# Construction Reporting App

Minimal modular multi-page app for construction works reporting.

## Tech Stack
- Vite + Vanilla JS (ES modules)
- Bootstrap 5
- Supabase (`@supabase/supabase-js`)

## Run Locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Create local env file:
   ```bash
   copy .env.example .env
   ```
   Or manually create `.env` with:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
3. Start dev server:
   ```bash
   npm run dev
   ```
4. Build for production:
   ```bash
   npm run build
   ```

## Routes
- `/` Home
- `/login` Login
- `/register` Register
- `/dashboard` Dashboard
- `/projects` Projects list
- `/projects/:id` Project details
- `/projects/:id/admin` Project admin

## Auth (Current Scaffold)
- Login form calls Supabase `signInWithPassword`.
- Register form calls Supabase `signUp` with `full_name` metadata.
- Navbar auth area is dynamic:
  - Signed out: shows `Login` / `Register`
  - Signed in: shows user email + `Logout`
  - Missing env config: shows `Auth not configured`

## Project Structure
- `src/pages` page modules
- `src/router` client-side routing
- `src/shared` shared layout/page shell
- `src/features/auth` auth UI handlers and nav rendering
- `src/lib/supabaseClient.js` Supabase client init
- `src/services/authService.js` auth service wrappers

## Notes
- Keep `.env` private. Do not commit private keys.
- Use Supabase migrations for DB schema changes.
