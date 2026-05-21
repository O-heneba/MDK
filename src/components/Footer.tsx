import { Heart } from "lucide-react";
import bykLogo from "@/assets/byklogo.jpg";

const Footer = () => {
  return (
    <footer className="border-t border-border bg-card py-10">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src={bykLogo} alt="BYK" className="w-6 h-6 rounded-full object-cover" />
            <span className="font-display text-xl text-gold tracking-wider">BEYOND</span>
            <span className="font-display text-xl text-foreground tracking-wider">KONTROL FAMILY</span>
          </div>

          <p className="text-muted-foreground text-xs text-center max-w-sm">
            This is an unofficial fan platform. All music is embedded from official sources. No copyrighted content is hosted.
          </p>

          <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-gold" />
            <span>by fans, for fans</span>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-border flex flex-wrap justify-center gap-4">
          {["Spotify", "Audiomack", "Boomplay", "YouTube"].map((platform) => (
            <a key={platform} href="#" className="text-muted-foreground hover:text-gold text-xs transition-colors">
              {platform}
            </a>
          ))}
        </div>

        <p className="text-center text-muted-foreground/50 text-xs mt-6">
          © {new Date().getFullYear()} BYK Fanbase. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
