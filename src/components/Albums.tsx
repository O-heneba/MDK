import { useEffect, useState } from "react";
import { Disc3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface Album {
  id: string;
  title: string;
  cover_url: string | null;
  release_year: number | null;
  spotify_url: string | null;
  audiomack_url: string | null;
  boomplay_url: string | null;
  youtube_url: string | null;
  apple_music_url: string | null;
  amazon_music_url: string | null;
  deezer_url: string | null;
  tidal_url: string | null;
  soundcloud_url: string | null;
  itunes_url: string | null;
  youtube_music_url: string | null;
}

const platformLinks: { key: keyof Album; label: string }[] = [
  { key: "spotify_url", label: "Spotify" },
  { key: "apple_music_url", label: "Apple Music" },
  { key: "youtube_music_url", label: "YouTube Music" },
  { key: "audiomack_url", label: "Audiomack" },
  { key: "boomplay_url", label: "Boomplay" },
  { key: "youtube_url", label: "YouTube" },
  { key: "itunes_url", label: "iTunes" },
  { key: "amazon_music_url", label: "Amazon Music" },
  { key: "deezer_url", label: "Deezer" },
  { key: "soundcloud_url", label: "SoundCloud" },
  { key: "tidal_url", label: "Tidal" },
];

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [visibleCount, setVisibleCount] = useState(6);

  useEffect(() => {
    supabase.from("albums").select("*").order("release_year", { ascending: false }).then(({ data }) => {
      if (data) setAlbums(data as Album[]);
    });
  }, []);

  return (
    <section id="albums" className="py-24">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Disc3 className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Discography</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">ALBUMS & PROJECTS</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Explore Medikal's full discography — albums, EPs, and mixtapes.
          </p>
        </div>

        {albums.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Disc3 className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>Albums coming soon. Stay tuned!</p>
          </div>
        ) : (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {albums.slice(0, visibleCount).map((album) => (
                <div key={album.id} className="gradient-card rounded-2xl border border-border overflow-hidden card-shadow hover:border-gold/30 transition-all duration-300 group">
                  {album.cover_url ? (
                    <img src={album.cover_url} alt={album.title} className="w-full aspect-square object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="w-full aspect-square bg-muted/30 flex items-center justify-center">
                      <Disc3 className="w-16 h-16 text-muted-foreground/30" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-display text-2xl text-foreground">{album.title}</h3>
                    {album.release_year && <p className="text-gold text-sm mt-1">{album.release_year}</p>}
                    <div className="flex flex-wrap gap-2 mt-3">
                      {platformLinks.map(({ key, label }) =>
                        album[key] ? (
                          <a key={key} href={album[key] as string} target="_blank" rel="noopener noreferrer" className="text-xs border border-border px-3 py-1 rounded-full text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors">
                            {label}
                          </a>
                        ) : null
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {albums.length > visibleCount && (
              <div className="text-center pt-8">
                <button onClick={() => setVisibleCount((c) => c + 6)} className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-6 py-2.5 rounded-full hover:bg-gold/10 transition-all text-sm">
                  Load More ({albums.length - visibleCount} remaining)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Albums;
