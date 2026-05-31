import React from "react";
import { Sparkles, ShieldCheck, Heart } from "lucide-react";
import { dbInstance } from "../lib/db";

export default function PresidentMessage() {
  const content = dbInstance.getSiteContent();

  return (
    <section
      id="president-msg"
      className="py-16 sm:py-20 bg-[#efe7d6]/20 relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="leaf-divider font-hindi text-ngo-forest font-bold text-lg select-none">
            🪶 अध्यक्षीय संदेश 🪶
          </div>
          <h2 className="font-hindi text-2xl sm:text-3xl font-black text-stone-900 mt-2.5">
            {content.presMessageTitle || "अध्यक्ष जी का विचार प्रवाह"}
          </h2>
        </div>

        {/* Outer Parchment Styled Frame Card */}
        <div
          className="bg-[#f5f1e8] rounded-3xl p-6 sm:p-10 lg:p-12 shadow-xl border-2 border-ngo-beige/80 relative overflow-hidden grid grid-cols-1 md:grid-cols-12 gap-8 items-center"
          id="president-card-frame"
        >
          {/* Decorative double border inside card */}
          <div className="absolute inset-2 border border-dashed border-ngo-forest/15 rounded-2xl pointer-events-none" />
          
          {/* Ambient organic patterns */}
          <div className="absolute top-0 right-0 w-24 h-24 bg-ngo-forest/5 rounded-full blur-xl" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-800/15 rounded-full blur-xl" />

          {/* Left Column: Portrait & Title Badge */}
          <div className="md:col-span-4 flex flex-col items-center text-center z-10">
            <div className="relative group">
              {/* Outer Golden/Green Ring */}
              <div className="absolute -inset-1.5 rounded-2xl bg-gradient-to-tr from-ngo-dark via-ngo-forest to-amber-700 blur-sm opacity-60 group-hover:opacity-100 transition duration-500" />
              
              {/* Main Portrait Frame */}
              <div className="relative w-52 h-64 sm:w-56 sm:h-72 bg-stone-100 rounded-2xl overflow-hidden shadow-lg border-2 border-[#efe7d6]">
                <img
                  src={content.presMessageImg || "/src/assets/images/nitin_swami_1780203516611.png"}
                  alt={`${content.presMessageName || "Nitin Swami"} - President, Paschimanchal Vikas Parishad`}
                  className="w-full h-full object-cover grayscale-[15%] hover:grayscale-0 transition-all duration-500 hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Verified Ribbon */}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-amber-700 text-[#efe7d6] text-[10px] font-sans font-extrabold uppercase tracking-widest py-1 px-4 rounded-full shadow-md border border-[#efe7d6] whitespace-nowrap">
                🎖️ {content.presMessageName ? content.presMessageName.toUpperCase() : "NITIN SWAMI"}
              </span>
            </div>

            {/* Official Designation Detail block */}
            <div className="mt-8 flex flex-col">
              <span className="font-hindi text-xl font-extrabold text-stone-900 leading-none">
                {content.presMessageName || "नितिन स्वामी"}
              </span>
              <span className="text-xs font-sans text-stone-500 font-extrabold uppercase tracking-wider mt-1.5">
                {content.heroPresidentSubtitle || "President, PVP NGO"}
              </span>
              <span className="font-hindi text-sm font-semibold text-[#1f6b35] bg-ngo-beige px-4 py-1.5 rounded-full border border-stone-300 mt-2">
                {content.presMessageRole || "अध्यक्ष, पश्चिमांचल विकास परिषद (भारत)"}
              </span>
            </div>
          </div>

          {/* Right Column: Formal message and elegant signature */}
          <div className="md:col-span-8 flex flex-col justify-between h-full z-10 px-0 sm:px-4">
            
            {/* Top quote symbol graphic */}
            <div className="text-5xl font-serif text-ngo-forest/25 select-none leading-none -mb-2">
              “
            </div>

            {/* Main letter body text in Hindi */}
            <div className="font-hindi text-[#1a2d1d] text-base sm:text-lg leading-relaxed space-y-4 font-semibold italic">
              <p>
                {content.presMessageText1}
              </p>
              <p className="not-italic text-stone-800">
                {content.presMessageText2}
              </p>
              <p>
                {content.presMessageText3}
              </p>
              <p>
                {content.presMessageText4}
              </p>
            </div>

            {/* Bottom Letter Detail Block: Sign out and Signature graphic */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between border-t border-stone-300/60 pt-6">
              
              <div className="flex items-center gap-2.5 text-xs text-stone-500 font-sans font-bold italic">
                <Sparkles className="w-4 h-4 text-amber-700 animate-spin-slow" />
                <span>"प्रकृतिः रक्षति रक्षिता" — Nature protects its protectors.</span>
              </div>

              {/* Signature Graphic Container */}
              <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
                <span className="font-hindi text-xs text-stone-500 italic mb-1 uppercase font-bold tracking-tight">
                  हस्ताक्षर (Signature)
                </span>
                <svg
                  width="130"
                  height="45"
                  viewBox="0 0 130 45"
                  className="opacity-80 hover:opacity-100 transition-opacity"
                  aria-hidden="true"
                >
                  <path
                    d="M 12 25 Q 35 5, 45 28 T 85 10 T 115 32"
                    fill="none"
                    stroke="#1e3a1e"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M 20 28 C 50 35, 80 30, 115 28"
                    fill="none"
                    stroke="#0f4d24"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="font-hindi text-sm font-black text-stone-900 mt-1">
                  ({content.presMessageName || "नितिन स्वामी"})
                </span>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
