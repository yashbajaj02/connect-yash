import { motion, Reorder } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Code,
  Database,
  Edit3,
  ExternalLink,
  Github,
  Globe,
  GripVertical,
  Instagram,
  Linkedin,
  Lock,
  Mail,
  MessageCircle,
  Moon,
  Palette,
  Plus,
  RefreshCw,
  Save,
  Send,
  Smartphone,
  Sparkles,
  Sun,
  Trash2,
  Zap,
} from 'lucide-react';
import { moveProjectUp, moveProjectDown, reorderProjects, normalizeDisplayOrder } from './lib/projectHelpers';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom';
import { ToastMessage, Toasts } from './components/Toast';
import { useTheme } from './context/ThemeContext';
import { contact } from './lib/constants';
import {
  deleteImage,
  generateThumbnail,
  optimizeImage,
  updateImage,
  validateImageFile,
} from './services/cloudinary';
import type { Project } from './types';

const formspreeEndpoint = import.meta.env.VITE_FORMSPREE_ENDPOINT || 'https://formspree.io/f/xjglqwke';
const configStorageKey = 'yash-portfolio-config';

type SiteSettings = {
  heroSubtitle: string;
  aboutText: string;
  skills: string[];
  technologies: string[];
  instagram: string;
  github: string;
  linkedin: string;
  whatsapp: string;
  email: string;
};

const defaultSettings: SiteSettings = {
  heroSubtitle:
    'AI enthusiast, creator, and developer building modern web experiences, automation systems, and creative digital projects.',
  aboutText:
    'Passionate about creating modern websites, AI-powered tools, automation workflows, and digital experiences. I enjoy building scalable projects, experimenting with new technologies, and creating content around creativity and innovation. Alongside development, I also explore social branding, and automation-based systems.',
  skills: ['Web Development', 'AI & Automation', 'Full-Stack Apps', 'Performance', 'UI/UX Design', 'Database Design', 'Responsive Design', 'Content Creation'],
  technologies: ['React', 'TypeScript', 'Node.js', 'Python', 'Supabase', 'Firebase', 'Tailwind CSS', 'Framer Motion', 'Git', 'Vercel', 'REST APIs', 'Figma'],
  instagram: 'https://www.instagram.com/yash___bajaj/',
  github: 'https://github.com/yashbajaj02',
  linkedin: 'https://www.linkedin.com/in/yashbajaj02/',
  whatsapp: '918854042917',
  email: 'enquirybusiness06@gmail.com',
};

import { projects as initialProjects } from './data/projects';

const skillIcons = [Code, Sparkles, Globe, Zap, Palette, Database, Smartphone, Mail];

function useToasts() {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const pushToast = (text: string, tone: ToastMessage['tone'] = 'info') => {
    const id = Date.now();
    setMessages((current) => [...current, { id, text, tone }]);
    window.setTimeout(() => setMessages((current) => current.filter((message) => message.id !== id)), 2600);
  };

  return { messages, pushToast };
}

function readStoredSettings() {
  try {
    const stored = localStorage.getItem(configStorageKey);
    const parsed = stored ? JSON.parse(stored) : {};
    return { ...defaultSettings, ...parsed };
  } catch {
    return defaultSettings;
  }
}

