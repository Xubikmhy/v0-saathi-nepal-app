-- Delete old seed data and insert 15 Nepali female models
-- Run this after the RLS fix script

-- Clear existing hosts
DELETE FROM public.hosts;

-- Insert 15 Nepali female models with realistic details
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
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Priyanka Thapa',
    'priyanka-thapa',
    24,
    '+9779701083684',
    'Runway specialist with appearances at Nepal Fashion Week. Passionate about bringing Nepali beauty to the global stage.',
    'Pokhara',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Srijana Gurung',
    'srijana-gurung',
    21,
    '+9779701083684',
    'Fresh face in the modeling industry with natural charm. Specializes in commercial and lifestyle shoots.',
    'Kathmandu',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Kritika Maharjan',
    'kritika-maharjan',
    23,
    '+9779701083684',
    'Versatile model experienced in both traditional and contemporary fashion. Former Miss Nepal contestant.',
    'Lalitpur',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Anjali Rai',
    'anjali-rai',
    20,
    '+9779701083684',
    'Young and vibrant model with a bright future. Known for her infectious energy and photogenic features.',
    'Biratnagar',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Sunita Tamang',
    'sunita-tamang',
    25,
    '+9779701083684',
    'Experienced professional model with a portfolio spanning international brands. Grace and sophistication personified.',
    'Kathmandu',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Manisha Shrestha',
    'manisha-shrestha',
    22,
    '+9779701083684',
    'Rising star in the Nepali modeling scene. Combines traditional beauty with modern style effortlessly.',
    'Bhaktapur',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Roshani Adhikari',
    'roshani-adhikari',
    24,
    '+9779701083684',
    'Fashion and lifestyle model with a passion for sustainable fashion. Ambassador for ethical brands.',
    'Pokhara',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Kabita Limbu',
    'kabita-limbu',
    21,
    '+9779701083684',
    'Fresh talent with unique Limbu heritage features. Bringing diversity and cultural pride to the industry.',
    'Dharan',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Samiksha Basnet',
    'samiksha-basnet',
    23,
    '+9779701083684',
    'Commercial model with experience in TV advertisements and print media. Friendly and approachable personality.',
    'Kathmandu',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Dikshya Karki',
    'dikshya-karki',
    26,
    '+9779701083684',
    'Veteran model with years of experience. Mentor to aspiring models and face of several national campaigns.',
    'Chitwan',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Puja Magar',
    'puja-magar',
    20,
    '+9779701083684',
    'Newest sensation with striking Magar features. Social media influencer with a growing following.',
    'Butwal',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Nisha Pradhan',
    'nisha-pradhan',
    24,
    '+9779701083684',
    'Glamour specialist known for elegant evening wear shoots. Red carpet ready at all times.',
    'Kathmandu',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Sarita Lama',
    'sarita-lama',
    22,
    '+9779701083684',
    'Fitness and fashion model combining athleticism with beauty. Health and wellness advocate.',
    'Pokhara',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  ),
  (
    'Bipana KC',
    'bipana-kc',
    23,
    '+9779701083684',
    'Editorial model with features in top Nepali magazines. Artistic vision and creative collaboration expert.',
    'Lalitpur',
    ARRAY[
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450',
      '/placeholder.svg?height=600&width=450'
    ],
    ARRAY['Model'],
    'active',
    '/placeholder.svg?height=700&width=500'
  );

-- Update site settings for premium branding
UPDATE public.site_settings 
SET 
  site_name = 'SAATHI NEPAL',
  hero_headline = 'Discover Exquisite Nepali Beauty',
  hero_subheadline = 'Premium models for your exclusive events and experiences'
WHERE id = 1;
