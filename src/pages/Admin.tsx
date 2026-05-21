import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate, Link } from "react-router-dom";
import {
  ArrowLeft, Shield, Bell, Disc3, CalendarDays, Camera, BookOpen, Megaphone,
  Trash2, Plus, Save, Loader2, Users, BarChart3, Eye, MapPin, Gift, Video, Pencil, X, Menu
} from "lucide-react";
import { format } from "date-fns";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

type Tab = "analytics" | "announcements" | "albums" | "events" | "gallery" | "bars" | "content" | "videos" | "fans" | "users";

const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "announcements", label: "Announcements", icon: Bell },
  { id: "albums", label: "Albums", icon: Disc3 },
  { id: "events", label: "Events", icon: CalendarDays },
  { id: "gallery", label: "Gallery", icon: Camera },
  { id: "bars", label: "Bars", icon: BookOpen },
  { id: "content", label: "Fan Content", icon: Megaphone },
  { id: "videos", label: "Videos", icon: Video },
  { id: "fans", label: "Fans", icon: Gift },
  { id: "users", label: "Users & Roles", icon: Users },
];

const inputClass = "w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors";
const btnClass = "bg-gold text-primary-foreground font-semibold py-3 px-6 rounded-xl hover:bg-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60";
const btnSecondary = "border border-border text-muted-foreground py-2 px-4 rounded-xl hover:text-foreground hover:border-gold/40 transition-all flex items-center justify-center gap-2 text-sm";

