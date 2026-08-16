import {
  ArrowRight,
  Lightbulb,
  Radar,
  Crosshair,
  MessageSquare,
  Users,
  TrendingUp,
  Shield,
  User,
  MapPin,
  Clock,
  BarChart2,
  Wallet,
  LineChart,
  Gauge,
  Smile,
  Activity,
  AlertOctagon,
  CheckCircle2,
  Info,
  Trophy,
  Check,
  type LucideIcon,
} from "lucide-react";

/* --------------------------------- Data --------------------------------- */

const AGENTS: {
  icon: LucideIcon;
  title: string;
  copy: string;
  pos: string;
}[] = [
  {
    icon: Crosshair,
    title: "MARKET SCOUT",
    copy: "Market size, segments & opportunity",
    pos: "left-1/2 top-0 -translate-x-1/2",
  },
  {
    icon: User,
    title: "SENTIMENT ANALYST",
    copy: "Customer sentiment, pain points & demand",
    pos: "left-0 top-[26%]",
  },
  {
    icon: Users,
    title: "COMPETITOR TRACKER",
    copy: "Competitor mapping, positioning & gaps",
    pos: "right-0 top-[26%]",
  },
  {
    icon: TrendingUp,
    title: "TREND FORECASTER",
    copy: "Emerging trends, momentum & signals",
    pos: "left-0 bottom-0",
  },
  {
    icon: Shield,
    title: "RISK MODELER",
    copy: "Risk scoring, failure points & mitigation",
    pos: "right-0 bottom-0",
  },
];

const SNAPSHOT: {
  icon: LucideIcon;
  color: string;
  label: string;
  value: string;
  sub: string;
  chart: "line" | "bars" | "dots" | "areaLine";
}[] = [
  {
    icon: Wallet,
    color: "#60a5fa",
    label: "Market Opportunity",
    value: "₹18.4B",
    sub: "TAM (Estimated)",
    chart: "line",
  },
  {
    icon: LineChart,
    color: "#4ade80",
    label: "Market Growth",
    value: "11.8%",
    sub: "CAGR (Next 5 Years)",
    chart: "areaLine",
  },
  {
    icon: Gauge,
    color: "#fb923c",
    label: "Competition Level",
    value: "Moderate",
    sub: "12 Relevant Players",
    chart: "dots",
  },
  {
    icon: Smile,
    color: "#c084fc",
    label: "Sentiment Score",
    value: "74%",
    sub: "Positive Signals",
    chart: "areaLine",
  },
  {
    icon: Activity,
    color: "#4ade80",
    label: "Trend Momentum",
    value: "Strong",
    sub: "Rising Interest",
    chart: "areaLine",
  },
  {
    icon: AlertOctagon,
    color: "#f87171",
    label: "Risk Level",
    value: "Medium",
    sub: "3 Priority Risks",
    chart: "dots",
  },
];

const TIMELINE: { icon: LucideIcon; title: string; time: string }[] = [
  { icon: Crosshair, title: "Market Scout", time: "01:32" },
  { icon: Users, title: "Competitor Tracker", time: "01:48" },
  { icon: MessageSquare, title: "Sentiment Analyst", time: "01:26" },
  { icon: TrendingUp, title: "Trend Forecaster", time: "01:12" },
  { icon: Shield, title: "Risk Modeler", time: "02:44" },
];

const COMPETITORS = [
  { name: "Blue Bottle", type: "Premium", score: 91 },
  { name: "Trade Coffee", type: "Subscription", score: 82 },
  { name: "Country Bean", type: "D2C Brand", score: 74 },
  { name: "Sleepy Owl", type: "D2C Brand", score: 69 },
  { name: "Third Wave", type: "Cafe Chain", score: 63 },
];

const TREND_DATA = [
  { label: "Q1", value: 40 },
  { label: "Q2", value: 52 },
  { label: "Q3", value: 58 },
  { label: "Q4", value: 68 },
  { label: "Q5", value: 80 },
  { label: "Q6", value: 92 },
];

