import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StreamEngine from "@/components/StreamEngine";
import MusicEmbed from "@/components/MusicEmbed";
import Albums from "@/components/Albums";
import BarsInsight from "@/components/BarsInsight";
import FanContentEngine from "@/components/FanContentEngine";
import Events from "@/components/Events";
import Announcements from "@/components/Announcements";
import Gallery from "@/components/Gallery";
import Leaderboard from "@/components/Leaderboard";
import AIFanBot from "@/components/AIFanBot";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main>
        <HeroSection />
        <Announcements />
        <StreamEngine />
        <MusicEmbed />
        <Albums />
        <BarsInsight />
        <FanContentEngine />
        <Events />
        <Gallery />
        <Leaderboard />
        <AIFanBot />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
