import React from "react";
import { PARTNERS_LOGOS } from "../data";

export default function Partners() {
  // Duplicate the array of logos to create a seamless infinite scrolling sequence
  const doubledLogos = [...PARTNERS_LOGOS, ...PARTNERS_LOGOS, ...PARTNERS_LOGOS, ...PARTNERS_LOGOS];

  return (
    <section className="bg-ngo-cream/90 py-10 border-y border-stone-200 overflow-hidden select-none relative" id="partners-carousel-section">
      
      {/* Inline Stylesheet for pure-CSS infinite scrolling marquee */}
      <style>{`
        @keyframes marquee-scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .marquee-infinite {
          display: flex;
          width: max-content;
          animation: marquee-scroll 32s linear infinite;
        }
        .marquee-infinite:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 flex flex-col items-center">
        <span className="font-hindi text-xs sm:text-sm font-extrabold text-[#1f6b35] uppercase tracking-widest bg-ngo-beige px-4 py-1 rounded-full border border-stone-300">
          🌱 मुख्य सहयोगी एवं मार्गदर्शक संस्थाएं 🌱
        </span>
      </div>

      {/* Outer wrapper with absolute faded side grids */}
      <div className="relative w-full overflow-hidden">
        
        {/* Soft fading left and right mask panels for premium scroll visual feel */}
        <div className="absolute top-0 left-0 w-16 sm:w-32 h-full bg-gradient-to-r from-[#f5f1e8] to-transparent z-10 pointer-events-none" />
        <div className="absolute top-0 right-0 w-16 sm:w-32 h-full bg-gradient-to-l from-[#f5f1e8] to-transparent z-10 pointer-events-none" />

        {/* Scrolling marquee inner content list */}
        <div className="marquee-infinite gap-6 sm:gap-10">
          {doubledLogos.map((partner, index) => (
            <div
              key={`${partner.name}-${index}`}
              className="flex items-center gap-2 sm:gap-3 px-6 py-3 bg-[#efe7d6]/75 rounded-2xl border border-stone-300/40 shadow-sm hover:border-ngo-forest/40 transition-colors duration-300 group"
            >
              
              {/* Dynamic Emoji Icon */}
              <span className="text-xl sm:text-2xl transition-transform duration-300 group-hover:scale-115">
                {partner.logoText}
              </span>

              {/* Company Legal Board Name */}
              <span className="font-hindi text-sm sm:text-base font-bold text-stone-800 tracking-wide">
                {partner.name}
              </span>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
