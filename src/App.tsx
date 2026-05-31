import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import AuthSystem from "./components/AuthSystem";
import Hero from "./components/Hero";
import Statistics from "./components/Statistics";
import About from "./components/About";
import AboutPillars from "./components/AboutPillars";
import Campaigns from "./components/Campaigns";
import PresidentMessage from "./components/PresidentMessage";
import NewsSection from "./components/NewsSection";
import Gallery from "./components/Gallery";
import TeamSection from "./components/TeamSection";
import Partners from "./components/Partners";
import JoinForm from "./components/JoinForm";
import DonationSection from "./components/DonationSection";
import ContactSection from "./components/ContactSection";
import Footer from "./components/Footer";

export default function App() {
  const [activeSection, setActiveSection] = useState("home");
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check auth state on start and updates
  const checkAuthStatus = () => {
    try {
      const stored = localStorage.getItem("pvp_current_user");
      if (stored) {
        const user = JSON.parse(stored);
        setIsLoggedIn(true);
        setIsAdmin(user.role === "admin" && user.email.toLowerCase() === "tomarvansh475@gmail.com");
      } else {
        setIsLoggedIn(false);
        setIsAdmin(false);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    checkAuthStatus();
  }, []);

  useEffect(() => {
    // List of keys corresponding to sections to track in real-time scroll
    const sectionIds = [
      "home",
      "about",
      "pillars",
      "campaigns",
      "news",
      "join",
      "donate",
      "contact"
    ];

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 180; // offset header height

      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Trigger on initial render
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#f5f1e8] text-stone-900 font-sans" id="pvp-root-layout">
      
      {/* 1. Navigation Panel Header */}
      <Header 
        activeSection={activeSection} 
        onOpenAuth={() => setIsAuthOpen(true)}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
      />

      <AuthSystem
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginStatusChange={checkAuthStatus}
      />

      {/* Main Sections Body List */}
      <main aria-label="NGO PVP Main Content container">
        
        {/* 2. Hero Section (Home) */}
        <Hero />

        {/* 3. Horizontal Stats metrics ribbon */}
        <Statistics />

        {/* 4. About Organisation Intro */}
        <About />

        {/* 5. 7 Action Pillars detailed card grids */}
        <AboutPillars />

        {/* 6. Active Campaigns with informational dialog popups */}
        <Campaigns />

        {/* 7. National President formal address */}
        <PresidentMessage />

        {/* 8. News, media announcements and Press block */}
        <NewsSection />

        {/* 9. Imagery Ground Works Gallery masonry grid and Lightbox */}
        <Gallery />

        {/* 10. Operational Team Advisory member list */}
        <TeamSection />

        {/* 11. Infinite auto scrolling brand partners marquee */}
        <Partners />

        {/* 12. Digital environment volunteer registration induction */}
        <JoinForm />

        {/* 13. Collaborative campaigns danyatra support & scan QR panel */}
        <DonationSection />

        {/* 14. Contact Form, locations and embed Google map block */}
        <ContactSection />

      </main>

      {/* 15. Forest deep green footer */}
      <Footer />

    </div>
  );
}
