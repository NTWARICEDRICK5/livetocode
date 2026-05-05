import { Link } from "react-router-dom";
import { Code2, Mail, Globe, Heart } from "lucide-react";
import { courses } from "@/data/courses";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-card/20">
      {/* Developer Credit Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto card-glass rounded-2xl p-8 md:p-10 text-center relative overflow-hidden">
          {/* Subtle glow effect */}
          <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl" />

          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-4">
              <Heart className="w-3.5 h-3.5" />
              Built with passion
            </div>

            <h3 className="text-2xl md:text-3xl font-extrabold mb-2">
              Developed by{" "}
              <span className="text-gradient-primary">NTWARI Cedrick</span>
            </h3>

            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Full-stack developer and coding enthusiast dedicated to making programming education accessible to everyone.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a
                href="mailto:ntwaricedrick3@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold hover:opacity-90 transition-all glow-cyan hover:scale-105"
              >
                <Mail className="w-4 h-4" />
                ntwaricedrick3@gmail.com
              </a>
              <a
                href="mailto:ntwaricedrick3@gmail.com"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all"
              >
                <Globe className="w-4 h-4" />
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold">
            <Code2 className="w-5 h-5 text-primary" />
            <span className="text-gradient-primary">Code</span>
            <span>Learn</span>
          </div>

          <p className="text-muted-foreground text-sm">
            Learn to code. Build the future. 🚀
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
            {courses.map((c) => (
              <Link
                key={c.id}
                to={`/course/${c.id}`}
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                {c.name}
              </Link>
            ))}
          </div>
        </div>

        <div className="text-center mt-4 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} CodeLearn. All rights reserved. | Developed by{" "}
          <a href="mailto:ntwaricedrick3@gmail.com" className="hover:text-primary transition-colors underline">
            NTWARI Cedrick
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
