import { useState, useEffect } from "react";
import { Megaphone, Plus, Send, Loader2, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface ContentItem {
  id: string;
  caption: string;
  hashtags: string;
  category: string;
  video_url?: string | null;
  user_id?: string;
  username?: string;
}

function getEmbedUrl(url: string): { embed: string; platform: string } | null {
  try {
    const ytMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([a-zA-Z0-9_-]+)/);
    if (ytMatch) return { embed: `https://www.youtube.com/embed/${ytMatch[1]}?loop=1&playlist=${ytMatch[1]}&autoplay=0`, platform: "YouTube" };
    const ttMatch = url.match(/tiktok\.com\/@[^/]+\/video\/(\d+)/);
    if (ttMatch) return { embed: `https://www.tiktok.com/embed/v2/${ttMatch[1]}`, platform: "TikTok" };
    const igMatch = url.match(/instagram\.com\/(reel|p)\/([a-zA-Z0-9_-]+)/);
    if (igMatch) return { embed: `https://www.instagram.com/${igMatch[1]}/${igMatch[2]}/embed`, platform: "Instagram" };
  } catch {}
  return null;
}

const FanContentEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ caption: "", hashtags: "", category: "General", video_url: "" });
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("fan_content").select("*").order("created_at", { ascending: false });
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((c) => c.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
        const profileMap: Record<string, string> = {};
        profiles?.forEach((p) => { profileMap[p.user_id] = p.username || "Fan"; });
        setItems(data.map((c: any) => ({ id: c.id, caption: c.caption, hashtags: c.hashtags, category: c.category, video_url: c.video_url, user_id: c.user_id, username: profileMap[c.user_id] || "Fan" })));
      }
      setLoading(false);
    };
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((s) => s.category)))];
  const filtered = activeFilter === "All" ? items : items.filter((s) => s.category === activeFilter);

  const handleSubmit = async () => {
    if (!user || !form.caption || !form.hashtags) return;
    setSubmitting(true);
    const insertData: any = { user_id: user.id, caption: form.caption, hashtags: form.hashtags, category: form.category };
    if (form.video_url.trim()) insertData.video_url = form.video_url.trim();
    const { error } = await supabase.from("fan_content").insert(insertData);
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Content submitted!", description: "Your content is now live!" });
      setForm({ caption: "", hashtags: "", category: "General", video_url: "" });
      setShowForm(false);
      const { data } = await supabase.from("fan_content").select("*").order("created_at", { ascending: false });
      if (data) {
        const userIds = [...new Set(data.map((c) => c.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
        const profileMap: Record<string, string> = {};
        profiles?.forEach((p) => { profileMap[p.user_id] = p.username || "Fan"; });
        setItems(data.map((c: any) => ({ id: c.id, caption: c.caption, hashtags: c.hashtags, category: c.category, video_url: c.video_url, user_id: c.user_id, username: profileMap[c.user_id] || "Fan" })));
      }
    }
    setSubmitting(false);
  };

  return (
    <section id="content" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Megaphone className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Fan Content</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">FAN CONTENT</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Share your Medikal fan videos and content. Submit a link to your video! 📱
          </p>
        </div>

        {user && (
          <div className="text-center mb-8">
            {!showForm ? (
              <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-6 py-2.5 rounded-full hover:bg-gold/10 transition-all">
                <Plus className="w-4 h-4" /> Submit Content
              </button>
            ) : (
              <div className="max-w-lg mx-auto gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4 text-left">
                <h3 className="font-display text-xl text-foreground">Submit Fan Content</h3>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Video Link (YouTube, TikTok, or Instagram)</label>
                  <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://youtube.com/watch?v=... or TikTok/Instagram link" className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Caption</label>
                  <textarea value={form.caption} onChange={(e) => setForm({ ...form, caption: e.target.value })} placeholder="Describe your content..." rows={2} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Hashtags</label>
                  <input value={form.hashtags} onChange={(e) => setForm({ ...form, hashtags: e.target.value })} placeholder="#Medikal #AMG ..." className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors" />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors">
                    {["Hype", "Lifestyle", "Appreciation", "Streak", "Deep Dive", "General"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button onClick={handleSubmit} disabled={submitting || !form.caption || !form.hashtags} className="flex-1 bg-gold text-primary-foreground font-semibold py-3 rounded-xl hover:bg-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Submit
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-3 border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors text-sm">Cancel</button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat} onClick={() => { setActiveFilter(cat); setVisibleCount(6); }} className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${activeFilter === cat ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" /></div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Megaphone className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No fan content yet. Be the first to submit!</p>
          </div>
        ) : (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
              {filtered.slice(0, visibleCount).map(({ id, caption, hashtags, category, video_url, user_id, username }) => {
                const embedInfo = video_url ? getEmbedUrl(video_url) : null;
                return (
                  <div key={id} className="gradient-card rounded-2xl border border-border card-shadow hover:border-gold/30 transition-all duration-300 flex flex-col overflow-hidden">
                    {embedInfo ? (
                      <div className="aspect-[9/16] w-full">
                        <iframe src={embedInfo.embed} title={caption} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" loading="lazy" />
                      </div>
                    ) : video_url ? (
                      <a href={video_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-muted/30 px-4 py-3 text-sm text-gold hover:text-gold-glow transition-colors">
                        <ExternalLink className="w-4 h-4" /> Watch Video
                      </a>
                    ) : null}
                    <div className="p-5 flex flex-col gap-3 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full font-medium">{category}</span>
                        {user_id && (
                          <Link to={`/user/${user_id}`} className="text-xs text-muted-foreground hover:text-gold transition-colors">
                            by {username}
                          </Link>
                        )}
                      </div>
                      <p className="text-foreground text-sm leading-relaxed flex-1">{caption}</p>
                      <div className="text-gold/70 text-xs leading-relaxed">{hashtags}</div>
                    </div>
                  </div>
                );
              })}
            </div>
            {filtered.length > visibleCount && (
              <div className="text-center pt-8">
                <button onClick={() => setVisibleCount((c) => c + 6)} className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-6 py-2.5 rounded-full hover:bg-gold/10 transition-all text-sm">
                  Load More ({filtered.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default FanContentEngine;
