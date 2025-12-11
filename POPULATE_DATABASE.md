# Quick Fix: Populate Database with Models

## Problem
Gallery and Discover pages show "No models found" because the database is empty.

## Solution
Run the SQL seed script to add 15 sample models to your database.

## Steps

### Option 1: Using Supabase Dashboard (Recommended)

**STEP 1: Create Tables First**

1. **Open Supabase SQL Editor**
   - Go to: https://supabase.com/dashboard/project/naxcktbdvyqigczahtup/sql/new

2. **Run the Setup Script**
   - Open the file: `scripts/SETUP_TABLES.sql`
   - Copy the entire contents (Ctrl+A, Ctrl+C)
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for success message: "Tables created successfully!"

**STEP 2: Add Model Data**

1. **Open a New Query** (or clear the editor)
   - Click "New query" in Supabase SQL Editor

2. **Copy the Seed Script**
   - Open the file: `scripts/SEED_DATABASE.sql`
   - Copy the entire contents (Ctrl+A, Ctrl+C)

3. **Paste and Run**
   - Paste into the SQL Editor
   - Click "Run" button
   - Wait for success message

4. **Verify**
   - You should see "15 rows affected" or similar
   - The last query will show: `total_models: 15`

5. **Refresh Your App**
   - Go back to http://localhost:3000
   - Click "View Gallery" or "Discover"
   - You should now see 15 models!

### Option 2: Using Supabase CLI (Advanced)

```bash
# If you have Supabase CLI installed
supabase db reset
supabase db push
```

## What This Script Does

✅ Clears any existing test data
✅ Inserts 15 Nepali female models with:
   - Real photos from Unsplash
   - Unique names and bios
   - Different locations (Kathmandu, Pokhara, etc.)
   - WhatsApp contact numbers
   - All set to "active" status
✅ Updates site settings

## Models Added

1. Aashika Sharma (Kathmandu) - Fashion model
2. Priyanka Thapa (Pokhara) - Runway specialist
3. Srijana Gurung (Kathmandu) - Commercial model
4. Kritika Maharjan (Lalitpur) - Former Miss Nepal contestant
5. Anjali Rai (Biratnagar) - Young vibrant model
6. Sunita Tamang (Kathmandu) - International model
7. Manisha Shrestha (Bhaktapur) - Rising star
8. Roshani Adhikari (Pokhara) - Sustainable fashion
9. Kabita Limbu (Dharan) - Cultural heritage model
10. Samiksha Basnet (Kathmandu) - Commercial TV model
11. Dikshya Karki (Chitwan) - Veteran mentor
12. Puja Magar (Butwal) - Social media influencer
13. Nisha Pradhan (Kathmandu) - Glamour specialist
14. Sarita Lama (Pokhara) - Fitness model
15. Bipana KC (Lalitpur) - Editorial model

## After Running

Your app will now display:
- ✅ Models in the gallery (/browse)
- ✅ Models in discover/swipe (/discover)
- ✅ Featured models on homepage
- ✅ Searchable and filterable by location

## Troubleshooting

**Still seeing "No models found"?**
1. Make sure the SQL ran successfully (check for errors)
2. Verify in Supabase Table Editor: Database → hosts table
3. Check that status = 'active' for all models
4. Hard refresh your browser (Ctrl+Shift+R)

**Permission errors?**
- Make sure you're using the correct Supabase project
- Check that RLS policies are set up (run scripts/SETUP_TABLES.sql first if needed)
