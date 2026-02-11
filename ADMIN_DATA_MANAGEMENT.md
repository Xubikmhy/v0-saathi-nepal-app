# Admin Data Management Guide

## Admin User Setup

Your admin user has been configured:
- **User ID**: bd5f76aa-a861-496b-b50b-7725c9742d99
- **Role**: agency_admin
- **Status**: Active
- **Access Level**: Full administrative access

## Admin API Endpoints

### Host Management

#### List All Hosts
```bash
GET /api/admin/hosts?status=active&location=Kathmandu&search=jane

Query Parameters:
- status: 'active' | 'pending' | 'archived' (optional)
- location: string (optional)
- search: string (optional)
```

#### Get Single Host
```bash
GET /api/admin/hosts/{id}
```

#### Create New Host
```bash
POST /api/admin/hosts
Content-Type: application/json

{
  "name": "Jane Doe",
  "slug": "jane-doe",
  "age": 24,
  "contact_whatsapp": "+977-9701083684",
  "bio": "Beautiful and professional escort",
  "location": "Kathmandu",
  "profile_image_url": "https://...",
  "gallery_urls": ["https://...", "https://..."],
  "categories": ["beauty", "companion"],
  "status": "active"
}
```

#### Update Host
```bash
PATCH /api/admin/hosts/{id}
Content-Type: application/json

{
  "name": "Jane Doe",
  "bio": "Updated bio",
  "age": 25,
  "status": "active"
}
```

#### Delete Host
```bash
DELETE /api/admin/hosts/{id}
```

### Image Management

#### Upload Image
```bash
POST /api/upload/image
Content-Type: multipart/form-data

Form Data:
- file: File (required)
- folder: string (optional, e.g., 'hosts', 'ads', 'blogs')
- name: string (optional, custom filename)

Response:
{
  "url": "https://escortnepal.supabase.co/storage/v1/object/public/escort-images/hosts/jane-doe.jpg",
  "path": "hosts/jane-doe.jpg"
}
```

#### List Images
```bash
GET /api/images?folder=hosts&limit=50&offset=0

Query Parameters:
- folder: string (optional)
- limit: number (default: 50)
- offset: number (default: 0)
```

#### Delete Image
```bash
DELETE /api/images
Content-Type: application/json

{
  "path": "hosts/jane-doe.jpg"
}
```

## Data Management Workflow

### Adding a New Escort Profile

1. **Prepare Images**
   - Profile photo (500x700px recommended)
   - Gallery photos (5-10 images)
   - Compress images before upload

2. **Upload Profile Photo**
   ```bash
   POST /api/upload/image
   - folder: "hosts"
   - name: "jane-doe-profile"
   ```

3. **Upload Gallery Photos**
   ```bash
   POST /api/upload/image (repeat for each)
   - folder: "hosts"
   - name: "jane-doe-gallery-1"
   ```

4. **Create Host Profile**
   ```bash
   POST /api/admin/hosts
   {
     "name": "Jane Doe",
     "slug": "jane-doe",
     "profile_image_url": "https://...", // From step 2
     "gallery_urls": ["https://...", "https://..."], // From step 3
     "age": 24,
     "location": "Kathmandu",
     "contact_whatsapp": "+977-9801234567",
     "bio": "Beautiful and professional...",
     "status": "active"
   }
   ```

### Editing Existing Profile

1. **Update Images (if needed)**
   - Delete old image: `DELETE /api/images`
   - Upload new image: `POST /api/upload/image`

2. **Update Profile**
   ```bash
   PATCH /api/admin/hosts/{id}
   {
     "name": "Updated Name",
     "age": 25,
     "bio": "Updated bio",
     "profile_image_url": "https://..." // if changed
   }
   ```

### Bulk Data Import

For importing multiple hosts at once:

1. **Prepare CSV File**
   ```csv
   name,slug,age,location,contact_whatsapp,bio,status
   Jane Doe,jane-doe,24,Kathmandu,+977-9801234567,Professional escort,active
   Mary Smith,mary-smith,23,Pokhara,+977-9801234568,Friendly and warm,active
   ```

