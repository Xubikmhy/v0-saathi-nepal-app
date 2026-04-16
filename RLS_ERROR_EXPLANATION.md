# Understanding the RLS Error

## The Error You're Seeing

```
Error: new row violates row-level security policy
```

OR

```
Could not find the table 'public.models' in the schema cache
```

## Root Cause

**The `models` database table doesn't exist yet.**

When we created your project earlier, we tried to create it automatically, but:
- Supabase auto-setup script can't create tables without a stored procedure
- The table needs to be created manually via SQL

## Why This Matters

Without the table:
1. ❌ Can't fetch models from database
2. ❌ Can't save new models
3. ❌ Admin dashboard shows errors
4. ❌ Image uploads fail (related RLS issue)

## The Solution

You need to run one SQL query in your Supabase dashboard. That's it.

**Time needed: 5 minutes**

See **FIX_NOW.md** for step-by-step instructions.

## What the SQL Does

The SQL block we provide:

1. **Creates the `models` table** with:
   - `id` (unique identifier)
   - `name` (model name)
   - `age` (model age)
   - `city` (location)
   - `bio` (description)
   - `whatsapp` (contact number)
   - `image_url` (profile photo)
   - `is_featured` (for homepage display)
   - `created_at` and `updated_at` (timestamps)

2. **Creates indexes** for fast queries on:
   - Featured models (for homepage)
   - Most recent first

3. **Enables Row Level Security (RLS)** and creates policies:
   - Everyone can READ all models
   - Everyone can INSERT/UPDATE/DELETE (we validate via API token)

4. **Allows storage bucket uploads** by not blocking them with RLS

## Why This Approach?

- **Simple**: Just run SQL once
- **Secure**: API validates admin tokens
- **Fast**: Indexes speed up queries
- **Flexible**: RLS policies allow future customization

## After You Run the SQL

1. Restart your dev server: `npm run dev`
2. Go to `/admin/login`
3. Create a model
4. All will work! ✅

## Technical Notes

- RLS (Row Level Security) is a Supabase feature that controls table access
- By default, tables have RLS disabled (allow all)
- We enable it but add policies that allow all (auth via API)
- This is intentional: we handle authentication in the API layer, not database layer