const RISKS: {
  level: "HIGH RISK" | "MEDIUM RISK";
  levelColor: string;
  title: string;
  copy: string;
  impact: number;
  likelihood: number;
  score: string;
}[] = [
  {
    level: "HIGH RISK",
    levelColor: "text-rose-400 border-rose-500/40 bg-rose-500/10",
    title: "Customer Acquisition Cost",
    copy: "High competition for eco-conscious audience may increase CAC and impact early margins.",
    impact: 5,
    likelihood: 4,
    score: "8.2/10",
  },
  {
    level: "MEDIUM RISK",
    levelColor: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    title: "Competitive Pressure",
    copy: "Established brands may expand sustainable lines and reduce differentiation.",
    impact: 4,
    likelihood: 3,
    score: "6.1/10",
  },
  {
    level: "MEDIUM RISK",
    levelColor: "text-amber-400 border-amber-500/40 bg-amber-500/10",
    title: "Supply Chain Consistency",
    copy: "Dependence on ethical suppliers may cause supply & cost volatility.",
    impact: 4,
    likelihood: 3,
    score: "5.9/10",
  },
];

const MITIGATIONS = [
  "Focus on community & content-led growth",
  "Build long-term supplier partnerships",
  "Differentiate with transparency & impact",
  "Optimize subscription retention",
];

/* -------------------------------- Component ------------------------------- */

export default function Demo() {
  return (
    <div className="min-h-screen bg-[#050810] font-sans text-white">
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #6b8cff 1px, transparent 1px), linear-gradient(to bottom, #6b8cff 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-6 pb-16 lg:px-10">
        <Nav />
        <Hero />
        <VentureCard />
        <Snapshot />
        <Timeline />
        <IntelligenceGrid />
        <RiskMatrix />
        <Recommendation />
        <Disclaimer />
      </div>
    </div>
  );
}

/* ---------------------------------- Nav ---------------------------------- */

function Nav() {
  return (
    <header className="flex items-center justify-between py-6">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#5d7bff]/50 bg-[#0a0f1e]">
          <Radar className="h-4 w-4 text-[#8fa4ff]" />
        </div>
        <div>
          <p className="text-lg font-bold leading-none tracking-wide">
            AMIVRE
          </p>
          <p className="mt-1 text-[11px] text-slate-500">
            Autonomous Market Intelligence
          </p>
        </div>
      </div>

      <nav className="hidden items-center gap-10 md:flex">
        <a href="#" className="text-sm text-slate-300 hover:text-white">
          How It Works
        </a>
        <a
          href="#"
          className="relative pb-1 text-sm text-white after:absolute after:-bottom-[1px] after:left-0 after:h-px after:w-full after:bg-[#8fa4ff]"
        >
          Demo
        </a>
      </nav>

      <div className="flex items-center gap-3">
        <a
          href="#"
          className="rounded-md border border-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/5"
        >
          Log In
        </a>
        <a
          href="#"
          className="rounded-md bg-gradient-to-r from-[#6d7dff] to-[#8f6dff] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
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
    <section className="grid grid-cols-1 items-center gap-14 py-10 lg:grid-cols-2">
      <div>
        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span className="text-[11px] font-semibold tracking-wide text-slate-300">
            DEMO RUN
          </span>
        </div>

        <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
          See{" "}
          <span className="bg-gradient-to-r from-[#a9bcff] to-[#8f6dff] bg-clip-text text-transparent">
            AMIVRE
          </span>{" "}
          in action.
        </h1>

        <p className="mt-5 max-w-md text-[15px] leading-relaxed text-slate-400">
          This is a live demo run using an example venture. AMIVRE deploys 5
          autonomous agents to analyze the idea across markets, competition,
          sentiment, trends and risks.
        </p>

        <div className="mt-8 flex items-start gap-4 rounded-xl border border-white/10 bg-[#0a0f1e] p-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1a2456]">
            <Lightbulb className="h-4 w-4 text-[#c084fc]" />
          </div>
          <p className="text-[13px] leading-relaxed text-slate-300">
            Experience the intelligence AMIVRE generates before you run your
            own analysis.
          </p>
        </div>
      </div>

      <EngineDiagram />
    </section>
  );
}

