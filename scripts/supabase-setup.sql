-- Create admin_users table for hardcoded admin login
CREATE TABLE IF NOT EXISTS admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create hosts table
CREATE TABLE IF NOT EXISTS hosts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    age INTEGER,
    contact_whatsapp VARCHAR(20),
    bio TEXT,
    location VARCHAR(255),
    gallery_urls TEXT[] DEFAULT '{}',
    categories TEXT[] DEFAULT '{}',
    profile_image_url VARCHAR(500),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'archived')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create blogs table
CREATE TABLE IF NOT EXISTS blogs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    content TEXT,
    excerpt VARCHAR(500),
    cover_image_url VARCHAR(500),
    is_published BOOLEAN DEFAULT false,
    author_id UUID REFERENCES auth.users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create ads table
CREATE TABLE IF NOT EXISTS ads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    image_url VARCHAR(500),
    link_url VARCHAR(500),
    html TEXT,
    position VARCHAR(50) DEFAULT 'header' CHECK (position IN ('header', 'sidebar', 'footer', 'inline')),
    is_active BOOLEAN DEFAULT true,
    start_at TIMESTAMP,
    end_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create site_settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    site_name VARCHAR(255),
    logo_url VARCHAR(500),
    hero_headline VARCHAR(500),
    hero_subheadline VARCHAR(500),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(20),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    role VARCHAR(50) DEFAULT 'client' CHECK (role IN ('client', 'agency_admin')),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create favorites table
CREATE TABLE IF NOT EXISTS favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    host_id UUID REFERENCES hosts(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, host_id)
);

-- Create indexes for better performance
CREATE INDEX idx_hosts_slug ON hosts(slug);
CREATE INDEX idx_hosts_status ON hosts(status);
CREATE INDEX idx_hosts_location ON hosts(location);
CREATE INDEX idx_blogs_slug ON blogs(slug);
CREATE INDEX idx_blogs_published ON blogs(is_published);
CREATE INDEX idx_ads_active ON ads(is_active);
CREATE INDEX idx_favorites_user ON favorites(user_id);
CREATE INDEX idx_favorites_host ON favorites(host_id);
CREATE INDEX idx_profiles_role ON profiles(role);

-- Enable Row Level Security (RLS)
ALTER TABLE hosts ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ads ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hosts (public read, admin write)
CREATE POLICY "Allow public read on hosts" ON hosts
    FOR SELECT USING (true);

CREATE POLICY "Allow admin update on hosts" ON hosts
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'agency_admin'
            )
        )
    );

CREATE POLICY "Allow admin insert on hosts" ON hosts
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'agency_admin'
            )
        )
    );

CREATE POLICY "Allow admin delete on hosts" ON hosts
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM auth.users
            WHERE auth.users.id = auth.uid()
            AND EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'agency_admin'
            )
        )
    );

-- RLS Policies for blogs (public read active, admin write)
CREATE POLICY "Allow public read active blogs" ON blogs
    FOR SELECT USING (is_published = true);

CREATE POLICY "Allow admin read all blogs" ON blogs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

CREATE POLICY "Allow admin insert on blogs" ON blogs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

CREATE POLICY "Allow admin update on blogs" ON blogs
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

CREATE POLICY "Allow admin delete on blogs" ON blogs
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

-- RLS Policies for ads (public read active)
CREATE POLICY "Allow public read active ads" ON ads
    FOR SELECT USING (is_active = true AND (start_at IS NULL OR start_at <= NOW()) AND (end_at IS NULL OR end_at >= NOW()));

CREATE POLICY "Allow admin read all ads" ON ads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

CREATE POLICY "Allow admin manage ads" ON ads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

-- RLS Policies for site_settings (public read, admin write)
CREATE POLICY "Allow public read settings" ON site_settings
    FOR SELECT USING (true);

CREATE POLICY "Allow admin update settings" ON site_settings
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'agency_admin'
        )
    );

-- RLS Policies for profiles
CREATE POLICY "Allow users read own profile" ON profiles
    FOR SELECT USING (auth.uid() = id OR EXISTS (
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid()
        AND p.role = 'agency_admin'
    ));

CREATE POLICY "Allow users update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- RLS Policies for favorites
CREATE POLICY "Allow users manage own favorites" ON favorites
    FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Allow public read favorites count" ON favorites
    FOR SELECT USING (true);

-- RLS Policies for admin_users (only for custom admin auth)
CREATE POLICY "Disable all access to admin_users" ON admin_users
    FOR ALL USING (false);

-- Insert default site settings
INSERT INTO site_settings (id, site_name, hero_headline, hero_subheadline)
VALUES (1, 'EscortNepal', 'Premium Nepali Escorts', 'Discover the finest collection of verified models')
ON CONFLICT DO NOTHING;
