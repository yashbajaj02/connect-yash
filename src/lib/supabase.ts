import { createClient } from '@supabase/supabase-js';
import type { Project, SiteConfig } from '../types';

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
