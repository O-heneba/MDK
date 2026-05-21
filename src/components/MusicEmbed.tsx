import { useEffect, useState } from "react";
import { Music, Play, ExternalLink, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface MusicVideo {
  id: string;
  title: string;
  video_id: string;
  year: string | null;
}

const extractYouTubeId = (input: string): string => {
  // If it's already just an ID (no slashes/dots), return as-is
  if (/^[a-zA-Z0-9_-]{11}$/.test(input.trim())) return input.trim();
  try {
    const url = new URL(input);
    if (url.hostname.includes("youtu.be")) return url.pathname.slice(1);
    return url.searchParams.get("v") || url.pathname.split("/").pop() || input;
  } catch {
    return input;
  }
};

const platforms = [
  { name: "Spotify", url: "https://open.spotify.com/search/medikal" },
  { name: "Apple Music", url: "https://music.apple.com/search?term=medikal" },
  { name: "YouTube Music", url: "https://music.youtube.com/search?q=medikal" },
  { name: "Audiomack", url: "https://audiomack.com/medikal" },
  { name: "Boomplay", url: "https://www.boomplay.com/search/default/Medikal" },
  { name: "YouTube", url: "https://www.youtube.com/@medikal" },
  { name: "iTunes Store", url: "https://music.apple.com/search?term=medikal" },
  { name: "Amazon Music", url: "https://music.amazon.com/search/medikal" },
  { name: "Deezer", url: "https://www.deezer.com/search/medikal" },
  { name: "SoundCloud", url: "https://soundcloud.com/search?q=medikal" },
  { name: "Tidal", url: "https://tidal.com/search?q=medikal" },
];

const MusicEmbed = () => {
  const [videos, setVideos] = useState<MusicVideo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase
      .from("music_videos")
      .select("*")
      .eq("active", true)
      .order("display_order", { ascending: true })
      .limit(4)
      .then(({ data }) => {
        // Fallback: if no active videos found (e.g. auto-rotation not set up yet), show all
        if (data && data.length > 0) {
          setVideos(data);
        } else {
          supabase
            .from("music_videos")
            .select("*")
            .order("created_at", { ascending: false })
            .then(({ data: fallback }) => {
              if (fallback) setVideos(fallback);
            });
        }
        setLoading(false);
      });
  }, []);

  return (
    <section id="music" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Music className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Music Player</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">WATCH &amp; LISTEN</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Official music videos. Stream on your favourite platform to keep the streak alive.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12"><Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" /></div>
        ) : videos.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Music className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No videos yet. Admin can add them from the dashboard.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
            {videos.map(({ id, title, video_id, year }) => {
              const ytId = extractYouTubeId(video_id);
              return (
                <div
                  key={id}
                  className="gradient-card rounded-2xl border border-border card-shadow overflow-hidden hover:border-gold/30 transition-all duration-300 group"
                >
                  <div className="relative aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex items-center justify-between px-4 py-3">
                    <div>
                      <p className="text-foreground font-semibold text-sm">{title}</p>
                      {year && <p className="text-muted-foreground text-xs">{year}</p>}
                    </div>
                    <a
                      href={`https://www.youtube.com/watch?v=${ytId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-xs text-gold hover:text-gold-glow transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" /> YouTube
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Platform Links */}
        <div className="max-w-4xl mx-auto">
          <p className="text-center text-muted-foreground text-xs uppercase tracking-widest mb-5">
            Stream on all platforms
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {platforms.map(({ name, url }) => (
              <a
                key={name}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="gradient-card border border-border hover:border-gold/40 rounded-xl py-4 flex flex-col items-center gap-2 transition-all duration-200 hover:scale-105 group"
              >
                <Play className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
                <span className="text-sm font-medium text-foreground">{name}</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default MusicEmbed;
