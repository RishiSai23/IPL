// src/lib/motion.ts
import type { Variants } from "framer-motion";

export const easeOutExpo = [0.16, 1, 0.3, 1] as const;

export const staggerContainer: Variants = {
  hidden: { opacity: 1 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: easeOutExpo },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const slideIn = (
  direction: "left" | "right" | "up" | "down" = "up"
): Variants => {
  const offset = 40;
  const map = {
    left: { x: -offset, y: 0 },
    right: { x: offset, y: 0 },
    up: { x: 0, y: offset },
    down: { x: 0, y: -offset },
  } as const;

  return {
    hidden: { opacity: 0, ...map[direction] },
    show: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: { duration: 0.7, ease: easeOutExpo },
    },
  };
};