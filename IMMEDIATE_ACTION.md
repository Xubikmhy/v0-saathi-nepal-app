# ⚡ IMMEDIATE ACTION REQUIRED

Your app needs one SQL command to work. Do this now:

---

## 📋 CHECKLIST (5 min)

### ☐ Step 1: Open Supabase
- Go to https://supabase.com/dashboard
- Select your project
- Click **SQL Editor** in left sidebar

### ☐ Step 2: Create Table
- Click **New Query**
- Copy-paste the entire SQL block below
- Click **Run** button

```sql
CREATE TABLE IF NOT EXISTS public.models (id UUID PRIMARY KEY DEFAULT gen_random_uuid(),name VARCHAR(255) NOT NULL,age INT,city VARCHAR(255),bio TEXT,whatsapp VARCHAR(20),image_url TEXT,is_featured BOOLEAN DEFAULT FALSE,created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP);CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;CREATE POLICY "allow_read_all" ON public.models FOR SELECT USING (true);CREATE POLICY "allow_all_authenticated" ON public.models FOR ALL USING (true) WITH CHECK (true);
```

Wait for: ✅ **Query executed successfully**

### ☐ Step 3: Check Storage Bucket
- Go to **Storage** in Supabase sidebar
- Click **Buckets**
- Find **model-images**
  - ✅ If exists, you're done
  - ❌ If not, click **Create a new bucket**, name it `model-images`, toggle **Public bucket** ON

### ☐ Step 4: Restart Dev Server
```bash
npm run dev
```

### ☐ Step 5: Test
- Visit http://localhost:3000/admin/login
- Login with your admin credentials
- Click **Add Model** tab
- Fill in: Name, City, WhatsApp
- Click **Create Model**
- ✅ Should work!

---

## ✨ That's It!

Your app will now:
- ✅ Save models to database
- ✅ Upload images to storage
- ✅ Display featured models on homepage
- ✅ Allow editing/deleting models
- ✅ Work in production when deployed

---

## 🆘 If Something's Wrong

**Error: "Could not find table"**
→ Make sure you clicked Run in step 2
→ Check that `models` appears in Tables list in Supabase

**Error: "row violates RLS policy"** 
→ Make sure storage bucket exists in step 3
→ Verify bucket is set to **Public**

**Error: "Cannot connect to database"**
→ Restart dev server
→ Reload the page

---

## 📖 Need More Help?

- `RLS_ISSUE_RESOLVED.md` - Full explanation
- `RLS_SECURITY_FIX.md` - Troubleshooting guide
- `FIX_NOW.md` - Quick reference

---

**That's literally all you need to do. Go!** 🚀
