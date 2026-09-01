import {
  Target, Brain, Wrench, ScrollText, Flame, Star, Zap, Sparkles, Trophy,
  BookOpen, NotebookPen, Compass, Award,
} from "lucide-react";

const MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  target: Target,
  brain: Brain,
  wrench: Wrench,
  scroll: ScrollText,
  flame: Flame,
  star: Star,
  zap: Zap,
  sparkles: Sparkles,
  trophy: Trophy,
  book: BookOpen,
  note: NotebookPen,
  compass: Compass,
};

const AchievementIcon = ({ name, className = "w-6 h-6" }: { name: string; className?: string }) => {
  const Icon = MAP[name] ?? Award;
  return <Icon className={className} />;
};

export default AchievementIcon;
