import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Bookmark, Trash2, ArrowRight } from "lucide-react";

interface Row {
  id: string;
  kind: string;
  ref_id: string;
  title: string;
  url: string;
  created_at: string;
}

const SavedPage = () => {
  const { user, loading } = useAuth();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("bookmarks")
      .select("id, kind, ref_id, title, url, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setRows((data as Row[]) ?? []));
  }, [user]);

  const remove = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-24 text-center">
          <Bookmark className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold mb-3">Saved lessons</h1>
          <p className="text-muted-foreground mb-6">
            Sign in to bookmark lessons and come back to them anytime.
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
        <header className="mb-8">
          <h1 className="text-4xl font-extrabold tracking-tight">
            Saved <span className="text-gradient-primary">for later</span>
          </h1>
          <p className="text-muted-foreground mt-2">Your bookmarked lessons and resources.</p>
        </header>

        {rows.length === 0 ? (
          <div className="card-glass rounded-2xl p-10 text-center text-muted-foreground">
            Nothing saved yet — tap the bookmark icon on any lesson to keep it here.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rows.map((r) => (
              <div key={r.id} className="card-glass rounded-2xl p-5 flex flex-col">
                <div className="flex items-start gap-2">
                  <Bookmark className="w-5 h-5 text-accent flex-shrink-0" />
                  <div className="flex-1">
                    <div className="font-bold text-sm">{r.title}</div>
                    <div className="text-xs text-muted-foreground capitalize">{r.kind}</div>
                  </div>
                  <button
                    onClick={() => remove(r.id)}
                    className="text-muted-foreground hover:text-destructive"
                    title="Remove bookmark"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <Link to={r.url} className="text-xs text-primary mt-4 font-semibold">
                  Open →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default SavedPage;