const Admin = () => {
  const { user, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [tab, setTab] = useState<Tab>("analytics");

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
          <Link to="/" className="text-gold hover:underline">← Back to BYK Fanbase</Link>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="min-h-screen flex w-full bg-background">
        {/* Admin Sidebar */}
        <Sidebar collapsible="icon" className="border-r border-border">
          <SidebarContent className="pt-20">
            <SidebarGroup>
              <SidebarGroupLabel className="text-gold/70 uppercase tracking-widest text-[10px] font-semibold">
                Admin Panel
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {TABS.map(({ id, label, icon: Icon }) => (
                    <SidebarMenuItem key={id}>
                      <SidebarMenuButton
                        onClick={() => setTab(id)}
                        isActive={tab === id}
                        tooltip={label}
                        className={tab === id ? "bg-gold/10 text-gold border-l-2 border-gold" : ""}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Back to site">
                      <Link to="/" className="text-muted-foreground hover:text-gold">
                        <ArrowLeft className="w-4 h-4" />
                        <span>Back to Site</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-16 flex items-center gap-3 border-b border-border px-4 pt-16 pb-2 sticky top-0 bg-background z-10">
            <SidebarTrigger className="text-muted-foreground hover:text-gold" />
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-gold" />
              <h1 className="font-display text-xl text-foreground uppercase tracking-wide">
                {TABS.find(t => t.id === tab)?.label || "Admin"}
              </h1>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {tab === "analytics" && <AnalyticsAdmin />}
            {tab === "announcements" && <AnnouncementsAdmin />}
            {tab === "albums" && <AlbumsAdmin />}
            {tab === "events" && <EventsAdmin />}
            {tab === "gallery" && <GalleryAdmin />}
            {tab === "bars" && <BarsAdmin />}
            {tab === "content" && <ContentAdmin />}
            {tab === "videos" && <VideosAdmin />}
            {tab === "fans" && <FansAdmin />}
            {tab === "users" && <UsersAdmin />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

/* ========== ANNOUNCEMENTS ========== */
const AnnouncementsAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const [form, setForm] = useState({ title: "", body: "", pinned: false });
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("announcements").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.body) return;
    setSaving(true);
    if (editId) {
      const { error } = await supabase.from("announcements").update({ title: form.title, body: form.body, pinned: form.pinned }).eq("id", editId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Updated!" }); setEditId(null); }
    } else {
      const { error } = await supabase.from("announcements").insert(form);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Announcement posted!" });
    }
    setForm({ title: "", body: "", pinned: false });
    load();
    setSaving(false);
  };

  const startEdit = (a: any) => {
    setEditId(a.id);
    setForm({ title: a.title, body: a.body, pinned: a.pinned || false });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("announcements").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">{editId ? "Edit Announcement" : "Post Announcement"}</h3>
        <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Title" className={inputClass} />
        <textarea value={form.body} onChange={e => setForm({ ...form, body: e.target.value })} placeholder="Body" rows={3} className={`${inputClass} resize-none`} />
        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input type="checkbox" checked={form.pinned} onChange={e => setForm({ ...form, pinned: e.target.checked })} className="accent-[hsl(var(--gold))]" /> Pin this announcement
        </label>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={btnClass}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editId ? "Update" : "Post"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm({ title: "", body: "", pinned: false }); }} className={btnSecondary}><X className="w-4 h-4" /> Cancel</button>}
        </div>
      </div>
      <div className="space-y-3">
        {items.map(a => (
          <div key={a.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
            <div>
              <p className="text-foreground font-medium">{a.title}</p>
              <p className="text-muted-foreground text-sm mt-1">{a.body.substring(0, 100)}...</p>
              <p className="text-xs text-muted-foreground mt-1">{format(new Date(a.created_at), "MMM dd, yyyy")}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(a)} className="text-gold hover:text-gold-glow"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
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
  const emptyForm = { title: "", cover_url: "", release_year: "", spotify_url: "", audiomack_url: "", boomplay_url: "", youtube_url: "", apple_music_url: "", amazon_music_url: "", deezer_url: "", tidal_url: "", soundcloud_url: "", itunes_url: "", youtube_music_url: "" };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("albums").select("*").order("release_year", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title) return;
    setSaving(true);
    const payload: any = {
      title: form.title,
      cover_url: form.cover_url || null,
      release_year: form.release_year ? parseInt(form.release_year) : null,
    };
    const urlFields = ["spotify_url", "audiomack_url", "boomplay_url", "youtube_url", "apple_music_url", "amazon_music_url", "deezer_url", "tidal_url", "soundcloud_url", "itunes_url", "youtube_music_url"] as const;
    urlFields.forEach(f => { payload[f] = (form as any)[f] || null; });

    if (editId) {
      const { error } = await supabase.from("albums").update(payload).eq("id", editId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Updated!" }); setEditId(null); }
    } else {
      const { error } = await supabase.from("albums").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Album added!" });
    }
    setForm(emptyForm);
    load();
    setSaving(false);
  };

  const startEdit = (a: any) => {
    setEditId(a.id);
    const f: any = { ...emptyForm };
    Object.keys(f).forEach(k => { f[k] = k === "release_year" ? (a.release_year?.toString() || "") : (a[k] || ""); });
    setForm(f);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("albums").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">{editId ? "Edit Album" : "Add Album / Project"}</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Album Title *" className={inputClass} />
          <input value={form.release_year} onChange={e => setForm({ ...form, release_year: e.target.value })} placeholder="Release Year" type="number" className={inputClass} />
          <input value={form.cover_url} onChange={e => setForm({ ...form, cover_url: e.target.value })} placeholder="Cover Image URL" className={inputClass} />
          <input value={form.spotify_url} onChange={e => setForm({ ...form, spotify_url: e.target.value })} placeholder="Spotify URL" className={inputClass} />
          <input value={form.apple_music_url} onChange={e => setForm({ ...form, apple_music_url: e.target.value })} placeholder="Apple Music URL" className={inputClass} />
          <input value={form.youtube_music_url} onChange={e => setForm({ ...form, youtube_music_url: e.target.value })} placeholder="YouTube Music URL" className={inputClass} />
          <input value={form.audiomack_url} onChange={e => setForm({ ...form, audiomack_url: e.target.value })} placeholder="Audiomack URL" className={inputClass} />
          <input value={form.boomplay_url} onChange={e => setForm({ ...form, boomplay_url: e.target.value })} placeholder="Boomplay URL" className={inputClass} />
          <input value={form.youtube_url} onChange={e => setForm({ ...form, youtube_url: e.target.value })} placeholder="YouTube URL" className={inputClass} />
          <input value={form.itunes_url} onChange={e => setForm({ ...form, itunes_url: e.target.value })} placeholder="iTunes Store URL" className={inputClass} />
          <input value={form.amazon_music_url} onChange={e => setForm({ ...form, amazon_music_url: e.target.value })} placeholder="Amazon Music URL" className={inputClass} />
          <input value={form.deezer_url} onChange={e => setForm({ ...form, deezer_url: e.target.value })} placeholder="Deezer URL" className={inputClass} />
          <input value={form.soundcloud_url} onChange={e => setForm({ ...form, soundcloud_url: e.target.value })} placeholder="SoundCloud URL" className={inputClass} />
          <input value={form.tidal_url} onChange={e => setForm({ ...form, tidal_url: e.target.value })} placeholder="Tidal URL" className={inputClass} />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={btnClass}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editId ? "Update" : "Add Album"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm(emptyForm); }} className={btnSecondary}><X className="w-4 h-4" /> Cancel</button>}
        </div>
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
            <div className="flex gap-2">
              <button onClick={() => startEdit(a)} className="text-gold hover:text-gold-glow"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(a.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
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
  const emptyForm = { title: "", description: "", location: "", event_date: "", image_url: "", ticket_url: "", is_upcoming: true };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("events").select("*").order("event_date", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleSave = async () => {
    if (!form.title || !form.event_date) return;
    setSaving(true);
    const payload = {
      title: form.title,
      description: form.description || null,
      location: form.location || null,
      event_date: form.event_date,
      image_url: form.image_url || null,
      ticket_url: form.ticket_url || null,
      is_upcoming: form.is_upcoming,
    };
    if (editId) {
      const { error } = await supabase.from("events").update(payload).eq("id", editId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Updated!" }); setEditId(null); }
    } else {
      const { error } = await supabase.from("events").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Event added!" });
    }
    setForm(emptyForm);
    load();
    setSaving(false);
  };

  const startEdit = (e: any) => {
    setEditId(e.id);
    setForm({ title: e.title, description: e.description || "", location: e.location || "", event_date: e.event_date?.substring(0, 16) || "", image_url: e.image_url || "", ticket_url: e.ticket_url || "", is_upcoming: e.is_upcoming ?? true });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("events").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">{editId ? "Edit Event" : "Add Event / Show"}</h3>
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
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={btnClass}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editId ? "Update" : "Add Event"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm(emptyForm); }} className={btnSecondary}><X className="w-4 h-4" /> Cancel</button>}
        </div>
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
            <div className="flex gap-2 flex-shrink-0">
              <button onClick={() => startEdit(e)} className="text-gold hover:text-gold-glow"><Pencil className="w-4 h-4" /></button>
              <button onClick={() => handleDelete(e.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
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

  const load = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("gallery").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="max-w-5xl">
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

  const load = async () => {
    const { data } = await supabase.from("bars").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("bars").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="max-w-4xl">
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

  const load = async () => {
    const { data } = await supabase.from("fan_content").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };
  useEffect(() => { load(); }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("fan_content").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="max-w-4xl">
      <h3 className="font-display text-2xl text-foreground mb-4">Manage Fan Content ({items.length})</h3>
      <div className="space-y-3">
        {items.map(c => (
          <div key={c.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-start gap-4">
            <div>
              <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{c.category}</span>
              <p className="text-foreground text-sm mt-1">{c.caption.substring(0, 80)}...</p>
              {c.video_url && <p className="text-xs text-muted-foreground mt-1 truncate max-w-xs">🎬 {c.video_url}</p>}
            </div>
            <button onClick={() => handleDelete(c.id)} className="text-destructive hover:text-destructive/80 flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== MUSIC VIDEOS ADMIN ========== */
const extractYouTubeId = (input: string): string => {
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    return url.searchParams.get("v") || url.pathname.split("/").pop() || input;
  } catch {
    return input;
  }
};

const VideosAdmin = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<any[]>([]);
  const emptyForm = { title: "", video_url: "", year: "" };
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);

  const [channelUrl, setChannelUrl] = useState("");
  const [channelId, setChannelId] = useState("");
  const [configId, setConfigId] = useState<string | null>(null);
  const [configSaving, setConfigSaving] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [lastFetched, setLastFetched] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("music_videos").select("*").order("created_at", { ascending: false });
    if (data) setItems(data);
  };

  const loadConfig = async () => {
    const { data } = await supabase.from("channel_config").select("*").limit(1).single();
    if (data) {
      setChannelUrl(data.channel_url || "");
      setChannelId(data.channel_id || "");
      setConfigId(data.id);
      setLastFetched(data.last_fetched_at);
    }
  };

  useEffect(() => { load(); loadConfig(); }, []);

  const extractChannelId = (url: string): string => {
    try {
      const u = new URL(url);
      const path = u.pathname;
      if (path.startsWith("/channel/")) return path.split("/")[2];
      if (path.startsWith("/@")) return url;
      if (path.startsWith("/c/")) return url;
      if (path.startsWith("/user/")) return url;
    } catch {}
    return url.trim();
  };

  const handleSaveConfig = async () => {
    if (!channelUrl) return;
    setConfigSaving(true);
    let resolvedId = channelId;
    if (!resolvedId || resolvedId === channelUrl) {
      resolvedId = extractChannelId(channelUrl);
    }
    const payload = { channel_url: channelUrl, channel_id: resolvedId, display_count: 4 };
    if (configId) {
      const { error } = await supabase.from("channel_config").update({ ...payload, updated_at: new Date().toISOString() }).eq("id", configId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Channel config updated!" });
    } else {
      const { error, data } = await supabase.from("channel_config").insert(payload).select().single();
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Channel configured!" }); if (data) setConfigId(data.id); }
    }
    setConfigSaving(false);
  };

  const handleFetchNow = async () => {
    setFetching(true);
    try {
      const projectId = import.meta.env.VITE_SUPABASE_PROJECT_ID;
      const res = await fetch(`https://${projectId}.supabase.co/functions/v1/fetch-youtube-videos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!res.ok) {
        const errorBody = await res.text();
        throw new Error(`Function request failed: ${res.status} ${res.statusText} - ${errorBody}`);
      }
      const result = await res.json();
      if (result.error) {
        toast({ title: "Fetch Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Videos fetched!", description: `${result.totalFetched} videos loaded, ${result.activeCount} now active.` });
        load();
        loadConfig();
      }
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
    setFetching(false);
  };

  const handleSave = async () => {
    if (!form.title || !form.video_url) return;
    setSaving(true);
    const video_id = extractYouTubeId(form.video_url);
    const payload = { title: form.title, video_id, year: form.year || null, auto_fetched: false, active: true };
    if (editId) {
      const { error } = await supabase.from("music_videos").update(payload).eq("id", editId);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else { toast({ title: "Updated!" }); setEditId(null); }
    } else {
      const { error } = await supabase.from("music_videos").insert(payload);
      if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
      else toast({ title: "Video added!" });
    }
    setForm(emptyForm);
    load();
    setSaving(false);
  };

  const startEdit = (v: any) => {
    setEditId(v.id);
    setForm({ title: v.title, video_url: `https://www.youtube.com/watch?v=${v.video_id}`, year: v.year || "" });
  };

  const handleDelete = async (id: string) => {
    await supabase.from("music_videos").delete().eq("id", id);
    toast({ title: "Deleted" });
    load();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <div className="gradient-card rounded-2xl border border-gold/20 p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground flex items-center gap-2">
          <Video className="w-5 h-5 text-gold" /> Auto-Rotation (YouTube Channel)
        </h3>
        <p className="text-muted-foreground text-sm">
          Paste your YouTube channel ID (e.g., <code className="text-gold">UCxxxxxx</code>). The system will fetch videos and rotate 4 every 24 hours automatically.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <input value={channelUrl} onChange={e => setChannelUrl(e.target.value)} placeholder="YouTube Channel URL (e.g., https://youtube.com/@medikal)" className={inputClass} />
          <input value={channelId} onChange={e => setChannelId(e.target.value)} placeholder="Channel ID (e.g., UCxxxxxxx) *" className={inputClass} />
        </div>
        {lastFetched && <p className="text-xs text-muted-foreground">Last fetched: {format(new Date(lastFetched), "MMM dd, yyyy HH:mm")}</p>}
        <div className="flex gap-3">
          <button onClick={handleSaveConfig} disabled={configSaving || !channelId} className={btnClass}>
            {configSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Config
          </button>
          <button onClick={handleFetchNow} disabled={fetching || !configId} className={btnSecondary}>
            {fetching ? <Loader2 className="w-4 h-4 animate-spin" /> : <Video className="w-4 h-4" />} Fetch Now
          </button>
        </div>
      </div>

      <div className="gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
        <h3 className="font-display text-2xl text-foreground">{editId ? "Edit Music Video" : "Add Manual Video"}</h3>
        <p className="text-muted-foreground text-sm">Manually added videos are always shown alongside auto-rotated ones.</p>
        <div className="grid md:grid-cols-3 gap-4">
          <input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Video Title *" className={inputClass} />
          <input value={form.video_url} onChange={e => setForm({ ...form, video_url: e.target.value })} placeholder="YouTube URL or Video ID *" className={inputClass} />
          <input value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} placeholder="Year" className={inputClass} />
        </div>
        <div className="flex gap-3">
          <button onClick={handleSave} disabled={saving} className={btnClass}>
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : editId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />} {editId ? "Update" : "Add Video"}
          </button>
          {editId && <button onClick={() => { setEditId(null); setForm(emptyForm); }} className={btnSecondary}><X className="w-4 h-4" /> Cancel</button>}
        </div>
      </div>

      <div className="space-y-3">
        {items.map(v => (
          <div key={v.id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex justify-between items-center gap-4">
            <div className="flex items-center gap-3">
              <img src={`https://img.youtube.com/vi/${v.video_id}/mqdefault.jpg`} className="w-20 h-12 rounded-lg object-cover" alt="" />
              <div>
                <p className="text-foreground font-medium text-sm">
                  {v.title}
                  {v.auto_fetched && <span className="ml-2 text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">Auto</span>}
                  {v.active && <span className="ml-1 text-xs bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full">Active</span>}
                </p>
                <p className="text-xs text-muted-foreground">{v.year || "N/A"} • ID: {v.video_id}</p>
              </div>
            </div>
            <div className="flex gap-2">
              {!v.auto_fetched && <button onClick={() => startEdit(v)} className="text-gold hover:text-gold-glow"><Pencil className="w-4 h-4" /></button>}
              <button onClick={() => handleDelete(v.id)} className="text-destructive hover:text-destructive/80"><Trash2 className="w-4 h-4" /></button>
            </div>
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

  const locationMap: Record<string, number> = {};
  fans.forEach(f => { const loc = f.location || "Unknown"; locationMap[loc] = (locationMap[loc] || 0) + 1; });
  const locationSorted = Object.entries(locationMap).sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-6 max-w-5xl">
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

/* ========== USERS & ROLES ADMIN ========== */
const UsersAdmin = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const { data: profiles } = await supabase.from("profiles").select("user_id, username, avatar_url, location, created_at").order("created_at", { ascending: false });
      const { data: roles } = await supabase.from("user_roles").select("user_id, role");
      const roleMap: Record<string, string> = {};
      roles?.forEach(r => { roleMap[r.user_id] = r.role; });
      setUsers((profiles || []).map(p => ({ ...p, role: roleMap[p.user_id] || "user" })));
      setLoading(false);
    };
    load();
  }, []);

  const changeRole = async (userId: string, newRole: "admin" | "user") => {
    const { error } = await supabase.from("user_roles").update({ role: newRole }).eq("user_id", userId);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: `Role updated to ${newRole}` });
      setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, role: newRole } : u));
    }
  };

  if (loading) return <div className="text-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" /></div>;

  return (
    <div className="max-w-4xl">
      <h3 className="font-display text-2xl text-foreground mb-4">All Users ({users.length})</h3>
      <div className="space-y-2">
        {users.map(u => (
          <div key={u.user_id} className="gradient-card rounded-xl border border-border p-4 card-shadow flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center overflow-hidden flex-shrink-0">
              {u.avatar_url ? <img src={u.avatar_url} className="w-full h-full object-cover" /> : <span className="text-sm font-bold text-foreground">{(u.username || "F")[0].toUpperCase()}</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-foreground font-medium text-sm truncate">{u.username || "No username"}</p>
              <p className="text-xs text-muted-foreground">{u.location || "No location"} • Joined {format(new Date(u.created_at), "MMM yyyy")}</p>
            </div>
            <select
              value={u.role}
              onChange={e => changeRole(u.user_id, e.target.value as "admin" | "user")}
              className="bg-muted/40 border border-border rounded-lg px-3 py-1.5 text-sm text-foreground focus:outline-none focus:border-gold/50"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${u.role === "admin" ? "bg-gold/20 text-gold" : "bg-muted text-muted-foreground"}`}>
              {u.role}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ========== ANALYTICS ========== */
const AnalyticsAdmin = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStreams: 0, totalBars: 0, totalContent: 0, totalGallery: 0 });
  const [platformCounts, setPlatformCounts] = useState<{ platform: string; count: number }[]>([]);
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

      // Fetch all streams and aggregate by platform
      const { data: allStreams } = await supabase.from("streams").select("platform");
      if (allStreams) {
        const countMap: Record<string, number> = {};
        allStreams.forEach(s => {
          countMap[s.platform] = (countMap[s.platform] || 0) + 1;
        });
        const sorted = Object.entries(countMap)
          .map(([platform, count]) => ({ platform, count }))
          .sort((a, b) => b.count - a.count);
        setPlatformCounts(sorted);
      }

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

  const maxCount = platformCounts.length > 0 ? platformCounts[0].count : 1;

  return (
    <div className="space-y-6 max-w-5xl">
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
        <h3 className="font-display text-2xl text-foreground mb-6">Stream Activity by Platform</h3>
        {platformCounts.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No stream data yet.</p>
        ) : (
          <div className="space-y-4">
            {platformCounts.map(({ platform, count }) => (
              <div key={platform} className="flex items-center gap-4">
                <span className="text-foreground text-sm font-medium w-32 truncate">{platform}</span>
                <div className="flex-1 h-8 bg-muted/30 rounded-lg overflow-hidden relative">
                  <div
                    className="h-full bg-gradient-to-r from-gold/80 to-gold rounded-lg transition-all duration-500"
                    style={{ width: `${Math.max((count / maxCount) * 100, 4)}%` }}
                  />
                </div>
                <span className="font-display text-lg text-gold w-16 text-right">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
