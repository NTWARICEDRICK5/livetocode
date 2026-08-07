import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { paths } from "@/data/paths";
import { ArrowRight, Compass, Briefcase } from "lucide-react";

const Paths = () => (
  <div className="min-h-screen bg-background">
    <Navbar />
    <main className="container mx-auto px-4 pt-28 pb-20">
      <div className="max-w-3xl mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
          <Compass className="w-3.5 h-3.5" /> Career tracks
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
          Personalized <span className="text-gradient-primary">learning paths</span>
        </h1>
        <p className="text-muted-foreground text-lg">
          Don't guess what to learn next. Each path is an ordered roadmap — fundamentals first, then
          practice, then real projects — built to take you from zero to job-ready.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        {paths.map((p) => (
          <Link
            key={p.id}
            to={`/paths/${p.id}`}
            className="card-glass rounded-2xl p-6 hover:-translate-y-1 hover:border-primary/40 transition-all group"
          >
            <div className="flex items-start gap-4 mb-4">
              <span className="text-4xl">{p.icon}</span>
              <div className="flex-1">
                <h2 className="text-xl font-bold">{p.name}</h2>
                <p className="text-sm text-muted-foreground">{p.tagline}</p>
              </div>
              <ArrowRight className="w-5 h-5 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
                {p.level}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
                {p.duration}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-secondary/60 border border-border">
                {p.steps.length} stages
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Briefcase className="w-3.5 h-3.5 text-primary" />
              {p.careers.join(" · ")}
            </div>
          </Link>
        ))}
      </div>
    </main>
    <Footer />
  </div>
);

export default Paths;
