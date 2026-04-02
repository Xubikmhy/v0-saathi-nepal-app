-- Storage policies for model-images bucket

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "model_images_public_read" ON storage.objects;
DROP POLICY IF EXISTS "model_images_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "model_images_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "model_images_authenticated_delete" ON storage.objects;

CREATE POLICY "model_images_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'model-images');

CREATE POLICY "model_images_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'model-images');

CREATE POLICY "model_images_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'model-images')
  WITH CHECK (bucket_id = 'model-images');

CREATE POLICY "model_images_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'model-images');

SELECT 'Model-images storage policies applied' as status;
