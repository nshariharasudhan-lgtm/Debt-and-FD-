'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface YieldNestLogoProps {
  className?: string;
  imgClassName?: string;
  variant?: 'full' | 'compact' | 'icon-only';
  width?: number;
  height?: number;
  priority?: boolean;
}

/**
 * YieldNestLogo Component
 * Serves as the official brand logo placeholder and renderer for YIELDNEST.ONLINE.
 * Renders the authentic original logo provided by the user:
 * - Left mark: Stylized navy nest with 3 golden eggs (FD, bank pillars, bar chart) and green sprout leaves
 * - Brand wordmark: Bold Navy "Yield" + Emerald "Nest" + Navy ".online"
 * - Official tagline: "FIXED INCOME. BRIGHTER TOMORROWS."
 * - Subtitle: "FDs | CORPORATE BONDS | GOVERNMENT BONDS"
 */
export function YieldNestLogo({
  className = '',
  imgClassName = '',
  variant = 'full',
  width: customWidth,
  height: customHeight,
  priority = false,
}: YieldNestLogoProps) {
  const [imgError, setImgError] = useState(false);

  // Generous, prominent display height (default 72px)
  const effectiveHeight = customHeight ?? (variant === 'compact' ? 64 : 76);

  // Exact aspect ratio of the user's authentic trimmed logo: 846 x 266 (~3.1805:1)
  const effectiveWidth =
    customWidth ??
    (variant === 'icon-only'
      ? effectiveHeight
      : Math.round(effectiveHeight * (846 / 266)));

  // If using icon-only
  if (variant === 'icon-only') {
    return (
      <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
        <Image
          src="/icon.png"
          alt="YieldNest.online Icon"
          width={effectiveHeight}
          height={effectiveHeight}
          className={`object-contain ${imgClassName}`}
          priority={priority}
          onError={() => setImgError(true)}
        />
      </div>
    );
  }

  // Official logo renderer with authentic user artwork
  return (
    <div className={`inline-flex items-center shrink-0 max-w-full ${className}`}>
      {!imgError ? (
        <div className="relative flex items-center justify-start w-full h-full">
          <Image
            src="/logo.png"
            alt="YIELDNEST.ONLINE Logo"
            width={effectiveWidth}
            height={effectiveHeight}
            className={`w-auto h-full max-h-full object-contain object-left transition-transform duration-200 group-hover:scale-[1.01] ${imgClassName}`}
            style={{
              maxHeight: `${effectiveHeight}px`,
              aspectRatio: '846 / 266',
            }}
            priority={priority}
            onError={() => setImgError(true)}
          />
        </div>
      ) : (
        /* Fallback Vector if image fails */
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-[#082548] border border-blue-900 flex items-center justify-center shadow-md">
            <span className="text-amber-400 font-black text-sm">FD</span>
          </div>
          <div className="leading-tight">
            <div className="flex items-baseline tracking-tight font-extrabold text-2xl">
              <span className="text-[#082548]">Yield</span>
              <span className="text-[#00875a]">Nest</span>
              <span className="text-[#082548] text-sm font-bold ml-0.5">.online</span>
            </div>
            <p className="text-[11px] text-slate-500 font-bold tracking-wider uppercase">
              FIXED INCOME. BRIGHTER TOMORROWS.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default YieldNestLogo;
