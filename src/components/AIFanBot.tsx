import { useState, useRef, useEffect } from "react";
import { Bot, Send, User, Sparkles } from "lucide-react";

type Message = {
  role: "user" | "bot";
  text: string;
};

const knowledgeBase: Record<string, string> = {
  default: "I'm the Medikal Fanverse AI Bot! Ask me anything about AMG Medikal — his music, career, lyrics, or how to support him. 🎤🔥",
  name: "Medikal's real name is Samuel Adu Frimpong. He's widely known by his stage name 'Medikal' and is also called 'Alhaji'.",
  age: "Medikal was born on December 25, 1994, making him a Christmas baby! 🎄",
  label: "Medikal is signed to AMG Business, a music label he co-owns. He's been associated with top Ghanaian music figures.",
  awards: "Medikal has won multiple Ghana Music Awards including Rapper of the Year. He's consistently ranked among Ghana's top rap acts.",
  hit: "Some of Medikal's biggest hits include 'Omo Ada', 'La Hustle', 'Ayekoo', 'Crazy', 'Confirm', and many more.",
  stream: "You can stream Medikal's music on Spotify, Audiomack, Boomplay, and YouTube. Support him by streaming daily and keeping your streak on Medikal Fanverse!",
  wife: "Medikal was married to Ghanaian actress Fella Makafui. They have a daughter together named Island Frimpong.",
  daughter: "Medikal's daughter is named Island Frimpong, born in 2021. She's the apple of his eye! 👶",
  la: "Medikal is from La (Labadi), a community in Accra, Ghana. His La roots deeply influence his music and identity — 'La Hustle' is a tribute to this.",
  genre: "Medikal primarily performs Afrobeats and Ghanaian hip-hop (Hiplife/Afropop). His style blends rap with melodic Afrobeats elements.",
  collaborate: "Medikal has collaborated with artists like Sarkodie, Shatta Wale, Stonebwoy, Fella Makafui, and many international acts.",
};

function getBotResponse(input: string): string {
  const text = input.toLowerCase();
  if (text.includes("name") || text.includes("real name")) return knowledgeBase.name;
  if (text.includes("age") || text.includes("born") || text.includes("birthday")) return knowledgeBase.age;
  if (text.includes("label") || text.includes("amg")) return knowledgeBase.label;
  if (text.includes("award") || text.includes("won") || text.includes("prize")) return knowledgeBase.awards;
  if (text.includes("hit") || text.includes("song") || text.includes("music") || text.includes("track")) return knowledgeBase.hit;
  if (text.includes("stream") || text.includes("spotify") || text.includes("audiomack")) return knowledgeBase.stream;
  if (text.includes("wife") || text.includes("fella") || text.includes("married")) return knowledgeBase.wife;
  if (text.includes("daughter") || text.includes("island") || text.includes("child")) return knowledgeBase.daughter;
  if (text.includes("la ") || text.includes("labadi") || text.includes("hometown") || text.includes("from")) return knowledgeBase.la;
  if (text.includes("genre") || text.includes("style") || text.includes("type")) return knowledgeBase.genre;
  if (text.includes("collab") || text.includes("feature") || text.includes("work with")) return knowledgeBase.collaborate;
  return knowledgeBase.default;
}

const quickPrompts = [
  "What songs made him famous?",
  "Where is Medikal from?",
  "Who did he marry?",
  "What awards has he won?",
];

const AIFanBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    { role: "bot", text: "Hey fan! 👋 I'm the Medikal AI Fan Bot. Ask me anything about AMG Medikal — his music, background, career, and more!" },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { role: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botReply: Message = { role: "bot", text: getBotResponse(text) };
      setMessages((prev) => [...prev, botReply]);
      setIsTyping(false);
    }, 900);
  };

  return (
    <section id="aibot" className="py-24">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-gold/10 border border-gold/30 rounded-full px-4 py-1.5 mb-4">
            <Bot className="w-3.5 h-3.5 text-gold" />
            <span className="text-gold text-xs font-medium tracking-widest uppercase">AI Fan Bot</span>
          </div>
          <h2 className="font-display text-5xl md:text-6xl text-foreground">MEDIKAL AI BOT</h2>
          <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
            Your personal Medikal encyclopedia. Ask anything about his music, life, and career.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          {/* Chat window */}
          <div className="gradient-card rounded-2xl border border-border card-shadow overflow-hidden">
            {/* Chat header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-muted/30">
              <div className="w-8 h-8 rounded-full bg-gold flex items-center justify-center">
                <Bot className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <div className="font-semibold text-sm text-foreground">Medikal Fan Bot</div>
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-gold" />
                  <span className="text-xs text-muted-foreground">Online</span>
                </div>
              </div>
              <Sparkles className="w-4 h-4 text-gold ml-auto" />
            </div>

            {/* Messages */}
            <div className="h-80 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.role === "bot" ? "bg-gold" : "bg-surface-raised border border-border"
                  }`}>
                    {msg.role === "bot" ? (
                      <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-muted-foreground" />
                    )}
                  </div>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    msg.role === "bot"
                      ? "bg-surface-raised text-foreground rounded-tl-sm"
                      : "bg-gold text-primary-foreground rounded-tr-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-gold flex items-center justify-center">
                    <Bot className="w-3.5 h-3.5 text-primary-foreground" />
                  </div>
                  <div className="bg-surface-raised rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gold rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick prompts */}
            <div className="px-5 py-3 border-t border-border flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  onClick={() => sendMessage(prompt)}
                  className="text-xs bg-muted/50 hover:bg-gold/10 hover:text-gold border border-border hover:border-gold/30 text-muted-foreground px-3 py-1.5 rounded-full transition-all duration-200"
                >
                  {prompt}
                </button>
              ))}
            </div>

            {/* Input */}
            <div className="flex items-center gap-3 px-5 py-4 border-t border-border">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Ask about Medikal..."
                className="flex-1 bg-muted/40 border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-gold/50 transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim()}
                className="w-10 h-10 bg-gold text-primary-foreground rounded-xl flex items-center justify-center hover:bg-gold-glow transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFanBot;
