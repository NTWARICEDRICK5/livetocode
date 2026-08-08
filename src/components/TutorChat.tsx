import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Bot, Send, X, Loader2, Sparkles } from "lucide-react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Explain pointers in C simply",
  "Why is my Python loop not stopping?",
  "What should I learn after HTML and CSS?",
  "Give me a practice task on JavaScript arrays",
];

const renderMarkdown = (text: string) => {
  const blocks = text.split(/```/);
  return blocks.map((block, i) => {
    if (i % 2 === 1) {
      const nl = block.indexOf("\n");
      const code = nl >= 0 ? block.slice(nl + 1) : block;
      return (
        <pre
          key={i}
          className="my-2 p-3 rounded-lg bg-background/80 border border-border overflow-x-auto text-xs font-mono"
        >
          <code>{code.replace(/\n$/, "")}</code>
        </pre>
      );
    }
    return (
      <p key={i} className="whitespace-pre-wrap leading-relaxed break-words">
        {block
          .replace(/^#{1,6}\s*/gm, "")
          .replace(/\*\*(.+?)\*\*/g, "$1")
          .replace(/`/g, "")}
      </p>
    );
  });
};

const TutorChat = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<Msg[]>([
    {
      role: "assistant",
      content:
        "Hi! I'm your CodeLearn AI Mentor. Ask me anything about Python, C, C++, HTML, CSS, JavaScript or TypeScript — or paste code that isn't working and I'll debug it with you.",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);
  const { pathname, search } = useLocation();

  useEffect(() => {
    const openHandler = () => setOpen(true);
    window.addEventListener("open-ai-mentor", openHandler);
    return () => window.removeEventListener("open-ai-mentor", openHandler);
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);


  const send = async (text: string) => {
    const question = text.trim();
    if (!question || busy) return;
    setError(null);
    setInput("");
    const next: Msg[] = [...messages, { role: "user", content: question }];
    setMessages([...next, { role: "assistant", content: "" }]);
    setBusy(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-tutor`;
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: next,
          context: `The learner is currently on the CodeLearn page "${pathname}${search}".`,
        }),
      });

      if (!res.ok || !res.body) {
        const info = await res.json().catch(() => ({ error: "Something went wrong." }));
        throw new Error(info.error || "Something went wrong.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let answer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const payload = line.slice(6).trim();
          if (payload === "[DONE]") continue;
          try {
            const delta = JSON.parse(payload).choices?.[0]?.delta?.content;
            if (delta) {
              answer += delta;
              setMessages([...next, { role: "assistant", content: answer }]);
            }
          } catch {
            /* partial chunk */
          }
        }
      }
      if (!answer) throw new Error("No response from the mentor. Try again.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setMessages(next);
    } finally {
      setBusy(false);
    }
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Open AI Mentor"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-primary text-primary-foreground font-semibold shadow-lg glow-cyan hover:scale-105 transition-transform"
      >
        <Bot className="w-5 h-5" />
        <span className="hidden sm:inline">AI Mentor</span>
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 left-4 sm:left-auto sm:w-[420px] z-50 h-[70vh] max-h-[640px] flex flex-col card-glass rounded-2xl border border-primary/30 overflow-hidden shadow-2xl">
      <header className="flex items-center gap-2 px-4 py-3 border-b border-border/60 bg-card/60">
        <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Bot className="w-4 h-4 text-primary-foreground" />
        </div>
        <div className="flex-1">
          <div className="text-sm font-bold">AI Mentor</div>
          <div className="text-[11px] text-muted-foreground">Explain · Demo · Practice · Check</div>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close AI Mentor"
          className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/60"
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm">
        {messages.map((m, i) => (
          <div
            key={i}
            className={
              m.role === "user"
                ? "ml-auto max-w-[85%] rounded-2xl rounded-br-sm bg-primary/15 border border-primary/25 px-3 py-2"
                : "max-w-[92%] rounded-2xl rounded-bl-sm bg-secondary/50 border border-border/60 px-3 py-2"
            }
          >
            {m.role === "assistant" && !m.content && busy ? (
              <span className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Thinking…
              </span>
            ) : (
              renderMarkdown(m.content)
            )}
          </div>
        ))}

        {messages.length === 1 && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-primary" /> Try asking
            </div>
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="block w-full text-left text-xs px-3 py-2 rounded-lg border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50 transition-colors"
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {error && <p className="text-xs text-destructive">{error}</p>}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="p-3 border-t border-border/60 flex items-end gap-2 bg-card/60"
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              send(input);
            }
          }}
          rows={1}
          placeholder="Ask anything, or paste your code…"
          className="flex-1 resize-none bg-background/70 border border-border rounded-xl px-3 py-2 text-sm outline-none focus:border-primary/60 max-h-32"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          className="p-2.5 rounded-xl bg-gradient-primary text-primary-foreground disabled:opacity-40"
          aria-label="Send message"
        >
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
};

export default TutorChat;
