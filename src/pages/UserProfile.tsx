import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, User, Loader2, MapPin, Gift } from "lucide-react";

const UserProfile = () => {
  const { userId } = useParams<{ userId: string }>();
  const [profile, setProfile] = useState<any>(null);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;
    Promise.all([
      supabase.from("profiles").select("username, bio, twitter, instagram, tiktok, youtube, avatar_url, location").eq("user_id", userId).single(),
      supabase.from("fan_rewards").select("*").eq("user_id", userId).order("created_at", { ascending: false }),
    ]).then(([profileRes, rewardsRes]) => {
      setProfile(profileRes.data);
      setRewards(rewardsRes.data || []);
      setLoading(false);
    });
  }, [userId]);

  if (loading) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center">
        <div>
          <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="font-display text-3xl text-foreground mb-2">Profile Not Found</h1>
          <Link to="/" className="text-gold hover:underline">← Back to Fanbase</Link>
        </div>
      </div>
    );
  }

  const socials = [
    { key: "twitter", label: "Twitter / X", prefix: "https://twitter.com/" },
    { key: "instagram", label: "Instagram", prefix: "https://instagram.com/" },
    { key: "tiktok", label: "TikTok", prefix: "https://tiktok.com/@" },
    { key: "youtube", label: "YouTube", prefix: "https://youtube.com/@" },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Fanbase
        </Link>

        <div className="gradient-card rounded-2xl border border-border p-8 card-shadow text-center">
          <div className="w-20 h-20 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-4 overflow-hidden">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} className="w-full h-full rounded-full object-cover" />
            ) : (
              <User className="w-10 h-10 text-gold" />
            )}
          </div>
          <h1 className="font-display text-4xl text-foreground">{profile.username || "Fan"}</h1>
          {profile.location && (
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground text-sm mt-1">
              <MapPin className="w-3.5 h-3.5 text-gold" /> {profile.location}
            </div>
          )}
          {profile.bio && <p className="text-muted-foreground mt-2 max-w-md mx-auto">{profile.bio}</p>}

          <div className="flex flex-wrap justify-center gap-3 mt-6">
            {socials.map(({ key, label, prefix }) => {
              const handle = profile[key];
              if (!handle) return null;
              const url = handle.startsWith("http") ? handle : `${prefix}${handle.replace("@", "")}`;
              return (
                <a key={key} href={url} target="_blank" rel="noopener noreferrer"
                  className="text-sm border border-border px-4 py-2 rounded-full text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors">
                  {label}
                </a>
              );
            })}
          </div>
        </div>

        {/* Rewards */}
        {rewards.length > 0 && (
          <div className="mt-6 space-y-3">
            <h2 className="font-display text-2xl text-foreground flex items-center gap-2">
              <Gift className="w-5 h-5 text-gold" /> Rewards & Shoutouts
            </h2>
            {rewards.map((r) => (
              <div key={r.id} className="gradient-card rounded-xl border border-gold/30 p-4 card-shadow">
                <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{r.reward_type}</span>
                <p className="text-foreground text-sm mt-2">{r.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
