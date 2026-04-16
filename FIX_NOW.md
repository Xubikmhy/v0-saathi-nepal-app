# 🔧 FIX IN 5 MINUTES

You're getting RLS errors because the database table hasn't been created yet.

## DO THIS NOW:

### 1. Open Supabase Dashboard
Go to: https://supabase.com/dashboard → Select your project

### 2. Create the Table
- Click **SQL Editor** → **New Query**
- Copy-paste this entire block:

```sql
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  age INT,
  city VARCHAR(255),
  bio TEXT,
  whatsapp VARCHAR(20),
  image_url TEXT,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS models_is_featured_idx ON public.models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON public.models(created_at DESC);

ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_read_all" ON public.models FOR SELECT USING (true);
CREATE POLICY "allow_all" ON public.models FOR ALL USING (true) WITH CHECK (true);
```

- Click **Run** ✅

### 3. Check Storage Bucket
- Go to **Storage** → **Buckets**
- Look for **model-images**
- If it doesn't exist: **Create a new bucket** named `model-images` with **Public bucket** toggled ON

### 4. Restart Dev Server
```bash
npm run dev
```

### 5. Try Again
- Go to http://localhost:3000/admin/login
- Create a model
- Upload an image
- ✅ Should work!

---

If you're still stuck: See **RLS_SECURITY_FIX.md** for detailed troubleshooting.
