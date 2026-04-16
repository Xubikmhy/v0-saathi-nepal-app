# Quick Fix: Upload RLS Error (2 Min)

## The Error
```
new row violates row-level security policy
```

## The Fix

### Step 1: SQL Editor
Go to: https://supabase.com/dashboard → Your Project → **SQL Editor**

### Step 2: Copy & Paste
Open file: `FIX_STORAGE_RLS.sql`

Copy everything and paste into SQL Editor

### Step 3: Run
Click **Run** button

Done! ✅

---

## Test It

Go to admin dashboard and upload an image.

It should work now.

---

## Still Not Working?

Go to **Storage** → **model-images** → **Policies** tab

Delete all policies if any exist.

Try upload again.

---

## That's It!

No code changes needed. Just the SQL.
