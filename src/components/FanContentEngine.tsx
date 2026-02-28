import { useState, useEffect } from "react";
import { Megaphone, Copy, CheckCheck, Plus, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const defaultContent = [
  { id: "d1", caption: "🔥 Just vibed out to Medikal all day and I'm not sorry. The bars are TOO hard. 🎤 #MedikalFanverse", hashtags: "#Medikal #AMG #GhanaianRap #LaHustle #BarsOnBars #StreakAlive", category: "Hype" },
  { id: "d2", caption: "Woke up, streamed Medikal. Went to work, streamed Medikal. Can't stop, won't stop. 💪", hashtags: "#MedikalFanverse #Medikal #DailyStream #StreamAndSupport #GhMusic", category: "Lifestyle" },
  { id: "d3", caption: "If you're not listening to @Medikal_gh then what are you even doing? 😤 The 🐐 of Ghanaian rap.", hashtags: "#Medikal #GOAT #GhanaianRap #AMGBusiness #FanLove", category: "Appreciation" },
  { id: "d4", caption: "Day {streak} of my Medikal streaming streak! Join the fanverse and lock in. 🎧🔥", hashtags: "#MedikalFanverse #StreamingStreak #Medikal #LaHustle #Support", category: "Streak" },
  { id: "d5", caption: "The way Medikal crafts his bars got me studying his lyrics like a textbook 📖 Genius level flow.", hashtags: "#Medikal #BarsInsight #GhanaianHipHop #Lyrics #AMG", category: "Deep Dive" },
  { id: "d6", caption: "Medikal ain't just music, it's a whole lifestyle. La lifestyle to be specific. 🔱", hashtags: "#LaHustle #Medikal #AMGBusiness #Lifestyle #GhanaianRap", category: "Lifestyle" },
];

interface ContentItem {
  id: string;
  caption: string;
  hashtags: string;
  category: string;
  user_id?: string;
  username?: string;
}

const FanContentEngine = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copiedIndex, setCopiedIndex] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState<ContentItem[]>(defaultContent);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ caption: "", hashtags: "", category: "General" });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("fan_content").select("*");
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((c) => c.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
        const profileMap: Record<string, string> = {};
        profiles?.forEach((p) => { profileMap[p.user_id] = p.username || "Fan"; });

        const userContent: ContentItem[] = data.map((c) => ({
          id: c.id,
          caption: c.caption,
          hashtags: c.hashtags,
          category: c.category,
          user_id: c.user_id,
          username: profileMap[c.user_id] || "Fan",
        }));
        setItems([...defaultContent, ...userContent]);
      }
    };
    load();
  }, []);

  const categories = ["All", ...Array.from(new Set(items.map((s) => s.category)))];
  const filtered = activeFilter === "All" ? items : items.filter((s) => s.category === activeFilter);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(id);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleSubmit = async () => {
    if (!user || !form.caption || !form.hashtags) return;
    setSubmitting(true);
    const { error } = await supabase.from("fan_content").insert({
      user_id: user.id,
      caption: form.caption,
      hashtags: form.hashtags,
      category: form.category,
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Content submitted!", description: "Your content is now live!" });
      setForm({ caption: "", hashtags: "", category: "General" });
      setShowForm(false);
    }
    setSubmitting(false);
  };

  return (
    <section id="content" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Megaphone className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Fan Content Engine</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">FAN CONTENT</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Ready-made captions and hashtags to spread the word about Medikal. Copy, post, repeat. 📱
          </p>
        </div>

        {/* Submit button */}
        {user && (
          <div className="text-center mb-8">
            {!showForm ? (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-6 py-2.5 rounded-full hover:bg-gold/10 transition-all"
              >
                <Plus className="w-4 h-4" /> Submit Content
              </button>
            ) : (
              <div className="max-w-lg mx-auto gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4 text-left">
                <h3 className="font-display text-xl text-foreground">Submit Fan Content</h3>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Caption</label>
                  <textarea
                    value={form.caption}
                    onChange={(e) => setForm({ ...form, caption: e.target.value })}
                    placeholder="Write your fan caption..."
                    rows={3}
                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Hashtags</label>
                  <input
                    value={form.hashtags}
                    onChange={(e) => setForm({ ...form, hashtags: e.target.value })}
                    placeholder="#Medikal #AMG ..."
                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground focus:outline-none focus:border-gold/50 transition-colors"
                  >
                    {["Hype", "Lifestyle", "Appreciation", "Streak", "Deep Dive", "General"].map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.caption || !form.hashtags}
                    className="flex-1 bg-gold text-primary-foreground font-semibold py-3 rounded-xl hover:bg-gold-glow transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    Submit
                  </button>
                  <button onClick={() => setShowForm(false)} className="px-4 py-3 border border-border rounded-xl text-muted-foreground hover:text-foreground transition-colors text-sm">
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${
                activeFilter === cat
                  ? "bg-gold text-primary-foreground border-gold"
                  : "border-border text-muted-foreground hover:border-gold/40 hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {filtered.map(({ id, caption, hashtags, category, user_id, username }) => (
            <div key={id} className="gradient-card rounded-2xl border border-border p-5 card-shadow hover:border-gold/30 transition-all duration-300 flex flex-col gap-3">
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
              <button
                onClick={() => handleCopy(id, `${caption}\n\n${hashtags}`)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium border transition-all duration-200 ${
                  copiedIndex === id
                    ? "bg-gold/20 border-gold text-gold"
                    : "border-border text-muted-foreground hover:border-gold/40 hover:text-gold"
                }`}
              >
                {copiedIndex === id ? <><CheckCheck className="w-3.5 h-3.5" /> Copied!</> : <><Copy className="w-3.5 h-3.5" /> Copy Caption + Hashtags</>}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FanContentEngine;
