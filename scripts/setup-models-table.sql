-- Create models table
CREATE TABLE IF NOT EXISTS models (
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

-- Create index on is_featured for faster queries
CREATE INDEX IF NOT EXISTS models_is_featured_idx ON models(is_featured);
CREATE INDEX IF NOT EXISTS models_created_at_idx ON models(created_at DESC);
