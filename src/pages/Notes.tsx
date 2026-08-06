import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { courses } from "@/data/courses";
import { toast } from "sonner";
import { NotebookPen, Trash2, Save, Plus, Search, ArrowRight } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  course_id: string | null;
  lesson_id: string | null;
  updated_at: string;
}

const NotesPage = () => {
  const { user, loading } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [active, setActive] = useState<Note | null>(null);
  const [query, setQuery] = useState("");
  const [busy, setBusy] = useState(false);

  const load = async () => {
    if (!user) return;
    const { data } = await supabase
      .from("notes")
      .select("id, title, content, course_id, lesson_id, updated_at")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });
    setNotes((data as Note[]) ?? []);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const createNote = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from("notes")
      .insert({ user_id: user.id, title: "Untitled note", content: "" })
      .select("id, title, content, course_id, lesson_id, updated_at")
      .single();
    if (error) return toast.error(error.message);
    setNotes((n) => [data as Note, ...n]);
    setActive(data as Note);
  };

  const saveNote = async () => {
    if (!active || !user) return;
    setBusy(true);
    const { error } = await supabase
      .from("notes")
      .update({
        title: active.title || "Untitled note",
        content: active.content,
        course_id: active.course_id,
      })
      .eq("id", active.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Note saved");
    load();
  };

  const deleteNote = async (id: string) => {
    await supabase.from("notes").delete().eq("id", id);
    setNotes((n) => n.filter((x) => x.id !== id));
    if (active?.id === id) setActive(null);
  };

  const filtered = notes.filter(
    (n) =>
      n.title.toLowerCase().includes(query.toLowerCase()) ||
      (n.content || "").toLowerCase().includes(query.toLowerCase())
  );

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-24 text-center">
          <NotebookPen className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold mb-3">Your study notes</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to write notes that sync across all your devices.
          </p>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold"
          >
            Sign in <ArrowRight className="w-4 h-4" />
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20">
        <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">
              Study <span className="text-gradient-primary">Notes</span>
            </h1>
            <p className="text-muted-foreground mt-2">
              Capture what you learn — everything is saved to your account.
            </p>
          </div>
          <button
            onClick={createNote}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold glow-cyan"
          >
            <Plus className="w-4 h-4" /> New note
          </button>
        </header>

        <div className="grid lg:grid-cols-[320px_1fr] gap-6">
          <aside className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search notes"
                className="w-full pl-10 pr-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary"
              />
            </div>
            <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1">
              {filtered.map((n) => (
                <button
                  key={n.id}
                  onClick={() => setActive(n)}
                  className={`w-full text-left card-glass rounded-xl p-4 border transition-colors ${
                    active?.id === n.id ? "border-primary/50" : "border-border/40"
                  }`}
                >
                  <div className="font-semibold text-sm truncate">{n.title}</div>
                  <div className="text-xs text-muted-foreground truncate">
                    {n.content?.slice(0, 60) || "Empty note"}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    {new Date(n.updated_at).toLocaleDateString()}
                    {n.course_id ? ` · ${n.course_id}` : ""}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <div className="card-glass rounded-xl p-6 text-center text-sm text-muted-foreground">
                  No notes yet.
                </div>
              )}
            </div>
          </aside>

          <section className="card-glass rounded-2xl p-6">
            {active ? (
              <div className="space-y-4">
                <input
                  value={active.title}
                  onChange={(e) => setActive({ ...active, title: e.target.value })}
                  className="w-full bg-transparent text-2xl font-extrabold focus:outline-none"
                  placeholder="Note title"
                />
                <select
                  value={active.course_id ?? ""}
                  onChange={(e) => setActive({ ...active, course_id: e.target.value || null })}
                  className="px-3 py-2 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:border-primary"
                >
                  <option value="">No course</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.fullName}
                    </option>
                  ))}
                </select>
                <textarea
                  value={active.content ?? ""}
                  onChange={(e) => setActive({ ...active, content: e.target.value })}
                  rows={16}
                  placeholder="Write what you learned, code snippets, questions…"
                  className="w-full p-4 rounded-xl bg-secondary/40 border border-border font-mono text-sm focus:outline-none focus:border-primary resize-y"
                />
                <div className="flex gap-2">
                  <button
                    onClick={saveNote}
                    disabled={busy}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-primary text-primary-foreground font-semibold disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" /> Save note
                  </button>
                  <button
                    onClick={() => deleteNote(active.id)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-20">
                Select a note or create a new one to start writing.
              </div>
            )}
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotesPage;
