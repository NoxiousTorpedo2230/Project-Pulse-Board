# PulseBoard

This is a minimal example project for the PulseBoard challenge:
- React 18 + Vite
- Tailwind CSS
- Supabase JS (Email OTP auth)
- Role-based UI: reads from `profiles.role` and shows admin controls

## Setup

1. Create Supabase project and run the SQL schema for `profiles`, `tickets`, `labels`, `tickets_labels`, `comments`.
2. Set environment variables in `.env`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```
3. Install and run:
```
npm install
npm run dev
```
