import type { ComponentType, CSSProperties } from "react";
import {
  SiPython, SiC, SiCplusplus, SiHtml5, SiCss, SiJavascript, SiTypescript,
  SiOpenjdk, SiDotnet, SiGo, SiRust, SiPhp, SiRuby, SiKotlin, SiSwift,
  SiReact, SiNextdotjs, SiVuedotjs, SiAngular, SiTailwindcss, SiNodedotjs,
  SiDjango, SiFastapi, SiLaravel, SiSpringboot, SiPostgresql, SiMysql,
  SiMongodb, SiRedis, SiGit, SiGithub, SiLinux, SiDocker, SiKubernetes,
  SiTerraform, SiNumpy, SiPandas, SiScikitlearn, SiPytorch, 
  SiGraphql, SiFlutter, SiFirebase, SiSass, SiVite, SiSupabase,
} from "react-icons/si";
import {
  Database, Network, Cloud, RefreshCw, BarChart3, Brain, Sparkles, BookOpen,
  Shield, Search, Lock, KeyRound, MonitorDot, Wrench, Sigma, Boxes, Building2,
  Compass, Code2, Terminal, Layers, Cpu, Bug, Globe, Rocket, ShieldCheck,
} from "lucide-react";

type IconDef = { Icon: ComponentType<{ className?: string; style?: CSSProperties }>; color: string };

const MAP: Record<string, IconDef> = {
  python: { Icon: SiPython, color: "#3776AB" },
  c: { Icon: SiC, color: "#A8B9CC" },
  cpp: { Icon: SiCplusplus, color: "#00599C" },
  "c++": { Icon: SiCplusplus, color: "#00599C" },
  html: { Icon: SiHtml5, color: "#E34F26" },
  css: { Icon: SiCss, color: "#1572B6" },
  javascript: { Icon: SiJavascript, color: "#F7DF1E" },
  js: { Icon: SiJavascript, color: "#F7DF1E" },
  typescript: { Icon: SiTypescript, color: "#3178C6" },
  ts: { Icon: SiTypescript, color: "#3178C6" },
  java: { Icon: SiOpenjdk, color: "#F89820" },
  csharp: { Icon: SiDotnet, color: "#512BD4" },
  "c#": { Icon: SiDotnet, color: "#512BD4" },
  go: { Icon: SiGo, color: "#00ADD8" },
  rust: { Icon: SiRust, color: "#DEA584" },
  php: { Icon: SiPhp, color: "#777BB4" },
  ruby: { Icon: SiRuby, color: "#CC342D" },
  kotlin: { Icon: SiKotlin, color: "#7F52FF" },
  swift: { Icon: SiSwift, color: "#F05138" },
  react: { Icon: SiReact, color: "#61DAFB" },
  "react-native": { Icon: SiReact, color: "#61DAFB" },
  nextjs: { Icon: SiNextdotjs, color: "#FFFFFF" },
  vue: { Icon: SiVuedotjs, color: "#4FC08D" },
  angular: { Icon: SiAngular, color: "#DD0031" },
  tailwind: { Icon: SiTailwindcss, color: "#38BDF8" },
  sass: { Icon: SiSass, color: "#CC6699" },
  vite: { Icon: SiVite, color: "#A855F7" },
  nodejs: { Icon: SiNodedotjs, color: "#5FA04E" },
  django: { Icon: SiDjango, color: "#44B78B" },
  fastapi: { Icon: SiFastapi, color: "#009688" },
  laravel: { Icon: SiLaravel, color: "#FF2D20" },
  "spring-boot": { Icon: SiSpringboot, color: "#6DB33F" },
  graphql: { Icon: SiGraphql, color: "#E10098" },
  flutter: { Icon: SiFlutter, color: "#02569B" },
  firebase: { Icon: SiFirebase, color: "#FFCA28" },
  supabase: { Icon: SiSupabase, color: "#3ECF8E" },
  sql: { Icon: Database, color: "#38BDF8" },
  postgresql: { Icon: SiPostgresql, color: "#4169E1" },
  mysql: { Icon: SiMysql, color: "#00758F" },
  mongodb: { Icon: SiMongodb, color: "#47A248" },
  redis: { Icon: SiRedis, color: "#FF4438" },
  git: { Icon: SiGit, color: "#F05032" },
  github: { Icon: SiGithub, color: "#E6EDF3" },
  linux: { Icon: SiLinux, color: "#FCC624" },
  networking: { Icon: Network, color: "#22D3EE" },
  docker: { Icon: SiDocker, color: "#2496ED" },
  kubernetes: { Icon: SiKubernetes, color: "#326CE5" },
  cloud: { Icon: Cloud, color: "#60A5FA" },
  devops: { Icon: RefreshCw, color: "#34D399" },
  terraform: { Icon: SiTerraform, color: "#7B42BC" },
  "data-science": { Icon: BarChart3, color: "#38BDF8" },
  numpy: { Icon: SiNumpy, color: "#4DABCF" },
  pandas: { Icon: SiPandas, color: "#E0E0E0" },
  "machine-learning": { Icon: SiScikitlearn, color: "#F7931E" },
  "deep-learning": { Icon: SiPytorch, color: "#EE4C2C" },
  "generative-ai": { Icon:  color: "#10A37F" },
  llms: { Icon: BookOpen, color: "#C084FC" },
  cybersecurity: { Icon: Shield, color: "#F87171" },
  "ethical-hacking": { Icon: Search, color: "#FB923C" },
  "web-security": { Icon: Lock, color: "#F472B6" },
  cryptography: { Icon: KeyRound, color: "#FBBF24" },
  soc: { Icon: MonitorDot, color: "#38BDF8" },
  "defensive-security": { Icon: ShieldCheck, color: "#4ADE80" },
  algorithms: { Icon: Sigma, color: "#A78BFA" },
  "data-structures": { Icon: Boxes, color: "#22D3EE" },
  "system-design": { Icon: Building2, color: "#F59E0B" },
  "software-engineering": { Icon: Compass, color: "#60A5FA" },
  // learning paths & misc
  "software-engineer": { Icon: Code2, color: "#22D3EE" },
  "ai-data": { Icon: Brain, color: "#C084FC" },
  "cloud-devops": { Icon: Cloud, color: "#60A5FA" },
  "cyber-security": { Icon: Shield, color: "#F87171" },
  terminal: { Icon: Terminal, color: "#22D3EE" },
  testing: { Icon: Bug, color: "#F59E0B" },
  web: { Icon: Globe, color: "#38BDF8" },
  projects: { Icon: Rocket, color: "#F472B6" },
  ai: { Icon: Sparkles, color: "#C084FC" },
};

const FALLBACK: IconDef = { Icon: Layers, color: "#22D3EE" };

export const getTechIcon = (key: string): IconDef =>
  MAP[key?.toLowerCase().trim()] ?? FALLBACK;

interface TechIconProps {
  /** course id, language or technology name */
  name: string;
  className?: string;
  /** apply the official brand colour (default true) */
  colored?: boolean;
}

const TechIcon = ({ name, className = "w-6 h-6", colored = true }: TechIconProps) => {
  const { Icon, color } = getTechIcon(name);
  return (
    <Icon
      className={className}
      {...(colored ? { style: { color } } : {})}
      aria-hidden
    />
  );
};

export default TechIcon;