2. **Use Admin Dashboard**
   - Navigate to `/admin/dashboard`
   - Click "Import Hosts"
   - Upload CSV file
   - Review and confirm

3. **Or Use API Loop**
   ```bash
   # In admin dashboard or custom script
   for each row in CSV:
     POST /api/admin/hosts with row data
   ```

## Best Practices

### Image Management
1. **Size Guidelines**
   - Profile: 500x700px (3:4 ratio)
   - Gallery: 500x700px or 800x600px
   - Max file size: 5MB per image
   - Format: JPEG or WebP

2. **Naming Convention**
   - Use: `firstname-lastname-photo-1`
   - Not: `img1`, `DSC_001`
   - Include content type: `-profile`, `-gallery-1`

3. **Organization**
   - Store by type: `/hosts/`, `/ads/`, `/blogs/`
   - Archive unused images monthly
   - Keep backups of original images

### Profile Data
1. **Required Fields**
   - name (string)
   - slug (unique, URL-safe)
   - profile_image_url
   - contact_whatsapp

2. **Recommended Fields**
   - age
   - location (Kathmandu, Pokhara, etc.)
   - bio (200-500 characters)
   - categories (array of strings)

3. **Status Values**
   - `pending` - Review before publishing
   - `active` - Published and visible
   - `archived` - Hidden but kept in database

## Using Admin Dashboard

### Access
```
URL: /admin/dashboard
Login: Use your credentials
```

### Features
1. **Host Management**
   - List all hosts with filters
   - View/edit individual profiles
   - Upload images directly
   - Change status (pending/active/archived)
   - Delete profiles

2. **Image Gallery**
   - View all uploaded images
   - Organize by folder
   - Delete unused images
   - Get image URLs

3. **Settings**
   - Update site name
   - Change hero headlines
   - Update contact information
   - Manage ads

4. **Analytics**
   - View profile views
   - Track popular escorts
   - Monitor upload activity

## Error Handling

### Image Upload Fails
- Check file size (max 5MB)
- Verify image format (JPEG/WebP)
- Ensure bucket exists and is accessible
- Check RLS policies allow upload

### Profile Creation Fails
- Verify all required fields present
- Check slug is unique
- Ensure contact_whatsapp is valid format
- Verify URL strings are valid

### Data Fetch Issues
- Check database connection
- Verify RLS policies allow read
- Ensure user is authenticated
- Check status filter values

## Common Tasks

### Change Escort Status to Active
```bash
PATCH /api/admin/hosts/{id}
{
  "status": "active"
}
```

### Update Multiple Fields
```bash
PATCH /api/admin/hosts/{id}
{
  "age": 25,
  "location": "Pokhara",
  "bio": "New bio",
  "status": "active"
}
```

### Add to Gallery
```bash
# First upload image
POST /api/upload/image -> get URL

# Then update host
PATCH /api/admin/hosts/{id}
{
  "gallery_urls": ["existing1", "existing2", "new-image-url"]
}
```

### Archive Profile
```bash
PATCH /api/admin/hosts/{id}
{
  "status": "archived"
}
```

## Database Queries (Direct Supabase)

If you need direct database access:

### View All Hosts
```sql
SELECT * FROM hosts WHERE status = 'active' ORDER BY created_at DESC;
```

### Update Host Status
```sql
UPDATE hosts SET status = 'active' WHERE id = '{id}';
```

### Delete Images
```sql
DELETE FROM storage.objects WHERE bucket_id = 'escort-images' AND name LIKE 'hosts/old-%';
```

## Backup & Recovery

### Export Data
```bash
# Via Supabase dashboard
Tables -> hosts -> Download CSV
```

### Backup Images
```bash
# Automated by Supabase (daily snapshots)
# Manual backup: download from Storage bucket
```

## Support

For issues:
1. Check this guide
2. Review API documentation
3. Check Supabase dashboard
4. Review application logs
5. Contact support team

---

**Ready to manage your escort profiles!** Use the admin dashboard or APIs above.
