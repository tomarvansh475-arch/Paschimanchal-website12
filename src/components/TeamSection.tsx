import React, { useState, useEffect } from "react";
import { Twitter, Facebook, Linkedin, Instagram, ArrowUpRight } from "lucide-react";
import { dbInstance } from "../lib/db";
import { TeamMember } from "../types";

export default function TeamSection() {
  const [teamList, setTeamList] = useState<TeamMember[]>([]);

  const loadData = () => {
    setTeamList(dbInstance.getTeam());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="team"
      className="py-16 sm:py-24 bg-[#efe7d6]/10 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="leaf-divider font-hindi text-ngo-forest font-bold text-lg select-none">
            🤝 हमारा नेतृत्व परिवार 🤝
          </div>
          <h2 className="font-hindi text-3xl sm:text-4xl font-black text-stone-900 mt-2.5">
            मार्गदर्शक एवं कार्यकारिणी समिति
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base font-medium">
            पर्यावरणविद, भूवैज्ञानिक और लोक संस्कृति के संरक्षक, जो स्वेच्छा से इस महाअभियान का नेतृत्व कर रहे हैं।
          </p>
        </div>

        {/* Team Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamList.map((member) => (
            <div
              key={member.id}
              className="bg-[#f5f1e8] rounded-3xl p-6 shadow-md hover:shadow-xl border border-stone-200 hover:border-ngo-forest/30 transition-all duration-300 flex flex-col items-center text-center group"
              id={`team-card-${member.id}`}
            >
              
              {/* Circular profile image with hover effect */}
              <div className="relative">
                {/* Rotating Border Ring */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-ngo-dark via-ngo-forest to-amber-700 blur-[2px] scale-[1.04] group-hover:rotate-180 transition-transform duration-500 ease-in-out" />
                
                {/* Image Frame */}
                <div className="relative w-36 h-36 rounded-full overflow-hidden border-4 border-[#efe7d6] shadow-md bg-stone-100">
                  <img
                    src={member.imageUrl}
                    alt={member.name}
                    className="w-full h-full object-cover grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-300"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Names Block */}
              <div className="mt-5 flex flex-col">
                <span className="font-hindi text-xl font-extrabold text-stone-900">
                  {member.nameHindi}
                </span>
                <span className="text-xs font-sans font-bold text-stone-500 uppercase tracking-widest mt-0.5 leading-none">
                  {member.name}
                </span>
              </div>

              {/* Roles Badge */}
              <div className="mt-3 flex flex-col gap-0.5">
                <span className="font-hindi text-sm font-bold text-ngo-forest bg-ngo-beige/80 py-1 px-3 rounded-full border border-stone-200">
                  {member.roleHindi}
                </span>
                <span className="text-[10px] font-sans font-medium text-stone-500 uppercase tracking-wider mt-1">
                  {member.role}
                </span>
              </div>

              {/* Short Bio Block */}
              {member.bio && (
                <p className="font-hindi text-stone-600 text-xs sm:text-sm mt-4 leading-relaxed font-semibold line-clamp-3 group-hover:text-stone-800 transition-colors">
                  "{member.bio}"
                </p>
              )}

              {/* Separator */}
              <div className="w-full h-px bg-stone-200 my-5" />

              {/* Social Media links exactly as requested */}
              <div className="flex items-center gap-3">
                {member.socials.twitter && (
                  <a
                    href={member.socials.twitter}
                    className="w-8 h-8 rounded-full bg-stone-200/50 hover:bg-ngo-forest hover:text-white text-stone-600 transition-colors flex items-center justify-center"
                    aria-label={`${member.name} Twitter Profile`}
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                )}
                
                {member.socials.facebook && (
                  <a
                    href={member.socials.facebook}
                    className="w-8 h-8 rounded-full bg-stone-200/50 hover:bg-blue-800 hover:text-white text-stone-600 transition-colors flex items-center justify-center"
                    aria-label={`${member.name} Facebook Profile`}
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                )}

                {member.socials.linkedin && (
                  <a
                    href={member.socials.linkedin}
                    className="w-8 h-8 rounded-full bg-stone-200/50 hover:bg-slate-700 hover:text-white text-stone-600 transition-colors flex items-center justify-center"
                    aria-label={`${member.name} LinkedIn Profile`}
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                )}

                {member.socials.instagram && (
                  <a
                    href={member.socials.instagram}
                    className="w-8 h-8 rounded-full bg-stone-200/50 hover:bg-pink-700 hover:text-white text-stone-600 transition-colors flex items-center justify-center"
                    aria-label={`${member.name} Instagram Profile`}
                  >
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
