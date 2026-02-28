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
}

const Albums = () => {
  const [albums, setAlbums] = useState<Album[]>([]);

  useEffect(() => {
    supabase.from("albums").select("*").order("release_year", { ascending: false }).then(({ data }) => {
      if (data) setAlbums(data);
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
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {albums.map((album) => (
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
                    {album.spotify_url && <a href={album.spotify_url} target="_blank" rel="noopener noreferrer" className="text-xs border border-border px-3 py-1 rounded-full text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors">Spotify</a>}
                    {album.audiomack_url && <a href={album.audiomack_url} target="_blank" rel="noopener noreferrer" className="text-xs border border-border px-3 py-1 rounded-full text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors">Audiomack</a>}
                    {album.boomplay_url && <a href={album.boomplay_url} target="_blank" rel="noopener noreferrer" className="text-xs border border-border px-3 py-1 rounded-full text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors">Boomplay</a>}
                    {album.youtube_url && <a href={album.youtube_url} target="_blank" rel="noopener noreferrer" className="text-xs border border-border px-3 py-1 rounded-full text-muted-foreground hover:border-gold/40 hover:text-gold transition-colors">YouTube</a>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Albums;
