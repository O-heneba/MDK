import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import bykLogo from "@/assets/byklogo.jpg";


const Auth = () => {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === "register") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { username },
          },
        });
        if (error) throw error;
        toast({
          title: "Account created!",
          description: "Check your email to confirm your account.",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate("/");
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <a href="/" className="flex items-center justify-center gap-2 mb-8">
          <img src={bykLogo} alt="BYK" className="w-8 h-8 rounded-full object-cover" />
          <span className="font-display text-2xl text-gold tracking-wider">BEYOND KONTROL FAMILY</span>
          <span className="font-display text-2xl text-foreground tracking-wider">MEDIKAL FANBASE</span>
        </a>

        <div className="gradient-card rounded-2xl border border-border p-8 card-shadow">
          {/* Tabs */}
          <div className="flex rounded-xl bg-muted/40 p-1 mb-8">
            {(["login", "register"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setMode(tab)}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all duration-200 capitalize ${
                  mode === tab
                    ? "bg-gold text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab === "login" ? "Sign In" : "Register"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "register" && (
              <div>
                <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="YourFanName"
                  required={mode === "register"}
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fan@medikal.com"
                required
                className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 pr-12 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-xl hover:bg-gold-glow transition-all duration-300 glow-gold flex items-center justify-center gap-2 mt-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          <p className="text-center text-muted-foreground text-xs mt-6">
            {mode === "login" ? "Don't have an account? " : "Already a fan? "}
            <button
              onClick={() => setMode(mode === "login" ? "register" : "login")}
              className="text-gold hover:underline font-medium"
            >
              {mode === "login" ? "Register" : "Sign In"}
            </button>
          </p>
        </div>

        <p className="text-center text-muted-foreground/50 text-xs mt-6">
          Fan platform for BKY Medikal. Not an official artist account.
        </p>
      </div>
    </div>
  );
};

export default Auth;
