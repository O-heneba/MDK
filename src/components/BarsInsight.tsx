import { useState, useEffect } from "react";
import { BookOpen, Quote, Plus, Send, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const defaultBars = [
  {
    id: "default-1",
    song: "Medikal – Omo Ada",
    excerpt: "\"I been working hard, made it from the dust / Now they calling my name, they must adjust\"",
    explanation: "Medikal reflects on his humble beginnings and rise to fame. He's telling critics and doubters that his success demands respect and acknowledgment — they must adapt to the new reality of his status.",
    tags: ["Hustle", "Success"],
  },
  {
    id: "default-2",
    song: "Medikal – La Hustle",
    excerpt: "\"La boys don't sleep, we grind through the night / Every move we make, we doing it right\"",
    explanation: "A tribute to his La (Labadi) community roots. He emphasizes the relentless work ethic and discipline of his crew — a shoutout to his origins and the values that shaped him.",
    tags: ["Community", "Grind"],
  },
  {
    id: "default-3",
    song: "Medikal – Ayekoo",
    excerpt: "\"Chale, I no rest till I get to the top / Money on my mind, I no go stop\"",
    explanation: "Using Ghanaian street slang ('Chale' = friend), Medikal expresses his unrelenting drive for financial success and elevation. 'Ayekoo' itself means 'well done' in Twi — celebrating milestones while staying motivated.",
    tags: ["Motivation", "Ghanaian Slang"],
  },
  {
    id: "default-4",
    song: "Medikal – Crazy",
    excerpt: "\"They said I was crazy for dreaming this big / Now look at me living exactly as I said\"",
    explanation: "A powerful vindication bar. He was doubted for his ambitions, but his reality now matches his vision — the bar serves as proof that belief in oneself is the foundation of success.",
    tags: ["Belief", "Vision"],
  },
];

interface Bar {
  id: string;
  song: string;
  excerpt: string;
  explanation: string;
  tags: string[];
  user_id?: string;
  username?: string;
}

const BarsInsight = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bars, setBars] = useState<Bar[]>(defaultBars);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ song: "", excerpt: "", explanation: "", tags: "" });

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.from("bars").select("*");
      if (data && data.length > 0) {
        const userIds = [...new Set(data.map((b) => b.user_id))];
        const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
        const profileMap: Record<string, string> = {};
        profiles?.forEach((p) => { profileMap[p.user_id] = p.username || "Fan"; });

        const userBars: Bar[] = data.map((b) => ({
          id: b.id,
          song: b.song,
          excerpt: b.excerpt,
          explanation: b.explanation,
          tags: b.tags || [],
          user_id: b.user_id,
          username: profileMap[b.user_id] || "Fan",
        }));
        setBars([...defaultBars, ...userBars]);
      }
    };
    load();
  }, []);

  const handleSubmit = async () => {
    if (!user || !form.song || !form.excerpt || !form.explanation) return;
    setSubmitting(true);
    const { error } = await supabase.from("bars").insert({
      user_id: user.id,
      song: form.song,
      excerpt: form.excerpt,
      explanation: form.explanation,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
    });
    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Bar submitted!", description: "Your bar is now live!" });
      setForm({ song: "", excerpt: "", explanation: "", tags: "" });
      setShowForm(false);
    }
    setSubmitting(false);
  };

  return (
    <section id="bars" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <BookOpen className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Bars & Lyrics</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">BARS INSIGHT</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Decode the meaning behind Medikal's hardest bars. From street talk to deep philosophy.
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
                <Plus className="w-4 h-4" /> Submit a Bar
              </button>
            ) : (
              <div className="max-w-lg mx-auto gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4 text-left">
                <h3 className="font-display text-xl text-foreground">Submit a Bar Insight</h3>
                {[
                  { key: "song", label: "Song Name", placeholder: "Medikal – Song Title" },
                  { key: "excerpt", label: "Bar / Lyric", placeholder: "Paste the bar here..." },
                  { key: "explanation", label: "Your Explanation", placeholder: "What does this bar mean?" },
                  { key: "tags", label: "Tags (comma separated)", placeholder: "Hustle, Motivation" },
                ].map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label className="block text-xs text-muted-foreground uppercase tracking-widest mb-1.5">{label}</label>
                    {key === "explanation" ? (
                      <textarea
                        value={(form as any)[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        rows={3}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors resize-none"
                      />
                    ) : (
                      <input
                        value={(form as any)[key]}
                        onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                        placeholder={placeholder}
                        className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
                      />
                    )}
                  </div>
                ))}
                <div className="flex gap-3">
                  <button
                    onClick={handleSubmit}
                    disabled={submitting || !form.song || !form.excerpt || !form.explanation}
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

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {bars.map(({ id, song, excerpt, explanation, tags, user_id, username }) => (
            <div key={id} className="gradient-card rounded-2xl border border-border p-6 card-shadow hover:border-gold/30 transition-all duration-300 group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-gold uppercase tracking-widest font-medium">{song}</span>
                {user_id && (
                  <Link to={`/user/${user_id}`} className="text-xs text-muted-foreground hover:text-gold transition-colors">
                    by {username}
                  </Link>
                )}
              </div>
              <div className="flex gap-3 mb-4">
                <Quote className="w-5 h-5 text-gold/60 flex-shrink-0 mt-0.5" />
                <p className="text-foreground font-medium leading-relaxed italic">{excerpt}</p>
              </div>
              <div className="h-px bg-border mb-4" />
              <p className="text-muted-foreground text-sm leading-relaxed">{explanation}</p>
              <div className="flex flex-wrap gap-2 mt-4">
                {tags.map((tag) => (
                  <span key={tag} className="text-xs bg-gold/10 text-gold border border-gold/20 px-3 py-1 rounded-full">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BarsInsight;
