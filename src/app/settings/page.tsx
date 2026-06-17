"use client";

import { useState } from "react";
import { User2, Bell, Sparkles, Database, Check } from "lucide-react";
import { currentUser } from "@/data";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardHeader, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, Input, Select } from "@/components/ui/Field";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!enabled)}
      className={cn(
        "relative inline-flex h-6 w-11 items-center rounded-full transition-colors",
        enabled ? "bg-brand-600" : "bg-slate-300",
      )}
      role="switch"
      aria-checked={enabled}
    >
      <span
        className={cn(
          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform",
          enabled ? "translate-x-5" : "translate-x-0.5",
        )}
      />
    </button>
  );
}

export default function SettingsPage() {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [role, setRole] = useState(currentUser.role);
  const [saved, setSaved] = useState(false);

  const [notifications, setNotifications] = useState({
    weeklyDigest: true,
    attentionAlerts: true,
    parentReplies: false,
  });

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2200);
  };

  return (
    <>
      <PageHeader title="Settings" description="Manage your profile, notifications, and integrations." />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Profile */}
        <Card className="lg:col-span-2">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <User2 className="h-4 w-4 text-slate-400" />
                Profile
              </span>
            }
            subtitle="Update your account details."
          />
          <CardBody>
            <form onSubmit={save} className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar initials="JM" color={currentUser.avatarColor} size="lg" />
                <div>
                  <Button variant="secondary" size="sm" type="button">
                    Change avatar
                  </Button>
                  <p className="mt-1 text-xs text-slate-400">PNG or JPG, up to 2MB.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Full name" htmlFor="name">
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </Field>
                <Field label="Email" htmlFor="email">
                  <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </Field>
              </div>

              <Field label="Role" htmlFor="role">
                <Select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as typeof role)}
                  className="sm:max-w-xs"
                >
                  <option value="tutor">Tutor</option>
                  <option value="admin">Program Admin</option>
                </Select>
              </Field>

              <div className="flex items-center gap-3 pt-2">
                <Button type="submit">Save changes</Button>
                {saved && (
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-600">
                    <Check className="h-4 w-4" />
                    Saved
                  </span>
                )}
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Integrations */}
        <div className="space-y-4">
          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-brand-600" />
                  AI integration
                </span>
              }
            />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">OpenAI API</span>
                <Badge className="bg-amber-50 text-amber-700 ring-amber-600/20">Mock mode</Badge>
              </div>
              <p className="text-xs text-slate-500">
                AI features run on a built-in mock engine. Add an{" "}
                <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">OPENAI_API_KEY</code>{" "}
                to <code className="rounded bg-slate-100 px-1 py-0.5 text-[11px]">.env.local</code> to
                enable live generation.
              </p>
              <Button variant="secondary" size="sm" type="button" className="w-full">
                Connect OpenAI
              </Button>
            </CardBody>
          </Card>

          <Card>
            <CardHeader
              title={
                <span className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-slate-400" />
                  Database
                </span>
              }
            />
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600">Supabase</span>
                <Badge className="bg-slate-100 text-slate-500 ring-slate-500/20">Local mock</Badge>
              </div>
              <p className="text-xs text-slate-500">
                Data is served from a typed local mock layer. Schema is ready to migrate to Supabase.
              </p>
              <Button variant="secondary" size="sm" type="button" className="w-full">
                Connect Supabase
              </Button>
            </CardBody>
          </Card>
        </div>

        {/* Notifications */}
        <Card className="lg:col-span-3">
          <CardHeader
            title={
              <span className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-slate-400" />
                Notifications
              </span>
            }
          />
          <CardBody className="divide-y divide-slate-100">
            {[
              { key: "weeklyDigest" as const, label: "Weekly progress digest", desc: "A summary of student progress every Monday." },
              { key: "attentionAlerts" as const, label: "Attention queue alerts", desc: "Notify me when a student needs follow-up." },
              { key: "parentReplies" as const, label: "Parent report replies", desc: "Email me when a guardian responds to a report." },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium text-slate-800">{item.label}</p>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
                <Toggle
                  enabled={notifications[item.key]}
                  onChange={(v) => setNotifications((n) => ({ ...n, [item.key]: v }))}
                />
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </>
  );
}
