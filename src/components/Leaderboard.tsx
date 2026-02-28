import { useEffect, useState } from "react";
import { Trophy, Flame, Crown, Medal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string | null;
  total_streams: number;
}

const rankIcon = (rank: number) => {
  if (rank === 1) return <Crown className="w-5 h-5 text-gold" />;
  if (rank === 2) return <Medal className="w-5 h-5 text-foreground/60" />;
  if (rank === 3) return <Medal className="w-5 h-5 text-amber-600" />;
  return <span className="text-muted-foreground text-sm font-bold w-5 text-center">#{rank}</span>;
};

const Leaderboard = () => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      // Get stream counts per user
      const { data: streams } = await supabase
        .from("streams")
        .select("user_id");

      if (!streams || streams.length === 0) {
        setLoading(false);
        return;
      }

      // Count streams per user
      const countMap: Record<string, number> = {};
      streams.forEach((s) => {
        countMap[s.user_id] = (countMap[s.user_id] || 0) + 1;
      });

      // Get top user_ids sorted by count
      const sorted = Object.entries(countMap)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10);

      const userIds = sorted.map(([uid]) => uid);

      // Fetch profiles
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, username, avatar_url")
        .in("user_id", userIds);

      const profileMap: Record<string, { username: string; avatar_url: string | null }> = {};
      profiles?.forEach((p) => {
        profileMap[p.user_id] = { username: p.username || "Fan", avatar_url: p.avatar_url };
      });

      const result: LeaderboardEntry[] = sorted.map(([uid, count]) => ({
        user_id: uid,
        username: profileMap[uid]?.username || "Fan",
        avatar_url: profileMap[uid]?.avatar_url || null,
        total_streams: count,
      }));

      setEntries(result);
      setLoading(false);
    };

    fetchLeaderboard();
  }, []);

  return (
    <section id="leaderboard" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Trophy className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Fan Rankings</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">LEADERBOARD</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Top fans by total streams. Can you make the top 10?
          </p>
        </div>

        <div className="max-w-2xl mx-auto space-y-3">
          {loading ? (
            <p className="text-center text-muted-foreground py-8">Loading rankings...</p>
          ) : entries.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No streams yet. Be the first to start streaming!</p>
          ) : (
            entries.map((entry, i) => {
              const rank = i + 1;
              return (
                <Link
                  to={`/user/${entry.user_id}`}
                  key={entry.user_id}
                  className={`gradient-card rounded-2xl border p-4 card-shadow flex items-center gap-4 transition-all duration-300 hover:scale-[1.01] ${
                    rank === 1
                      ? "border-gold/40 bg-gold/5"
                      : rank <= 3
                      ? "border-gold/20"
                      : "border-border hover:border-gold/20"
                  }`}
                >
                  <div className="flex items-center justify-center w-8 flex-shrink-0">
                    {rankIcon(rank)}
                  </div>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden ${
                    rank === 1 ? "bg-gold text-primary-foreground" : "bg-muted text-foreground"
                  }`}>
                    {entry.avatar_url ? (
                      <img src={entry.avatar_url} className="w-full h-full object-cover" alt="" />
                    ) : (
                      entry.username[0].toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-semibold text-sm truncate">{entry.username}</p>
                    <p className="text-muted-foreground text-xs">{entry.total_streams} streams</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Flame className="w-4 h-4 text-gold" />
                    <span className="font-display text-xl text-gold">{entry.total_streams}</span>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
