# Welcome to Irshad-Hub Project

## Project info

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Seed an Admin User

You can seed or update an admin account in Supabase using the provided scripts. This requires the Supabase Service Role key (server-side secret).

Environment variables required:

```sh
export SUPABASE_URL="https://YOUR_PROJECT_REF.supabase.co"
export SUPABASE_SERVICE_ROLE_KEY="YOUR_SERVICE_ROLE_KEY"
```

Run with Node (portable):

```sh
# Show usage
node scripts/seed-admin.mjs --help

# Create or update admin
node scripts/seed-admin.mjs --email admin@example.com --password "StrongPassword123!" --name "Site Admin"

# Dry-run preview
node scripts/seed-admin.mjs --email admin@example.com --password "StrongPassword123!" --name "Site Admin" --dry-run
```

Or, if you use Bun:

```sh
# Using the Bun script directly
bun run scripts/seed-admin.ts -- --email admin@example.com --password "StrongPassword123!" --name "Site Admin"

# Or via package script
bun run seed:admin -- --email admin@example.com --password "StrongPassword123!" --name "Site Admin"
```

Package script (Node fallback):

```sh
npm run seed:admin:node -- --email admin@example.com --password "StrongPassword123!" --name "Site Admin"
```

Notes:
- The script will create the user (or reuse an existing one), upsert the `profiles` record with `full_name`, and upsert `user_roles` with `role = "admin"`.
- Keep your `SUPABASE_SERVICE_ROLE_KEY` secret. Do not expose it to client-side code or commit it to version control.
- You can set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_NAME` env vars instead of passing flags.



