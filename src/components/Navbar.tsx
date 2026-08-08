import { Link } from "react-router-dom";
import { Code2, Menu, X, LogOut, User as UserIcon, Bot } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import GlobalSearch from "@/components/GlobalSearch";

const PUBLIC_LINKS = [
  { label: "Courses", href: "/courses" },
  { label: "Learning Paths", href: "/paths" },
  { label: "Playground", href: "/playground" },
  { label: "Templates", href: "/templates" },
];

const AUTH_LINKS = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Courses", href: "/courses" },
  { label: "Paths", href: "/paths" },
  { label: "Playground", href: "/playground" },
  { label: "Notes", href: "/notes" },
  { label: "Saved", href: "/saved" },
];

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const links = user ? AUTH_LINKS : PUBLIC_LINKS;

  const initial = (user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase();
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  const openMentor = () => {
    setMenuOpen(false);
    window.dispatchEvent(new Event("open-ai-mentor"));
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 group shrink-0">
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
          <button
            onClick={openMentor}
            className="px-3 py-1.5 text-sm text-muted-foreground hover:text-primary transition-colors rounded-md hover:bg-secondary/50 flex items-center gap-1.5"
          >
            <Bot className="w-4 h-4" /> AI Mentor
          </button>
        </div>

        <div className="hidden md:flex items-center gap-2">
          <GlobalSearch />

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border hover:border-primary/50 transition-colors"
              >
                {avatar ? (
                  <img src={avatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                    {initial}
                  </div>
                )}
                <span className="text-sm text-foreground max-w-[110px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </Link>
              <button
                onClick={signOut}
                title="Sign out"
                aria-label="Sign out"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/auth"
                className="px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-secondary/50"
              >
                Sign in
              </Link>
              <Link
                to="/auth?mode=signup"
                className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity glow-cyan"
              >
                <UserIcon className="w-4 h-4" />
                Get Started
              </Link>
            </div>
          )}
        </div>

        <div className="flex md:hidden items-center gap-1">
          <GlobalSearch variant="icon" />
          <button
            className="text-muted-foreground hover:text-foreground transition-colors p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

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
          <button
            onClick={openMentor}
            className="w-full text-left px-6 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-colors"
          >
            AI Mentor
          </button>
          {user && (
            <Link
              to="/profile"
              className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              <UserIcon className="w-4 h-4" /> My profile
            </Link>
          )}
          <div className="px-6 py-4">
            {user ? (
              <button
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="w-full text-center px-4 py-2 text-sm font-semibold rounded-lg bg-secondary text-foreground"
              >
                Sign out
              </button>
            ) : (
              <Link
                to="/auth"
                className="block text-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-primary-foreground"
                onClick={() => setMenuOpen(false)}
              >
                Get Started
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
