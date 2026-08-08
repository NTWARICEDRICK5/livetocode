import { Link } from "react-router-dom";
import { Code2, Mail, Heart, Github, Twitter, Linkedin } from "lucide-react";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "Learn",
    links: [
      { label: "Courses", to: "/courses" },
      { label: "Learning Paths", to: "/paths" },
      { label: "Templates", to: "/templates" },
      { label: "Playground", to: "/playground" },
    ],
  },
  {
    title: "Your space",
    links: [
      { label: "Dashboard", to: "/dashboard" },
      { label: "Notes", to: "/notes" },
      { label: "Saved", to: "/saved" },
      { label: "Profile", to: "/profile" },
    ],
  },
  {
    title: "Technologies",
    links: [
      { label: "Python", to: "/course/python" },
      { label: "JavaScript", to: "/course/javascript" },
      { label: "React", to: "/course/react" },
      { label: "Docker", to: "/course/docker" },
      { label: "SQL", to: "/course/sql" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="relative border-t border-border/50 bg-card/20 overflow-hidden">
      {/* Ambient code stream — decorative, disabled for reduced motion */}
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[0.06] font-mono text-[10px] leading-5 text-primary select-none">
        <div className="footer-stream whitespace-nowrap">
          01001100 &lt;/&gt; const learn = () =&gt; build(); 01100101 &lt;/&gt; git commit -m "keep going" 01100001 &lt;/&gt; docker run codelearn 01110010 &lt;/&gt; SELECT * FROM skills;
        </div>
        <div className="footer-stream footer-stream-slow whitespace-nowrap">
          $ npm run dev &lt;/&gt; 11010010 &lt;/&gt; python main.py &lt;/&gt; kubectl apply -f future.yaml &lt;/&gt; 10101110 &lt;/&gt; make it work, make it right
        </div>
      </div>

      {/* Developer credit */}
      <div className="relative container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto card-glass rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Heart className="w-3.5 h-3.5" />
              Built with passion
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">
              Developed by <span className="text-gradient-primary">NTWARI Cedrick</span>
            </h3>

            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Full-stack developer and coding enthusiast dedicated to making programming education
              accessible to everyone.
            </p>

            <a
              href="mailto:ntwaricedrick3@gmail.com"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-cyan hover:scale-105"
            >
              <Mail className="w-4 h-4" />
              ntwaricedrick3@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Link columns */}
      <div className="relative container mx-auto px-4 pb-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 font-bold mb-3">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="text-gradient-primary">Code</span>
            <span>Learn</span>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Learn, practice, build and debug — one platform for your whole developer journey.
          </p>
          <div className="flex items-center gap-2">
            <a href="mailto:ntwaricedrick3@gmail.com" aria-label="Email" className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
              <Mail className="w-4 h-4" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer noopener" aria-label="GitHub" className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://x.com" target="_blank" rel="noreferrer noopener" aria-label="X" className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer noopener" aria-label="LinkedIn" className="p-2 rounded-lg border border-border text-muted-foreground hover:text-primary hover:border-primary/40 transition-colors">
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h4 className="text-sm font-bold text-foreground mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link to={l.to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="relative border-t border-border/50 py-6 text-center text-xs text-muted-foreground/70">
        © {new Date().getFullYear()} CodeLearn. All rights reserved. | Developed by{" "}
        <a href="mailto:ntwaricedrick3@gmail.com" className="hover:text-primary transition-colors underline">
          NTWARI Cedrick
        </a>
      </div>
    </footer>
  );
};

export default Footer;
