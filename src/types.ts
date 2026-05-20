export type Project = {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  thumbnail_url: string;
  live_link: string;
  github_link: string;
  featured: boolean;
  category: 'AI' | 'Web App' | 'Dashboard' | 'Automation';
  created_at?: string;
};

export type SiteConfig = {
  id: string;
  key: string;
  value: string;
  updated_at?: string;
};
