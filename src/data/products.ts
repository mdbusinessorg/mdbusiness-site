import type { DataStatus } from './types'

export interface Plan {
  id: string
  group: 'Landing Page' | 'Website' | 'Marketing' | 'Corporativo'
  name: string
  price: number | null
  desc: string
  features: string[]
}

export const PLANS_STATUS: DataStatus = 'real'

export const PLANS: Plan[] = [
  {
    id: 'lp-comercial',
    group: 'Landing Page',
    name: 'Landing Page Comercial',
    price: 25000,
    desc: 'Design moderno focado em conversão e resultados imediatos para o seu negócio.',
    features: ['Responsiva', 'Integração WhatsApp', 'SEO Básico', 'Design Moderno', 'Otimização Mobile'],
  },
  {
    id: 'lp-especializada',
    group: 'Landing Page',
    name: 'Landing Page Especializada',
    price: 35000,
    desc: 'Experiência visual superior com animações customizadas e storytelling estratégico.',
    features: ['Animações Customizadas', 'Storytelling Digital', 'Copywriting de Alto Impacto'],
  },
  {
    id: 'lp-cine',
    group: 'Landing Page',
    name: 'Landing Page Cinematográfica',
    price: 50000,
    desc: 'Rigor visual absoluto. Efeitos imersivos e experiência institucional de alto nível.',
    features: ['Efeitos Visuais Avançados', 'Smooth Scroll Pro', 'Interações Complexas'],
  },
  {
    id: 'web-basico',
    group: 'Website',
    name: 'Website Básico',
    price: null,
    desc: 'Site institucional completo para pequenas empresas e profissionais liberais.',
    features: ['Até 3 Páginas', 'Painel Admin', 'Blog Integrado'],
  },
  {
    id: 'web-pro',
    group: 'Website',
    name: 'Website Profissional',
    price: 40000,
    desc: 'Estrutura robusta para empresas que buscam autoridade e performance.',
    features: ['Até 7 Páginas', 'SEO Avançado', 'Gestão de Conteúdo'],
  },
  {
    id: 'web-empresarial',
    group: 'Website',
    name: 'Website Empresarial',
    price: null,
    desc: 'Solução completa para grandes empresas com necessidades específicas.',
    features: ['Páginas Ilimitadas', 'Multi-idiomas', 'Suporte Prioritário'],
  },
  {
    id: 'marketing-mensal',
    group: 'Marketing',
    name: 'Gestão de Marketing Digital',
    price: null,
    desc: 'Gestão mensal de redes sociais e campanhas pagas, com orçamento definido conforme os objectivos.',
    features: ['Calendário de Conteúdo', 'Design de Posts', 'Campanhas Meta & Google', 'Relatório Mensal'],
  },
  {
    id: 'corporativo',
    group: 'Corporativo',
    name: 'Corporativo de Alto Nível',
    price: null,
    desc: 'Software à medida para empresas: sistemas de gestão, aplicações e integrações.',
    features: ['IA Integrada', 'Sistemas Customizados', 'Segurança Robusta'],
  },
]
