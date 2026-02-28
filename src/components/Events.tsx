import { useEffect, useState } from "react";
import { CalendarDays, MapPin, Ticket } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Event {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  event_date: string;
  image_url: string | null;
  ticket_url: string | null;
  is_upcoming: boolean;
}

const Events = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  useEffect(() => {
    supabase.from("events").select("*").order("event_date", { ascending: tab === "upcoming" }).then(({ data }) => {
      if (data) setEvents(data);
    });
  }, [tab]);

  const filtered = events.filter((e) => (tab === "upcoming" ? e.is_upcoming : !e.is_upcoming));

  return (
    <section id="events" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <CalendarDays className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Shows & Events</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">EVENTS</h2>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          {(["upcoming", "past"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-full text-sm font-medium border transition-all capitalize ${
                tab === t ? "bg-gold text-primary-foreground border-gold" : "border-border text-muted-foreground hover:border-gold/40"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No {tab} events right now. Check back soon!</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {filtered.map((event) => (
              <div key={event.id} className="gradient-card rounded-2xl border border-border overflow-hidden card-shadow hover:border-gold/30 transition-all duration-300">
                {event.image_url && (
                  <img src={event.image_url} alt={event.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="text-xs text-gold uppercase tracking-widest mb-2">
                    {format(new Date(event.event_date), "MMM dd, yyyy • h:mm a")}
                  </div>
                  <h3 className="font-display text-2xl text-foreground mb-2">{event.title}</h3>
                  {event.description && <p className="text-muted-foreground text-sm mb-3">{event.description}</p>}
                  {event.location && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm mb-3">
                      <MapPin className="w-3.5 h-3.5 text-gold" /> {event.location}
                    </div>
                  )}
                  {event.ticket_url && (
                    <a
                      href={event.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-gold text-primary-foreground text-sm font-semibold px-5 py-2 rounded-full hover:bg-gold-glow transition-all"
                    >
                      <Ticket className="w-3.5 h-3.5" /> Get Tickets
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Events;
