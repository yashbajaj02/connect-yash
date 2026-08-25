<div align="center">

# ⚡ Connect

### A Modern Developer Portfolio & Personal Brand Website

A premium, responsive developer portfolio built to showcase projects, skills, certifications, experience, and digital work — with a secure admin panel, Cloudinary-powered media management, and GitHub-based project persistence.

<br />

[![Live Website](https://img.shields.io/badge/🌐_Live_Website-connectyash.vercel.app-000000?style=for-the-badge)](https://connectyash.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-yashbajaj02%2Fconnect--yash-181717?style=for-the-badge&logo=github)](https://github.com/yashbajaj02/connect-yash)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vite.dev)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

<br />

**Designed • Built • Secured • Deployed by Yash Bajaj**

</div>

---

## ✨ Overview

**Connect** is my personal developer portfolio and digital identity platform.

Instead of being just a static portfolio, Connect includes a secure administration system that allows project content to be managed dynamically while keeping the public website fast and lightweight.

The project is designed around a simple principle:

> **Keep the frontend fast. Keep secrets server-side. Keep project data under version control.**

---

## 🚀 Highlights

- ⚡ Modern React + TypeScript architecture
- 🎨 Premium responsive UI
- 🌙 Dark & Light theme
- 📱 Mobile-first responsive layouts
- 📂 Dynamic project showcase
- 🔐 Secure server-side Admin authentication
- ☁️ Cloudinary-powered image management
- 🔄 GitHub-based project persistence
- 🖼️ Optimized image delivery through Cloudinary CDN
- 🎯 Manual project ordering
- 🖱️ Drag & Drop project management
- 📧 Contact form integration
- 🔍 SEO-friendly structure
- ♿ Accessibility-focused UI
- 🚀 Vercel production deployment
- 🛡️ Server-side handling of sensitive credentials

---

# 🧠 Architecture

Connect follows a lightweight architecture where the public website remains mostly static while administrative operations are handled securely through serverless APIs.

```text
                         ┌─────────────────────┐
                         │    Connect Website  │
                         │    React + Vite     │
                         └──────────┬──────────┘
                                    │
                  ┌─────────────────┼─────────────────┐
                  │                 │                 │
                  ▼                 ▼                 ▼
             Cloudinary          Vercel           Formspree
             Images/CDN        Serverless API     Contact Form
                  │                 │
                  │        ┌────────┴────────┐
                  │        │                 │
                  │        ▼                 ▼
                  │   Secure Auth        GitHub API
                  │        │                 │
                  │        │                 ▼
                  │        │          src/data/projects.ts
                  │        │
                  └────────┴────────────────────────────
