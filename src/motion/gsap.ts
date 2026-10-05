import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export const EASE = {
  outExpo: 'expo.out',
  inOut: 'expo.inOut',
  power3: 'power3.out',
}

export const DUR = {
  fast: 0.25,
  reveal: 0.7,
  cinematic: 1.1,
}

export const reducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export { gsap, ScrollTrigger }
