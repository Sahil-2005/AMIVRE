'use client';

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Bell, Shield, Trash2 } from 'lucide-react';

export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-8 max-w-2xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-semibold text-primary uppercase tracking-widest">Account</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-2 text-sm">Manage your application preferences and account settings.</p>
      </div>

      {/* Notifications */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-400/10">
            <Bell className="h-4 w-4 text-blue-400" />
          </div>
          <h2 className="text-sm font-semibold">Notifications</h2>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/60">
          <SettingRow
            label="Email Notifications"
            description="Receive an email when an analysis report is complete."
            defaultChecked
          />
          <SettingRow
            label="Weekly Digest"
            description="Get a weekly summary of your usage and completed reports."
            defaultChecked={false}
          />
          <SettingRow
            label="Agent Progress Updates"
            description="Real-time notifications as each AI agent completes its task."
            defaultChecked
          />
        </div>
      </section>

      {/* Privacy */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-400/10">
            <Shield className="h-4 w-4 text-emerald-400" />
          </div>
          <h2 className="text-sm font-semibold">Privacy & Security</h2>
        </div>
        <div className="rounded-2xl border border-border/60 bg-card overflow-hidden divide-y divide-border/60">
          <SettingRow
            label="Analytics Sharing"
            description="Allow AMIVRE to use your anonymized data to improve AI model accuracy."
            defaultChecked
          />
          <SettingRow
            label="Personalized Insights"
            description="Use your analysis history to surface smarter recommendations."
            defaultChecked
          />
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="flex items-center gap-2.5 mb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
            <Trash2 className="h-4 w-4 text-destructive" />
          </div>
          <h2 className="text-sm font-semibold text-destructive">Danger Zone</h2>
        </div>
        <div className="rounded-2xl border border-destructive/20 bg-card overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-5 justify-between">
            <div>
              <p className="text-sm font-semibold">Delete All Account Data</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permanently delete all your analyses and account information. This action is irreversible.</p>
            </div>
            <button className="shrink-0 inline-flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/5 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
              Delete Data
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

function SettingRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description: string;
  defaultChecked: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-6 p-5">
      <div className="flex-1">
        <Label className="text-sm font-medium cursor-pointer">{label}</Label>
        <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">{description}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}
