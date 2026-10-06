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
    title: 'Marketing Digital',
    desc: 'Estratégia, campanhas pagas no Meta e Google e análise de resultados para gerar clientes, não apenas visualizações.',
    tags: ['Estratégia', 'Tráfego Pago', 'Relatórios'],
    img: '/img/service-1.jpg',
  },
  {
    num: '02',
    title: 'Redes Sociais & Conteúdo',
    desc: 'Gestão de Instagram, Facebook e LinkedIn com calendário editorial, design de posts e copywriting.',
    tags: ['Gestão', 'Design', 'Copywriting'],
    img: '/img/service-2.jpg',
  },
  {
    num: '03',
    title: 'Branding & Identidade',
    desc: 'Logótipo, paleta, tipografia e manual de marca para uma imagem consistente em todos os canais.',
    tags: ['Logótipo', 'Identidade', 'Manual de Marca'],
    img: '/img/service-3.jpg',
  },
  {
    num: '04',
    title: 'Websites & Landing Pages',
    desc: 'Sites institucionais e páginas de venda rápidos, responsivos e preparados para o Google.',
    tags: ['Institucional', 'Landing Page', 'SEO'],
    img: '/img/service-4.jpg',
  },
  {
    num: '05',
    title: 'Software à Medida',
    desc: 'Sistemas de gestão, CRM, dashboards e plataformas web desenhados à volta dos processos da sua empresa.',
    tags: ['Sistemas', 'CRM', 'Dashboards'],
    img: '/img/service-5.jpg',
  },
  {
    num: '06',
    title: 'Apps, E-commerce & Automação',
    desc: 'Aplicações mobile, lojas online com pedidos via WhatsApp e automações que poupam horas de trabalho manual.',
    tags: ['Android & iOS', 'Lojas Online', 'Automação'],
    img: '/img/service-6.jpg',
  },
]
