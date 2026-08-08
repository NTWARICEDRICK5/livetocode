import { useMemo, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CatalogCourseCard from "@/components/CatalogCourseCard";
import { catalog, catalogCategories, difficulties, type Difficulty, type CatalogCategory } from "@/data/catalog";
import { useLocalCourseProgress } from "@/hooks/useLocalCourseProgress";
import { Search, Library, X } from "lucide-react";

type Sort = "recommended" | "az" | "shortest" | "longest";

const Courses = () => {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<CatalogCategory | "All">("All");
  const [difficulty, setDifficulty] = useState<Difficulty | "All">("All");
  const [sort, setSort] = useState<Sort>("recommended");
  const { percentByCourse } = useLocalCourseProgress();

  const results = useMemo(() => {
    const q = query.toLowerCase().trim();
    let list = catalog.filter((c) => {
      if (category !== "All" && c.category !== category) return false;
      if (difficulty !== "All" && c.difficulty !== difficulty) return false;
      if (!q) return true;
      return (
        c.name.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.skills.some((s) => s.toLowerCase().includes(q)) ||
        c.modules.some((m) => m.lessons.some((l) => l.toLowerCase().includes(q)))
      );
    });

    list = [...list].sort((a, b) => {
      if (sort === "az") return a.name.localeCompare(b.name);
      if (sort === "shortest") return a.estimatedHours - b.estimatedHours;
      if (sort === "longest") return b.estimatedHours - a.estimatedHours;
      // recommended: interactive content first, then easier, then A-Z
      if (a.status !== b.status) return a.status === "full" ? -1 : 1;
      const order = { Beginner: 0, Intermediate: 1, Advanced: 2 } as const;
      if (order[a.difficulty] !== order[b.difficulty]) return order[a.difficulty] - order[b.difficulty];
      return a.name.localeCompare(b.name);
    });

    return list;
  }, [query, category, difficulty, sort]);

  const chip = (active: boolean) =>
    `px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
      active
        ? "bg-primary/15 text-primary border-primary/40"
        : "bg-secondary/50 text-muted-foreground border-border hover:text-foreground hover:border-primary/30"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-28 pb-20">
        <header className="max-w-3xl mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
            <Library className="w-3.5 h-3.5" /> {catalog.length} courses
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            The CodeLearn <span className="text-gradient-primary">course catalog</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Languages, frameworks, databases, DevOps, data, AI, security and computer science — each with
            structured modules, prerequisites, skills and clear learning outcomes.
          </p>
        </header>

        {/* Search + filters */}
        <div className="card-glass rounded-2xl p-4 mb-8 space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search courses, skills or lessons…"
              aria-label="Search courses"
              className="w-full pl-10 pr-10 py-3 rounded-xl bg-background/70 border border-border text-sm outline-none focus:border-primary/60"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button className={chip(category === "All")} onClick={() => setCategory("All")}>
              All topics
            </button>
            {catalogCategories.map((c) => (
              <button key={c} className={chip(category === c)} onClick={() => setCategory(c)}>
                {c}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button className={chip(difficulty === "All")} onClick={() => setDifficulty("All")}>
              Any level
            </button>
            {difficulties.map((d) => (
              <button key={d} className={chip(difficulty === d)} onClick={() => setDifficulty(d)}>
                {d}
              </button>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <label htmlFor="sort" className="text-xs text-muted-foreground">
                Sort
              </label>
              <select
                id="sort"
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="bg-background/70 border border-border rounded-lg px-2 py-1.5 text-xs outline-none focus:border-primary/60"
              >
                <option value="recommended">Recommended</option>
                <option value="az">A → Z</option>
                <option value="shortest">Shortest first</option>
                <option value="longest">Longest first</option>
              </select>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          {results.length} course{results.length === 1 ? "" : "s"}
        </p>

        {results.length === 0 ? (
          <div className="card-glass rounded-2xl p-10 text-center text-muted-foreground">
            No courses match that search yet. Try a different keyword or clear the filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {results.map((c) => (
              <CatalogCourseCard key={c.id} course={c} progress={percentByCourse[c.id] ?? 0} />
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Courses;
