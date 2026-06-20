// app/(auth)/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import {AuthButton as Button} from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { PasswordStrength } from "@/components/ui/PasswordStrength";
import { BrandMark } from "@/components/auth/BrandMark";

export default function SignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsLoading(true);

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name: firstName, last_name: lastName, phone },
      },
    });

    if (signUpError) {
      setIsLoading(false);
      setError(signUpError.message);
      return;
    }

    // Create the profile row alongside the auth user.
    // Adjust table/column names to match your existing schema.
    if (data.user) {
      await supabase.from("profiles").upsert({
        id: data.user.id,
        first_name: firstName,
        last_name: lastName,
        phone,
      });
    }

    setIsLoading(false);
    router.push("/login?registered=true");
  }

  return (
    <div className="bg-cream/95 border border-[var(--border-strong)] rounded-xl p-24 sm:p-32">
      <BrandMark />
      <h1 className="font-display text-[22px] italic font-normal text-ink-primary mb-1">
        Join the table
      </h1>
      <p className="text-[13px] text-ink-muted mb-24">
        Create your gourmet account
      </p>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-2 gap-12">
          <Input
            label="First name"
            placeholder="Priya"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            autoComplete="given-name"
          />
          <Input
            label="Last name"
            placeholder="Sharma"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            autoComplete="family-name"
          />
        </div>

        <Input
          label="Email address"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="email"
        />

        <div>
          <Input
            label="Password"
            type="password"
            placeholder="Min. 8 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="new-password"
            className="mb-0"
          />
          <PasswordStrength password={password} />
        </div>

        <Input
          label="Phone (optional)"
          type="tel"
          placeholder="+91 98765 43210"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />

        {error && (
          <p className="text-[13px] text-red-600 bg-red-50 rounded-md px-3 py-2 mb-16">
            {error}
          </p>
        )}

        <Button type="submit" isLoading={isLoading}>
          Create account
        </Button>
      </form>

      <p className="text-center text-[11px] text-ink-muted mt-12 leading-relaxed">
        By creating an account you agree to our{" "}
        <Link href="/terms" className="font-semibold text-wine hover:underline">
          Terms
        </Link>{" "}
        &{" "}
        <Link href="/privacy" className="font-semibold text-wine hover:underline">
          Privacy Policy
        </Link>
      </p>

      <p className="text-center text-[13px] text-ink-muted mt-20">
        Have an account?{" "}
        <Link href="/login" className="font-semibold text-wine hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  );
}