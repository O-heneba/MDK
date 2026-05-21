import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const YOUTUBE_API_KEY = Deno.env.get("YOUTUBE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    if (!YOUTUBE_API_KEY) throw new Error("YOUTUBE_API_KEY not configured");

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get channel config
    const { data: config } = await supabase
      .from("channel_config")
      .select("*")
      .limit(1)
      .single();

    if (!config) {
      return new Response(JSON.stringify({ error: "No channel configured" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const channelId = config.channel_id;
    const displayCount = config.display_count || 4;

    // Fetch latest videos from YouTube Data API v3
    // First get the uploads playlist ID
    const channelRes = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`
    );
    const channelData = await channelRes.json();

    if (!channelData.items?.length) {
      return new Response(JSON.stringify({ error: "Channel not found", channelId }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;

    // Fetch up to 50 videos from uploads playlist
    const playlistRes = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
    );
    const playlistData = await playlistRes.json();

    if (!playlistData.items?.length) {
      return new Response(JSON.stringify({ error: "No videos found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const videos = playlistData.items.map((item: any, index: number) => ({
      video_id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      year: item.snippet.publishedAt?.substring(0, 4) || null,
      auto_fetched: true,
      display_order: index,
      active: false, // will set active ones below
    }));

    // Delete old auto-fetched videos
    await supabase.from("music_videos").delete().eq("auto_fetched", true);

    // Calculate which 4 to display based on rotation
    const totalVideos = videos.length;
    const offset = config.rotation_offset % totalVideos;

    for (let i = 0; i < videos.length; i++) {
      const relativeIndex = (i - offset + totalVideos) % totalVideos;
      videos[i].active = relativeIndex < displayCount;
    }

    // Insert all fetched videos
    const { error: insertError } = await supabase.from("music_videos").insert(videos);
    if (insertError) {
      console.error("Insert error:", insertError);
      throw insertError;
    }

    // Update config: increment rotation offset, update timestamps
    const newOffset = (offset + displayCount) % totalVideos;
    await supabase.from("channel_config").update({
      rotation_offset: newOffset,
      last_fetched_at: new Date().toISOString(),
      last_rotated_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }).eq("id", config.id);

    return new Response(JSON.stringify({ 
      success: true, 
      totalFetched: videos.length,
      activeCount: displayCount,
      offset: newOffset,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("fetch-youtube-videos error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
