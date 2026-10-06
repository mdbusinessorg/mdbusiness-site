export interface Testimonial {
  quote: string
  name: string
  role: string
}

/**
 * No client testimonials could be verified from the old website.
 * The section stays data-driven and renders nothing until real
 * testimonials are added here — never invent quotes.
 */
export const TESTIMONIALS: Testimonial[] = []
