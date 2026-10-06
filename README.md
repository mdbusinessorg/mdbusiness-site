# MD Business — Site Institucional V2

Site institucional cinematográfico da MD Business. Projecto **completamente independente** — sem qualquer dependência do domínio, hosting ou backend antigos.

## Stack

Vite + React 19 + TypeScript + Tailwind CSS v4 + GSAP (ScrollTrigger) + Lenis smooth scroll.

## Estrutura

```
src/
  data/          → conteúdo de negócio (business, contact, social, navigation,
                   services, products, projects, testimonials, stats, faq)
  lib/services/  → boundary de backend (ProductService, OrderService,
                   ContactService, LeadService) — cada chamada reporta
                   'real' | 'placeholder' | 'unavailable'
  components/    → secções da página
  motion/        → sistema de motion (SmoothScroll, Reveal, Magnetic, gsap)
  state/         → carrinho de pedidos
public/img/      → todos os assets visuais (locais, sem URLs externos)
```

## Dados de negócio

Todo o conteúdo vive em `src/data/`. Cada ficheiro marca o que é `real`
(informação confirmada do negócio) vs `placeholder` (estrutura pronta,
à espera de conteúdo). Secções sem dados reais (testemunhos, métricas)
não renderizam até receberem conteúdo real — nunca inventar números,
clientes ou avaliações.

## Variáveis de ambiente

Ver `.env.example`. Todas opcionais — existem defaults:

| Variável | Descrição |
| --- | --- |
| `VITE_SITE_URL` | URL pública do deploy (canonical, OG, robots, sitemap) |
| `VITE_WHATSAPP_NUMBER` | Número WhatsApp em formato internacional |
| `VITE_CONTACT_EMAIL` | Email público de contacto |

## Desenvolvimento

```bash
npm ci
npm run dev      # dev server
npm run build    # build de produção em dist/ (base relativa — funciona em qualquer domínio/path)
```

## Deploy

O build usa `base: './'` — o `dist/` corre em qualquer domínio ou subpath
sem rebuild. Para um novo domínio basta definir `VITE_SITE_URL` antes do build.
