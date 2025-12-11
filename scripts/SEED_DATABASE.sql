-- COMPLETE DATABASE SETUP FOR EscortNepal
-- Run this entire script in your Supabase SQL Editor
-- This will create tables and populate them with sample data

-- ============================================
-- STEP 1: Create Tables and Schema (if not exists)
-- ============================================

-- Create custom ENUM types
DO $$ BEGIN
    CREATE TYPE app_role AS ENUM ('client', 'agency_admin');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE host_status AS ENUM ('pending', 'active', 'archived');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ============================================
-- STEP 2: Clear existing data (if tables exist)
-- ============================================
-- Skip this step - we'll use INSERT with ON CONFLICT instead

-- ============================================
-- STEP 3: Insert 15 Nepali Female Models
-- ============================================
INSERT INTO public.hosts (name, slug, age, contact_whatsapp, bio, location, gallery_urls, categories, status, profile_image_url)
VALUES
  (
    'Aashika Sharma',
    'aashika-sharma',
    22,
    '+9779701083684',
    'Professional model with experience in fashion shows and brand campaigns. Known for her elegant presence and graceful demeanor.',
    'Kathmandu',
    ARRAY[
      'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop'
    ],
    ARRAY['Fashion', 'Commercial', 'Editorial'],
    'active',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop'
  ),
  (
    'Priyanka Thapa',
    'priyanka-thapa',
    24,
    '+9779701083685',
    'Runway specialist with appearances at Nepal Fashion Week. Passionate about bringing Nepali beauty to the global stage.',
    'Pokhara',
    ARRAY[
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524502397800-2eeaad7c3fe5?w=600&h=800&fit=crop'
    ],
    ARRAY['Runway', 'Fashion', 'Events'],
    'active',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop'
  ),
  (
    'Srijana Gurung',
    'srijana-gurung',
    21,
    '+9779701083686',
    'Fresh face in the modeling industry with natural charm. Specializes in commercial and lifestyle shoots.',
    'Kathmandu',
    ARRAY[
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop'
    ],
    ARRAY['Commercial', 'Lifestyle', 'Brand'],
    'active',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=700&fit=crop'
  ),
  (
    'Kritika Maharjan',
    'kritika-maharjan',
    23,
    '+9779701083687',
    'Versatile model experienced in both traditional and contemporary fashion. Former Miss Nepal contestant.',
    'Lalitpur',
    ARRAY[
      'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=800&fit=crop'
    ],
    ARRAY['Fashion', 'Traditional', 'Pageant'],
    'active',
    'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=700&fit=crop'
  ),
  (
    'Anjali Rai',
    'anjali-rai',
    20,
    '+9779701083688',
    'Young and vibrant model with a bright future. Known for her infectious energy and photogenic features.',
    'Biratnagar',
    ARRAY[
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1515077678510-ce3bdf418862?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&h=800&fit=crop'
    ],
    ARRAY['Fashion', 'Youth', 'Social Media'],
    'active',
    'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=500&h=700&fit=crop'
  ),
  (
    'Sunita Tamang',
    'sunita-tamang',
    25,
    '+9779701083689',
    'Experienced professional model with a portfolio spanning international brands. Grace and sophistication personified.',
    'Kathmandu',
    ARRAY[
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=800&fit=crop'
    ],
    ARRAY['International', 'Luxury', 'Editorial'],
    'active',
    'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=500&h=700&fit=crop'
  ),
  (
    'Manisha Shrestha',
    'manisha-shrestha',
    22,
    '+9779701083690',
    'Rising star in the Nepali modeling scene. Combines traditional beauty with modern style effortlessly.',
    'Bhaktapur',
    ARRAY[
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&h=800&fit=crop'
    ],
    ARRAY['Fashion', 'Traditional', 'Modern'],
    'active',
    'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=500&h=700&fit=crop'
  ),
  (
    'Roshani Adhikari',
    'roshani-adhikari',
    24,
    '+9779701083691',
    'Fashion and lifestyle model with a passion for sustainable fashion. Ambassador for ethical brands.',
    'Pokhara',
    ARRAY[
      'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=600&h=800&fit=crop'
    ],
    ARRAY['Sustainable', 'Lifestyle', 'Ethical'],
    'active',
    'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=500&h=700&fit=crop'
  ),
  (
    'Kabita Limbu',
    'kabita-limbu',
    21,
    '+9779701083692',
    'Fresh talent with unique Limbu heritage features. Bringing diversity and cultural pride to the industry.',
    'Dharan',
    ARRAY[
      'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop'
    ],
    ARRAY['Cultural', 'Heritage', 'Fashion'],
    'active',
    'https://images.unsplash.com/photo-1509967419530-da38b4704bc6?w=500&h=700&fit=crop'
  ),
  (
    'Samiksha Basnet',
    'samiksha-basnet',
    23,
    '+9779701083693',
    'Commercial model with experience in TV advertisements and print media. Friendly and approachable personality.',
    'Kathmandu',
    ARRAY[
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600&h=800&fit=crop'
    ],
    ARRAY['Commercial', 'TV', 'Print'],
    'active',
    'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=500&h=700&fit=crop'
  ),
  (
    'Dikshya Karki',
    'dikshya-karki',
    26,
    '+9779701083694',
    'Veteran model with years of experience. Mentor to aspiring models and face of several national campaigns.',
    'Chitwan',
    ARRAY[
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1496440737103-cd596325d314?w=600&h=800&fit=crop'
    ],
    ARRAY['Veteran', 'Mentor', 'Campaign'],
    'active',
    'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=500&h=700&fit=crop'
  ),
  (
    'Puja Magar',
    'puja-magar',
    20,
    '+9779701083695',
    'Newest sensation with striking Magar features. Social media influencer with a growing following.',
    'Butwal',
    ARRAY[
      'https://images.unsplash.com/photo-1515077678510-ce3bdf418862?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=600&h=800&fit=crop'
    ],
    ARRAY['Influencer', 'Social Media', 'Fashion'],
    'active',
    'https://images.unsplash.com/photo-1515077678510-ce3bdf418862?w=500&h=700&fit=crop'
  ),
  (
    'Nisha Pradhan',
    'nisha-pradhan',
    24,
    '+9779701083696',
    'Glamour specialist known for elegant evening wear shoots. Red carpet ready at all times.',
    'Kathmandu',
    ARRAY[
      'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1506863530036-1efeddceb993?w=600&h=800&fit=crop'
    ],
    ARRAY['Glamour', 'Evening Wear', 'Red Carpet'],
    'active',
    'https://images.unsplash.com/photo-1513956589380-bad6acb9b9d4?w=500&h=700&fit=crop'
  ),
  (
    'Sarita Lama',
    'sarita-lama',
    22,
    '+9779701083697',
    'Fitness and fashion model combining athleticism with beauty. Health and wellness advocate.',
    'Pokhara',
    ARRAY[
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1503185912284-5271ff81b9a8?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1499952127939-9bbf5af6c51c?w=600&h=800&fit=crop'
    ],
    ARRAY['Fitness', 'Wellness', 'Athletic'],
    'active',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=500&h=700&fit=crop'
  ),
  (
    'Bipana KC',
    'bipana-kc',
    23,
    '+9779701083698',
    'Editorial model with features in top Nepali magazines. Artistic vision and creative collaboration expert.',
    'Lalitpur',
    ARRAY[
      'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=600&h=800&fit=crop',
      'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop'
    ],
    ARRAY['Editorial', 'Magazine', 'Artistic'],
    'active',
    'https://images.unsplash.com/photo-1500917293891-ef795e70e1f6?w=500&h=700&fit=crop'
  );

-- ============================================
-- STEP 4: Update site settings
-- ============================================
-- Update site settings for premium branding
INSERT INTO public.site_settings (id, site_name, hero_headline, hero_subheadline, contact_email, contact_phone)
VALUES (
  1,
  'EscortNepal',
  'Discover Exquisite Nepali Beauty',
  'Premium models for your exclusive events and experiences',
  'info@escortnepal.com',
  '+977-9801234567'
)
ON CONFLICT (id) DO UPDATE SET
  site_name = EXCLUDED.site_name,
  hero_headline = EXCLUDED.hero_headline,
  hero_subheadline = EXCLUDED.hero_subheadline,
  contact_email = EXCLUDED.contact_email,
  contact_phone = EXCLUDED.contact_phone;

-- ============================================
-- DONE! You should now see 15 models
-- ============================================
SELECT COUNT(*) as total_models FROM public.hosts WHERE status = 'active';
