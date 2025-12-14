-- Storage policies for uploads bucket

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "uploads_public_read" ON storage.objects;
DROP POLICY IF EXISTS "uploads_authenticated_insert" ON storage.objects;
DROP POLICY IF EXISTS "uploads_authenticated_update" ON storage.objects;
DROP POLICY IF EXISTS "uploads_authenticated_delete" ON storage.objects;

CREATE POLICY "uploads_public_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'uploads');

CREATE POLICY "uploads_authenticated_insert" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "uploads_authenticated_update" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'uploads')
  WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "uploads_authenticated_delete" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'uploads');

SELECT 'Uploads storage policies applied' as status;
