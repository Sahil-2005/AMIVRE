import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  PieChart,
  Users,
  User,
  TrendingUp,
  Shield,
  Lightbulb,
  Rocket,
  Share2,
  Layers,
  AlertTriangle,
  FileText,
  Crosshair,
  MessageSquare,
  ShieldCheck,
  Radar,
  BarChart3,
  Gauge,
  type LucideIcon,
} from "lucide-react";

import Image from "next/image";

const NAV_LINKS = [
  { label: "How it Works", href: "/platform" },
  { label: "Demo", href: "/demo" },
];

const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Security",
  "API Documentation",
];

const PROCESS_STEPS: {
  step: string;
  icon: LucideIcon;
  title: string;
  copy: string;
}[] = [
  {
    step: "STEP 01",
    icon: Lightbulb,
    title: "Define the Venture",
    copy: "You provide your startup idea, target audience and geography.",
  },
  {
    step: "STEP 02",
    icon: Rocket,
    title: "Deploy Agents",
    copy: "AMIVRE launches specialized AI agents to research every dimension.",
  },
  {
    step: "STEP 03",
    icon: Share2,
    title: "Parallel Intelligence",
    copy: "Agents independently investigate markets, competitors, sentiment and trends.",
  },
  {
    step: "STEP 04",
    icon: Layers,
    title: "Converging Intelligence",
    copy: "Collected evidence is combined, validated and synthesized into a unified view.",
  },
  {
    step: "STEP 05",
    icon: AlertTriangle,
    title: "Risk & Decision",
    copy: "The system identifies critical failure points and suggests mitigation strategies.",
  },
  {
    step: "STEP 06",
    icon: FileText,
    title: "Intelligence Report",
    copy: "You receive a structured venture intelligence report with actionable insights.",
  },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#050810] text-white">
      {/* Background grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6b8cff 1px, transparent 1px), linear-gradient(to bottom, #6b8cff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative">
        {/* Nav */}
        <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
          <span className="text-lg font-bold tracking-wide text-[#aebfff]">
            AMIVRE
          </span>

          <nav className="hidden items-center gap-10 md:flex">
                        {NAV_LINKS.map((link) => (
            <a
                key={link.label}
                href={link.href}
                className="text-sm text-slate-300 transition-colors hover:text-white"
            >
                {link.label}
            </a>
            ))}
          </nav>

          <div className="flex items-center gap-6">
          
             <Link
            href="/login"
            className="rounded-md bg-[#b7c6ff] px-5 py-2.5 text-sm font-semibold text-[#0a0e1a] transition-colors hover:bg-[#c9d5ff]"
            >
            Log In
            </Link>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto max-w-7xl px-6 pt-16 lg:px-10">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-slate-400">
                AUTONOMOUS VENTURE INTELLIGENCE
              </p>
              <h1 className="bg-gradient-to-b from-[#c3d0ff] to-[#8fa4ff] bg-clip-text text-6xl font-black leading-none tracking-tight text-transparent sm:text-7xl lg:text-8xl">
                AMIVRE
              </h1>
              <p className="mt-6 text-sm font-medium tracking-[0.2em] text-slate-300">
                AUTONOMOUS MARKET INTELLIGENCE &amp; VENTURE RISK ENGINE
              </p>
            </div>

            <div className="relative aspect-[14/9] w-full lg:min-h-[200px]">
                {/* Ambient glow behind the image */}
                <div className="absolute inset-0 bg-[#1769aa]/10 blur-3xl scale-90" />

                {/* Image */}
                <Image
                    src="/images/screen.png"
                    alt="AMIVRE Intelligence Platform"
                    fill
                    priority
                    className="
                    object-cover
                    [mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_82%)]
                    [-webkit-mask-image:radial-gradient(ellipse_at_center,black_45%,transparent_82%)]
                    "
                />

                {/* Soft blue atmospheric overlay */}
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,#050810_88%)]" />
                </div>
          </div>
        </section>

        {/* Headline */}
        <section className="mx-auto max-w-5xl px-6 pt-32 text-center lg:px-10">
          <h2 className="text-5xl font-extrabold leading-tight tracking-tight text-white sm:text-6xl">
            Know if your idea is
            <br />
            <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
              worth building.
            </span>
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-slate-300">
            AMIVRE deploys autonomous intelligence agents to research your
            market, competitors, customers, trends, and risks — turning
            uncertainty into an evidence-backed venture decision.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg bg-[#b7c6ff] px-7 py-3.5 text-sm font-semibold text-[#0a0e1a] transition-colors hover:bg-[#c9d5ff]"
            >
              Start Intelligence Run
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="rounded-lg border border-white/15 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              See How It Works
            </a>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <p className="mb-14 text-center text-xs font-semibold tracking-[0.25em] text-slate-400">
        FROM IDEA TO <span className="text-[#8fa4ff]">INTELLIGENCE.</span>
      </p>

      <div className="grid grid-cols-2 gap-x-4 gap-y-14 sm:grid-cols-3 lg:grid-cols-6">
        {PROCESS_STEPS.map(({ step, icon: Icon, title, copy }, i) => (
          <div key={title} className="relative text-center">
            {i < PROCESS_STEPS.length - 1 && (
              <div className="absolute right-[-18%] top-8 hidden h-px w-[36%] border-t border-dashed border-white/15 lg:block" />
            )}
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full border border-[#3a5bff]/40 bg-[#0a0f1e]">
              <Icon className="h-6 w-6 text-[#8fa4ff]" />
            </div>
            <p className="mb-2 text-[10px] font-semibold tracking-[0.2em] text-slate-500">
              {step}
            </p>
            <h3 className="mb-2 text-[14px] font-semibold text-white">
              {title}
            </h3>
            <p className="mx-auto max-w-[150px] text-[12px] leading-relaxed text-slate-400">
              {copy}
            </p>
          </div>
        ))}
      </div>
    </section>

        {/* Footer */}
        <footer className="mx-auto mt-32 max-w-7xl px-6 py-8 lg:px-10">
          <div className="flex flex-col items-center justify-between gap-6 border-t border-white/10 pt-8 sm:flex-row">
            <span className="text-base font-bold text-white">AMIVRE</span>

            <nav className="flex flex-wrap items-center justify-center gap-6">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link}
                </a>
              ))}
            </nav>

            <span className="text-sm text-slate-500">
              © 2024 AMIVRE Intelligence. All rights reserved.
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}