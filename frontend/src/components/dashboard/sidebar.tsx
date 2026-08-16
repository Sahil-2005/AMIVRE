// 'use client';

// import Link from 'next/link';
// import { usePathname } from 'next/navigation';
// import { BarChart3, LayoutDashboard, PlusCircle, Settings, Zap } from 'lucide-react';
// import { cn } from '@/lib/utils';

// const links = [
//   { name: 'Dashboard', href: '/', icon: LayoutDashboard },
//   { name: 'New Analysis', href: '/new-analysis', icon: PlusCircle },
// ];

// export function Sidebar() {
//   const pathname = usePathname();

//   return (
//     <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col sm:flex border-r border-border/60 bg-background">
//       {/* Logo */}
//       <div className="flex h-16 items-center px-6 border-b border-border/60">
//         <Link href="/" className="flex items-center gap-3 group">
//           <div className="relative flex items-center justify-center h-8 w-8 rounded-lg bg-primary shadow-lg shadow-primary/30 group-hover:shadow-primary/50 transition-shadow">
//             <BarChart3 className="h-4 w-4 text-white" strokeWidth={2.5} />
//           </div>
//           <div>
//             <span className="font-bold text-sm tracking-widest text-foreground">AMIVRE</span>
//           </div>
//         </Link>
//       </div>

//       {/* Navigation */}
//       <nav className="flex-1 space-y-1 px-3 py-6">
//         <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
//           Intelligence
//         </p>
//         {links.map((link) => {
//           const Icon = link.icon;
//           const isActive = pathname === link.href;
//           return (
//             <Link
//               key={link.name}
//               href={link.href}
//               className={cn(
//                 'group relative flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150',
//                 isActive
//                   ? 'bg-primary/10 text-primary'
//                   : 'text-muted-foreground hover:bg-muted hover:text-foreground'
//               )}
//             >
//               {isActive && (
//                 <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-primary rounded-full" />
//               )}
//               <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
//               {link.name}
//             </Link>
//           );
//         })}
//       </nav>

//       {/* Bottom */}
//       <div className="px-3 pb-6 border-t border-border/60 pt-4 space-y-1">
//         <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest uppercase text-muted-foreground/60">
//           Account
//         </p>
//         <Link
//           href="/settings"
//           className={cn(
//             'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
//             pathname === '/settings'
//               ? 'bg-primary/10 text-primary'
//               : 'text-muted-foreground hover:bg-muted hover:text-foreground'
//           )}
//         >
//           <Settings className="h-4 w-4 shrink-0" />
//           Settings
//         </Link>
//         {/* Usage indicator */}
//         <div className="mt-4 mx-1 p-3 rounded-xl bg-muted/60 border border-border/60">
//           <div className="flex items-center gap-2 mb-2">
//             <Zap className="h-3.5 w-3.5 text-primary" />
//             <span className="text-xs font-semibold text-foreground">Usage</span>
//           </div>
//           <div className="h-1.5 w-full bg-border rounded-full overflow-hidden">
//             <div className="h-full w-[15%] bg-primary rounded-full" />
//           </div>
//           <p className="text-[11px] text-muted-foreground mt-1.5">0 / 10 daily analyses</p>
//         </div>
//       </div>
//     </aside>
//   );
// }


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
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-60 flex-col border-r border-white/10 bg-[#0a0f1e] sm:flex">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-white/10 px-6">
        <Link href="/" className="group flex items-center gap-3">
          <div>
            <span className="bg-gradient-to-r from-[#c4b5fd] to-[#e9d5ff] bg-clip-text text-sm font-bold tracking-widest text-transparent">
              AMIVRE
            </span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[white]/70">
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
                  ? 'bg-gradient-to-r from-[#8f6dff]/25 to-[#c084fc]/10 text-[#e9d5ff]'
                  : 'text-[#white]/70 hover:bg-white/5 hover:text-[#e9d5ff]'
              )}
            >
              {isActive && (
                <span className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-gradient-to-b from-[#c084fc] to-[#8f6dff]" />
              )}
              <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-[#c084fc]' : 'text-[#a78bfa]/70 group-hover:text-[#c084fc]')} />
              {link.name}
            </Link>
          );
        })}
      </nav>

      {/* Bottom */}
      <div className="space-y-1 border-t border-white/10 px-3 pb-6 pt-4">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-[#a78bfa]/70">
          Account
        </p>
        <Link
          href="/settings"
          className={cn(
            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all',
            pathname === '/settings'
              ? 'bg-gradient-to-r from-[#8f6dff]/25 to-[#c084fc]/10 text-[#e9d5ff]'
              : 'text-[#c4b5fd]/70 hover:bg-white/5 hover:text-[#e9d5ff]'
          )}
        >
          <Settings className={cn('h-4 w-4 shrink-0', pathname === '/settings' ? 'text-[#c084fc]' : 'text-[#a78bfa]/70 group-hover:text-[#c084fc]')} />
          Settings
        </Link>

        {/* Usage indicator */}
        <div className="relative mx-1 mt-4 overflow-hidden rounded-xl border border-[#a855f7]/25 bg-gradient-to-br from-[#8f6dff]/20 via-[#150f3e] to-[#0a0f1e] p-3">
          <div className="mb-2 flex items-center gap-2">
            <Zap className="h-3.5 w-3.5 text-[#c084fc]" />
            <span className="text-xs font-semibold text-[#e9d5ff]">Usage</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[15%] rounded-full bg-gradient-to-r from-[#8f6dff] to-[#c084fc]" />
          </div>
          <p className="mt-1.5 text-[11px] text-[#c4b5fd]/70">0 / 10 daily analyses</p>
        </div>
      </div>
    </aside>
  );
}