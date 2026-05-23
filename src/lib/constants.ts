import {
  Bot,
  BookOpen,
  BrainCircuit,
  Github,
  Instagram,
  LayoutDashboard,
  Linkedin,
  Mail,
  Phone,
  Sparkles,
  Youtube,
} from 'lucide-react';
import type { Project } from '../types';

export const adminCredentials = {
  email: 'enquirybusiness06@gmail.com',
  password: 'Yashbajaj@0212',
};

export const contact = {
  email: 'enquirybusiness06@gmail.com',
  phone: '+91 8854042917',
};

export const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/yash___bajaj/', icon: Instagram },
  { label: 'GitHub', href: 'https://github.com/yashbajaj02', icon: Github },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/yashbajaj02/', icon: Linkedin },
  { label: 'YouTube', href: 'https://www.youtube.com/@LyricJunction', icon: Youtube },
];

export const skills = [
  'HTML',
  'CSS',
  'JavaScript',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'Supabase',
  'GitHub',
  'AI Prompt Engineering',
  'UI/UX Design',
];

export const focusAreas = [
  'AI Tools',
  'Portfolio Development',
  'SaaS Ideas',
  'Automation Systems',
  'Content Creation',
  'YouTube Growth',
  'Instagram Branding',
];

export const experience = [
  {
    icon: BrainCircuit,
    title: 'AI product experiments',
    body: 'Designing prompt-driven systems, productivity workflows, and AI-assisted user experiences.',
  },
  {
    icon: LayoutDashboard,
    title: 'Modern frontend systems',
    body: 'Building polished React interfaces with responsive design, motion, and data-backed dashboards.',
  },
  {
    icon: Sparkles,
    title: 'Creative digital growth',
    body: 'Exploring content systems, Instagram branding, YouTube growth, and startup validation loops.',
  },
];

export const sampleProjects: Project[] = [
{
  id: 'modern-book-search',
  title: 'Modern-Book-Search',
  description: 'Modern responsive book search web app with live suggestions, Google Books API integration, premium dark UI, and interactive search.',
  tech_stack: ['React', 'TypeScript', 'Tailwind CSS', 'Google Books API'],
  thumbnail_url: '/book-search.png',
  live_link: 'https://yashbajaj02.github.io/Modern-Book-Search/',
  github_link: 'https://github.com/yashbajaj02/Modern-Book-Search',
  featured: true,
  category: 'Web App',
}
];

export const statCards = [
  ['10+', 'Core skills'],
  ['4', 'Featured builds'],
  ['7', 'Growth tracks'],
  ['24/7', 'Curiosity mode'],
];

export const contactMethods = [
  { label: 'Email', href: `mailto:${contact.email}`, value: contact.email, icon: Mail },
  { label: 'Phone', href: `tel:${contact.phone.replace(/\s/g, '')}`, value: contact.phone, icon: Phone },
  { label: 'AI + Web', href: '#contact', value: 'Open for collaborations', icon: Bot },
  { label: 'Book Search', href: '/projects?demo=book-search', value: 'Google Books demo ready', icon: BookOpen },
];
