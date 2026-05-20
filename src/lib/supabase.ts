import { createClient } from '@supabase/supabase-js';
import type { Project, SiteConfig } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://ssolgawhrhfywusmhcmr.supabase.co';
const supabaseAnonKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_iz7tmBhscI1LNueYgus2AQ_UiyIbSSa';

export const supabase = createClient<{
  public: {
    Tables: {
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id'> & { id?: string };
        Update: Partial<Project>;
      };
      site_config: {
        Row: SiteConfig;
        Insert: Omit<SiteConfig, 'id'> & { id?: string };
        Update: Partial<SiteConfig>;
      };
    };
  };
}>(supabaseUrl, supabaseAnonKey);

export async function uploadProjectImage(file: File) {
  const extension = file.name.split('.').pop() || 'jpg';
  const filePath = `project-thumbnails/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from('portfolio-assets').upload(filePath, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    throw error;
  }

  const { data } = supabase.storage.from('portfolio-assets').getPublicUrl(filePath);
  return data.publicUrl;
}
