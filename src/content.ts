export const WHATSAPP = 'https://wa.me/244934859240'
export const EMAIL = 'mdbusinessorg@gmail.com'
export const PHONE = '+244 934 859 240'

export interface Plan {
  id: string
  group: 'Landing Page' | 'Website' | 'Corporativo'
  name: string
  price: number | null
  desc: string
  features: string[]
}

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
    id: 'corporativo',
    group: 'Corporativo',
    name: 'Corporativo de Alto Nível',
    price: null,
    desc: 'Soluções de engenharia empresarial. Sistemas sob medida e arquitectura exclusiva.',
    features: ['IA Integrada', 'Sistemas Customizados', 'Segurança Robusta'],
  },
]

export interface Service {
  num: string
  title: string
  desc: string
  tags: string[]
  img: string
}

export const SERVICES: Service[] = [
  {
    num: '01',
    title: 'Landing Pages',
    desc: 'Páginas de alta conversão com design cinematográfico e carregamento ultra-rápido.',
    tags: ['Comercial', 'Especializada', 'Cinematográfica'],
    img: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=70&auto=format&fit=crop',
  },
  {
    num: '02',
    title: 'Websites & Plataformas',
    desc: 'Plataformas institucionais e sistemas web sob medida para escalar o seu negócio.',
    tags: ['Institucional', 'CMS', 'SEO Avançado'],
    img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=70&auto=format&fit=crop',
  },
  {
    num: '03',
    title: 'Sistemas & SaaS',
    desc: 'Sistemas de CRM e BI customizados para decisões baseadas em dados.',
    tags: ['Dashboards', 'Pagamentos', 'Automação'],
    img: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=70&auto=format&fit=crop',
  },
  {
    num: '04',
    title: 'E-Commerce',
    desc: 'Lojas profissionais com catálogo, pagamentos e gestão integrada.',
    tags: ['Catálogo', 'Checkout', 'Inventário'],
    img: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=70&auto=format&fit=crop',
  },
  {
    num: '05',
    title: 'Branding Digital',
    desc: 'Interfaces cinematográficas premium que transmitem autoridade imediata.',
    tags: ['Identidade', 'Motion', 'Editorial'],
    img: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=70&auto=format&fit=crop',
  },
  {
    num: '06',
    title: 'Automação & IA',
    desc: 'Automação inteligente e fluxos de trabalho digitais integrados.',
    tags: ['Assistentes IA', 'Workflows', 'Integrações'],
    img: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=70&auto=format&fit=crop',
  },
]

export interface Project {
  title: string
  category: string
  desc: string
  tech: string[]
  img: string
}

export const PROJECTS: Project[] = [
  {
    title: 'Grupo Luanda',
    category: 'Landing Page Premium',
    desc: 'Landing page cinematográfica com animações avançadas e taxa de conversão superior.',
    tech: ['Next.js', 'Framer Motion', 'Tailwind'],
    img: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&q=70&auto=format&fit=crop',
  },
  {
    title: 'StartUp AO',
    category: 'Sistema Web Completo',
    desc: 'SaaS completo com dashboard analytics, gestão de utilizadores e pagamentos.',
    tech: ['React', 'Supabase', 'Stripe'],
    img: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=70&auto=format&fit=crop',
  },
  {
    title: 'Plataforma Digital',
    category: 'Website Institucional',
    desc: 'Presença digital de autoridade com sistema de gestão integrado e design premium.',
    tech: ['TypeScript', 'CMS', 'SEO'],
    img: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&q=70&auto=format&fit=crop',
  },
  {
    title: 'Commerce AO',
    category: 'E-Commerce',
    desc: 'Loja online completa com catálogo dinâmico, pagamentos e logística integrada.',
    tech: ['Next.js', 'Supabase', 'WhatsApp API'],
    img: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=1200&q=70&auto=format&fit=crop',
  },
]

export interface Testimonial {
  quote: string
  name: string
  role: string
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      'A MD Business transformou completamente a nossa presença digital. O website que desenvolveram superou todas as expectativas — moderno, rápido e com resultados reais em conversão.',
    name: 'Cliente Corporativo',
    role: 'Director, Grupo Empresarial',
  },
  {
    quote:
      'Profissionalismo e excelência técnica. A equipa entregou um sistema digital que nos posicionou como líderes no nosso sector. Recomendo sem hesitação.',
    name: 'Parceiro Institucional',
    role: 'CEO, Empresa de Tecnologia',
  },
  {
    quote:
      'Desde a landing page até ao sistema completo de gestão, cada detalhe foi pensado com rigor. A nossa taxa de conversão aumentou 300% no primeiro mês.',
    name: 'Gestora Comercial',
    role: 'Gestora, Imobiliária Premium',
  },
  {
    quote:
      'O design cinematográfico e as animações são de outro nível. Os nossos clientes ficam impressionados com a qualidade visual do nosso website.',
    name: 'Empreendedor',
    role: 'Fundador, StartUp AO',
  },
]

export const STATS = [
  { value: 30, suffix: '+', label: 'Projectos Concluídos' },
  { value: 300, suffix: '%', label: 'Aumento Médio de Conversão' },
  { value: 24, suffix: 'h', label: 'Tempo Médio de Resposta' },
  { value: 98, suffix: '%', label: 'Satisfação do Cliente' },
]

export const FAQS = [
  {
    q: 'Que métodos de pagamento aceitam?',
    a: 'Aceitamos transferência bancária (Angola), Multicaixa Express, e pagamentos internacionais. O pagamento é dividido em duas fases: 50% no início do projecto e 50% na entrega final aprovada.',
  },
  {
    q: 'Os websites são optimizados para dispositivos móveis?',
    a: 'Absolutamente. Todos os nossos projectos são desenvolvidos com abordagem mobile-first, garantindo uma experiência perfeita em qualquer dispositivo — telemóvel, tablet ou desktop.',
  },
  {
    q: 'Oferecem suporte após a entrega do projecto?',
    a: 'Sim. Cada plano inclui um período de suporte técnico e os planos superiores incluem suporte prioritário contínuo, actualizações e monitorização.',
  },
  {
    q: 'Quanto tempo demora um projecto?',
    a: 'O prazo depende do plano e do âmbito do projecto. Após confirmar o plano, definimos consigo um prazo e pode acompanhá-lo em cada etapa.',
  },
  {
    q: 'Os websites incluem SEO?',
    a: 'Sim! Os nossos planos incluem SEO (básico nas Landing Pages e avançado nos Websites superiores) para melhorar a sua visibilidade no Google.',
  },
]

export const PAIN_POINTS = [
  {
    pain: 'Processos manuais lentos e propensos a erro.',
    gain: 'Automação inteligente e fluxos de trabalho digitais integrados.',
  },
  {
    pain: 'Presença digital genérica e de baixo impacto.',
    gain: 'Interfaces cinematográficas premium que transmitem autoridade imediata.',
  },
  {
    pain: 'Dificuldade em escalar operações e gerir leads.',
    gain: 'Sistemas de CRM e BI customizados para decisões baseadas em dados.',
  },
]
