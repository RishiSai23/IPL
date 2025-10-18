// src/components/Hero.tsx
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { gsap, useGSAP, ScrollTrigger } from "@/lib/gsap";
import SplitType from "split-type";

import kohli from "@/assets/players/kohli.png";
import rohit from "@/assets/players/rohit.png";
import CricketBall from "@/components/icons/CricketBall";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement | null>(null);

  // Background parallax via Framer (lightweight)
  const { scrollYProgress } = useScroll({ target: sectionRef });
  const bgY1 = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const bgY2 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"]);

  // Refs for GSAP
  const subtitleRef = useRef<HTMLParagraphElement | null>(null);
  const ctaRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLImageElement | null>(null);
  const rightRef = useRef<HTMLImageElement | null>(null);
  const ballRef = useRef<SVGSVGElement | null>(null); // SVG ball

  useGSAP(
    () => {
      // Split “Cric” (gradient) and “Scout” (white) separately
      const gradientEl = sectionRef.current?.querySelector(
        ".title-gradient"
      ) as HTMLElement | null;
      const whiteEl = sectionRef.current?.querySelector(
        ".title-white"
      ) as HTMLElement | null;

      const splitGradient = gradientEl
        ? new SplitType(gradientEl, { types: "chars" })
        : null;
      const splitWhite = whiteEl
        ? new SplitType(whiteEl, { types: "chars" })
        : null;

      // Apply gradient classes to each “Cric” char (so they remain visible after split)
      if (splitGradient?.chars) {
        splitGradient.chars.forEach((el) =>
          el.classList.add(
            "bg-gradient-to-r",
            "from-orange-500",
            "via-yellow-400",
            "to-pink-500",
            "bg-clip-text",
            "text-transparent"
          )
        );
      }

      // Helper: position the ball above the "i"
      const positionBallAboveI = () => {
        if (!sectionRef.current || !ballRef.current) return;

        // prefer the first "i" in “Cric”
        let iChar: HTMLElement | null = null;
        if (splitGradient?.chars?.length) {
          iChar =
            (splitGradient.chars.find(
              (c) => (c.textContent || "").toLowerCase() === "i"
            ) as HTMLElement) ||
            (splitGradient.chars[2] as HTMLElement | undefined) || // fallback index
            null;
        }
        if (!iChar) return;

        const sectionRect = sectionRef.current.getBoundingClientRect();
        const iRect = iChar.getBoundingClientRect();

        // measure ball to center horizontally
        const ballRect = ballRef.current.getBoundingClientRect();
        const bw = ballRect.width || 64;
        const bh = ballRect.height || bw;

        // center on the "i" and place a little above it
        const left =
          iRect.left - sectionRect.left + iRect.width / 2 - bw / 2;
        const top =
          iRect.top - sectionRect.top - bh * 0.75; // 0.75 places the ball above the glyph

        gsap.set(ballRef.current, { left, top, position: "absolute" });
      };

      // Initial states
      const allChars = [
        ...(splitGradient?.chars ?? []),
        ...(splitWhite?.chars ?? []),
      ];

      // Set base positions and hide
      gsap.set(allChars, {
        opacity: 0,
        yPercent: 110,
        rotateX: 45,
        transformOrigin: "50% 100%",
      });
      gsap.set([subtitleRef.current, ctaRef.current], { opacity: 0, y: 20 });
      gsap.set([leftRef.current, rightRef.current, ballRef.current], {
        opacity: 0,
        y: 40,
      });

      // Ensure ball is placed after layout
      gsap.delayedCall(0, positionBallAboveI);

      // Reposition on resize and when ScrollTrigger refreshes
      const onResize = () => positionBallAboveI();
      window.addEventListener("resize", onResize);
      ScrollTrigger.addEventListener("refresh", onResize);

      // Entry timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.to(allChars, {
        opacity: 1,
        yPercent: 0,
        rotateX: 0,
        stagger: { each: 0.02, from: "center" },
        duration: 0.7,
      })
        .to(
          [subtitleRef.current, ctaRef.current],
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.12 },
          "-=0.25"
        )
        .to(
          [leftRef.current, rightRef.current],
          { opacity: 1, y: 0, duration: 0.9, stagger: 0.1 },
          "-=0.2"
        )
        .to(ballRef.current, { opacity: 1, y: 0, rotate: 360, duration: 1 }, "-=0.6");

      // Scroll parallax for players
      gsap.to([leftRef.current, rightRef.current], {
        y: -60,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Scroll parallax for ball (keeps its anchored x/top, shifts y)
      gsap.to(ballRef.current, {
        y: -120,
        rotate: 360,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // Cleanup
      return () => {
        splitGradient?.revert();
        splitWhite?.revert();
        window.removeEventListener("resize", onResize);
        ScrollTrigger.removeEventListener("refresh", onResize);
      };
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative z-0 flex min-h-[80vh] md:min-h-[90vh] items-center justify-center overflow-hidden bg-black text-white perspective-1000"
    >
      {/* 3D Lights Layer (parallax via Framer) */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,165,0,0.18),_transparent_70%)]"
        style={{ y: bgY1 }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,102,255,0.18),_transparent_70%)]"
        style={{ y: bgY2 }}
      />

      {/* Player Images */}
      <img
        ref={leftRef}
        src={kohli}
        alt="player-left"
        className="pointer-events-none select-none absolute bottom-0 left-6 md:left-16 w-56 md:w-80 opacity-90"
      />
      <img
        ref={rightRef}
        src={rohit}
        alt="player-right"
        className="pointer-events-none select-none absolute bottom-0 right-6 md:right-16 w-56 md:w-80 opacity-90"
      />

      {/* Hero Content */}
      <div className="relative z-10 text-center px-6">
        <h1 className="text-5xl font-extrabold tracking-tight md:text-7xl">
          <span className="title-gradient">Cric</span>
          <span className="title-white text-white">Scout</span>
        </h1>

        <p ref={subtitleRef} className="mt-4 text-lg text-gray-300 md:text-xl">
          Where IPL analytics meet motion design brilliance ⚡
        </p>

        <div ref={ctaRef} className="mt-8 flex flex-wrap justify-center gap-4">
          <a
            href="/analysis"
            className="rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 px-6 py-3 text-lg font-semibold shadow-lg shadow-orange-500/30 transition-transform hover:scale-105"
          >
            Explore Analytics
          </a>
          <a
            href="/comparison"
            className="rounded-xl border border-gray-500/40 px-6 py-3 text-lg font-semibold text-gray-200 hover:bg-white/10 transition-all"
          >
            Compare Players
          </a>
        </div>
      </div>

      {/* Cricket Ball (anchored above the "i" in Cric) */}
      <CricketBall
        ref={ballRef}
        className="pointer-events-none select-none absolute w-16 md:w-20 z-20"
      />
    </section>
  );
}