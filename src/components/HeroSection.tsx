import { ChevronDown } from "lucide-react";
import heroBanner from "@/assets/hero-banner.webp";
import bykLogo from "@/assets/byklogo.jpg";

const HeroSection = () => {
  return (
    <section id="hub" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Background image */}
      <div className="absolute inset-0">
        <img
          src={heroBanner}
          alt="BYK Fanbase"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/80 via-background/60 to-background" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 animate-fade-up">
        <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-6">
          <img src={bykLogo} alt="BYK" className="w-4 h-4 rounded-full object-cover" />
          <span className="text-gold text-xs font-medium tracking-widest uppercase">Official Beyond Kontrol Family Platform</span>
        </div>

        <h1 className="font-display font-bold text-7xl md:text-[120px] leading-none tracking-widest mb-2 text-white">
          MEDIKAL
        </h1>
        <h2 className="font-display font-bold text-3xl md:text-5xl text-white tracking-widest mb-6">
          FAN BASE
        </h2>

        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          The official fan hub for BYK Medikal. Stream, engage, and connect with Africa's biggest rap energy.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#stream"
            className="inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-gold-glow transition-all duration-300 glow-gold pulse-gold"
          >
            Start Streaming Streak
          </a>
          <a
            href="#bars"
            className="inline-flex items-center justify-center gap-2 border border-gold/40 text-gold font-semibold px-8 py-3 rounded-full hover:bg-gold/10 transition-all duration-300"
          >
            Explore Bars
          </a>
        </div>

        {/* Music platform links */}
        <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
          <span className="text-muted-foreground text-xs uppercase tracking-widest">Listen on</span>
          {[
            { name: "Spotify", url: "https://open.spotify.com/search/medikal" },
            { name: "Audiomack", url: "https://audiomack.com/medikal" },
            { name: "Boomplay", url: "https://www.boomplay.com/search/default/Medikal" },
            { name: "YouTube", url: "https://www.youtube.com/@medikal" },
          ].map(({ name, url }) => (
            <a
              key={name}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-surface-raised border border-border hover:border-gold/50 text-foreground/70 hover:text-gold text-sm px-4 py-1.5 rounded-full transition-all duration-200"
            >
              {name}
            </a>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce-down text-muted-foreground">
        <ChevronDown className="w-6 h-6" />
      </div>
    </section>
  );
};

export default HeroSection;
