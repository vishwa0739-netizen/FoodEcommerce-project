// app/account/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { EditableRow } from "@/components/account/EditableRow";
import { AuthButton as Button } from "@/components/ui/button";
import type { Profile } from "@/lib/types";
import { Pencil, ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();

      setProfile({
        id: user.id,
        first_name: data?.first_name ?? "",
        last_name: data?.last_name ?? "",
        phone: data?.phone ?? null,
        email: user.email ?? "",
        avatar_url: data?.avatar_url ?? null,
        birthday: data?.birthday ?? null,
        created_at: user.created_at,
      });
      setIsLoading(false);
    }
    load();
  }, [supabase]);

  async function updateField(field: keyof Profile, value: string) {
    if (!profile) return;

    if (field === "email") {
      // Email changes go through Supabase Auth, not the profiles table.
      await supabase.auth.updateUser({ email: value });
    } else {
      await supabase.from("profiles").update({ [field]: value }).eq("id", profile.id);
    }

    setProfile({ ...profile, [field]: value });
  }

  if (isLoading || !profile) {
    return (
      <div className="px-16 lg:px-0 pt-24">
        <div className="h-24 w-40 bg-wine/[0.06] rounded mb-4 animate-pulse" />
        <div className="h-32 bg-wine/[0.04] rounded-lg animate-pulse" />
      </div>
    );
  }

  const fullName = `${profile.first_name} ${profile.last_name}`.trim();
  const memberSince = new Date(profile.created_at).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="px-16 desktop:px-0 pb-24">
      <div className="flex items-center justify-between pt-20 desktop:pt-0 pb-16">
        <h1 className="font-display text-xl italic text-ink-primary">Profile & details</h1>
        <Button variant="secondary" size="sm" fullWidth={false}>
          <Pencil size={14} /> Edit
        </Button>
      </div>

      <div className="flex items-center gap-16 bg-white border border-[var(--border-subtle)] rounded-lg p-16 mb-16">
        <div className="w-16 h-16 rounded-full bg-wine flex items-center justify-center font-display text-[26px] font-semibold text-gold-light border-[3px] border-gold-pale shrink-0">
          {profile.first_name?.[0]?.toUpperCase() ?? "?"}
        </div>
        <div>
          <div className="text-[15px] font-semibold text-ink-primary">{fullName}</div>
          <div className="text-xs text-ink-muted mt-0.5">Member since {memberSince}</div>
          <button className="text-xs font-semibold text-wine mt-2">Change photo</button>
        </div>
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-lg mb-16 overflow-hidden">
        <div className="px-16 py-3 border-b border-[var(--border-subtle)] text-[11px] font-semibold text-ink-muted uppercase tracking-[0.6px]">
          Personal information
        </div>
        <EditableRow
          label="Full name"
          value={fullName}
          onSave={async (val) => {
            const [first, ...rest] = val.split(" ");
            await updateField("first_name", first);
            await updateField("last_name", rest.join(" "));
          }}
        />
        <EditableRow
          label="Email"
          value={profile.email}
          type="email"
          onSave={(val) => updateField("email", val)}
        />
        <EditableRow
          label="Phone"
          value={profile.phone ?? ""}
          type="tel"
          onSave={(val) => updateField("phone", val)}
        />
        <EditableRow
          label="Birthday"
          value={profile.birthday ?? ""}
          type="date"
          onSave={(val) => updateField("birthday", val)}
        />
      </div>

      <div className="bg-white border border-[var(--border-subtle)] rounded-lg overflow-hidden">
        <div className="px-16 py-3 border-b border-[var(--border-subtle)] text-[11px] font-semibold text-ink-muted uppercase tracking-[0.6px]">
          Security
        </div>
        <div className="flex items-center py-[13px] px-16 border-b border-[var(--border-subtle)]">
          <span className="text-xs text-ink-muted w-[90px] shrink-0">Password</span>
          <span className="text-[13px] font-medium text-ink-primary flex-1">••••••••••</span>
          <button className="text-xs font-semibold text-wine">Change</button>
        </div>
        <div className="flex items-center py-[13px] px-16">
          <span className="text-xs text-ink-muted w-[90px] shrink-0">2FA</span>
          <span className="text-[13px] font-semibold text-emerald-600 flex-1 flex items-center gap-1">
            <ShieldCheck size={14} /> Enabled
          </span>
          <button className="text-xs font-semibold text-wine">Manage</button>
        </div>
      </div>
    </div>
  );
}