import React, { useState, useEffect } from "react";
import { Maximize2, X, ChevronLeft, ChevronRight, Image as ImageIcon } from "lucide-react";
import { dbInstance } from "../lib/db";
import { GalleryImage } from "../types";

export default function Gallery() {
  const [activeTab, setActiveTab] = useState<string>("सभी");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [galleryList, setGalleryList] = useState<GalleryImage[]>([]);

  const loadData = () => {
    setGalleryList(dbInstance.getGallery());
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  // Extract unique categories dynamically and add "सभी" (All)
  const categories = ["सभी", ...Array.from(new Set(galleryList.map((img) => img.category)))];

  // Filter images based on selected tab
  const filteredImages = activeTab === "सभी"
    ? galleryList
    : galleryList.filter((img) => img.category === activeTab);

  // Navigating the Lightbox
  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const prevIndex = lightboxIndex === 0 ? filteredImages.length - 1 : lightboxIndex - 1;
    setLightboxIndex(prevIndex);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex === null) return;
    const nextIndex = lightboxIndex === filteredImages.length - 1 ? 0 : lightboxIndex + 1;
    setLightboxIndex(nextIndex);
  };

  return (
    <section
      id="gallery"
      className="py-16 sm:py-24 bg-[#efe7d6]/20 scroll-mt-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="leaf-divider font-hindi text-ngo-forest font-bold text-lg select-none">
            🖼️ चित्र वीथिका 🖼️
          </div>
          <h2 className="font-hindi text-3xl sm:text-4xl font-black text-stone-900 mt-2.5">
            श्रमदान व सामाजिक अभियानों की झलकियाँ
          </h2>
          <p className="text-stone-600 mt-4 text-sm sm:text-base font-medium">
            प्रकृति को समर्पित हमारे स्वयंसेवकों द्वारा धरातल पर किए गए कार्यों का जीवंत छायाचित्र संकलन।
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10 max-w-2xl mx-auto px-4">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 sm:px-5 py-2 rounded-full font-hindi text-sm font-bold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ngo-forest/45
                ${
                  activeTab === cat
                    ? "bg-ngo-dark text-[#efe7d6] shadow-md scale-105"
                    : "bg-[#f5f1e8] text-stone-700 hover:bg-ngo-beige border border-stone-300/60"
                }
              `}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Imagery Masonry Grid matching Pinterest styled display */}
        <div className="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4 space-y-4" id="gallery-masonry-grid">
          {filteredImages.map((img, idx) => {
            // Finding real index in filtered array for lightbox navigation
            return (
              <div
                key={img.id}
                onClick={() => setLightboxIndex(idx)}
                className="break-inside-avoid relative rounded-2xl overflow-hidden shadow border border-stone-200 cursor-pointer group bg-stone-900"
              >
                
                {/* Main image */}
                <img
                  src={img.url.startsWith("data:") ? img.url : `${img.url}?auto=format&fit=crop&q=80&w=500`}
                  alt={img.title}
                  className="w-full h-auto object-cover block transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />

                {/* Overlying details block on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                  
                  <span className="text-[10px] sm:text-xs font-hindi bg-[#1f6b35] text-white py-1 px-2.5 rounded-full w-max mb-2">
                    {img.category}
                  </span>

                  <h3 className="font-hindi text-sm sm:text-base font-black text-white leading-tight">
                    {img.title}
                  </h3>

                  <span className="text-[10px] font-sans font-medium text-emerald-300 flex items-center gap-1 mt-1.5 uppercase tracking-wider">
                    <Maximize2 className="w-3.5 h-3.5" /> View Photo
                  </span>

                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* Lightbox full scale overlay render */}
      {lightboxIndex !== null && filteredImages[lightboxIndex] && (
        <div
          className="fixed inset-0 bg-stone-950/95 z-[100] flex flex-col items-center justify-between p-4"
          onClick={() => setLightboxIndex(null)}
          role="dialog"
          aria-label="Image lightbox"
        >
          {/* Top Actions Nav */}
          <div className="w-full max-w-5xl flex justify-between items-center text-white p-2">
            <span className="font-hindi text-base sm:text-lg font-bold flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald-400" />
              {filteredImages[lightboxIndex].title}
            </span>
            
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="p-2 hover:bg-white/10 rounded-full text-[#efe7d6] focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Close Lightbox"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Centered Image content + navigation */}
          <div className="relative w-full max-w-4xl max-h-[75vh] flex items-center justify-center">
            
            {/* Prev Trigger */}
            <button
              onClick={handlePrev}
              className="absolute left-2 sm:left-4 z-10 p-3 bg-black/45 backdrop-blur-sm hover:bg-black/75 rounded-full text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Prev image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Core Image displaying */}
            <img
              src={filteredImages[lightboxIndex].url}
              alt={filteredImages[lightboxIndex].title}
              className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl select-none"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Next Trigger */}
            <button
              onClick={handleNext}
              className="absolute right-2 sm:right-4 z-10 p-3 bg-black/45 backdrop-blur-sm hover:bg-black/75 rounded-full text-white transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

          </div>

          {/* Bottom details / index display */}
          <div className="w-full max-w-xl text-center text-stone-400 font-hindi text-sm pb-4">
            <div className="inline-block bg-white/10 py-1.5 px-4 rounded-full text-white font-bold text-xs">
              चित्र {lightboxIndex + 1} / {filteredImages.length} • {filteredImages[lightboxIndex].category}
            </div>
          </div>

        </div>
      )}

    </section>
  );
}
