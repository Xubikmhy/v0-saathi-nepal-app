-- Create "uploads" storage bucket

INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

SELECT 'Uploads bucket ensured' as status;
