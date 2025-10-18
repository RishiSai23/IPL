// src/components/icons/CricketBall.tsx
import React, { forwardRef } from "react";

type Props = React.SVGProps<SVGSVGElement>;

const CricketBall = forwardRef<SVGSVGElement, Props>(
  ({ className, ...props }, ref) => {
    return (
      <svg
        ref={ref}
        viewBox="0 0 200 200"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        role="img"
        aria-label="Cricket ball"
        preserveAspectRatio="xMidYMid meet"
        {...props}
      >
        <defs>
          <radialGradient id="ballGrad" cx="40%" cy="35%" r="70%">
            <stop offset="0%" stopColor="#ff5a58" />
            <stop offset="55%" stopColor="#d62525" />
            <stop offset="100%" stopColor="#7a0c0c" />
          </radialGradient>
          <radialGradient id="shineGrad" cx="35%" cy="30%" r="35%">
            <stop offset="0%" stopColor="white" stopOpacity="0.9" />
            <stop offset="60%" stopColor="white" stopOpacity="0.25" />
            <stop offset="100%" stopColor="white" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="seamBase" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#400808" />
            <stop offset="50%" stopColor="#5a0a0a" />
            <stop offset="100%" stopColor="#400808" />
          </linearGradient>
          <filter id="ballShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="6"
              floodColor="#e44d26"
              floodOpacity="0.35"
            />
          </filter>
        </defs>

        {/* main sphere */}
        <circle
          cx="100"
          cy="100"
          r="88"
          fill="url(#ballGrad)"
          filter="url(#ballShadow)"
        />

        {/* seams */}
        <g transform="rotate(-20 100 100)">
          <path
            d="M20 80 C 60 65, 140 65, 180 80"
            stroke="url(#seamBase)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />
          <path
            d="M20 120 C 60 105, 140 105, 180 120"
            stroke="url(#seamBase)"
            strokeWidth="10"
            strokeLinecap="round"
            fill="none"
            opacity="0.95"
          />

          {/* stitches */}
          <g
            stroke="#f6e4b8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          >
            <path d="M35 77 C 70 63, 130 63, 165 77" strokeDasharray="5 8" />
            <path d="M35 83 C 70 69, 130 69, 165 83" strokeDasharray="5 8" />
            <path d="M35 117 C 70 103, 130 103, 165 117" strokeDasharray="5 8" />
            <path d="M35 123 C 70 109, 130 109, 165 123" strokeDasharray="5 8" />
          </g>
        </g>

        {/* glossy highlight */}
        <ellipse cx="72" cy="64" rx="34" ry="22" fill="url(#shineGrad)" />
      </svg>
    );
  }
);

export default CricketBall;