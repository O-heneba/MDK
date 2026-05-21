import { useEffect, useState } from "react";
import { Bell, Pin } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Announcement {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  created_at: string;
}

const Announcements = () => {
  const [items, setItems] = useState<Announcement[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    supabase
      .from("announcements")
      .select("*")
      .order("pinned", { ascending: false })
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setItems(data); });
  }, []);

  return (
    <section id="announcements" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Bell className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">News</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">ANNOUNCEMENTS</h2>
        </div>

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Bell className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No announcements yet. Stay tuned!</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {items.slice(0, visibleCount).map((a) => (
              <div
                key={a.id}
                className={`gradient-card rounded-2xl border p-6 card-shadow transition-all duration-300 ${
                  a.pinned ? "border-gold/40" : "border-border hover:border-gold/20"
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {a.pinned && <Pin className="w-3.5 h-3.5 text-gold" />}
                      <span className="text-xs text-muted-foreground">{format(new Date(a.created_at), "MMM dd, yyyy")}</span>
                    </div>
                    <h3 className="font-display text-xl text-foreground mb-2">{a.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{a.body}</p>
                  </div>
                </div>
              </div>
            ))}
            {items.length > visibleCount && (
              <div className="text-center pt-4">
                <button onClick={() => setVisibleCount((c) => c + 6)} className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-6 py-2.5 rounded-full hover:bg-gold/10 transition-all text-sm">
                  Load More ({items.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Announcements;
