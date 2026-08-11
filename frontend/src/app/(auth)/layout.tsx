import { BarChart3 } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left side - Dynamic branding & gradient */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between bg-zinc-950 p-12 relative overflow-hidden text-white">
        {/* Abstract Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute top-[40%] right-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[100px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <div className="bg-primary/20 p-2 rounded-xl backdrop-blur-md border border-primary/30">
              <BarChart3 className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold tracking-tight">AMIVRE</span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 max-w-lg">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-tight">
            The next generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Market Intelligence.</span>
          </h1>
          <p className="text-zinc-400 text-lg leading-relaxed">
            Deploy autonomous AI agents to research markets, track competitors, and stress-test your startup ideas in seconds, not weeks.
          </p>
        </div>

        <div className="relative z-10 text-sm text-zinc-500">
          © {new Date().getFullYear()} AMIVRE Inc. All rights reserved.
        </div>
      </div>

      {/* Right side - Auth forms */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background relative">
        <div className="w-full max-w-md space-y-8 relative z-10">
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AMIVRE</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
