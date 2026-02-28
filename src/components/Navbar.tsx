import { useState, useEffect } from "react";
import { Music, Flame, BookOpen, Megaphone, Bot, Menu, X, LogIn, LogOut, User, Trophy, Disc3, CalendarDays, Bell, Camera, Shield, Home } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import bykLogo from "@/assets/byklogo.jpg";

const navLinks = [
  { label: "Home", href: "#hub", icon: Home },
  { label: "News", href: "#announcements", icon: Bell },
  { label: "Stream", href: "#stream", icon: Flame },
  { label: "Music", href: "#music", icon: Music },
  { label: "Albums", href: "#albums", icon: Disc3 },
  { label: "Bars", href: "#bars", icon: BookOpen },
  { label: "Content", href: "#content", icon: Megaphone },
  { label: "Events", href: "#events", icon: CalendarDays },
  { label: "Gallery", href: "#gallery", icon: Camera },
  { label: "Ranks", href: "#leaderboard", icon: Trophy },
  { label: "AI Bot", href: "#aibot", icon: Bot },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user) {
      supabase.from("user_roles").select("role").eq("user_id", user.id).single().then(({ data }) => {
        setIsAdmin(data?.role === "admin");
      });
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-md border-b border-border">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <a href="#hub" className="flex items-center gap-2 group">
          <img src={bykLogo} alt="BYK" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-display text-2xl text-gold tracking-wider">BEYOND </span>
          <span className="font-display text-2xl text-foreground tracking-wider">KONTROL</span>
          <span className="font-display text-2xl text-foreground tracking-wider">FAMILY</span>
        </a>

        <div className="hidden lg:flex items-center gap-0.5">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="flex items-center gap-1 px-2.5 py-2 rounded-md text-muted-foreground hover:text-gold hover:bg-muted transition-all duration-200 text-xs font-medium"
            >
              <Icon className="w-3 h-3" />
              {label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {user ? (
            <div className="hidden md:flex items-center gap-2">
              {isAdmin && (
                <Link to="/admin" className="flex items-center gap-1.5 text-gold hover:text-gold-glow text-sm transition-colors">
                  <Shield className="w-3.5 h-3.5" />
                  Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-1.5 text-muted-foreground hover:text-gold text-sm transition-colors">
                <User className="w-3.5 h-3.5" />
                <span className="max-w-[100px] truncate">{user.email?.split("@")[0]}</span>
              </Link>
              <button
                onClick={signOut}
                className="flex items-center gap-1.5 px-3 py-2 rounded-md text-muted-foreground hover:text-gold hover:bg-muted transition-all duration-200 text-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="hidden md:flex items-center gap-1.5 bg-gold text-primary-foreground text-sm font-semibold px-4 py-2 rounded-full hover:bg-gold-glow transition-all duration-300"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In
            </Link>
          )}

          <button
            className="lg:hidden text-muted-foreground hover:text-gold transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden bg-card border-b border-border px-4 pb-4 space-y-1">
          {navLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={href}
              href={href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 rounded-md text-muted-foreground hover:text-gold hover:bg-muted transition-all duration-200 text-sm font-medium"
            >
              <Icon className="w-4 h-4" />
              {label}
            </a>
          ))}
          <div className="pt-2 border-t border-border">
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gold hover:bg-gold/10 transition-all duration-200 text-sm w-full font-semibold"
                  >
                    <Shield className="w-4 h-4" />
                    Admin Dashboard
                  </Link>
                )}
                <Link
                  to="/profile"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-muted-foreground hover:text-gold hover:bg-muted transition-all duration-200 text-sm w-full"
                >
                  <User className="w-4 h-4" />
                  My Profile
                </Link>
                <button
                  onClick={() => { signOut(); setMobileOpen(false); }}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-md text-muted-foreground hover:text-gold hover:bg-muted transition-all duration-200 text-sm w-full"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-md text-gold hover:bg-gold/10 text-sm font-semibold"
              >
                <LogIn className="w-4 h-4" />
                Sign In / Register
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
