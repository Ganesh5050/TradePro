"use client";
import { motion, useScroll, useTransform } from "framer-motion";
import Lenis from "lenis";
import React, { useRef, useEffect } from "react";

interface CardProps {
  i: number;
  title: string;
  content: React.ReactNode;
  progress: any;
  range: [number, number];
  targetScale: number;
}

const StickyCard = ({
  i,
  title,
  content,
  progress,
  range,
  targetScale,
}: CardProps) => {
  const container = useRef<HTMLDivElement>(null);
  const scale = useTransform(progress, range, [1, targetScale]);

  return (
    <div
      ref={container}
      className="sticky flex items-center justify-center"
      style={{
        top: "120px", // Account for navbar height
        zIndex: 10 + i, // Higher index = comes forward (on top)
      }}
    >
      <motion.div
        style={{
          scale,
          top: `${i * 0}px`, // No vertical offset, pure stacking
        }}
        className="rounded-3xl relative flex h-[500px] w-full max-w-5xl origin-center flex-col overflow-hidden bg-white border-2 border-gray-200 shadow-2xl"
      >
        {content}
      </motion.div>
    </div>
  );
};

interface SmoothScrollStackProps {
  cards: Array<{
    title: string;
    content: React.ReactNode;
  }>;
}

const SmoothScrollStack = ({ cards }: SmoothScrollStackProps) => {
  const container = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ["start start", "end end"],
  });

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main
      ref={container}
      className="relative flex w-full flex-col items-center justify-center"
      style={{
        paddingTop: "5vh",
        paddingBottom: `${cards.length * 20}vh`,
      }}
    >
      {cards.map((card, i) => {
        const targetScale = Math.max(0.9, 1 - (cards.length - i - 1) * 0.03);
        return (
          <StickyCard
            key={`card_${i}`}
            i={i}
            title={card.title}
            content={card.content}
            progress={scrollYProgress}
            range={[i * 0.2, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </main>
  );
};

export default SmoothScrollStack;
