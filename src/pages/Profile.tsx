import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { User, Save, Loader2, Flame, Trophy, ArrowLeft, Camera } from "lucide-react";
import { Link } from "react-router-dom";

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profile, setProfile] = useState({
    username: "",
    bio: "",
    twitter: "",
    instagram: "",
    tiktok: "",
    youtube: "",
    location: "",
  });
  const [stats, setStats] = useState({ totalStreams: 0, currentStreak: 0, bestStreak: 0 });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [user, authLoading]);

  useEffect(() => {
    if (user) {
      fetchProfile();
      fetchStats();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    setLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select("username, bio, twitter, instagram, tiktok, youtube, avatar_url, location")
      .eq("user_id", user.id)
      .single();
    if (data) {
      setProfile({
        username: data.username || "",
        bio: data.bio || "",
        twitter: data.twitter || "",
        instagram: data.instagram || "",
        tiktok: data.tiktok || "",
        youtube: data.youtube || "",
        location: data.location || "",
      });
      setAvatarUrl(data.avatar_url || null);
    }
    setLoading(false);
  };

  const fetchStats = async () => {
    if (!user) return;
    const { data: streams } = await supabase
      .from("streams")
      .select("stream_date")
      .eq("user_id", user.id)
      .order("stream_date", { ascending: false });

    if (!streams || streams.length === 0) return;
    const total = streams.length;
    const today = new Date().toISOString().split("T")[0];
    const dates = streams.map((s) => s.stream_date);
    const streamedToday = dates[0] === today;

    let streak = 0;
    let checkDate = new Date();
    if (!streamedToday) checkDate.setDate(checkDate.getDate() - 1);
    for (const date of dates) {
      if (date === checkDate.toISOString().split("T")[0]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else break;
    }

    let best = 0, current = 1;
    const sorted = [...dates].sort();
    for (let i = 1; i < sorted.length; i++) {
      const diff = (new Date(sorted[i]).getTime() - new Date(sorted[i - 1]).getTime()) / 86400000;
      if (diff === 1) current++;
      else { best = Math.max(best, current); current = 1; }
    }
    setStats({ totalStreams: total, currentStreak: streak, bestStreak: Math.max(best, current, streak) });
  };

   const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    setUploadingAvatar(true);
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const path = `${user.id}/avatar.${ext}`;
    const { error: uploadError } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploadingAvatar(false);
      return;
    }
    const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(path);
    const newUrl = `${urlData.publicUrl}?t=${Date.now()}`;
    const { error: updateError } = await supabase.from("profiles").update({ avatar_url: newUrl }).eq("user_id", user.id);
    if (updateError) {
      toast({ title: "Error", description: updateError.message, variant: "destructive" });
    } else {
      setAvatarUrl(newUrl);
      toast({ title: "Avatar updated!" });
    }
    setUploadingAvatar(false);
  };


  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        username: profile.username,
        bio: profile.bio,
        twitter: profile.twitter,
        instagram: profile.instagram,
        tiktok: profile.tiktok,
        youtube: profile.youtube,
        location: profile.location,
      })
      .eq("user_id", user.id);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else toast({ title: "Profile saved!", description: "Your profile has been updated." });
    setSaving(false);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-gold animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to BKY FAMILY
        </Link>

           <div className="flex items-center gap-4 mb-8">
          {/* Avatar with upload */}
          <div className="relative group">
            <div className="w-16 h-16 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center overflow-hidden">
              {avatarUrl ? (
                <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                <User className="w-8 h-8 text-gold" />
              )}
            </div>
            <label className="absolute inset-0 rounded-full bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity">
              {uploadingAvatar ? (
                <Loader2 className="w-5 h-5 text-gold animate-spin" />
              ) : (
                <Camera className="w-5 h-5 text-gold" />
              )}
              <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" disabled={uploadingAvatar} />
            </label>
          </div>
          <div>
            <h1 className="font-display text-4xl text-foreground">MY PROFILE</h1>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: "Streak", value: stats.currentStreak, icon: Flame },
            { label: "Best", value: stats.bestStreak, icon: Trophy },
            { label: "Total", value: stats.totalStreams, icon: Flame },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="gradient-card rounded-2xl border border-border p-5 card-shadow text-center">
              <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
              <div className="font-display text-3xl text-gold">{value}</div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
            </div>
          ))}
        </div>

        {/* Profile Form */}
        <div className="gradient-card rounded-2xl border border-border p-8 card-shadow space-y-5">
          <h2 className="font-display text-2xl text-foreground mb-2">Edit Profile</h2>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Username</label>
            <input
              value={profile.username}
              onChange={(e) => setProfile({ ...profile, username: e.target.value })}
              className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Bio</label>
            <textarea
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              rows={3}
              placeholder="Tell the fanverse about yourself..."
              className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors resize-none"
            />
          </div>

           <div>
            <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Location</label>
            <input
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
              placeholder="City, Country"
              className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
            />
          </div>


          <h3 className="font-display text-xl text-foreground pt-2">Social Media Handles</h3>

          {[
            { key: "twitter", label: "Twitter / X", placeholder: "@yourhandle" },
            { key: "instagram", label: "Instagram", placeholder: "@yourhandle" },
            { key: "tiktok", label: "TikTok", placeholder: "@yourhandle" },
            { key: "youtube", label: "YouTube", placeholder: "channel name or URL" },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
              <input
                value={(profile as any)[key]}
                onChange={(e) => setProfile({ ...profile, [key]: e.target.value })}
                placeholder={placeholder}
                className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
              />
            </div>
          ))}

          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-gold text-primary-foreground font-semibold py-3 rounded-xl hover:bg-gold-glow transition-all duration-300 glow-gold flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
