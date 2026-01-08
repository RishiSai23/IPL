import { useEffect, useState } from "react";
import { motion } from "framer-motion";

const ScrollProgress = () => {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const scrolled = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(scrolled);

      setVisible(scrollTop > 200);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.4 }}
      className="fixed bottom-8 right-8 z-50"
    >
      <div
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
        className="w-12 h-12 rounded-full bg-black/60 backdrop-blur border border-teal-500/40 flex items-center justify-center cursor-pointer"
      >
        <svg className="w-8 h-8 rotate-[-90deg]">
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="2"
            fill="none"
          />
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="#2dd4bf"
            strokeWidth="2"
            fill="none"
            strokeDasharray={2 * Math.PI * 14}
            strokeDashoffset={
              2 * Math.PI * 14 * (1 - progress)
            }
          />
        </svg>
      </div>
    </motion.div>
  );
};

export default ScrollProgress;
