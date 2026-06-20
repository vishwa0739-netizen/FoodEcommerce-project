// components/account/AddressCard.tsx
"use client";

import { Home, Building, Pencil, Star } from "lucide-react";
import { AuthButton as Button } from "@/components/ui/button";
import type { Address } from "@/lib/types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onSetDefault: (id: string) => void;
}

export function AddressCard({ address, onEdit, onSetDefault }: AddressCardProps) {
  const Icon = address.label.toLowerCase().includes("office") ? Building : Home;

  return (
    <div
      className={`flex gap-3 p-16 rounded-lg border mb-2.5 ${
        address.is_default
          ? "bg-gold/[0.04] border-gold-light"
          : "bg-white border-[var(--border-subtle)]"
      }`}
    >
      <Icon
        size={20}
        className={`mt-0.5 shrink-0 ${address.is_default ? "text-gold" : "text-ink-muted"}`}
      />
      <div className="flex-1">
        {address.is_default && (
          <span className="inline-block bg-gold/[0.12] text-gold font-mono text-[9px] font-medium px-1.5 py-0.5 rounded mb-1">
            DEFAULT
          </span>
        )}
        <p className="text-[13px] text-ink-secondary leading-relaxed">
          {address.line1}
          {address.line2 && <>, {address.line2}</>}
          <br />
          {address.city} — {address.postal_code}
          <br />
          {address.state}
        </p>
        <div className="flex gap-2 mt-2">
          <Button
            variant="ghost"
            size="sm"
            fullWidth={false}
            className="h-7 px-3 text-[11px]"
            onClick={() => onEdit(address)}
          >
            <Pencil size={12} /> Edit
          </Button>
          {!address.is_default && (
            <Button
              variant="ghost"
              size="sm"
              fullWidth={false}
              className="h-7 px-3 text-[11px]"
              onClick={() => onSetDefault(address.id)}
            >
              <Star size={12} /> Set default
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}