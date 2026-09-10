import {
  ArrowRight,
  PieChart,
  Users,
  User,
  TrendingUp,
  Shield,
  Crosshair,
  MessageSquare,
  ShieldCheck,
  BarChart3,
  type LucideIcon,
} from "lucide-react";

const NAV_LINKS = ["Platform", "Demo"];

const CAPABILITIES: {
  step: string;
  icon: LucideIcon;
  title: string;
  copy: string;
}[] = [
  {
    step: "01",
    icon: PieChart,
    title: "Market Intelligence",
    copy: "Measure the opportunity through TAM, SAM, SOM, target segments and market dynamics.",
  },
  {
    step: "02",
    icon: Users,
    title: "Competitive Intelligence",
    copy: "Map direct and indirect competitors, positioning, features and weaknesses.",
  },
  {
    step: "03",
    icon: User,
    title: "Customer Intelligence",
    copy: "Analyze customer sentiment, pain points, desires and demand signals.",
  },
  {
    step: "04",
    icon: TrendingUp,
    title: "Trend Intelligence",
    copy: "Identify emerging trends, market momentum and changing consumer behavior.",
  },
  {
    step: "05",
    icon: Shield,
    title: "Venture Risk",
    copy: "Stress-test the idea and identify critical failure points before resources are committed.",
  },
];


const AGENTS: {
  icon: LucideIcon;
  title: string;
  copy: string;
  angle: number;
}[] = [
  {
    icon: Crosshair,
    title: "Market Scout",
    copy: "Sizes the opportunity and evaluates market potential.",
    angle: -90,
  },
  {
    icon: Users,
    title: "Competitor Mapper",
    copy: "Maps the competitive landscape and identifies strategic gaps.",
    angle: -18,
  },
  {
    icon: ShieldCheck,
    title: "Risk Assessor",
    copy: "Stress-tests the venture and identifies failure points.",
    angle: 54,
  },
  {
    icon: TrendingUp,
    title: "Trend Forecaster",
    copy: "Detects market momentum and emerging trends.",
    angle: 126,
  },
  {
    icon: MessageSquare,
    title: "Sentiment Analyst",
    copy: "Reads customer sentiment, pain points and demand.",
    angle: 198,
  },
];

const REPORT_NAV = [
  "Executive Summary",
  "Market Size",
  "Competitors",
  "User Sentiment",
  "Trends & Forecast",
  "Risk Assessment",
  "Mitigation Strategies",
];
const FOOTER_LINKS = [
  "Privacy Policy",
  "Terms of Service",
  "Security",
  "API Documentation",
];

