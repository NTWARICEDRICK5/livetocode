import TechIcon from "@/components/TechIcon";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, CornerDownLeft } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { catalog } from "@/data/catalog";
import { courses } from "@/data/courses";
import { paths } from "@/data/paths";

interface Props {
  variant?: "button" | "icon";
}

const GlobalSearch = ({ variant = "button" }: Props) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((o) => !o);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const lessons = useMemo(
    () =>
      courses.flatMap((c) =>
        c.lessons.map((l) => ({
          key: `${c.id}:${l.id}`,
          label: l.title,
          sub: c.name,
          to: `/course/${c.id}`,
        }))
      ),
    []
  );

  const go = (to: string) => {
    setOpen(false);
    navigate(to);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search CodeLearn"
        className={
          variant === "icon"
            ? "p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
            : "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/50 border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors text-sm"
        }
      >
        <Search className="w-4 h-4" />
        {variant === "button" && (
          <>
            <span className="hidden xl:inline">Search…</span>
            <kbd className="hidden xl:inline text-[10px] px-1.5 py-0.5 rounded border border-border bg-background/60 font-mono">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search courses, lessons, paths, technologies…" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandGroup heading="Go to">
            {[
              { label: "Dashboard", to: "/dashboard" },
              { label: "Courses", to: "/courses" },
              { label: "Learning Paths", to: "/paths" },
              { label: "Projects", to: "/projects" },
              { label: "Playground", to: "/playground" },
              { label: "Templates", to: "/templates" },
              { label: "Notes", to: "/notes" },
              { label: "Saved", to: "/saved" },
            ].map((i) => (
              <CommandItem key={i.to} value={`nav ${i.label}`} onSelect={() => go(i.to)}>
                <CornerDownLeft className="w-3.5 h-3.5 mr-2 text-muted-foreground" />
                {i.label}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Courses">
            {catalog.map((c) => (
              <CommandItem
                key={c.id}
                value={`${c.name} ${c.category} ${c.skills.join(" ")}`}
                onSelect={() => go(`/course/${c.id}`)}
              >
                <TechIcon name={c.id} className="w-4 h-4 mr-2" />
                <span className="flex-1">{c.name}</span>
                <span className="text-xs text-muted-foreground">{c.category}</span>
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Learning paths">
            {paths.map((p) => (
              <CommandItem key={p.id} value={`path ${p.name}`} onSelect={() => go(`/paths/${p.id}`)}>
                <TechIcon name={p.id} className="w-4 h-4 mr-2" />
                {p.name}
              </CommandItem>
            ))}
          </CommandGroup>

          <CommandGroup heading="Lessons">
            {lessons.map((l) => (
              <CommandItem key={l.key} value={`${l.label} ${l.sub}`} onSelect={() => go(l.to)}>
                <span className="flex-1">{l.label}</span>
                <span className="text-xs text-muted-foreground">{l.sub}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default GlobalSearch;
