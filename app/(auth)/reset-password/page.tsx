// app/reset-password/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { AuthButton as Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { BrandMark } from "@/components/auth/BrandMark";

export default function ResetPasswordPage() {
  const router = useRouter();
  const supabase = createClient();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setIsLoading(false);

    if (updateError) {
      setError(updateError.message);
      return;
    }

    router.push("/login?reset=true");
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-16 py-32 bg-gradient-to-br from-cream via-[#f5ece0] to-[#ede0cc]">
      <div className="w-full max-w-[420px] bg-cream/95 border border-[var(--border-strong)] rounded-xl p-24 sm:p-32">
        <BrandMark />
        <h1 className="font-display text-[22px] italic font-normal text-ink-primary mb-1">
          New password
        </h1>
        <p className="text-[13px] text-ink-muted mb-24">Choose a strong password</p>

        <form onSubmit={handleSubmit}>
          <Input
            label="New password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />

          {error && (
            <p className="text-[13px] text-red-600 bg-red-50 rounded-md px-3 py-2 mb-16">
              {error}
            </p>
          )}

          <Button type="submit" isLoading={isLoading}>
            Reset & sign in
          </Button>
        </form>
      </div>
    </div>
  );
}