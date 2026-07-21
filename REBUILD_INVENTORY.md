# ToolShare Rebuild — Inventory

## Stays completely as-is (do not touch, do not rebuild)

- **Supabase project itself** — same URL/keys in `.env.local`, same tables, same data
- `schema.sql`, `storage_policies.sql` — the actual database schema and RLS policies
- `seed.mjs` — dev seeding script
- `src/lib/supabaseClient.ts` — the Supabase connection helper (framework-agnostic, no styling)
- `src/lib/filterItems.ts` + `src/lib/filterItems.test.ts` — pure filtering logic, no UI
- `tests/rls.test.ts` — tests the database, not the frontend
- `.github/workflows/ci.yml` — CI pipeline (may need the `test` script path double-checked once file structure changes)
- `.env.local` / `.env.local.example`

## Needs to be rebuilt (new design, same underlying behavior)

For each page below, the **visual design is 100% up for reinvention** — but the functional requirements next to it must still work the same way in the new version.

### Auth
- **Signup** — email/password via Supabase Auth → redirect to complete-profile
- **Login** — email/password → check if `residents.name` is filled in → redirect to complete-profile (if empty) or homepage
- **Complete profile** — collects name, apartment number, phone; updates the resident's own row

### Homepage
- Redirect to `/login` if not authenticated
- Fetch all items, joined with owner's name + apartment number
- Search (matches title, case-insensitive) + category filter, combinable — reuse `filterItems()` as-is
- Split into two sections: requests ("Looking for") vs offers ("Available to borrow")
- Category icon row, clicking toggles the filter (click again to clear)

### List an item
- Toggle between "offer" (lending) and "request" (looking for)
- Offer-only fields: condition, photo upload
- Photo uploads to Supabase Storage (`item-photos` bucket, path `{user_id}/{filename}`)
- Inserts into `items` with correct `owner_id`, `listing_type`

### Item detail
- Shows full listing info; wording changes based on `listing_type` ("Owned by" vs "Requested by")
- If viewing your own item: show Edit/Delete instead of a borrow form
- If viewing someone else's: show a message form → "Request to borrow"
- **Conversation dedup logic**: check for an existing conversation between this requester + this item before creating a new one
- Delete requires confirmation

### Edit item
- Pre-fills existing values
- Owner-only (redirect away if the viewer isn't `owner_id` — UI-level check; RLS is the real enforcement)
- Can replace the photo; keeps existing photo if none is re-uploaded

### Messages list
- Lists all conversations the current user is part of (as either requester or owner)
- Shows the *other* person's name, and which item the conversation is about

### Message thread
- Shows all messages in order, styled distinctly by sender (mine vs theirs)
- Send a new message, appends to the list without a full reload

### My listings
- Shows only items where `owner_id` = current user

## Accessibility / quality bar to preserve
- Real `<label>` elements tied to every form input (not placeholder-only)
- `aria-label`s on the search bar and message input
- Internal navigation via `<Link>`, not raw `<a>`
- Buttons show `cursor-pointer` + hover feedback

## Known limitations, still true after rebuild
- Signup is open to anyone (no invite/approval system)
- No real-time message updates (refresh to see new replies)
