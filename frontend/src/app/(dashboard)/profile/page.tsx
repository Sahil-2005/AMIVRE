'use client';

import { useAuthStore } from '@/stores/auth-store';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Mail, Key, Shield } from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();

  const getInitials = (email: string) =>
    email ? email.substring(0, 2).toUpperCase() : 'U';

  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Account</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your personal information and account security.</p>
      </div>

      {/* Identity card */}
      <div className="rounded-2xl border border-border/60 bg-card p-6 flex items-center gap-5">
        <Avatar className="h-16 w-16 border-2 border-border shadow-lg">
          <AvatarFallback className="text-xl font-bold bg-primary text-primary-foreground">
            {getInitials(user?.email || '')}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold">{user?.email?.split('@')[0] || 'User'}</h2>
          <p className="text-sm text-muted-foreground truncate">{user?.email}</p>
          <div className="flex items-center gap-1.5 mt-2">
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Active
            </span>
          </div>
        </div>
        <button className="shrink-0 rounded-xl border border-border/60 bg-muted/40 px-4 py-2 text-xs font-medium hover:bg-muted hover:border-border transition-all">
          Change Photo
        </button>
      </div>

      {/* Account Details */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-400/10">
            <Mail className="h-4 w-4 text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold">Account Details</h2>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="p-5 space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Email Address</Label>
              <Input
                value={user?.email || ''}
                readOnly
                className="h-11 bg-muted/30 border-border/60 text-muted-foreground cursor-not-allowed"
              />
              <p className="text-xs text-muted-foreground">Your email address cannot be changed at this time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400/10">
            <Key className="h-4 w-4 text-amber-400" />
          </div>
          <h2 className="text-sm font-semibold">Security</h2>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden">
          <div className="p-5 space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="new-pass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">New Password</Label>
              <Input id="new-pass" type="password" placeholder="••••••••••••" className="h-11 bg-background border-border/60 focus:border-primary/60 focus-visible:ring-primary/20" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="confirm-pass" className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Confirm Password</Label>
              <Input id="confirm-pass" type="password" placeholder="••••••••••••" className="h-11 bg-background border-border/60 focus:border-primary/60 focus-visible:ring-primary/20" />
            </div>
          </div>
          <div className="flex justify-end px-5 pb-5">
            <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 hover:bg-primary/90 transition-all">
              <Shield className="h-3.5 w-3.5" />
              Update Password
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
