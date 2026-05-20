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
    id: 'stress-analysis',
    title: 'AI-Driven Lifestyle Stress Analysis System',
    description:
      'A wellness intelligence concept that analyzes lifestyle inputs and turns them into personalized stress patterns, recommendations, and daily improvement signals.',
    tech_stack: ['React', 'TypeScript', 'AI Prompts', 'Supabase', 'Tailwind CSS'],
    thumbnail_url: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?auto=format&fit=crop&w=1200&q=80',
    live_link: 'https://example.com/stress-analysis',
    github_link: 'https://github.com/yashbajaj02',
    featured: true,
    category: 'AI',
  },
  {
    id: 'book-search',
    title: 'Modern Book Search App',
    description:
      'Google Books powered discovery app with live autocomplete, animated responsive cards, title/author search, previews, buying links, and a futuristic dark interface.',
    tech_stack: ['React', 'Google Books API', 'Framer Motion', 'Tailwind CSS'],
    thumbnail_url: 'https://images.unsplash.com/photo-1519682337058-a94d519337bc?auto=format&fit=crop&w=1200&q=80',
    live_link: '/projects?demo=book-search',
    github_link: 'https://github.com/yashbajaj02',
    featured: true,
    category: 'Web App',
  },
  {
    id: 'productivity-assistant',
    title: 'AI Productivity Assistant',
    description:
      'An automation assistant for planning, prioritizing, summarizing tasks, and turning scattered ideas into structured execution systems.',
    tech_stack: ['React', 'Supabase', 'AI Automation', 'TypeScript'],
    thumbnail_url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80',
    live_link: 'https://example.com/productivity-assistant',
    github_link: 'https://github.com/yashbajaj02',
    featured: false,
    category: 'Automation',
  },
  {
    id: 'portfolio-dashboard',
    title: 'Smart Portfolio Dashboard',
    description:
      'A personal command center for managing projects, featured content, site messaging, and future portfolio growth signals.',
    tech_stack: ['React', 'Supabase', 'Tailwind CSS', 'Lucide Icons'],
    thumbnail_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
    live_link: '/admin',
    github_link: 'https://github.com/yashbajaj02',
    featured: true,
    category: 'Dashboard',
  },
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
