import { Link } from "react-router-dom";
import { Code2, Menu, X, Mail, LogOut, User as UserIcon } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, signOut } = useAuth();

  const links = [
    { label: "Courses", href: "/#courses" },
    { label: "Playground", href: "/playground" },
    { label: "Explore More", href: "/#explore" },
    { label: "Python", href: "/course/python" },
    { label: "C", href: "/course/c" },
    { label: "C++", href: "/course/cpp" },
    { label: "JS", href: "/course/javascript" },
  ];

  const initial = (user?.user_metadata?.full_name || user?.email || "U").charAt(0).toUpperCase();
  const avatar = user?.user_metadata?.avatar_url as string | undefined;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 backdrop-blur-xl bg-background/80">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
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

        <div className="hidden md:flex items-center gap-3">
          <a
            href="mailto:ntwaricedrick3@gmail.com"
            className="flex items-center gap-1.5 px-3 py-2 text-sm text-muted-foreground hover:text-primary transition-colors rounded-lg hover:bg-secondary/50"
            title="Contact Developer"
          >
            <Mail className="w-4 h-4" />
            <span className="hidden lg:inline">Contact</span>
          </a>

          {user ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-secondary/60 border border-border">
                {avatar ? (
                  <img src={avatar} alt="" className="w-6 h-6 rounded-full" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-gradient-primary flex items-center justify-center text-[11px] font-bold text-primary-foreground">
                    {initial}
                  </div>
                )}
                <span className="text-sm text-foreground max-w-[120px] truncate">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <button
                onClick={signOut}
                title="Sign out"
                className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-primary-foreground hover:opacity-90 transition-opacity glow-cyan"
            >
              <UserIcon className="w-4 h-4" />
              Sign in
            </Link>
          )}
        </div>

        <button
          className="md:hidden text-muted-foreground hover:text-foreground transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
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
          <a
            href="mailto:ntwaricedrick3@gmail.com"
            className="flex items-center gap-2 px-6 py-3 text-sm text-muted-foreground hover:text-primary hover:bg-secondary/30 transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            <Mail className="w-4 h-4" />
            Contact Developer
          </a>
          <div className="px-6 py-4">
            {user ? (
              <button
                onClick={() => { signOut(); setMenuOpen(false); }}
                className="w-full text-center px-4 py-2 text-sm font-semibold rounded-lg bg-secondary text-foreground"
              >
                Sign out ({user.email})
              </button>
            ) : (
              <Link
                to="/auth"
                className="block text-center px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-primary text-primary-foreground"
                onClick={() => setMenuOpen(false)}
              >
                Sign in
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
