import type { DataStatus } from './types'

export interface Project {
  title: string
  category: string
  desc: string
  tech: string[]
  img: string
  status: DataStatus
}

/**
 * Capability showcases — describe the kind of work MD Business delivers.
 * These are NOT named client projects (none could be verified from the old
 * site); each entry is flagged 'placeholder' so the UI never presents them
 * as real client work. Replace with real case studies when available.
 */
export const PROJECTS: Project[] = [
  {
    title: 'Landing Page Cinematográfica',
    category: 'Landing Page Premium',
    desc: 'Exemplo de entrega: página de conversão com animações avançadas, smooth scroll e carregamento instantâneo.',
    tech: ['React', 'GSAP', 'Tailwind'],
    img: '/img/project-1.jpg',
    status: 'placeholder',
  },
  {
    title: 'Plataforma Web Corporativa',
    category: 'Sistema Web Completo',
    desc: 'Exemplo de entrega: SaaS com dashboard analytics, gestão de utilizadores e pagamentos integrados.',
    tech: ['React', 'Supabase', 'Stripe'],
    img: '/img/project-2.jpg',
    status: 'placeholder',
  },
  {
    title: 'Portal Institucional',
    category: 'Website Institucional',
    desc: 'Exemplo de entrega: presença digital de autoridade com gestão de conteúdo e design premium.',
    tech: ['TypeScript', 'CMS', 'SEO'],
    img: '/img/project-3.jpg',
    status: 'placeholder',
  },
  {
    title: 'Loja E-Commerce',
    category: 'E-Commerce',
    desc: 'Exemplo de entrega: loja online com catálogo dinâmico, pagamentos e pedidos via WhatsApp.',
    tech: ['Next.js', 'Supabase', 'WhatsApp'],
    img: '/img/project-4.jpg',
    status: 'placeholder',
  },
]
