-- Create "model-images" storage bucket for host/model images

INSERT INTO storage.buckets (id, name, public)
VALUES ('model-images', 'model-images', true)
ON CONFLICT (id) DO UPDATE SET public = EXCLUDED.public;

SELECT 'Model-images bucket ensured' as status;
