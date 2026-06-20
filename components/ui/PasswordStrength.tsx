// components/ui/PasswordStrength.tsx
"use client";

import { cn } from "@/lib/utils";

function getStrength(password: string): number {
  let score = 0;
  if (password.length >= 4) score = 1;
  if (password.length >= 8) score = 2;
  if (password.length >= 10 && /[A-Z]/.test(password)) score = 3;
  if (password.length >= 12 && /[!@#$%^&*]/.test(password)) score = 4;
  return score;
}

export function PasswordStrength({ password }: { password: string }) {
  const strength = getStrength(password);

  return (
    <div className="flex gap-1 mt-2 -mt-2 mb-16" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div
          key={i}
          className={cn(
            "flex-1 h-[3px] rounded-full bg-[var(--border-subtle)] transition-colors",
            i < strength && strength < 4 && "bg-gold",
            i < strength && strength === 4 && "bg-emerald-600"
          )}
        />
      ))}
    </div>
  );
}