import { useState, useEffect } from "react";
import { Flame, CheckCircle, Trophy, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const PLATFORMS = [
  { name: "Spotify", url: "https://open.spotify.com/search/medikal" },
  { name: "Apple Music", url: "https://music.apple.com/search?term=medikal" },
  { name: "YouTube Music", url: "https://music.youtube.com/search?q=medikal" },
  { name: "Audiomack", url: "https://audiomack.com/medikal" },
  { name: "Boomplay", url: "https://www.boomplay.com/search/default/Medikal" },
  { name: "YouTube", url: "https://www.youtube.com/@medikal" },
  { name: "Amazon Music", url: "https://music.amazon.com/search/medikal" },
  { name: "Deezer", url: "https://www.deezer.com/search/medikal" },
  { name: "SoundCloud", url: "https://soundcloud.com/search?q=medikal" },
  { name: "Tidal", url: "https://tidal.com/search?q=medikal" },
  { name: "iTunes Store", url: "https://music.apple.com/search?term=medikal" },
];

const StreamEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [streaked, setStreaked] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [totalStreams, setTotalStreams] = useState(0);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) fetchStreakData();
  }, [user]);

  const fetchStreakData = async () => {
    if (!user) return;

    // Get all stream dates sorted descending
    const { data: streams } = await supabase
      .from("streams")
      .select("stream_date")
      .eq("user_id", user.id)
      .order("stream_date", { ascending: false });

    if (!streams || streams.length === 0) return;

    setTotalStreams(streams.length);

    // Check if streamed today
    const today = new Date().toISOString().split("T")[0];
    const streamedToday = streams[0].stream_date === today;
    setStreaked(streamedToday);

    // Calculate current streak
    let streak = 0;
    const dates = streams.map((s) => s.stream_date);
    let checkDate = new Date();
    if (!streamedToday) checkDate.setDate(checkDate.getDate() - 1);

    for (const date of dates) {
      const expected = checkDate.toISOString().split("T")[0];
      if (date === expected) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    setCurrentStreak(streak);

    // Calculate best streak
    let best = 0;
    let current = 1;
    const sortedDates = [...dates].sort();
    for (let i = 1; i < sortedDates.length; i++) {
      const prev = new Date(sortedDates[i - 1]);
      const curr = new Date(sortedDates[i]);
      const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24);
      if (diff === 1) {
        current++;
      } else {
        best = Math.max(best, current);
        current = 1;
      }
    }
    setBestStreak(Math.max(best, current, streak));
  };

  const handleConfirm = async () => {
    if (!user || streaked || !selectedPlatform || loading) return;
    setLoading(true);

    const today = new Date().toISOString().split("T")[0];
    const { error } = await supabase.from("streams").insert({
      user_id: user.id,
      platform: selectedPlatform,
      stream_date: today,
    });

    if (error) {
      if (error.code === "23505") {
        toast({ title: "Already confirmed today!", description: "Come back tomorrow." });
        setStreaked(true);
      } else {
        toast({ title: "Error", description: error.message, variant: "destructive" });
      }
    } else {
      setStreaked(true);
      setCurrentStreak((s) => s + 1);
      setTotalStreams((t) => t + 1);
      toast({ title: "🔥 Stream confirmed!", description: "Your streak has been saved." });
    }
    setLoading(false);
  };

  return (
    <section id="stream" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Flame className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Stream Engine</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">DAILY STREAM TRACKER</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Confirm your daily stream on any platform and keep your streak alive. Every stream counts!
          </p>
        </div>

        {!user ? (
          <div className="max-w-md mx-auto gradient-card rounded-2xl border border-border p-8 card-shadow text-center">
            <LogIn className="w-10 h-10 text-gold mx-auto mb-4" />
            <h3 className="font-display text-2xl text-foreground mb-2">Sign In to Track Streaks</h3>
            <p className="text-muted-foreground text-sm mb-6">
              Create an account to save your streaming streaks and climb the leaderboard!
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center justify-center gap-2 bg-gold text-primary-foreground font-semibold px-8 py-3 rounded-full hover:bg-gold-glow transition-all duration-300 glow-gold"
            >
              Join the Fanverse
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Streak Card */}
            <div className="gradient-card rounded-2xl border border-border p-8 card-shadow flex flex-col items-center justify-center text-center">
              <div className="animate-flame text-6xl mb-4">🔥</div>
              <div className="font-display text-8xl text-gold">{currentStreak}</div>
              <div className="text-muted-foreground text-sm uppercase tracking-widest mt-1">Day Streak</div>
              <div className="mt-4 grid grid-cols-2 gap-3 w-full">
                <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3">
                  <Trophy className="w-4 h-4 text-gold flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Best</div>
                    <div className="font-semibold text-foreground text-sm">{bestStreak} Days</div>
                  </div>
                </div>
                <div className="flex items-center gap-2 bg-muted/50 rounded-xl px-4 py-3">
                  <Flame className="w-4 h-4 text-gold flex-shrink-0" />
                  <div className="text-left">
                    <div className="text-xs text-muted-foreground">Total</div>
                    <div className="font-semibold text-foreground text-sm">{totalStreams} Days</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Confirm Stream Card */}
            <div className="gradient-card rounded-2xl border border-border p-8 card-shadow flex flex-col gap-4">
              <h3 className="font-display text-2xl text-foreground">Confirm Today's Stream</h3>
              <p className="text-muted-foreground text-sm">Where did you stream Medikal today?</p>

              <div className="grid grid-cols-2 gap-2">
                {PLATFORMS.map(({ name, url }) => (
                  <button
                    key={name}
                    onClick={() => {
                      window.open(url, "_blank");
                      setSelectedPlatform(name);
                    }}
                    className={`flex items-center justify-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${
                      selectedPlatform === name
                        ? "border-gold bg-gold/10 text-gold"
                        : "border-border bg-muted/30 text-muted-foreground hover:border-gold/50 hover:text-foreground"
                    }`}
                  >
                    {selectedPlatform === name && <CheckCircle className="w-3.5 h-3.5" />}
                    {name}
                  </button>
                ))}
              </div>

              {selectedPlatform && !streaked && (
                <button
                  onClick={handleConfirm}
                  disabled={loading}
                  className="mt-2 w-full bg-gold text-primary-foreground font-semibold py-3 rounded-xl hover:bg-gold-glow transition-all duration-300 glow-gold disabled:opacity-60"
                >
                  ✅ I Streamed on {selectedPlatform} Today!
                </button>
              )}

              {streaked && (
                <div className="flex flex-col items-center gap-2 mt-2 bg-gold/10 border border-gold/30 rounded-xl p-4 text-center">
                  <div className="text-3xl">🎉</div>
                  <div className="text-gold font-semibold">Stream Confirmed!</div>
                  <div className="text-muted-foreground text-xs">Come back tomorrow to keep your streak.</div>
                </div>
              )}

              {!selectedPlatform && (
                <p className="text-muted-foreground text-xs text-center mt-2">
                  Click a platform to open it, then confirm your stream above.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default StreamEngine;