export default function Platform() {
  return (
    <>
  <div className="min-h-screen bg-[#050810] font-sans text-white">
      {/* ambient grid */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6b8cff 1px, transparent 1px), linear-gradient(to bottom, #6b8cff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative">
        <Nav />
        <Hero />
        <Capabilities />
        {/* <Process /> */}
        <AgentEngine />
        <ReportPreview />
        <FinalCta />
      </div>

    </div>
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
    </>
  
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function Nav() {
  return (
    <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6 lg:px-10">
      <span className="text-lg font-bold tracking-wide text-[#aebfff]">
        AMIVRE
      </span>

      <nav className="hidden items-center gap-10 md:flex">
        {NAV_LINKS.map((link, i) => (
          <a
            key={link}
            href="#"
            className={`relative pb-1 text-sm transition-colors ${
              i === 0
                ? "text-white after:absolute after:-bottom-[1px] after:left-0 after:h-px after:w-full after:bg-[#8fa4ff]"
                : "text-slate-300 hover:text-white"
            }`}
          >
            {link}
          </a>
        ))}
      </nav>

      <div className="flex items-center gap-6">
        <a
          href="#"
          className="hidden text-sm text-slate-200 hover:text-white sm:block"
        >
          Log In
        </a>
        <a
          href="#"
          className="rounded-md bg-[#b7c6ff] px-5 py-2.5 text-sm font-semibold text-[#0a0e1a] transition-colors hover:bg-[#c9d5ff]"
        >
          Get Access
        </a>
      </div>
    </header>
  );
}

/* ---------------------------------- Hero ---------------------------------- */

function Hero() {
  return (
    <section className="mx-auto max-w-7xl px-6 pb-20 pt-10 lg:px-10">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-slate-400">
            AUTONOMOUS VENTURE INTELLIGENCE
          </p>
          <h1 className="text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">
            Turn uncertainty into
            <br />
            <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
              venture intelligence.
            </span>
          </h1>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-400">
            AMIVRE deploys autonomous AI agents to research markets,
            competitors, customers, trends, and risks — transforming a
            startup idea into an evidence-backed venture decision.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg bg-[#b7c6ff] px-6 py-3 text-sm font-semibold text-[#0a0e1a] transition-colors hover:bg-[#c9d5ff]"
            >
              Explore the Intelligence Engine
              <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#"
              className="flex items-center gap-2 rounded-lg border border-white/15 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/5"
            >
              Run a Demo
              <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </div>

        <EngineDiagram />
      </div>
    </section>
  );
}

function DataChip({
  icon: Icon,
  label,
  line1,
  line2,
  className = "",
}: {
  icon: LucideIcon;
  label: string;
  line1: string;
  line2: string;
  className?: string;
}) {
  return (
    <div
      className={`absolute w-[168px] rounded-lg border border-white/10 bg-[#0a0f1e]/90 p-3 backdrop-blur-sm ${className}`}
    >
      <div className="mb-1.5 flex items-center gap-1.5">
        <Icon className="h-3.5 w-3.5 text-[#8fa4ff]" />
        <span className="text-[10px] font-semibold tracking-wide text-slate-300">
          {label}
        </span>
      </div>
      <p className="text-[11px] font-medium text-white">{line1}</p>
      <p className="text-[11px] text-slate-500">{line2}</p>
    </div>
  );
}

function EngineDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      {/* orbit rings */}
      <div className="absolute left-1/2 top-1/2 h-[70%] w-[70%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3a5bff]/20" />
      <div className="absolute left-1/2 top-1/2 h-[90%] w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3a5bff]/10" />

      {/* center cube */}
      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
        <div className="absolute h-full w-full rounded-2xl bg-[#3a5bff]/20 blur-2xl" />
        <div className="relative flex h-24 w-24 rotate-45 items-center justify-center rounded-xl border border-[#8fa4ff]/60 bg-gradient-to-br from-[#1a2456] to-[#0a0f1e] shadow-[0_0_40px_rgba(90,120,255,0.35)]">
          <span className="-rotate-45 text-center text-[11px] font-bold leading-tight text-[#c3d0ff]">
            AMIVRE
            <br />
            ENGINE
          </span>
        </div>
      </div>

      <DataChip
        icon={Crosshair}
        label="MARKET DATA"
        line1="97+ market signals"
        line2="Real-time"
        className="left-[6%] top-[14%]"
      />
      <DataChip
        icon={Users}
        label="COMPETITOR DATA"
        line1="Live mapping"
        line2="230+ sources"
        className="right-[2%] top-[2%]"
      />
      <DataChip
        icon={ShieldCheck}
        label="SENTIMENT DATA"
        line1="Social + review"
        line2="Sentiment analysis"
        className="right-[-4%] top-[38%]"
      />
      <DataChip
        icon={BarChart3}
        label="TREND DATA"
        line1="Emerging trends"
        line2="AI forecasting"
        className="left-[0%] top-[52%]"
      />
      <DataChip
        icon={Shield}
        label="RISK DATA"
        line1="Risk factors"
        line2="& mitigations"
        className="right-[4%] bottom-[6%]"
      />
    </div>
  );
}

/* ------------------------------ Capabilities ------------------------------ */

function Capabilities() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="mb-12 rounded-2xl border border-white/10 bg-[#080c18] p-10">
        <p className="mb-10 text-center text-xs font-semibold tracking-[0.25em] text-slate-400">
          ONE PLATFORM.{" "}
          <span className="text-[#8fa4ff]">COMPLETE VENTURE INTELLIGENCE.</span>
        </p>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {CAPABILITIES.map(({ step, icon: Icon, title, copy }) => (
            <div
              key={title}
              className="rounded-xl border border-white/10 bg-[#0a0f1e] p-5"
            >
              <div className="mb-6 flex items-start justify-between">
                <Icon className="h-6 w-6 text-[#8fa4ff]" />
                <span className="text-xs text-slate-600">{step}</span>
              </div>
              <h3 className="mb-2 text-[15px] font-semibold text-white">
                {title}
              </h3>
              <p className="text-[13px] leading-relaxed text-slate-400">
                {copy}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}


/* ------------------------------- Agent Engine ------------------------------ */

function AgentEngine() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-2">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-slate-400">
            THE AMIVRE INTELLIGENCE ENGINE
          </p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Five agents.
            <br />
            <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
              One venture decision.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-400">
            AMIVRE&rsquo;s autonomous agents work in parallel, each an expert
            in their domain, converging into one intelligence report.
          </p>
          <a
            href="#"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-[#8fa4ff] hover:text-[#a9bcff]"
          >
            View agent capabilities
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <AgentRadial />
      </div>
    </section>
  );
}

function AgentRadial() {
  const radius = 44; // percent
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[560px]">
      <div className="absolute left-1/2 top-1/2 h-[78%] w-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-[#3a5bff]/30" />

      <div className="absolute left-1/2 top-1/2 flex h-32 w-32 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#8fa4ff]/50 bg-gradient-to-br from-[#141d45] to-[#0a0f1e] shadow-[0_0_50px_rgba(90,120,255,0.3)]">
        <span className="text-center text-[13px] font-bold leading-tight text-[#c3d0ff]">
          AMIVRE
          <br />
          ENGINE
        </span>
      </div>

      {AGENTS.map(({ icon: Icon, title, copy, angle }) => {
        const rad = (angle * Math.PI) / 180;
        const x = 50 + radius * Math.cos(rad);
        const y = 50 + radius * Math.sin(rad);
        const labelSide = Math.cos(rad) >= 0 ? "left" : "right";

        return (
          <div
            key={title}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${x}%`, top: `${y}%` }}
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[#3a5bff]/50 bg-[#0a0f1e]">
              <Icon className="h-5 w-5 text-[#8fa4ff]" />
            </div>
            <div
              className={`absolute top-1/2 w-40 -translate-y-1/2 ${
                labelSide === "left"
                  ? "left-16 text-left"
                  : "right-16 text-right"
              }`}
            >
              <p className="mb-1 text-[11px] font-semibold tracking-wide text-[#8fa4ff]">
                {title.toUpperCase()}
              </p>
              <p className="text-[11px] leading-snug text-slate-400">
                {copy}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Report Preview ----------------------------- */

function ReportPreview() {
  const metrics = [
    {
      label: "Market Size",
      sub: "TAM",
      value: "$95B",
      tag: "Large Opportunity",
      tagColor: "text-[#8fa4ff]",
      icon: <MiniLineChart color="#8fa4ff" />,
    },
    {
      label: "Competitors",
      sub: "Active Players",
      value: "24",
      tag: "High Competition",
      tagColor: "text-rose-400",
      icon: <MiniBarChart color="#8fa4ff" />,
    },
    {
      label: "User Sentiment",
      sub: "Overall Sentiment",
      value: "82%",
      tag: "Positive",
      tagColor: "text-emerald-400",
      icon: <MiniRing value={82} color="#34d399" />,
    },
    {
      label: "Trends & Forecast",
      sub: "Market Momentum",
      value: "High",
      tag: "Strong Growth",
      tagColor: "text-emerald-400",
      icon: <MiniLineChart color="#34d399" />,
    },
    {
      label: "Risk Assessment",
      sub: "Overall Risk Score",
      value: "29/100",
      tag: "Moderate Risk",
      tagColor: "text-amber-400",
      icon: <MiniGauge value={29} />,
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
      <div className="grid grid-cols-1 items-center gap-16 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.25em] text-slate-400">
            ONE INTELLIGENCE REPORT.
          </p>
          <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
            Every angle
            <br />
            <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
              covered.
            </span>
          </h2>
          <p className="mt-6 max-w-md text-[15px] leading-relaxed text-slate-400">
            A comprehensive view of your venture across all critical
            dimensions.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#080c18]">
          <div className="grid grid-cols-[170px_1fr]">
            {/* sidebar */}
            <aside className="border-r border-white/10 bg-[#0a0f1e] p-4">
              <p className="mb-4 px-2 text-[11px] font-bold tracking-widest text-[#aebfff]">
                AMIVRE
              </p>
              <nav className="space-y-1">
                {REPORT_NAV.map((item, i) => (
                  <div
                    key={item}
                    className={`rounded-md px-2 py-1.5 text-[11px] ${
                      i === 0
                        ? "bg-[#1a2456] text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </nav>
            </aside>

            {/* content */}
            <div className="p-5">
              <p className="mb-4 text-[13px] font-semibold text-white">
                Executive Summary
              </p>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {metrics.map((m) => (
                  <div
                    key={m.label}
                    className="rounded-lg border border-white/10 bg-[#0a0f1e] p-3"
                  >
                    <p className="text-[10px] text-slate-500">{m.label}</p>
                    <p className="mb-2 text-[10px] text-slate-600">{m.sub}</p>
                    <p className="mb-1 text-lg font-bold text-white">
                      {m.value}
                    </p>
                    <p className={`mb-2 text-[10px] ${m.tagColor}`}>
                      {m.tag}
                    </p>
                    {m.icon}
                  </div>
                ))}

                <div className="rounded-lg border border-white/10 bg-[#0a0f1e] p-3">
                  <p className="mb-2 text-[10px] font-semibold text-[#8fa4ff]">
                    Critical Failure Points
                  </p>
                  <ul className="mb-3 space-y-1 text-[10px] leading-relaxed text-slate-400">
                    <li>• Customer acquisition cost may be high</li>
                    <li>• Strong established competitors</li>
                    <li>• Market education required</li>
                  </ul>
                  <p className="mb-2 text-[10px] font-semibold text-[#8fa4ff]">
                    Top Mitigation Strategies
                  </p>
                  <ul className="space-y-1 text-[10px] leading-relaxed text-slate-400">
                    <li>• Focus on niche segment</li>
                    <li>• Differentiated positioning</li>
                    <li>• Phased market entry</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

  );
}

function MiniLineChart({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 30" className="h-6 w-full">
      <polyline
        points="0,25 15,20 30,22 45,14 60,17 75,8 100,4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniBarChart({ color }: { color: string }) {
  const bars = [8, 14, 22, 12];
  return (
    <svg viewBox="0 0 100 30" className="h-6 w-full">
      {bars.map((h, i) => (
        <rect
          key={i}
          x={i * 26}
          y={30 - h}
          width="16"
          height={h}
          fill={color}
          opacity={0.4 + i * 0.15}
        />
      ))}
    </svg>
  );
}

function MiniRing({ value, color }: { value: number; color: string }) {
  const r = 12;
  const c = 2 * Math.PI * r;
  return (
    <svg viewBox="0 0 30 30" className="h-6 w-6">
      <circle
        cx="15"
        cy="15"
        r={r}
        fill="none"
        stroke="#1c2440"
        strokeWidth="4"
      />
      <circle
        cx="15"
        cy="15"
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="4"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / 100}
        strokeLinecap="round"
        transform="rotate(-90 15 15)"
      />
    </svg>
  );
}

function MiniGauge({ value }: { value: number }) {
  const angle = -90 + (value / 100) * 180;
  return (
    <svg viewBox="0 0 60 32" className="h-6 w-full">
      <path
        d="M 5 30 A 25 25 0 0 1 55 30"
        fill="none"
        stroke="url(#gaugeGrad)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#34d399" />
          <stop offset="50%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#fb7185" />
        </linearGradient>
      </defs>
      <line
        x1="30"
        y1="30"
        x2={30 + 18 * Math.cos((angle * Math.PI) / 180)}
        y2={30 + 18 * Math.sin((angle * Math.PI) / 180)}
        stroke="#e5e9ff"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="30" cy="30" r="2" fill="#e5e9ff" />
    </svg>
  );
}

/* --------------------------------- Final CTA -------------------------------- */

function FinalCta() {
  return (
    <section className="relative overflow-hidden px-6 py-28 lg:px-10">
      <DotWave />
      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          Before you build it,
          <br />
          <span className="bg-gradient-to-r from-[#a9bcff] to-[#5d7bff] bg-clip-text text-transparent">
            know what you&rsquo;re building into.
          </span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-[15px] text-slate-400">
          Let autonomous intelligence stress-test your venture idea.
        </p>
        <a
          href="#"
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#b7c6ff] px-7 py-3.5 text-sm font-semibold text-[#0a0e1a] transition-colors hover:bg-[#c9d5ff]"
        >
          Start Intelligence Run
          <ArrowRight className="h-4 w-4" />
        </a>
      </div>
    </section>
  );
}

function DotWave() {
  return (
    <svg
      className="pointer-events-none absolute inset-x-0 bottom-0 h-64 w-full opacity-60"
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
    >
      {Array.from({ length: 26 }).map((_, row) => {
        const y = row * 10;
        const amp = 40 * Math.sin(row / 6);
        return Array.from({ length: 60 }).map((_, col) => {
          const x = col * 20;
          const offset = amp * Math.sin(col / 5 + row / 3);
          return (
            <circle
              key={`${row}-${col}`}
              cx={x}
              cy={y + offset + 120}
              r="1.1"
              fill="#5d7bff"
              opacity={0.15 + (row / 26) * 0.5}
            />
          );
        });
      })}
    </svg>
  );
}