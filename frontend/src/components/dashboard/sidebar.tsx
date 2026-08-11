'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart3, LayoutDashboard, PlusCircle, Settings, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'New Analysis', href: '/new-analysis', icon: PlusCircle },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col sm:flex border-r border-border/60 bg-background">
      {/* Logo */}
      <div className="flex h-16 items-center px-6 border-b border-border/60">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-primary shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
            <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
          </div>
          <div>
            <span className="font-bold text-sm tracking-widest text-foreground">AMIVRE</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
          Intelligence
        </p>
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.name}
              href={link.href}
              className={cn(
                'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
              )}
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="px-3 pb-6 border-t border-border/60 pt-4 space-y-1">
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
          Account
        </p>
        <Link
          href="/settings"
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
            pathname === '/settings'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          Settings
        </Link>
        {/* Usage indicator */}
        <div className="mt-4 mx-1 p-3 rounded-xl bg-muted/60 border border-border/60">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-foreground">Usage</span>
          </div>
          <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
            <div className="h-full w-[15%] bg-primary rounded-full" />
          </div>
          <p className="text-[11px] text-muted-foreground mt-1.5">0 / 10 daily analyses</p>
        </div>
      </div>
    </aside>
  );
}
