/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeMap = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-40 h-40',
  };

  return (
    <div id="la_fuente_logo_container" className={`relative flex items-center justify-center select-none ${sizeMap[size]} ${className}`}>
      {/* 
        This is a high-fidelity SVG illustration representing "La Fuente Sandwicheria"
        - Circular black background
        - Maestro sanguchero character (German-Chilean alpine outfit, green hat with feather, green vest, beard)
        - Delicious tiered sandwich
        - Traditional gothic calligraphy styled "la fuente" text in high-contrast white & golden outline
        - Orange/red double accent underline ribbon
        - "sandwicheria" in elegant serif lettering
      */}
      <svg id="la_fuente_logo_svg" viewBox="0 0 400 400" className="w-full h-full drop-shadow-xl">
        {/* Circle background */}
        <circle cx="200" cy="200" r="190" fill="#000000" stroke="#f1c40f" strokeWidth="2.5" />
        
        {/* Background Aura */}
        <circle cx="200" cy="200" r="140" fill="none" stroke="#222" strokeWidth="1" strokeDasharray="5,5" />

        {/* Character: Maestro Sanguchero */}
        <g id="maestro_character" transform="translate(140, 100)">
          {/* Alpine Feather on Hat */}
          <path d="M 52 -18 C 55 -32, 65 -45, 60 -48 C 55 -50, 48 -35, 48 -20" fill="#F9FAFB" stroke="#9CA3AF" strokeWidth="0.8" />
          
          {/* Green Alpine Hat */}
          <path d="M 22 -15 C 22 -35, 78 -35, 78 -15 Z" fill="#2d5a27" />
          <ellipse cx="50" cy="-14" rx="32" ry="5" fill="#1b3b18" />
          {/* Hat Ribbon (Gold) */}
          <path d="M 21 -15 C 35 -18, 65 -18, 79 -15 C 79 -13, 21 -13, 21 -15" fill="#e67e22" />

          {/* Hair & Ears */}
          <path d="M 25 -10 C 20 -10, 18 5, 23 8" fill="#5c3f15" stroke="#372506" strokeWidth="1" />
          <path d="M 75 -10 C 80 -10, 82 5, 77 8" fill="#5c3f15" stroke="#372506" strokeWidth="1" />

          {/* Ear details */}
          <path d="M 18 -2 C 16 -2, 14 5, 18 7" fill="#dfaa81" />
          <path d="M 82 -2 C 84 -2, 86 5, 82 7" fill="#dfaa81" />

          {/* Skin: Head & Face */}
          <path d="M 22 -10 C 22 -13, 78 -13, 78 -10 C 78 15, 68 30, 50 35 C 32 30, 22 15, 22 -10" fill="#dfaa81" />

          {/* Beard & Mustache */}
          <path d="M 20 8 C 20 28, 30 45, 50 48 C 70 45, 80 28, 80 8 C 75 14, 70 16, 50 16 C 30 16, 25 14, 20 8" fill="#36220F" stroke="#1C1007" strokeWidth="0.5" />
          <path d="M 33 13 C 40 10, 47 14, 50 16 C 53 14, 60 10, 67 13 C 65 17, 58 20, 50 20 C 42 20, 35 17, 33 13 Z" fill="#1a1107" />

          {/* Eyes (Happy and focused) */}
          <circle cx="38" cy="2" r="3" fill="#2c3e50" />
          <circle cx="62" cy="2" r="3" fill="#2c3e50" />
          {/* Eyebrows */}
          <path d="M 32 -3 Q 38 -7 44 -2" fill="none" stroke="#22140A" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M 68 -3 Q 62 -7 56 -2" fill="none" stroke="#22140A" strokeWidth="1.5" strokeLinecap="round" />
          
          {/* Blush */}
          <circle cx="30" cy="8" r="4" fill="#e74c3c" opacity="0.3" />
          <circle cx="70" cy="8" r="4" fill="#e74c3c" opacity="0.3" />

          {/* Smile and teeth */}
          <path d="M 43 14 Q 50 18 57 14" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />

          {/* Neck */}
          <path d="M 40 32 L 40 45 L 60 45 L 60 32 Z" fill="#dfaa81" />

          {/* White Chef Shirt with Collar */}
          <path d="M 20 45 L 80 45 L 90 85 L 10 85 Z" fill="#F9FAFB" />
          {/* Collar v-neck */}
          <path d="M 40 45 L 50 55 L 60 45 L 50 32 Z" fill="#E5E7EB" />
          <path d="M 30 45 L 42 58 L 40 45 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="0.5" />
          <path d="M 70 45 L 58 58 L 60 45 Z" fill="#F3F4F6" stroke="#9CA3AF" strokeWidth="0.5" />

          {/* Green Alpine Vest with Suspenders */}
          <path d="M 12 45 L 35 45 L 35 85 L 10 85 Z" fill="#2d5a27" />
          <path d="M 88 45 L 65 45 L 65 85 L 90 85 Z" fill="#2d5a27" />
          {/* Vest Suspenders straps */}
          <rect x="35" y="45" width="8" height="40" fill="#4B5320" />
          <rect x="57" y="45" width="8" height="40" fill="#4B5320" />
          {/* Golden vest buckles */}
          <circle cx="39" cy="55" r="2.5" fill="#f1c40f" />
          <circle cx="61" cy="55" r="2.5" fill="#f1c40f" />
          {/* Brown horizontal chest strap */}
          <rect x="35" y="65" width="30" height="7" fill="#5c3f15" rx="1.5" />
          <rect x="42" y="66" width="16" height="5" fill="#df9413" rx="1" />
        </g>

        {/* Hand carrying plate - Left Hand (viewer's left) */}
        <g id="maestro_arm_carrying" transform="translate(180, 130)">
          {/* Sleeve */}
          <path d="M -40 50 Q -32 58 -20 54 L -23 42 Q -35 45 -40 50" fill="#F9FAFB" stroke="#E5E7EB" strokeWidth="0.5" />
          {/* Arm extending to plate */}
          <path d="M -20 54 Q -3 68 15 48" fill="none" stroke="#dfaa81" strokeWidth="12" strokeLinecap="round" />
          {/* Hand fingers */}
          <circle cx="16" cy="42" r="5" fill="#dfaa81" />
          <circle cx="21" cy="44" r="4.5" fill="#dfaa81" />
          <circle cx="25" cy="48" r="4" fill="#dfaa81" />
        </g>

        {/* Plate / Tray with Hamburger */}
        <g id="platter_sandwich" transform="translate(170, 120)">
          {/* Silver Tray */}
          <ellipse cx="28" cy="42" rx="35" ry="5" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
          <ellipse cx="28" cy="40" rx="30" ry="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="0.8" />

          {/* Large Burger Stack */}
          <g id="burger_layers" transform="translate(10, 10)">
            {/* Bottom Bun */}
            <path d="M 6 28 C 6 32, 30 32, 30 28 C 30 27, 6 27, 6 28" fill="#df9413" stroke="#b06c05" strokeWidth="0.5" />
            
            {/* Beef Patty */}
            <rect x="5" y="22" width="26" height="6" fill="#5c3f15" rx="3" stroke="#2b1c07" strokeWidth="0.4" />
            {/* Searing detail */}
            <line x1="8" y1="24" x2="14" y2="24" stroke="#2b1c07" strokeWidth="1" strokeLinecap="round" />
            <line x1="16" y1="25" x2="22" y2="25" stroke="#2b1c07" strokeWidth="1" strokeLinecap="round" />
            <line x1="24" y1="23" x2="28" y2="23" stroke="#2b1c07" strokeWidth="1" strokeLinecap="round" />

            {/* Melted Cheese (yellow dripping layer) */}
            <path d="M 4 21 Q 12 25 14 21 Q 20 24 24 21 Q 29 25 32 21 M 4 21 L 32 21 L 32 23 L 4 23 Z" fill="#f1c40f" />

            {/* Red Tomato Slices */}
            <rect x="5" y="17" width="12" height="4" fill="#e74c3c" rx="1.5" />
            <rect x="18" y="17" width="13" height="4" fill="#e74c3c" rx="1.5" />

            {/* Green avocado/sauerkraut layers */}
            <path d="M 3 14 C 3 18, 18 18, 18 14 Q 24 18 33 14 L 33 17 L 3 17 Z" fill="#27ae60" />
            {/* White creamy mayo dots */}
            <circle cx="10" cy="15" r="2" fill="#FFFFF0" />
            <circle cx="20" cy="16" r="2.5" fill="#FFFFF0" />
            <circle cx="27" cy="14" r="2" fill="#FFFFF0" />

            {/* Top Sesame Bun */}
            <path d="M 4 13 C 4 1, 32 1, 32 13 Z" fill="#df9413" stroke="#b06c05" strokeWidth="0.5" />
            {/* Sesame Seeds */}
            <ellipse cx="12" cy="7" rx="0.8" ry="1.4" fill="#FDFD96" transform="rotate(30, 12, 7)" />
            <ellipse cx="24" cy="6" rx="0.8" ry="1.4" fill="#FDFD96" transform="rotate(-30, 24, 6)" />
            <ellipse cx="18" cy="4" rx="0.8" ry="1.4" fill="#FDFD96" />
            <ellipse cx="16" cy="9" rx="0.8" ry="1.4" fill="#FDFD96" transform="rotate(45, 16, 9)" />
          </g>
        </g>

        {/* Brand Text Banner / Underline Background (Orange/Red Ribbons) */}
        <g id="decorations" transform="translate(0, 210)">
          {/* Orange Ribbon */}
          <path d="M 50 25 L 350 25 C 370 25, 360 40, 340 40 L 60 40 C 40 40, 30 25, 50 25 Z" fill="#d35400" />
          {/* Bright Red Inner Accent Ribbon */}
          <path d="M 58 28 L 342 28 C 352 28, 348 37, 335 37 L 65 37 C 52 37, 48 28, 58 28 Z" fill="#c0392b" />
          {/* Yellow Border Underline Accent */}
          <path d="M 70 31 L 330 31" stroke="#f1c40f" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* LOGO TITLE: "la fuente" in custom styled gothic characters */}
        <g id="gothic_la_fuente" transform="translate(200, 222)" textAnchor="middle">
          {/* White Text with double golden and thin black shadow outlines */}
          <text 
            x="0" 
            y="0" 
            fontFamily="Impact, Georgia, serif" 
            fontWeight="bold" 
            fontSize="54" 
            fill="#FFFFFF" 
            stroke="#e67e22" 
            strokeWidth="3.5"
            strokeLinejoin="miter"
            letterSpacing="-1"
            className="select-none"
          >
            la fuente
          </text>
          {/* Overlay to preserve crisp white center fill and letter separation */}
          <text 
            x="0" 
            y="0" 
            fontFamily="Impact, Georgia, serif" 
            fontWeight="bold" 
            fontSize="54" 
            fill="#FFFFFF" 
            letterSpacing="-1"
            className="select-none"
          >
            la fuente
          </text>
        </g>

        {/* Subtitle: "sandwicheria", nicely tracked old style font */}
        <g id="spaced_sandwicheria" transform="translate(200, 258)" textAnchor="middle">
          <text 
            fill="#FFFFFF" 
            fontSize="15" 
            fontFamily="'Courier New', Courier, monospace" 
            fontWeight="900" 
            letterSpacing="8"
            className="select-none" 
            opacity="0.95"
          >
            SANDWICHERIA
          </text>
        </g>
        
        {/* Establish brand seal stars */}
        <path d="M 80 200 L 85 203 L 83 208 L 88 205 L 93 208 L 91 203 L 96 200 L 90 200 L 88 195 L 86 200 Z" fill="#f1c40f" />
        <path d="M 320 200 L 325 203 L 323 208 L 328 205 L 333 208 L 331 203 L 336 200 L 330 200 L 328 195 L 326 200 Z" fill="#f1c40f" />
      </svg>
    </div>
  );
}
