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
 * NOT named client projects; flagged 'placeholder' until real case studies exist.
 */
export const PROJECTS: Project[] = [
  {
    title: 'Campanhas & Redes Sociais',
    category: 'Marketing Digital',
    desc: 'Planeamento de conteúdo, gestão de páginas e campanhas pagas com relatórios mensais de resultados.',
    tech: ['Meta Ads', 'Google Ads', 'Conteúdo'],
    img: '/img/project-1.jpg',
    status: 'placeholder',
  },
  {
    title: 'Sistema de Gestão',
    category: 'Software à Medida',
    desc: 'Plataforma web com utilizadores, permissões, relatórios e dashboards para a operação diária.',
    tech: ['React', 'Supabase', 'Dashboards'],
    img: '/img/project-2.jpg',
    status: 'placeholder',
  },
  {
    title: 'Website Institucional',
    category: 'Desenvolvimento Web',
    desc: 'Presença digital profissional com páginas de serviços, contactos e SEO para ser encontrado no Google.',
    tech: ['TypeScript', 'SEO', 'Responsivo'],
    img: '/img/project-3.jpg',
    status: 'placeholder',
  },
  {
    title: 'Loja Online',
    category: 'E-commerce',
    desc: 'Catálogo de produtos, carrinho e pedidos directos via WhatsApp, com painel de gestão.',
    tech: ['Next.js', 'Supabase', 'WhatsApp'],
    img: '/img/project-4.jpg',
    status: 'placeholder',
  },
]
