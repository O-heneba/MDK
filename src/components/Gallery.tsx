import { useEffect, useState } from "react";
import { Camera, Upload, Loader2, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

interface GalleryItem {
  id: string;
  image_url: string;
  caption: string | null;
  created_at: string;
  uploaded_by: string | null;
  username?: string;
}

const Gallery = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    const { data } = await supabase.from("gallery").select("*").order("created_at", { ascending: false });
    if (data && data.length > 0) {
      const userIds = [...new Set(data.map((g) => g.uploaded_by).filter(Boolean))] as string[];
      const { data: profiles } = await supabase.from("profiles").select("user_id, username").in("user_id", userIds);
      const profileMap: Record<string, string> = {};
      profiles?.forEach((p) => { profileMap[p.user_id] = p.username || "Fan"; });
      setItems(data.map((g) => ({ ...g, username: g.uploaded_by ? profileMap[g.uploaded_by] || "Fan" : undefined })));
    } else {
      setItems([]);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files?.[0]) return;
    setUploading(true);
    const file = e.target.files[0];
    const ext = file.name.split(".").pop();
    const path = `${user.id}/${Date.now()}.${ext}`;

    const { error: uploadError } = await supabase.storage.from("gallery").upload(path, file);
    if (uploadError) {
      toast({ title: "Upload failed", description: uploadError.message, variant: "destructive" });
      setUploading(false);
      return;
    }

    const { data: urlData } = supabase.storage.from("gallery").getPublicUrl(path);
    const { error: insertError } = await supabase.from("gallery").insert({
      image_url: urlData.publicUrl,
      caption: caption || null,
      uploaded_by: user.id,
    });

    if (insertError) {
      toast({ title: "Error", description: insertError.message, variant: "destructive" });
    } else {
      toast({ title: "Photo uploaded!", description: "Your photo is now live!" });
      setCaption("");
      setShowUpload(false);
      fetchGallery();
    }
    setUploading(false);
  };

  return (
    <section id="gallery" className="py-24 bg-card border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Camera className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">Fan Gallery</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">PICTURES</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Fan photos and moments from the Medikal community.
          </p>
        </div>

        {/* Upload button */}
        {user && (
          <div className="text-center mb-8">
            {!showUpload ? (
              <button
                onClick={() => setShowUpload(true)}
                className="inline-flex items-center gap-2 border border-gold/40 text-gold font-semibold px-6 py-2.5 rounded-full hover:bg-gold/10 transition-all"
              >
                <Upload className="w-4 h-4" /> Upload a Photo
              </button>
            ) : (
              <div className="max-w-md mx-auto gradient-card rounded-2xl border border-border p-6 card-shadow space-y-4">
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption (optional)"
                  className="w-full bg-muted/40 border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
                />
                <label className="flex items-center justify-center gap-2 w-full bg-gold text-primary-foreground font-semibold py-3 rounded-xl hover:bg-gold-glow transition-all cursor-pointer disabled:opacity-60">
                  {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                  {uploading ? "Uploading..." : "Choose Photo"}
                  <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
                </label>
                <button onClick={() => setShowUpload(false)} className="text-muted-foreground text-sm hover:text-foreground transition-colors">
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}

        {items.length === 0 ? (
          <div className="text-center text-muted-foreground py-12">
            <Camera className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No photos yet. Be the first to share!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-6xl mx-auto">
            {items.map((item) => (
              <div key={item.id} className="rounded-xl overflow-hidden border border-border hover:border-gold/30 transition-all group">
                <div
                  onClick={() => setSelectedImage(item.image_url)}
                  className="aspect-square cursor-pointer overflow-hidden"
                >
                  <img
                    src={item.image_url}
                    alt={item.caption || "Fan photo"}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                </div>
                {item.uploaded_by && (
                  <div className="px-3 py-2 bg-card">
                    <Link to={`/user/${item.uploaded_by}`} className="text-xs text-muted-foreground hover:text-gold transition-colors">
                      by {item.username}
                    </Link>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-6 right-6 text-foreground hover:text-gold transition-colors">
              <X className="w-8 h-8" />
            </button>
            <img src={selectedImage} alt="Full view" className="max-w-full max-h-[90vh] rounded-xl object-contain" />
          </div>
        )}
      </div>
    </section>
  );
};

export default Gallery;
