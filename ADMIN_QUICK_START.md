# Admin Dashboard - Quick Start

## Access Admin Panel

**URL:** `http://localhost:3000/admin/login`

**Login:**
- Email: Use your `ADMIN_EMAIL`
- Password: Use your `ADMIN_PASSWORD`

## Add a Model (3 Minutes)

### Step 1: Fill Required Fields
```
Name:        Type model name
City:        Type city (e.g., "Kathmandu")
WhatsApp:    Type number (e.g., "+977-98111")
```

### Step 2: Add Optional Details
```
Age:         Type number (e.g., "24")
Bio:         Write description
Photo:       Click to upload image
Featured:    Check to show on homepage
```

### Step 3: Save
```
Click "Create Model" button
Wait for "Model created successfully!" message
Model appears in list automatically
```

## Edit a Model

1. Click "All Models" tab
2. Find model card
3. Click "Edit" button
4. Form auto-fills
5. Change fields
6. Click "Update Model"
7. Done!

## Delete a Model

1. Click "All Models" tab
2. Find model card
3. Click "Delete" button
4. Confirm in popup
5. Model removed

## Troubleshooting

### Button won't work?
- Check all **required** fields are filled
- Name, City, WhatsApp are required
- Image must be JPG, PNG, or WebP
- Look for red error message

### Image upload fails?
- File must be JPG, PNG, or WebP
- File must be under 5MB
- Check internet connection

### Changes don't save?
- Check for error message
- Try refreshing page
- Check browser console for [v0] logs

## Files

- **Form & Lists:** `/app/admin/page.tsx`
- **Create API:** `/app/api/models/route.ts`
- **Edit/Delete API:** `/app/api/models/[id]/route.ts`
- **Upload API:** `/app/api/admin/upload/route.ts`
- **Database:** Supabase table: `models`
- **Storage:** Supabase bucket: `model-images`

## That's it!

The admin dashboard now fully works:
- ✅ Create models
- ✅ Upload photos
- ✅ Edit details
- ✅ Delete profiles
- ✅ Feature on homepage

Questions? Check the debug logs in browser console (look for `[v0]` prefix).