function EngineDiagram() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[520px]">
      <div className="absolute left-1/2 top-1/2 h-[62%] w-[62%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3a5bff]/20" />
      <div className="absolute left-1/2 top-1/2 h-[80%] w-[80%] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#3a5bff]/10" />

      <div className="absolute left-1/2 top-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border border-[#8fa4ff]/50 bg-gradient-to-br from-[#101a4a] to-[#050a18] text-center shadow-[0_0_60px_rgba(90,120,255,0.35)]">
        <p className="text-lg font-bold text-white">AMIVRE</p>
        <p className="mt-0.5 text-[11px] tracking-wide text-[#8fa4ff]">
          INTELLIGENCE
        </p>
        <p className="text-[11px] tracking-wide text-[#8fa4ff]">ENGINE</p>
      </div>

      {AGENTS.map(({ icon: Icon, title, copy, pos }) => (
        <div key={title} className={`absolute w-[190px] ${pos}`}>
          <div className="rounded-lg border border-white/10 bg-[#0a0f1e]/95 p-3 backdrop-blur-sm">
            <div className="mb-1.5 flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 text-[#8fa4ff]" />
              <span className="text-[10px] font-semibold tracking-wide text-slate-200">
                {title}
              </span>
            </div>
            <p className="text-[11px] leading-snug text-slate-500">{copy}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------- Venture card ------------------------------ */

function VentureCard() {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#080c18] p-7">
      <p className="mb-4 flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] text-[#8fa4ff]">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
        EXAMPLE VENTURE
      </p>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1.6fr_0.9fr]">
        <div className="flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-500/15">
            <span className="text-lg">🌱</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              EcoCoffee – Sustainable Coffee Subscription
            </h3>
            <p className="mt-2 text-[13px] leading-relaxed text-slate-400">
              A subscription service delivering ethically sourced coffee in
              reusable packaging, targeting environmentally conscious urban
              consumers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-8 gap-y-5">
          <MetaItem
            icon={User}
            label="Target Audience"
            value="Urban, 22–40 yrs, eco-conscious"
          />
          <MetaItem icon={MapPin} label="Geography" value="India – Metro & Tier 1 Cities" />
          <MetaItem icon={Clock} label="Run Time" value="8m 42s" />
          <MetaItem icon={BarChart2} label="Analysis Depth" value="Comprehensive" />
        </div>

        <div className="border-t border-white/10 pt-5 lg:border-l lg:border-t-0 lg:pl-8 lg:pt-0">
          <p className="text-[11px] font-semibold tracking-wide text-slate-500">
            AMIVRE VIABILITY SCORE
          </p>
          <p className="mt-1 text-4xl font-extrabold text-white">
            78<span className="text-lg font-medium text-slate-500">/100</span>
          </p>
          <span className="mt-2 inline-block rounded-md bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-400">
            BUILDABLE
          </span>
          <p className="mt-3 text-[12px] leading-relaxed text-slate-400">
            Promising opportunity with moderate competitive risk.
          </p>
        </div>
      </div>
    </section>
  );
}

function MetaItem({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#8fa4ff]" />
      <div>
        <p className="text-[13px] font-medium text-white">{value}</p>
        <p className="text-[11px] text-slate-500">{label}</p>
      </div>
    </div>
  );
}

/* --------------------------------- Snapshot -------------------------------- */

function Snapshot() {
  return (
    <section className="mt-8">
      <SectionLabel>EXECUTIVE SNAPSHOT</SectionLabel>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {SNAPSHOT.map(({ icon: Icon, color, label, value, sub, chart }) => (
          <div
            key={label}
            className="rounded-xl border border-white/10 bg-[#080c18] p-4"
          >
            <div className="mb-3 flex items-center gap-2">
              <Icon className="h-4 w-4" style={{ color }} />
              <span className="text-[12px] text-slate-300">{label}</span>
            </div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="mb-3 mt-0.5 text-[11px] text-slate-500">{sub}</p>
            {chart === "line" && <MiniLine color={color} />}
            {chart === "areaLine" && <MiniAreaLine color={color} />}
            {chart === "dots" && <MiniDots color={color} />}
          </div>
        ))}
      </div>
    </section>
  );
}

function MiniLine({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 28" className="h-6 w-full">
      <polyline
        points="0,24 20,18 40,20 60,10 80,14 100,4"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function MiniAreaLine({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 28" className="h-6 w-full">
      <polyline
        points="0,26 18,22 36,20 54,14 72,10 100,2"
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <polygon
        points="0,26 18,22 36,20 54,14 72,10 100,2 100,28 0,28"
        fill={color}
        opacity="0.12"
      />
    </svg>
  );
}

function MiniDots({ color }: { color: string }) {
  return (
    <div className="flex h-6 items-center gap-1">
      {Array.from({ length: 6 }).map((_, i) => (
        <span
          key={i}
          className="h-2 flex-1 rounded-sm"
          style={{
            backgroundColor: i < 3 ? color : "#1c2440",
          }}
        />
      ))}
    </div>
  );
}

/* --------------------------------- Timeline -------------------------------- */

function Timeline() {
  return (
    <section className="mt-8">
      <SectionLabel>AGENT ACTIVITY TIMELINE</SectionLabel>
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-[#080c18] px-6 py-5">
        {TIMELINE.map(({ icon: Icon, title, time }, i) => (
          <div key={title} className="flex items-center">
            <div className="flex flex-col items-center text-center">
              <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-full border border-[#3a5bff]/50 bg-[#0a0f1e]">
                <Icon className="h-4 w-4 text-[#8fa4ff]" />
              </div>
              <p className="text-[12px] font-medium text-white">{title}</p>
              <p className="flex items-center gap-1 text-[11px] text-emerald-400">
                Completed <CheckCircle2 className="h-3 w-3" />
              </p>
              <p className="text-[10px] text-slate-500">{time}</p>
            </div>
            {i < TIMELINE.length - 1 && (
              <div className="mx-3 hidden h-px w-10 border-t border-dashed border-white/15 sm:block" />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- Intelligence grid ---------------------------- */

function IntelligenceGrid() {
  return (
    <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-4">
      <MarketIntelligencePanel />
      <CompetitorPanel />
      <SentimentPanel />
      <TrendPanel />
    </section>
  );
}

function PanelLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-4 text-[11px] font-semibold tracking-[0.15em] text-[#8fa4ff]">
      {children}
    </p>
  );
}

function MarketIntelligencePanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080c18] p-5">
      <PanelLabel>MARKET INTELLIGENCE</PanelLabel>
      <p className="text-2xl font-bold text-white">₹18.4B</p>
      <p className="mb-4 text-[11px] text-slate-500">
        Addressable Market (TAM)
      </p>

      <div className="mb-4 flex items-center gap-4">
        <Donut segments={[
          { value: 42, color: "#4ade80" },
          { value: 14, color: "#60a5fa" },
          { value: 44, color: "#1c2440" },
        ]} />
        <div className="space-y-1.5 text-[11px]">
          <LegendRow color="#4ade80" label="SAM" value="₹7.8B" pct="42%" />
          <LegendRow color="#60a5fa" label="SOM" value="₹2.6B" pct="14%" />
          <p className="pt-1 text-slate-500">Serviceable Obtainable Market</p>
        </div>
      </div>

      <div className="rounded-lg border border-white/10 bg-[#0a0f1e] p-3 text-[11px] leading-relaxed text-slate-400">
        The sustainable coffee market is growing steadily with strong
        long-term potential.
      </div>
    </div>
  );
}

function LegendRow({
  color,
  label,
  value,
  pct,
}: {
  color: string;
  label: string;
  value: string;
  pct: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="h-2 w-2 rounded-full"
        style={{ backgroundColor: color }}
      />
      <span className="text-slate-300">{label}</span>
      <span className="text-white">{value}</span>
      <span className="text-slate-500">{pct}</span>
    </div>
  );
}

function Donut({
  segments,
}: {
  segments: { value: number; color: string }[];
}) {
  const r = 26;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox="0 0 64 64" className="h-16 w-16 shrink-0 -rotate-90">
      {segments.map((s, i) => {
        const len = (s.value / 100) * c;
        const circle = (
          <circle
            key={i}
            cx="32"
            cy="32"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="9"
            strokeDasharray={`${len} ${c - len}`}
            strokeDashoffset={-offset}
          />
        );
        offset += len;
        return circle;
      })}
    </svg>
  );
}

function CompetitorPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080c18] p-5">
      <PanelLabel>COMPETITOR LANDSCAPE</PanelLabel>

      <div className="mb-2 grid grid-cols-[1fr_0.7fr_1fr_0.5fr] text-[10px] text-slate-500">
        <span>Competitor</span>
        <span>Type</span>
        <span>Strength</span>
        <span className="text-right">Score</span>
      </div>

      <div className="space-y-2.5">
        {COMPETITORS.map((c) => (
          <div
            key={c.name}
            className="grid grid-cols-[1fr_0.7fr_1fr_0.5fr] items-center text-[11px]"
          >
            <span className="text-white">{c.name}</span>
            <span className="text-slate-400">{c.type}</span>
            <span className="h-1.5 overflow-hidden rounded-full bg-[#1c2440]">
              <span
                className="block h-full rounded-full bg-[#6d7dff]"
                style={{ width: `${c.score}%` }}
              />
            </span>
            <span className="text-right text-slate-300">{c.score}/100</span>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-lg border border-white/10 bg-[#0a0f1e] p-3 text-[11px] leading-relaxed text-slate-400">
        EcoCoffee has strong differentiation in sustainability but faces
        strong brand competition.
      </div>
    </div>
  );
}

function SentimentPanel() {
  return (
    <div className="rounded-xl border border-white/10 bg-[#080c18] p-5">
      <PanelLabel>CUSTOMER SENTIMENT</PanelLabel>

      <div className="flex justify-center py-2">
        <Arc value={74} />
      </div>

      <div className="mt-3 space-y-1.5 text-[11px]">
        <p className="font-semibold text-[#8fa4ff]">Top Themes</p>
        <p className="text-slate-400">
          <span className="text-emerald-400">Loved:</span> Taste,
          Sustainability, Packaging
        </p>
        <p className="text-slate-400">
          <span className="text-amber-400">Needs Work:</span> Price, Delivery
          Speed, Variety
        </p>
      </div>
    </div>
  );
}

function Arc({ value }: { value: number }) {
  const r = 44;
  const c = Math.PI * r; // half circle
  return (
    <div className="relative flex h-24 w-32 items-end justify-center">
      <svg viewBox="0 0 100 55" className="h-full w-full">
        <path
          d="M 6 50 A 44 44 0 0 1 94 50"
          fill="none"
          stroke="#1c2440"
          strokeWidth="8"
          strokeLinecap="round"
        />
        <path
          d="M 6 50 A 44 44 0 0 1 94 50"
          fill="none"
          stroke="#a78bfa"
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c - (c * value) / 100}
        />
      </svg>
      <div className="absolute bottom-0 flex flex-col items-center">
        <p className="text-xl font-bold text-white">{value}%</p>
        <p className="text-[11px] text-slate-400">Positive</p>
      </div>
    </div>
  );
}

function TrendPanel() {
  const max = Math.max(...TREND_DATA.map((d) => d.value));
  return (
    <div className="rounded-xl border border-white/10 bg-[#080c18] p-5">
      <PanelLabel>TREND &amp; MOMENTUM</PanelLabel>
      <p className="mb-4 text-[11px] text-slate-500">
        Interest Over Time (Relative)
      </p>

      <div className="mb-4 flex h-24 items-end gap-2">
        {TREND_DATA.map((d) => (
          <div key={d.label} className="flex flex-1 flex-col items-center gap-1.5">
            <div
              className="w-full rounded-t-sm bg-gradient-to-t from-[#4c3fd6] to-[#8fa4ff]"
              style={{ height: `${(d.value / max) * 100}%` }}
            />
            <span className="text-[10px] text-slate-500">{d.label}</span>
          </div>
        ))}
      </div>

      <div className="space-y-1.5 text-[11px] text-slate-300">
        <p className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          Sustainable living trend is accelerating
        </p>
        <p className="flex items-center gap-1.5">
          <Check className="h-3.5 w-3.5 text-emerald-400" />
          Subscription model adoption rising
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- Risk matrix ------------------------------- */

function RiskMatrix() {
  return (
    <section className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-[2.1fr_1fr]">
      <div>
        <SectionLabel>RISK MATRIX – TOP PRIORITY RISKS</SectionLabel>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {RISKS.map((r) => (
            <div
              key={r.title}
              className="rounded-xl border border-white/10 bg-[#080c18] p-4"
            >
              <span
                className={`mb-3 inline-block rounded-md border px-2 py-1 text-[10px] font-semibold ${r.levelColor}`}
              >
                {r.level}
              </span>
              <h4 className="mb-2 text-[14px] font-semibold text-white">
                {r.title}
              </h4>
              <p className="mb-4 text-[11px] leading-relaxed text-slate-400">
                {r.copy}
              </p>

              <RiskBar label="Impact" value={r.impact} />
              <RiskBar label="Likelihood" value={r.likelihood} />

              <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
                <span className="text-[11px] text-slate-500">
                  Risk Score
                </span>
                <span className="text-[13px] font-semibold text-white">
                  {r.score}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-[#080c18] p-5">
        <PanelLabel>MITIGATION STRATEGIES</PanelLabel>
        <ul className="space-y-2.5">
          {MITIGATIONS.map((m) => (
            <li key={m} className="flex items-start gap-2 text-[12px] text-slate-300">
              <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />
              {m}
            </li>
          ))}
        </ul>
        <a
          href="#"
          className="mt-5 flex items-center justify-center gap-2 rounded-lg border border-[#5d7bff]/40 bg-[#141d45] px-4 py-2.5 text-[12px] font-semibold text-[#c3d0ff] hover:bg-[#1a2456]"
        >
          View Full Risk Report
          <ArrowRight className="h-3.5 w-3.5" />
        </a>
      </div>
    </section>
  );
}

function RiskBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="mb-2 flex items-center gap-2">
      <span className="w-16 text-[10px] text-slate-500">{label}</span>
      <div className="flex flex-1 gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 flex-1 rounded-sm ${
              i < value ? "bg-amber-500" : "bg-[#1c2440]"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Recommendation ------------------------------ */

function Recommendation() {
  return (
    <section className="mt-8 rounded-2xl border border-white/10 bg-[#080c18] p-6">
      <div className="grid grid-cols-1 items-center gap-6 lg:grid-cols-[auto_1fr_auto_auto]">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#141d45]">
            <Trophy className="h-5 w-5 text-[#8fa4ff]" />
          </div>
          <div>
            <p className="text-[11px] font-semibold tracking-wide text-[#8fa4ff]">
              AMIVRE RECOMMENDATION
            </p>
            <p className="text-xl font-bold text-white">
              Proceed with Caution.
            </p>
          </div>
        </div>

        <p className="max-w-sm text-[12px] leading-relaxed text-slate-400">
          The opportunity looks strong with a viable market and positive
          sentiment. Focus on unit economics, retention and brand
          differentiation.
        </p>

        <div className="lg:border-l lg:border-white/10 lg:pl-6">
          <p className="text-[11px] text-slate-500">OVERALL VIABILITY SCORE</p>
          <p className="text-2xl font-extrabold text-white">
            78<span className="text-sm font-medium text-slate-500">/100</span>
          </p>
        </div>

        <div className="lg:border-l lg:border-white/10 lg:pl-6">
          <p className="mb-1 text-[13px] font-semibold text-white">
            What&rsquo;s Next?
          </p>
          <p className="mb-3 max-w-[220px] text-[11px] leading-relaxed text-slate-400">
            Run your own analysis to get a personalized intelligence report
            for your idea.
          </p>
          <a
            href="#"
            className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-[#6d7dff] to-[#8f6dff] px-4 py-2.5 text-[12px] font-semibold text-white hover:opacity-90"
          >
            Start Your Analysis
            <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------- Disclaimer -------------------------------- */

function Disclaimer() {
  return (
    <p className="mt-8 flex items-center justify-center gap-1.5 text-center text-[11px] text-slate-600">
      <Info className="h-3.5 w-3.5" />
      This is a demo run using an example venture. Results are illustrative
      and not real-time market data.
    </p>
  );
}

/* --------------------------------- Helpers --------------------------------- */

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 flex items-center gap-2 text-[11px] font-semibold tracking-[0.15em] text-slate-500">
      <span className="h-1.5 w-1.5 rounded-full bg-[#5d7bff]" />
      {children}
    </p>
  );
}