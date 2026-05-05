import { Link, useLocation } from "react-router-dom";
import { Code2, Menu, X, Mail } from "lucide-react";
import { useState } from "react";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const links = [
    { label: "Courses", href: "/#courses" },
    { label: "Python", href: "/course/python" },
    { label: "C", href: "/course/c" },
    { label: "C++", href: "/course/cpp" },
    { label: "HTML", href: "/course/html" },
    { label: "CSS", href: "/course/css" },
    { label: "JavaScript", href: "/course/javascript" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-lg bg-gradient-primary flex items-center justify-center glow-cyan group-hover:scale-105 transition-transform">
            <Code2 className="w-5 h-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-lg tracking-tight">
              <span className="text-gradient-primary">Code</span>
              <span className="text-foreground">Learn</span>
            </span>
            <span className="text-[10px] text-muted-foreground/70 font-medium hidden sm:block">
              by NTWARI Cedrick
            </span>
          </div>
        </Link>

        {/* Desktop links */}
        <div className="hidden lg:flex items-center gap-1">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-secondary/50"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA + Contact */}
        <div className="hidden md:flex items-center gap-3">
          <a
            href="mailto:ntwaricedrick3@gmail.com"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary/50"
            title="Contact Developer"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden lg:inline">Contact</span>
          </a>
          <Link
            to="/#courses"
            className="px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity glow-cyan"
          >
            Start Learning
          </Link>
        </div>

        {/* Mobile menu */}
        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden border-t border-border bg-card/90 backdrop-blur-xl">
          {links.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              className="block px-6 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <a
            href="mailto:ntwaricedrick3@gmail.com"
            className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Mail className="w-4 h-4" />
            Contact Developer
          </a>
          <div className="px-6 py-4">
            <Link
              to="/#courses"
              className="block text-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-primary-foreground"
              onClick={() => setMenuOpen(false)}
            >
              Start Learning
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
