import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";
import { useLearner } from "@/hooks/useLearner";
import { toast } from "sonner";
import { Save, User as UserIcon, Target, ArrowRight, LogOut } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const LEVELS = ["beginner", "intermediate", "advanced"];
const TIMES = ["morning", "afternoon", "evening", "night"];

const ProfilePage = () => {
  const { user, profile, stats, loading, reload } = useLearner();
  const { signOut } = useAuth();
  const [form, setForm] = useState<Record<string, any>>({});
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (profile) setForm({ ...profile });
  }, [profile]);

  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({
        full_name: form.full_name || null,
        username: form.username || null,
        display_name: form.display_name || null,
        country: form.country || null,
        bio: form.bio || null,
        skill_level: form.skill_level || "beginner",
        learning_goal: form.learning_goal || null,
        preferred_language: form.preferred_language || "en",
        time_zone: form.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone,
        preferred_study_time: form.preferred_study_time || null,
        daily_goal_minutes: Number(form.daily_goal_minutes) || 20,
        weekly_goal_minutes: Number(form.weekly_goal_minutes) || 120,
      })
      .eq("id", user.id);
    setBusy(false);
    if (error) return toast.error(error.message);
    toast.success("Profile updated");
    reload();
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="container mx-auto px-4 pt-32 pb-24 text-center">
          <UserIcon className="w-10 h-10 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-extrabold mb-3">Your profile</h1>
          <p className="text-muted-foreground mb-6">Sign in to manage your profile and goals.</p>
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

  const field = "w-full px-3 py-2.5 bg-secondary/50 border border-border rounded-lg text-sm focus:outline-none focus:border-primary";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-20 max-w-4xl">
        <header className="mb-8 flex items-center gap-4">
          {profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Your avatar" className="w-16 h-16 rounded-2xl" />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-primary flex items-center justify-center text-2xl font-extrabold text-primary-foreground">
              {(profile?.full_name || profile?.email || "Q").charAt(0).toUpperCase()}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">
              {profile?.full_name || profile?.display_name || "Your profile"}
            </h1>
            <p className="text-muted-foreground text-sm">
              Level {stats.level.level} · {stats.xp} XP · {stats.streak.current}-day streak
            </p>
          </div>
        </header>

        <section className="card-glass rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <UserIcon className="w-4 h-4 text-primary" /> Personal details
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Full name</span>
              <input className={field} value={form.full_name ?? ""} onChange={(e) => set("full_name", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Username</span>
              <input className={field} value={form.username ?? ""} onChange={(e) => set("username", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Display name</span>
              <input className={field} value={form.display_name ?? ""} onChange={(e) => set("display_name", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Email</span>
              <input className={`${field} opacity-60`} value={profile?.email ?? user?.email ?? ""} readOnly />
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Country</span>
              <input className={field} value={form.country ?? ""} onChange={(e) => set("country", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Preferred language</span>
              <input className={field} value={form.preferred_language ?? "en"} onChange={(e) => set("preferred_language", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5 md:col-span-2">
              <span className="text-muted-foreground">About you</span>
              <textarea rows={3} className={field} value={form.bio ?? ""} onChange={(e) => set("bio", e.target.value)} />
            </label>
          </div>
        </section>

        <section className="card-glass rounded-2xl p-6 mb-6">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" /> Learning preferences
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Skill level</span>
              <select className={field} value={form.skill_level ?? "beginner"} onChange={(e) => set("skill_level", e.target.value)}>
                {LEVELS.map((l) => (
                  <option key={l} value={l} className="capitalize">
                    {l}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Preferred study time</span>
              <select className={field} value={form.preferred_study_time ?? ""} onChange={(e) => set("preferred_study_time", e.target.value)}>
                <option value="">No preference</option>
                {TIMES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Daily goal (minutes)</span>
              <input type="number" min={5} max={480} className={field} value={form.daily_goal_minutes ?? 20} onChange={(e) => set("daily_goal_minutes", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5">
              <span className="text-muted-foreground">Weekly goal (minutes)</span>
              <input type="number" min={30} max={3000} className={field} value={form.weekly_goal_minutes ?? 120} onChange={(e) => set("weekly_goal_minutes", e.target.value)} />
            </label>
            <label className="text-sm space-y-1.5 md:col-span-2">
              <span className="text-muted-foreground">What do you want to achieve?</span>
              <input className={field} value={form.learning_goal ?? ""} onChange={(e) => set("learning_goal", e.target.value)} placeholder="e.g. Build my first website in 3 months" />
            </label>
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={save}
            disabled={busy}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-primary text-primary-foreground font-semibold glow-cyan disabled:opacity-50"
          >
            <Save className="w-4 h-4" /> Save changes
          </button>
          <button
            onClick={signOut}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-border text-muted-foreground hover:text-foreground"
          >
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ProfilePage;