function linesToList(value: FormDataEntryValue | null) {
  return String(value || '')
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildWhatsAppLink(rawPhoneOrUrl: string) {
  const message = 'Hi Yash, I visited your portfolio and want to discuss a project.';
  if (rawPhoneOrUrl.includes('wa.me') || rawPhoneOrUrl.includes('whatsapp')) {
    const [base] = rawPhoneOrUrl.split('?');
    return `${base}?text=${encodeURIComponent(message)}`;
  }
  const digits = rawPhoneOrUrl.replace(/\D/g, '');
  return `https://wa.me/${digits || '918854042917'}?text=${encodeURIComponent(message)}`;
}

function buildEmailLink(rawEmailOrUrl: string) {
  const email = rawEmailOrUrl.replace(/^mailto:/, '').split('?')[0] || contact.email;
  const subject = 'Project Inquiry from Portfolio';
  const body = 'Hi Yash,\n\nI visited your portfolio and want to discuss a project.\n\nProject idea:\nBudget/Timeline:\n\nThanks.';
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

function AppShell({ children }: { children: React.ReactNode }) {
  const { isDark, toggleTheme } = useTheme();
  const navItems = [
    ['Home', '/'],
    ['Projects', '/projects'],
    ['Contact', '/contact'],
  ];

  return (
    <div className={isDark ? 'dark min-h-screen bg-[#070b16] text-white' : 'light min-h-screen bg-[#eef7ff] text-slate-950'}>
      <div className="fixed inset-0 -z-10 overflow-hidden bg-[radial-gradient(circle_at_85%_0%,rgba(32,66,120,0.34),transparent_34%),radial-gradient(circle_at_10%_100%,rgba(12,84,88,0.28),transparent_30%),radial-gradient(circle_at_58%_70%,rgba(110,98,53,0.20),transparent_26%)] light:bg-[radial-gradient(circle_at_85%_0%,rgba(59,130,246,0.20),transparent_34%),radial-gradient(circle_at_10%_100%,rgba(20,184,166,0.18),transparent_30%),radial-gradient(circle_at_58%_70%,rgba(168,85,247,0.12),transparent_26%)]" />
      <header className="sticky top-3 z-40 px-4">
        <nav className="nav-shell mx-auto flex max-w-[1050px] items-center justify-between rounded-lg px-5 py-3">
          <Link to="/" className="brand-logo text-base font-extrabold tracking-tight">
            Yash Bajaj
          </Link>
          <div className="flex items-center gap-1 sm:gap-3">
            {navItems.map(([label, to]) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `nav-link rounded-lg px-3 py-2 text-xs font-bold transition sm:px-4 ${
                    isActive ? 'nav-link-active' : 'nav-link-idle'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={toggleTheme}
              className="theme-button ml-1 grid h-9 w-9 place-items-center rounded-lg transition"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-[1050px] px-4 pb-24 pt-12">{children}</main>
    </div>
  );
}

function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
      {subtitle ? <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-400">{subtitle}</p> : null}
    </motion.div>
  );
}

function Home({ settings, projects }: { settings: SiteSettings; projects: Project[] }) {
  return (
    <div>
      <section className="flex min-h-[640px] items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <div className="mb-9 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-400">
            <Zap className="h-4 w-4" />
            Available for projects
          </div>
          <h1 className="max-w-3xl text-5xl font-black leading-tight tracking-tight sm:text-7xl">
            Hi, I&apos;m <span className="bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 bg-clip-text text-transparent">Yash Bajaj</span>
          </h1>
          <p className="mt-7 max-w-3xl text-xl leading-9 text-slate-400">{settings.heroSubtitle}</p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link to="/projects" className="premium-button inline-flex items-center gap-3 rounded-lg bg-white px-7 py-4 font-bold text-slate-950">
              View Projects <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/contact" className="ghost-button inline-flex items-center gap-3 rounded-lg border border-slate-700 px-7 py-4 font-bold text-slate-300">
              Get in Touch
            </Link>
          </div>
        </motion.div>
      </section>

      <section className="py-20">
        <h2 className="text-4xl font-extrabold">About Me</h2>
        <p className="mt-8 max-w-4xl text-xl leading-10 text-slate-400">{settings.aboutText}</p>
      </section>

      <section className="py-20">
        <h2 className="text-4xl font-extrabold">Skills</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {settings.skills.map((skill, index) => {
            const SkillIcon = skillIcons[index % skillIcons.length];
            return (
              <div key={skill} className="soft-card grid min-h-32 place-items-center rounded-lg p-6 text-center">
                <SkillIcon className="mb-5 h-9 w-9 text-blue-400" />
                <h3 className="font-bold text-slate-300">{skill}</h3>
              </div>
            );
          })}
        </div>
      </section>

      <section className="py-20">
        <h2 className="text-4xl font-extrabold">Technologies</h2>
        <div className="mt-10 flex flex-wrap gap-3">
          {settings.technologies.map((tech) => (
            <span key={tech} className="tech-pill rounded-lg border border-slate-800 bg-slate-900/70 px-6 py-4 font-bold text-slate-300">
              {tech}
            </span>
          ))}
        </div>
      </section>

      <section className="py-20">
        <div className="mb-10 flex items-center justify-between">
          <h2 className="text-4xl font-extrabold">Featured Projects</h2>
          <Link to="/projects" className="inline-flex items-center gap-2 font-bold text-blue-400">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ProjectCards projects={projects.filter((project) => project.featured).slice(0, 2)} />
      </section>

      <section className="py-20">
        <h2 className="text-4xl font-extrabold">Connect</h2>
        <div className="mt-10 flex flex-wrap gap-4">
          <SocialButton icon={Instagram} label="Instagram" href={settings.instagram} />
          <SocialButton icon={Github} label="GitHub" href={settings.github} />
          <SocialButton icon={Linkedin} label="LinkedIn" href={settings.linkedin} />
        </div>
      </section>

      <section className="soft-card my-20 rounded-lg p-12 text-center">
        <h2 className="text-4xl font-extrabold">Let&apos;s Work Together</h2>
        <p className="mt-5 text-lg text-slate-400">Have a project in mind or want to collaborate? I&apos;d love to hear from you.</p>
        <Link to="/contact" className="premium-button mt-10 inline-flex items-center gap-3 rounded-lg bg-white px-8 py-4 font-bold text-slate-950">
          Get in Touch <ArrowRight className="h-5 w-5" />
        </Link>
      </section>
    </div>
  );
}

function SocialButton({ icon: Icon, label, href }: { icon: typeof Instagram; label: string; href: string }) {
  return (
    <a href={href} target="_blank" rel="noreferrer" className="social-button soft-card inline-flex items-center gap-3 rounded-lg px-6 py-4 font-bold text-slate-400">
      <Icon className="h-5 w-5" />
      {label}
    </a>
  );
}

function ProjectCards({ projects }: { projects: Project[] }) {
  return (
    <div className="grid w-full gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {projects.map((project) => {
        const optimizedImage = generateThumbnail(project.thumbnail_url);
        return (
          <motion.article
            key={project.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="project-card overflow-hidden rounded-lg"
          >
            <img
              src={optimizedImage}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="project-image h-48 w-full object-cover"
            />
            <div className="p-5">
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-extrabold">{project.title}</h3>
                {project.featured ? <span className="text-yellow-400">*</span> : null}
              </div>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-400">{project.description}</p>
              <div className="mt-5 flex gap-3">
                {project.live_link ? (
                  <a href={project.live_link} target="_blank" rel="noreferrer" className="premium-button inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-bold text-slate-950">
                    <ExternalLink className="h-4 w-4" /> Live
                  </a>
                ) : null}
                {project.github_link ? (
                  <a href={project.github_link} target="_blank" rel="noreferrer" className="ghost-button inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-2 text-sm font-bold text-slate-300 light:text-slate-700">
                    <Github className="h-4 w-4" /> Repo
                  </a>
                ) : null}
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
}

function Projects({ projects }: { projects: Project[] }) {
  return (
    <div>
      <PageTitle title="Projects" subtitle="A collection of my work across web development, AI tools, and automation." />
      <div className="mt-12">
        <ProjectCards projects={projects} />
      </div>
    </div>
  );
}

function Contact({ settings, pushToast }: { settings: SiteSettings; pushToast: (text: string, tone?: ToastMessage['tone']) => void }) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const response = await fetch(formspreeEndpoint, {
      method: 'POST',
      body: new FormData(form),
      headers: { Accept: 'application/json' },
    });
    if (response.ok) {
      form.reset();
      pushToast('Message sent successfully.', 'success');
    } else {
      pushToast('Message could not be sent.', 'error');
    }
  }

  return (
    <div>
      <PageTitle title="Contact" subtitle="Let's connect and build something great together." />
      <div className="mt-14 grid gap-9 lg:grid-cols-2">
        <div className="grid content-start gap-5">
          <a href={buildWhatsAppLink(settings.whatsapp)} target="_blank" rel="noreferrer" className="contact-tile soft-card flex items-center justify-between rounded-lg p-6">
            <span className="flex items-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                <MessageCircle className="h-7 w-7" />
              </span>
              <span>
                <b>WhatsApp</b>
                <span className="block text-slate-400">Quick message</span>
              </span>
            </span>
            <ExternalLink className="h-5 w-5 text-slate-400" />
          </a>
          <a href={buildEmailLink(settings.email)} className="contact-tile soft-card flex items-center justify-between rounded-lg p-6">
            <span className="flex items-center gap-5">
              <span className="grid h-14 w-14 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
                <Mail className="h-7 w-7" />
              </span>
              <span>
                <b>Email</b>
                <span className="block text-slate-400">Send an email</span>
              </span>
            </span>
            <ExternalLink className="h-5 w-5 text-slate-400" />
          </a>
        </div>
        <form onSubmit={submit} className="soft-card rounded-lg p-7">
          <label className="mb-3 block text-sm font-bold text-slate-300">Name</label>
          <input name="name" required placeholder="Your name" className="form-input mb-6" />
          <label className="mb-3 block text-sm font-bold text-slate-300">Email</label>
          <input name="email" type="email" required placeholder="your@email.com" className="form-input mb-6" />
          <label className="mb-3 block text-sm font-bold text-slate-300">Message</label>
          <textarea name="message" required rows={5} placeholder="Your message..." className="form-input mb-7 resize-none" />
          <button className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 font-bold text-slate-950">
            Send Message <Send className="h-5 w-5" />
          </button>
        </form>
      </div>
    </div>
  );
}

function Admin({
  projects,
  onSaveProject,
  onDeleteProject,
  onReorderProjects,
  settings,
  setSettings,
  pushToast,
}: {
  projects: Project[];
  onSaveProject: (project: Project) => Promise<void>;
  onDeleteProject: (projectId: string) => Promise<void>;
  onReorderProjects: (projects: Project[]) => Promise<void>;
  settings: SiteSettings;
  setSettings: (settings: SiteSettings) => void;
  pushToast: (text: string, tone?: ToastMessage['tone']) => void;
}) {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('yash-admin') === 'true');
  const [tab, setTab] = useState<'projects' | 'settings'>('projects');
  const [editing, setEditing] = useState<Project | null>(null);
  const [uploadPreview, setUploadPreview] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setUploadPreview(editing?.thumbnail_url || '');
    setSelectedFile(null);
    setUploadProgress(null);
  }, [editing]);

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const pwd = String(formData.get('password') || '');
    
    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pwd })
      });
      
      if (res.ok) {
        sessionStorage.setItem('yash-admin', 'true');
        setLoggedIn(true);
        pushToast('Signed in.', 'success');
      } else {
        pushToast('Wrong password.', 'error');
      }
    } catch (error) {
      pushToast('Authentication failed due to network error.', 'error');
    }
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const existingImage = String(form.get('thumbnail_existing') || '');
    let finalImageUrl = uploadPreview || existingImage;

    if (selectedFile) {
      try {
        setIsSaving(true);
        setUploadProgress(0);
        pushToast('Uploading image to Cloudinary CDN...', 'info');
        // Uploads new image first; deletes old Cloudinary image only after upload succeeds
        finalImageUrl = await updateImage(selectedFile, existingImage, (progress) => {
          setUploadProgress(progress);
        });
        pushToast('Image updated on Cloudinary CDN.', 'success');
      } catch (error) {
        setIsSaving(false);
        setUploadProgress(null);
        pushToast(error instanceof Error ? error.message : 'Cloudinary upload failed.', 'error');
        return;
      }
    }

    if (!finalImageUrl) {
      pushToast('Please upload a project image.', 'error');
      return;
    }

    const nextProject: Project = {
      id: editing?.id || crypto.randomUUID(),
      title: String(form.get('title') || ''),
      description: String(form.get('description') || ''),
      thumbnail_url: finalImageUrl,
      live_link: String(form.get('live_link') || ''),
      github_link: String(form.get('github_link') || ''),
      tech_stack: linesToList(form.get('tech_stack')),
      featured: form.get('featured') === 'on',
      category: editing?.category || 'Web App',
    };

    const isExistingProject = Boolean(editing?.id);
    try {
      setIsSaving(true);
      await onSaveProject(nextProject);
      setEditing(null);
      setSelectedFile(null);
      setUploadProgress(null);
      pushToast(isExistingProject ? 'Project updated locally (edit src/data/projects.ts to persist).' : 'Project added locally (edit src/data/projects.ts to persist).', 'success');
    } catch (error) {
      pushToast(error instanceof Error ? error.message : 'Project could not be saved.', 'error');
    } finally {
      setIsSaving(false);
      setUploadProgress(null);
    }
  }

  function saveSettings(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextSettings: SiteSettings = {
      heroSubtitle: String(form.get('heroSubtitle') || ''),
      aboutText: String(form.get('aboutText') || ''),
      skills: linesToList(form.get('skills')),
      technologies: linesToList(form.get('technologies')),
      instagram: String(form.get('instagram') || ''),
      github: String(form.get('github') || ''),
      linkedin: String(form.get('linkedin') || ''),
      whatsapp: String(form.get('whatsapp') || ''),
      email: String(form.get('email') || ''),
    };
    setSettings(nextSettings);
    pushToast('Settings saved.', 'success');
  }

  if (!loggedIn) {
    return (
      <div className="grid min-h-[620px] place-items-center">
        <form onSubmit={(e) => void login(e)} className="soft-card w-full max-w-md rounded-lg p-9">
          <div className="mx-auto mb-8 grid h-16 w-16 place-items-center rounded-lg bg-blue-500/10 text-blue-400">
            <Lock className="h-8 w-8" />
          </div>
          <h1 className="text-center text-3xl font-extrabold">Admin Login</h1>
          <p className="mt-3 text-center text-slate-400">Sign in to manage your portfolio</p>
          <label className="mb-3 mt-10 block text-sm font-bold text-slate-300">Password</label>
          <input name="password" type="password" placeholder="Enter password" required className="form-input mb-7" />
          <button className="inline-flex w-full items-center justify-center gap-3 rounded-lg bg-white px-7 py-4 font-bold text-slate-950">
            Sign In <ArrowRight className="h-5 w-5" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold">Dashboard</h1>
          <p className="mt-2 text-slate-400">Manage your portfolio content</p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-4 py-3 text-sm font-bold text-slate-300">
            <ArrowLeft className="h-4 w-4" /> View Site
          </button>
          <button
            onClick={() => {
              sessionStorage.removeItem('yash-admin');
              setLoggedIn(false);
            }}
            className="rounded-lg bg-red-500/10 px-4 py-3 text-sm font-bold text-red-300"
          >
            Sign Out
          </button>
        </div>
      </div>

      <div className="mb-9 flex gap-4">
        <button onClick={() => setTab('projects')} className={`rounded-lg px-5 py-3 text-sm font-bold ${tab === 'projects' ? 'bg-white text-slate-950' : 'text-slate-400'}`}>
          Projects
        </button>
        <button onClick={() => setTab('settings')} className={`rounded-lg px-5 py-3 text-sm font-bold ${tab === 'settings' ? 'bg-white text-slate-950' : 'text-slate-400'}`}>
          Site Settings
        </button>
      </div>

      {tab === 'projects' ? (
        <div>
          <div className="mb-6 flex items-center justify-between">
            <p className="text-slate-400">{projects.length} projects</p>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  const normalized = normalizeDisplayOrder(projects);
                  onReorderProjects(normalized).catch(() => {});
                }} 
                className="inline-flex items-center gap-2 rounded-lg bg-slate-800 px-5 py-3 text-sm font-bold text-slate-300 hover:bg-slate-700 transition"
              >
                <RefreshCw className="h-4 w-4" /> Reset Order
              </button>
              <button onClick={() => setEditing(emptyProject())} className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 transition">
                <Plus className="h-4 w-4" /> Add Project
              </button>
            </div>
          </div>

          {editing ? (
            <form onSubmit={saveProject} className="soft-card mb-8 rounded-lg p-6">
              <div className="grid gap-4 md:grid-cols-2">
                <input name="title" defaultValue={editing.title} placeholder="Project title" required className="form-input" />
                <div className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 p-3 light:bg-white/70">
                  <input name="thumbnail_existing" type="hidden" value={editing.thumbnail_url || ''} />
                  <div className="grid gap-3 sm:grid-cols-[120px_1fr]">
                    <div className="grid h-24 place-items-center overflow-hidden rounded-md border border-slate-700 bg-slate-950/60 light:border-blue-200 light:bg-blue-50">
                      {uploadPreview ? (
                        <img src={optimizeImage(uploadPreview)} alt="Project preview" className="h-full w-full object-cover" />
                      ) : (
                        <span className="px-3 text-center text-xs font-bold text-slate-400">No image</span>
                      )}
                    </div>
                    <label className="flex cursor-pointer flex-col justify-center rounded-md px-3 py-2 text-sm font-bold text-blue-300 transition hover:bg-blue-500/10 light:text-blue-700">
                      {uploadPreview ? 'Change picture' : 'Upload project image'}
                      <span className="mt-1 text-xs font-medium text-slate-400">PNG, JPG, WebP, GIF, or AVIF (Max 10MB)</span>
                      <input
                        name="thumbnail_file"
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={(event) => {
                          const file = event.currentTarget.files?.[0];
                          if (file) {
                            const validation = validateImageFile(file);
                            if (!validation.valid) {
                              pushToast(validation.error || 'Invalid file.', 'error');
                              event.currentTarget.value = '';
                              return;
                            }
                            setSelectedFile(file);
                            setUploadPreview(URL.createObjectURL(file));
                          }
                        }}
                      />
                    </label>
                  </div>
                </div>

                <input name="live_link" defaultValue={editing.live_link} placeholder="Live link" className="form-input" />
                <input name="github_link" defaultValue={editing.github_link} placeholder="Repository link" className="form-input" />
                <textarea
                  name="tech_stack"
                  defaultValue={editing.tech_stack.join('\n')}
                  placeholder="Languages / tech, one per line: React, TypeScript, Supabase"
                  rows={3}
                  className="form-input resize-none md:col-span-2"
                />
                <textarea name="description" defaultValue={editing.description} placeholder="Description" rows={3} className="form-input resize-none md:col-span-2" />
              </div>

              {uploadProgress !== null && (
                <div className="mt-4 rounded-lg bg-slate-900/80 p-3">
                  <div className="flex items-center justify-between text-xs font-bold text-blue-400">
                    <span>Uploading image to Cloudinary CDN...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-blue-500 via-sky-400 to-emerald-400 transition-all duration-150"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              <label className="mt-5 flex items-center gap-3 text-sm font-bold text-slate-300">
                <input name="featured" type="checkbox" defaultChecked={editing.featured} /> Featured project
              </label>

              <div className="mt-6 flex gap-3">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-bold text-slate-950 disabled:opacity-50"
                >
                  <Save className="h-4 w-4" /> {isSaving ? 'Saving...' : 'Save Project'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setSelectedFile(null);
                    setUploadProgress(null);
                  }}
                  className="rounded-lg border border-slate-700 px-5 py-3 text-sm font-bold text-slate-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : null}

          <Reorder.Group axis="y" values={projects} onReorder={(reordered) => {
            const normalized = normalizeDisplayOrder(reordered);
            onReorderProjects(normalized).catch(() => {});
          }} className="grid gap-4">
            {projects.map((project) => (
              <Reorder.Item value={project} key={project.id} id={project.id} className="soft-card grid items-center gap-4 rounded-lg p-4 md:grid-cols-[auto_76px_1fr_auto]">
                <div className="flex cursor-grab flex-col items-center gap-2 text-slate-500 hover:text-slate-300 active:cursor-grabbing">
                  <GripVertical className="h-5 w-5" />
                  <span className="text-xs font-bold text-slate-600">{project.display_order}</span>
                </div>
                <img src={generateThumbnail(project.thumbnail_url, 160, 112)} alt="" className="h-14 w-20 rounded-md object-cover" />
                <div className="min-w-0">
                  <h3 className="truncate font-extrabold">
                    {project.title} {project.featured ? <span className="text-yellow-400">*</span> : null}
                  </h3>
                  <p className="truncate text-sm text-slate-400">{project.description}</p>
                </div>
                <div className="flex items-center gap-3 text-slate-400">
                  <button onClick={() => {
                    const next = moveProjectUp(projects, project.id);
                    if (next !== projects) onReorderProjects(next).catch(() => {});
                  }} aria-label="Move Up" className="hover:text-blue-400 transition">
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button onClick={() => {
                    const next = moveProjectDown(projects, project.id);
                    if (next !== projects) onReorderProjects(next).catch(() => {});
                  }} aria-label="Move Down" className="hover:text-blue-400 transition">
                    <ArrowDown className="h-4 w-4" />
                  </button>
                  <div className="mx-1 h-4 w-px bg-slate-700" />
                  <a href={project.live_link} target="_blank" rel="noreferrer" aria-label="Open live project" className="hover:text-blue-400 transition">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                  <a href={project.github_link} target="_blank" rel="noreferrer" aria-label="Open GitHub" className="hover:text-blue-400 transition">
                    <Github className="h-4 w-4" />
                  </a>
                  <button onClick={() => setEditing(project)} aria-label="Edit project" className="hover:text-blue-400 transition">
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        await onDeleteProject(project.id);
                        pushToast('Project deleted.', 'success');
                      } catch (error) {
                        pushToast(error instanceof Error ? error.message : 'Project could not be deleted.', 'error');
                      }
                    }}
                    aria-label="Delete project"
                    className="hover:text-red-400 transition"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Reorder.Item>
            ))}
          </Reorder.Group>
        </div>
      ) : (
        <form onSubmit={saveSettings} className="grid gap-7">
          <div className="soft-card rounded-lg p-6">
            <h2 className="mb-6 text-xl font-extrabold">Homepage Content</h2>
            <label className="mb-3 block text-sm font-bold text-slate-300">Hero Subtitle</label>
            <textarea name="heroSubtitle" defaultValue={settings.heroSubtitle} rows={3} className="form-input mb-6 resize-none" />
            <label className="mb-3 block text-sm font-bold text-slate-300">About Text</label>
            <textarea name="aboutText" defaultValue={settings.aboutText} rows={5} className="form-input resize-none" />
          </div>
          <div className="soft-card rounded-lg p-6">
            <h2 className="mb-6 text-xl font-extrabold">Skills</h2>
            <label className="mb-3 block text-sm font-bold text-slate-300">Edit or add skills, one per line</label>
            <textarea name="skills" defaultValue={settings.skills.join('\n')} rows={8} className="form-input resize-none" />
          </div>
          <div className="soft-card rounded-lg p-6">
            <h2 className="mb-6 text-xl font-extrabold">Technologies / Languages</h2>
            <label className="mb-3 block text-sm font-bold text-slate-300">Edit or add technologies, one per line</label>
            <textarea name="technologies" defaultValue={settings.technologies.join('\n')} rows={8} className="form-input resize-none" />
          </div>
          <div className="soft-card rounded-lg p-6">
            <h2 className="mb-6 text-xl font-extrabold">Contact + Footer Links</h2>
            <p className="mb-5 text-sm text-slate-400">WhatsApp and Email power the Contact page. Instagram, GitHub, and LinkedIn power the footer icons.</p>
            {(['whatsapp', 'email', 'instagram', 'github', 'linkedin'] as const).map((key) => (
              <label key={key} className="mb-5 block text-sm font-bold capitalize text-slate-300">
                {key === 'whatsapp' ? 'WhatsApp number or wa.me URL' : key === 'email' ? 'Email address' : `${key} URL`}
                <input name={key} defaultValue={settings[key]} className="form-input mt-3" />
              </label>
            ))}
          </div>
          <button className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-6 py-4 font-bold text-slate-950">
            <Save className="h-4 w-4" /> Save Settings
          </button>
        </form>
      )}
    </div>
  );
}

function emptyProject(): Project {
  return {
    id: '',
    title: '',
    description: '',
    thumbnail_url: '',
    live_link: '',
    github_link: '',
    tech_stack: [],
    featured: false,
    category: 'Web App',
    display_order: 0,
  };
}

export default function App() {
  const { messages, pushToast } = useToasts();
  const [projects, setProjectsState] = useState<Project[]>(initialProjects);
  const [settings, setSettingsState] = useState<SiteSettings>(readStoredSettings);

  const setSettings = (nextSettings: SiteSettings) => {
    setSettingsState(nextSettings);
    localStorage.setItem(configStorageKey, JSON.stringify(nextSettings));
  };

  useEffect(() => {
    document.body.classList.remove('light-surface');
  }, []);

  async function persistToGitHub(newProjects: Project[]) {
    const res = await fetch('/api/save-projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projects: newProjects })
    });
    
    if (!res.ok) {
      if (res.status === 401) {
        sessionStorage.removeItem('yash-admin');
        window.location.reload();
        throw new Error('Your session has expired. Please log in again.');
      }
      const err = await res.json().catch(() => ({ error: 'Failed to contact API' }));
      throw new Error(err.error || 'Failed to save to GitHub');
    }
  }

  async function saveProjectLocally(project: Project) {
    const isUpdate = projects.some((item) => item.id === project.id);
    const newDisplayOrder = Math.max(0, ...projects.map(p => p.display_order || 0)) + 1;

    const nextProject = {
      ...project,
      display_order: isUpdate ? project.display_order : newDisplayOrder,
    };

    const nextProjects = isUpdate 
      ? projects.map((item) => (item.id === nextProject.id ? nextProject : item)) 
      : [nextProject, ...projects];

    await persistToGitHub(nextProjects);
    setProjectsState(nextProjects);
  }

  async function deleteProjectLocally(projectId: string) {
    const targetProject = projects.find((p) => p.id === projectId);

    // Automatically remove Cloudinary asset to prevent orphaned storage
    if (targetProject?.thumbnail_url) {
      void deleteImage(targetProject.thumbnail_url);
    }
    
    const remaining = projects.filter((project) => project.id !== projectId);
    const normalized = normalizeDisplayOrder(remaining);
    
    await persistToGitHub(normalized);
    setProjectsState(normalized);
  }

  async function saveOrderLocally(reorderedProjects: Project[]) {
    await persistToGitHub(reorderedProjects);
    setProjectsState(reorderedProjects);
    pushToast('Project order updated. Vercel is building the site!', 'success');
  }

  // Use display_order for all lists
  const sortedProjects = [...projects].sort((a, b) => (a.display_order || 0) - (b.display_order || 0));
  const featuredProjects = sortedProjects;

  return (
    <AppShell>
      <Toasts messages={messages} />
      <Routes>
        <Route path="/" element={<Home settings={settings} projects={featuredProjects} />} />
        <Route path="/projects" element={<Projects projects={projects} />} />
        <Route path="/contact" element={<Contact settings={settings} pushToast={pushToast} />} />
        <Route
          path="/admin"
          element={
            <Admin
              projects={projects}
              onSaveProject={saveProjectLocally}
              onDeleteProject={deleteProjectLocally}
              onReorderProjects={saveOrderLocally}
              settings={settings}
              setSettings={setSettings}
              pushToast={pushToast}
            />
          }
        />
      </Routes>
      <footer className="mx-auto mt-20 flex max-w-[1050px] items-center justify-between border-t border-slate-800 py-8 text-sm text-slate-500 light:border-blue-200 light:text-slate-600">
        <span>© 2026 Yash Bajaj. All rights reserved.</span>
        <span className="flex items-center gap-4">
          <a href={settings.instagram} target="_blank" rel="noreferrer" aria-label="Instagram" className="transition hover:text-blue-400"><Instagram className="h-4 w-4" /></a>
          <a href={settings.github} target="_blank" rel="noreferrer" aria-label="GitHub" className="transition hover:text-blue-400"><Github className="h-4 w-4" /></a>
          <a href={settings.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="transition hover:text-blue-400"><Linkedin className="h-4 w-4" /></a>
        </span>
      </footer>
    </AppShell>
  );
}
