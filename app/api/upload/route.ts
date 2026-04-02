/**
 * Server-side image upload API endpoint
 * Uses service role key to bypass RLS policies
 * Fixes: "new row violates row-level security" error
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAdminStorageClient } from '@/lib/supabase/admin-storage';

export async function POST(request: NextRequest) {
  try {
    console.error('[upload fix] Processing upload request...');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const bucket = (formData.get('bucket') as string) || 'model-images';

    if (!file) {
      console.error('[upload fix] No file provided');
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    console.error('[upload fix] Processing file:', file.name, 'Size:', file.size);

    // Get admin storage client (uses SERVICE_ROLE_KEY to bypass RLS)
    const supabase = getAdminStorageClient();
    
    // Generate unique filename
    const timestamp = Date.now();
    const randomSuffix = Math.random().toString(36).substring(2, 8);
    const fileExt = file.name.split('.').pop()?.toLowerCase();
    const fileName = `${timestamp}-${randomSuffix}.${fileExt}`;

    console.error('[upload fix] Uploading to bucket:', bucket, 'file:', fileName);

    // Upload file using service role (bypasses RLS)
    const { error: uploadError, data } = await supabase.storage
      .from(bucket)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (uploadError) {
      console.error('[upload fix] Upload error:', uploadError);
      return NextResponse.json(
        { error: uploadError.message || 'Upload failed' },
        { status: 500 }
      );
    }

    console.error('[upload fix] Upload successful:', fileName);

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from(bucket).getPublicUrl(fileName);
    
    console.error('[upload fix] Public URL:', publicUrlData.publicUrl);

    return NextResponse.json({
      success: true,
      url: publicUrlData.publicUrl,
      path: fileName,
      message: 'Image uploaded successfully'
    });
  } catch (error: any) {
    console.error('[upload fix] API error:', error.message);
    return NextResponse.json(
      { error: error.message || 'Upload failed' },
      { status: 500 }
    );
  }
}
