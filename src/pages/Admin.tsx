import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Bell, Disc3, CalendarDays, Camera, BookOpen, Megaphone,
  Trash2, Plus, Save, Loader2, Users, BarChart3, Eye, MapPin, Gift, Video
} from "lucide-react";
import { format } from "date-fns";

type Tab = "announcements" | "albums" | "events" | "gallery" | "bars" | "content" | "videos" | "fans" | "analytics";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "albums", label: "Albums", icon: Disc3 },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "bars", label: "Bars", icon: BookOpen },
  { id: "content", label: "Fan Content", icon: Megaphone },
  { id: "videos", label: "Music Videos", icon: Video },
  { id: "fans", label: "Fans & Rewards", icon: Gift },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
];

const inputClass = "w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors";
const btnClass = "bg-gold text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("announcements");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (user) checkAdmin();
  }, [user, authLoading]);

  const checkAdmin = async () => {
    const { data } = await supabase.from("user_roles").select("role").eq("user_id", user!.id).single();
    setIsAdmin(data?.role === "admin");
    setChecking(false);
  };

  if (authLoading || checking) {
    return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 className="w-8 h-8 text-gold animate-spin" /></div>;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-center px-4">
        <div>
          <Shield className="w-16 h-16 text-destructive mx-auto mb-4" />
          <h1 className="font-display text-4xl text-foreground mb-2">ACCESS DENIED</h1>
          <p className="text-muted-foreground mb-6">You need admin privileges to access this page.</p>
          <Link to="/" className="text-gold hover:underline">← Back to Fanbase</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-gold text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Fanbase
        </Link>
        <div className="flex items-center gap-3 mb-8">
          <Shield className="w-8 h-8 text-gold" />
          <h1 className="font-display text-4xl text-foreground">ADMIN DASHBOARD</h1>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-all ${
                tab === id ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:border-gold/40"
              }`}
            >
              <Icon className="w-3.5 h-3.5" /> {label}
            </button>
          ))}
        </div>

        {tab === "announcements" && <AnnouncementsAdmin />}
        {tab === "albums" && <AlbumsAdmin />}
        {tab === "events" && <EventsAdmin />}
        {tab === "gallery" && <GalleryAdmin />}
        {tab === "bars" && <BarsAdmin />}
        {tab === "content" && <ContentAdmin />}
        {tab === "videos" && <VideosAdmin />}
        {tab === "fans" && <FansAdmin />}
        {tab === "analytics" && <AnalyticsAdmin />}
      </div>
    </div>
  );
};

/* ========== ANNOUNCEMENTS ========== */
const AnnouncementsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", body: "", pinned: false });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.body) return;
    setSaving(true);
    const { error } = await supabase.from("announcements").insert(form);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Announcement posted!" }); setForm({ title: "", body: "", pinned: false }); fetch(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">Post Announcement</h3>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className={inputClass} />
        <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Body" rows={3} className={`${inputClass} resize-none`} />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="accent-[hsl(var(--gold))]" /> Pin this announcement
        </label>
        <button onClick={handleAdd} disabled={saving} className={btnClass}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Post
        </button>
      </div>
      <div className="space-y-3">
        {items.map(a => (
          <div key={a.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
            <div>
              <p className="text-foreground font-medium">{a.title}</p>
              <p className="text-muted-foreground text-sm mt-1">{a.body.substring(0, 100)}...</p>
              <p className="text-xs text-muted-foreground mt-1">{format(new Date(a.created_at), "MMM dd, yyyy")}</p>
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== ALBUMS ========== */
const AlbumsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", cover_url: "", release_year: "", spotify_url: "", audiomack_url: "", boomplay_url: "", youtube_url: "" });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("albums").select("*").order("release_year", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!form.title) return;
    setSaving(true);
    const { error } = await supabase.from("albums").insert({
      title: form.title,
      cover_url: form.cover_url || null,
      release_year: form.release_year ? parseInt(form.release_year) : null,
      spotify_url: form.spotify_url || null,
      audiomack_url: form.audiomack_url || null,
      boomplay_url: form.boomplay_url || null,
      youtube_url: form.youtube_url || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Album added!" }); setForm({ title: "", cover_url: "", release_year: "", spotify_url: "", audiomack_url: "", boomplay_url: "", youtube_url: "" }); fetch(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("albums").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">Add Album / Project</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Album Title *" className={inputClass} />
          <input value={form.release_year} onChange={e => setForm({ ...form, release_year: e.target.value })} placeholder="Release Year" type="number" className={inputClass} />
          <input value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} placeholder="Cover Image URL" className={inputClass} />
          <input value={form.spotify_url} onChange={e => setForm({ ...form, spotify_url: e.target.value })} placeholder="Spotify URL" className={inputClass} />
          <input value={form.audiomack_url} onChange={e => setForm({ ...form, audiomack_url: e.target.value })} placeholder="Audiomack URL" className={inputClass} />
          <input value={form.boomplay_url} onChange={e => setForm({ ...form, boomplay_url: e.target.value })} placeholder="Boomplay URL" className={inputClass} />
          <input value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} placeholder="YouTube URL" className={inputClass} />
        </div>
        <button onClick={handleAdd} disabled={saving} className={btnClass}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Album
        </button>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        {items.map(a => (
          <div key={a.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              {a.cover_url ? <img src={a.cover_url} className="w-12 h-12 rounded-lg object-cover" /> : <Disc3 className="w-12 h-12 text-muted-foreground/30" />}
              <div>
                <p className="text-foreground font-medium">{a.title}</p>
                <p className="text-xs text-muted-foreground">{a.release_year || "N/A"}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== EVENTS ========== */
const EventsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", description: "", location: "", event_date: "", image_url: "", ticket_url: "", is_upcoming: true });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.event_date) return;
    setSaving(true);
    const { error } = await supabase.from("events").insert({
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      event_date: form.event_date,
      image_url: form.image_url || null,
      ticket_url: form.ticket_url || null,
      is_upcoming: form.is_upcoming,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Event added!" }); setForm({ title: "", description: "", location: "", event_date: "", image_url: "", ticket_url: "", is_upcoming: true }); fetch(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">Add Event / Show</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Event Title *" className={inputClass} />
          <input value={form.event_date} onChange={e => setForm({ ...form, event_date: e.target.value })} type="datetime-local" className={inputClass} />
          <input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Location" className={inputClass} />
          <input value={form.ticket_url} onChange={e => setForm({ ...form, ticket_url: e.target.value })} placeholder="Ticket URL" className={inputClass} />
          <input value={form.image_url} onChange={e => setForm({ ...form, image_url: e.target.value })} placeholder="Image URL" className={inputClass} />
          <label className="flex items-center gap-2 text-sm text-muted-foreground px-1">
            <input type="checkbox" checked={form.is_upcoming} onChange={e => setForm({ ...form, is_upcoming: e.target.checked })} className="accent-[hsl(var(--gold))]" /> Upcoming event
          </label>
        </div>
        <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Description" rows={2} className={`${inputClass} resize-none`} />
        <button onClick={handleAdd} disabled={saving} className={btnClass}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Event
        </button>
      </div>
      <div className="space-y-3">
        {items.map(e => (
          <div key={e.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
            <div className="flex gap-3">
              {e.image_url && <img src={e.image_url} className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />}
              <div>
                <p className="text-foreground font-medium">{e.title}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(e.event_date), "MMM dd, yyyy • h:mm a")} • {e.location || "TBA"}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full mt-1 inline-block ${e.is_upcoming ? "bg-gold/10 text-gold" : "bg-muted text-muted-foreground"}`}>
                  {e.is_upcoming ? "Upcoming" : "Past"}
                </span>
              </div>
            </div>
            <button onClick={() => handleDelete(e.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== GALLERY ADMIN ========== */
const GalleryAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("gallery").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div>
      <h3 className="font-display text-2xl text-foreground mb-4">Manage Gallery ({items.length} photos)</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {items.map(item => (
          <div key={item.id} className="relative group rounded-xl overflow-hidden border border-border">
            <img src={item.image_url} alt={item.caption || ""} className="w-full aspect-square object-cover" />
            <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button onClick={() => handleDelete(item.id)} className="bg-destructive text-destructive-foreground px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" /> Delete
              </button>
            </div>
            {item.caption && <p className="absolute bottom-0 left-0 right-0 bg-background/70 text-foreground text-xs p-2 truncate">{item.caption}</p>}
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== BARS ADMIN ========== */
const BarsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from("bars").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("bars").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div>
      <h3 className="font-display text-2xl text-foreground mb-4">Manage Bars ({items.length})</h3>
      <div className="space-y-3">
        {items.map(b => (
          <div key={b.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
            <div>
              <p className="text-gold text-xs uppercase tracking-widest">{b.song}</p>
              <p className="text-foreground text-sm italic mt-1">{b.excerpt.substring(0, 80)}...</p>
            </div>
            <button onClick={() => handleDelete(b.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== FAN CONTENT ADMIN ========== */
const ContentAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from("fan_content").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("fan_content").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div>
      <h3 className="font-display text-2xl text-foreground mb-4">Manage Fan Content ({items.length})</h3>
      <div className="space-y-3">
        {items.map(c => (
          <div key={c.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
            <div>
              <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{c.category}</span>
              <p className="text-foreground text-sm mt-1">{c.caption.substring(0, 80)}...</p>
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== MUSIC VIDEOS ADMIN ========== */
const VideosAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", video_id: "", year: "" });
  const [saving, setSaving] = useState(false);

  const fetch = async () => {
    const { data } = await supabase.from("music_videos").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { fetch(); }, []);

  const handleAdd = async () => {
    if (!form.title || !form.video_id) return;
    setSaving(true);
    const { error } = await supabase.from("music_videos").insert({
      title: form.title,
      video_id: form.video_id,
      year: form.year || null,
    });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Video added!" }); setForm({ title: "", video_id: "", year: "" }); fetch(); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("music_videos").delete().eq("id", id);
    toast({ title: "Deleted" });
    fetch();
  };

  return (
    <div className="space-y-6">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">Add Music Video</h3>
        <p className="text-muted-foreground text-sm">These videos will appear in the Music section on the homepage.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Video Title *" className={inputClass} />
          <input value={form.video_id} onChange={e => setForm({ ...form, video_id: e.target.value })} placeholder="YouTube Video ID *" className={inputClass} />
          <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Year" className={inputClass} />
        </div>
        <button onClick={handleAdd} disabled={saving} className={btnClass}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />} Add Video
        </button>
      </div>
      <div className="space-y-3">
        {items.map(v => (
          <div key={v.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={`https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`} className="w-20 h-12 rounded-lg object-cover" alt="" />
              <div>
                <p className="text-foreground font-medium text-sm">{v.title}</p>
                <p className="text-xs text-muted-foreground">{v.year || "N/A"} • ID: {v.video_id}</p>
              </div>
            </div>
            <button onClick={() => handleDelete(v.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== FANS & REWARDS ADMIN ========== */
const FansAdmin = () => {
  const { toast } = useToast();
  const [fans, setFans] = useState<any[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [rewardForm, setRewardForm] = useState({ user_id: "", reward_type: "shoutout", message: "" });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase.from("profiles").select("user_id, username, location, avatar_url").order("created_at", { ascending: false });
      if (profiles) setFans(profiles);
      const { data: rw } = await supabase.from("fan_rewards").select("*").order("created_at", { ascending: false });
      if (rw) setRewards(rw);
      setLoading(false);
    };
    load();
  }, []);

  const handleReward = async () => {
    if (!rewardForm.user_id || !rewardForm.message) return;
    setSaving(true);
    const { error } = await supabase.from("fan_rewards").insert(rewardForm);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else {
      toast({ title: "Reward sent!" });
      setRewardForm({ user_id: "", reward_type: "shoutout", message: "" });
      const { data: rw } = await supabase.from("fan_rewards").select("*").order("created_at", { ascending: false });
      if (rw) setRewards(rw);
    }
    setSaving(false);
  };

  const handleDeleteReward = async (id: string) => {
    await supabase.from("fan_rewards").delete().eq("id", id);
    toast({ title: "Deleted" });
    const { data: rw } = await supabase.from("fan_rewards").select("*").order("created_at", { ascending: false });
    if (rw) setRewards(rw);
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" /></div>;

  // Group fans by location
  const locationMap: Record<string, number> = {};
  fans.forEach(f => {
    const loc = f.location || "Unknown";
    locationMap[loc] = (locationMap[loc] || 0) + 1;
  });
  const locationSorted = Object.entries(locationMap).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6">
      {/* Geo breakdown */}
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow">
        <h3 className="font-display text-2xl text-foreground mb-4 flex items-center gap-2"><MapPin className="w-5 h-5 text-gold" /> Fan Locations</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {locationSorted.map(([loc, count]) => (
            <div key={loc} className="bg-muted/30 border border-border rounded-xl p-3 text-center">
              <div className="font-display text-2xl text-gold">{count}</div>
              <div className="text-xs text-muted-foreground truncate">{loc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* All fans list */}
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow">
        <h3 className="font-display text-2xl text-foreground mb-4">All Fans ({fans.length})</h3>
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {fans.map(f => (
            <div key={f.user_id} className="flex items-center gap-3 py-2 border-b border-border last:border-0">
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
                {f.avatar_url ? <img src={f.avatar_url} className="w-full h-full object-cover" /> : <span className="text-xs font-bold text-foreground">{(f.username || "F")[0].toUpperCase()}</span>}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-foreground text-sm font-medium truncate">{f.username || "Fan"}</p>
                <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                  {f.location && <><MapPin className="w-3 h-3" /> {f.location}</>}
                </p>
              </div>
              <button onClick={() => setRewardForm({ ...rewardForm, user_id: f.user_id })} className="text-xs text-gold hover:text-gold-glow transition-colors">
                <Gift className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Send reward */}
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">Send Reward / Shoutout</h3>
        <select value={rewardForm.user_id} onChange={e => setRewardForm({ ...rewardForm, user_id: e.target.value })} className={inputClass}>
          <option value="">Select a fan...</option>
          {fans.map(f => <option key={f.user_id} value={f.user_id}>{f.username || "Fan"} {f.location ? `(${f.location})` : ""}</option>)}
        </select>
        <select value={rewardForm.reward_type} onChange={e => setRewardForm({ ...rewardForm, reward_type: e.target.value })} className={inputClass}>
          <option value="shoutout">Shoutout</option>
          <option value="badge">Badge</option>
          <option value="prize">Prize</option>
          <option value="feature">Feature</option>
        </select>
        <textarea value={rewardForm.message} onChange={e => setRewardForm({ ...rewardForm, message: e.target.value })} placeholder="Reward message..." rows={2} className={`${inputClass} resize-none`} />
        <button onClick={handleReward} disabled={saving || !rewardForm.user_id || !rewardForm.message} className={btnClass}>
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Gift className="w-4 h-4" />} Send Reward
        </button>
      </div>

      {/* Existing rewards */}
      {rewards.length > 0 && (
        <div>
          <h3 className="font-display text-xl text-foreground mb-3">Recent Rewards ({rewards.length})</h3>
          <div className="space-y-2">
            {rewards.map(r => (
              <div key={r.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
                <div>
                  <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{r.reward_type}</span>
                  <p className="text-foreground text-sm mt-1">{r.message}</p>
                  <p className="text-xs text-muted-foreground mt-1">User: {r.user_id.substring(0, 8)}...</p>
                </div>
                <button onClick={() => handleDeleteReward(r.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

/* ========== ANALYTICS ========== */
const AnalyticsAdmin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStreams: 0, totalBars: 0, totalContent: 0, totalGallery: 0 });
  const [recentStreams, setRecentStreams] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const [profiles, streams, bars, content, gallery] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("streams").select("id", { count: "exact", head: true }),
        supabase.from("bars").select("id", { count: "exact", head: true }),
        supabase.from("fan_content").select("id", { count: "exact", head: true }),
        supabase.from("gallery").select("id", { count: "exact", head: true }),
      ]);
      setStats({
        totalUsers: profiles.count || 0,
        totalStreams: streams.count || 0,
        totalBars: bars.count || 0,
        totalContent: content.count || 0,
        totalGallery: gallery.count || 0,
      });

      const { data: recent } = await supabase.from("streams").select("stream_date, platform, user_id").order("created_at", { ascending: false }).limit(20);
      if (recent) setRecentStreams(recent);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" /></div>;

  const statCards = [
    { label: "Total Users", value: stats.totalUsers, icon: Users },
    { label: "Total Streams", value: stats.totalStreams, icon: BarChart3 },
    { label: "Bars Submitted", value: stats.totalBars, icon: BookOpen },
    { label: "Fan Content", value: stats.totalContent, icon: Megaphone },
    { label: "Gallery Photos", value: stats.totalGallery, icon: Camera },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {statCards.map(({ label, value, icon: Icon }) => (
          <div key={label} className="gradient-card rounded-2xl border border-border p-5 card-shadow text-center">
            <Icon className="w-5 h-5 text-gold mx-auto mb-2" />
            <div className="font-display text-3xl text-gold">{value}</div>
            <div className="text-xs text-muted-foreground uppercase tracking-widest">{label}</div>
          </div>
        ))}
      </div>

      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow">
        <h3 className="font-display text-2xl text-foreground mb-4">Recent Stream Activity</h3>
        <div className="space-y-2">
          {recentStreams.map((s, i) => (
            <div key={i} className="flex justify-between items-center py-2 border-b border-border last:border-0">
              <div className="flex items-center gap-3">
                <Eye className="w-3.5 h-3.5 text-gold" />
                <span className="text-foreground text-sm">{s.platform}</span>
              </div>
              <span className="text-muted-foreground text-xs">{s.stream_date}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Admin;
