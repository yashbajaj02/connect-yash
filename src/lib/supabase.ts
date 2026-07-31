import { createClient } from '@supabase/supabase-js';
import type { Project, SiteConfig } from '../types';
import { uploadImage as uploadToCloudinary } from '../services/cloudinary';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://odcprfnjmfzhggifhhuh.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yyTgUKp8rZ_C1dHNwWm_Eg_58WTTpR6';

export const supabase = createClient<{
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id'> & { id?: string };
        Update: Partial<Project>;
        Relationships: [];
      };
      site_config: {
        Row: SiteConfig;
        Insert: Omit<SiteConfig, 'id'> & { id?: string };
        Update: Partial<SiteConfig>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
    };
}>(supabaseUrl, supabaseAnonKey);

/**
 * Uploads an image to Cloudinary and returns the optimized Cloudinary CDN URL.
 * Replaces old Supabase Storage / Base64 upload logic while preserving function signature.
 */
export async function uploadProjectImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return await uploadToCloudinary(file, onProgress);
}
