import type { DataStatus } from './types'

export interface Service {
  num: string
  title: string
  desc: string
  tags: string[]
  img: string
}

export const SERVICES_STATUS: DataStatus = 'real'

export const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Landing Pages',
    desc: 'Páginas de alta conversão com design cinematográfico e carregamento ultra-rápido.',
    tags: ['Comercial', 'Especializada', 'Cinematográfica'],
    img: '/img/service-1.jpg',
  },
  {
    num: '02',
    title: 'Websites & Plataformas',
    desc: 'Plataformas institucionais e sistemas web sob medida para escalar o seu negócio.',
    tags: ['Institucional', 'CMS', 'SEO Avançado'],
    img: '/img/service-2.jpg',
  },
  {
    num: '03',
    title: 'Sistemas & SaaS',
    desc: 'Sistemas de CRM e BI customizados para decisões baseadas em dados.',
    tags: ['Dashboards', 'Pagamentos', 'Automação'],
    img: '/img/service-3.jpg',
  },
  {
    num: '04',
    title: 'E-Commerce',
    desc: 'Lojas profissionais com catálogo, pagamentos e gestão integrada.',
    tags: ['Catálogo', 'Checkout', 'Inventário'],
    img: '/img/service-4.jpg',
  },
  {
    num: '05',
    title: 'Branding Digital',
    desc: 'Interfaces cinematográficas premium que transmitem autoridade imediata.',
    tags: ['Identidade', 'Motion', 'Editorial'],
    img: '/img/service-5.jpg',
  },
  {
    num: '06',
    title: 'Automação & IA',
    desc: 'Automação inteligente e fluxos de trabalho digitais integrados.',
    tags: ['Assistentes IA', 'Workflows', 'Integrações'],
    img: '/img/service-6.jpg',
  },
]
