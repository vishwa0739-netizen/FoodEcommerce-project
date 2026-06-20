// app/(auth)/forgot-password/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { AuthButton as Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { BrandMark } from "@/components/auth/BrandMark";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(
      email,
      { redirectTo: `${window.location.origin}/reset-password` }
    );

    setIsLoading(false);

    if (resetError) {
      setError(resetError.message);
      return;
    }

    setSent(true);
  }

  return (
    <div className="bg-cream/95 border border-[var(--border-strong)] rounded-xl p-24 sm:p-32">
      <BrandMark />

      {!sent ? (
        <>
          <h1 className="font-display text-[22px] italic font-normal text-ink-primary mb-1">
            Forgot password?
          </h1>
          <p className="text-[13px] text-ink-muted mb-24">
            We&apos;ll send a reset link to your email
          </p>

          <form onSubmit={handleSubmit}>
            <Input
              label="Email address"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />

            {error && (
              <p className="text-[13px] text-red-600 bg-red-50 rounded-md px-3 py-2 mb-16">
                {error}
              </p>
            )}

            <Button type="submit" isLoading={isLoading}>
              Send reset link
            </Button>
          </form>
        </>
      ) : (
        <>
          <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 rounded-full px-3.5 py-1.5 text-[13px] font-medium mb-16">
            <Mail size={14} />
            Reset link sent to {email}
          </div>
          <h1 className="font-display text-[22px] italic font-normal text-ink-primary mb-1">
            Check your inbox
          </h1>
          <p className="text-[13px] text-ink-muted mb-24">
            Click the link we sent to reset your password. It expires in 60 minutes.
          </p>
          <Button variant="ghost" onClick={() => setSent(false)} type="button">
            Use a different email
          </Button>
        </>
      )}

      <p className="text-center text-[13px] text-ink-muted mt-20">
        <Link href="/login" className="font-semibold text-wine hover:underline">
          ← Back to sign in
        </Link>
      </p>
    </div>
  );
}