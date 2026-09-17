import { supabase, isSupabaseConfigured } from '@/lib/supabase';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/svg+xml',
  'image/gif',
  'video/mp4',
  'video/webm',
];

const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024; // 20MB

export interface UploadResult {
  publicUrl: string;
  filePath: string;
  name: string;
  fileSize: number;
  mimeType: string;
}

export async function uploadMedia(file: File, folder: string = 'uploads'): Promise<UploadResult> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase storage is not configured. Live media uploads require active credentials.');
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error(
      `Unsupported file type: ${file.type}. Allowed formats: JPG, PNG, WEBP, SVG, GIF, MP4, WEBM.`
    );
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(
      `File size exceeds limit (${(file.size / (1024 * 1024)).toFixed(1)}MB > 20MB max).`
    );
  }

  // Clean filename and create unique path
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_').toLowerCase();
  const uniquePrefix = `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
  const filePath = `${folder}/${uniquePrefix}-${sanitizedName}`;

  // Upload object to portfolio-media bucket
  const { error: uploadError } = await supabase.storage
    .from('portfolio-media')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`);
  }

  // Retrieve public URL
  const { data: urlData } = supabase.storage
    .from('portfolio-media')
    .getPublicUrl(filePath);

  const publicUrl = urlData.publicUrl;

  // Insert record into media_assets table
  await supabase.from('media_assets').insert([
    {
      name: file.name,
      file_path: filePath,
      file_size: file.size,
      mime_type: file.type,
      public_url: publicUrl,
    },
  ]);

  return {
    publicUrl,
    filePath,
    name: file.name,
    fileSize: file.size,
    mimeType: file.type,
  };
}
