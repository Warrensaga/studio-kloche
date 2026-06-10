import React from "react";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "mark";
  size?: number | string;
  className?: string;
  light?: boolean; // If true, optimizes text color for dark backgrounds
}

export default function Logo({
  variant = "horizontal",
  size,
  className = "",
  light = false,
}: LogoProps) {
  // Brand color hex codes (exactly matching Kloche's verified logo palette)
  const brandGreen = "#0F6051"; // Rich, elegant emerald-green
  const brandGold = "#FAB012";  // Vibrant golden accent from the logo leaf
  const brandBrown = "#3D2322"; // Chocolate brown detailing on the golden leaf
  const textDark = "#1C1C1A";   // Deep charcoal for light backgrounds
  const textLight = "#FFFFFF";  // Crisp white/cream for dark backgrounds
  const textOlive = "#7A8B7B";  // Muted sage-olive for "Interiors" subtitle

  // Outer Leaf Path (top-left petal base layout, rotated clockwise for others)
  // Symmetric organic curves meetings at center 47,47 with space-hairline cross
  const leafPath = "M 46,46 C 34,46 12,38 12,28 C 12,18 18,12 28,12 C 38,12 46,34 46,46 Z";

  const renderLogoMark = (markSize: number) => {
    return (
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 drop-shadow-sm"
      >
        {/* Top-Left Petal: Kloche Emerald-Green */}
        <path
          d={leafPath}
          fill={brandGreen}
        />

        {/* Bottom-Left Petal: Kloche Emerald-Green (Rotated 270 degrees clockwise / 90 degrees CCW) */}
        <g transform="rotate(270 50 50)">
          <path
            d={leafPath}
            fill={brandGreen}
          />
        </g>

        {/* Bottom-Right Petal: Kloche Emerald-Green (Rotated 180 degrees) */}
        <g transform="rotate(180 50 50)">
          <path
            d={leafPath}
            fill={brandGreen}
          />
        </g>

        {/* Top-Right Petal: Kloche Golden Accent (Rotated 90 degrees) */}
        <g transform="rotate(90 50 50)">
          <path
            d={leafPath}
            fill={brandGold}
          />
          {/* Detailed brown spots inside the golden leaf (translated within the base top-left cell coords) */}
          <circle cx="28" cy="28" r="4.2" fill={brandBrown} />
          <circle cx="20" cy="18" r="2.2" fill={brandBrown} />
        </g>
      </svg>
    );
  };

  const textStyle = light ? textLight : textDark;

  if (variant === "mark") {
    const markSize = typeof size === "number" ? size : 48;
    return <div className={`inline-flex items-center justify-center ${className}`}>{renderLogoMark(markSize)}</div>;
  }

  if (variant === "vertical") {
    return (
      <div className={`flex flex-col items-center text-center ${className}`}>
        {renderLogoMark(typeof size === "number" ? size : 85)}
        <div className="mt-4 flex flex-col items-center">
          {/* Main "Kloche" luxury serif */}
          <span
            className="font-serif text-3xl md:text-4xl font-semibold tracking-wider leading-none"
            style={{ color: textStyle }}
          >
            Kloche
          </span>
          {/* Muted subtitle with line accent exactly as shown in the logo */}
          <div className="flex items-center gap-3 mt-2.5">
            <span className="h-[1.5px] w-12" style={{ backgroundColor: brandGold }} />
            <span
              className="font-sans text-xs uppercase tracking-[0.25em] font-medium"
              style={{ color: textOlive }}
            >
              Interiors
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Horizontal navbar variant
  return (
    <div className={`flex items-center gap-4 ${className}`}>
      {renderLogoMark(typeof size === "number" ? size : 40)}
      <div className="flex flex-col text-left justify-center leading-none">
        <span
          className="font-serif text-xl md:text-2xl font-bold tracking-wider leading-none mb-1"
          style={{ color: textStyle }}
        >
          Kloche
        </span>
        <div className="flex items-center gap-1.5 pt-0.5">
          <span className="h-[1px] w-4" style={{ backgroundColor: brandGold }} />
          <span
            className="font-sans text-[9px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: textOlive }}
          >
            Interiors
          </span>
        </div>
      </div>
    </div>
  );
}
