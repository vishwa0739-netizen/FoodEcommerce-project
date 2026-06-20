// components/account/AddressFormModal.tsx
"use client";

import { useState, useEffect } from "react";
import { AuthButton as Button } from "@/components/ui/button";
import { Input } from "@/components/ui/Input";
import { X } from "lucide-react";
import type { Address } from "@/lib/types";

interface AddressFormModalProps {
  isOpen: boolean;
  initial?: Address | null;
  onClose: () => void;
  onSave: (address: Omit<Address, "id" | "is_default">) => Promise<void>;
}

const emptyForm = { label: "", line1: "", line2: "", city: "", state: "", postal_code: "" };

export function AddressFormModal({ isOpen, initial, onClose, onSave }: AddressFormModalProps) {
  const [form, setForm] = useState(emptyForm);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initial) {
      setForm({
        label: initial.label,
        line1: initial.line1,
        line2: initial.line2 ?? "",
        city: initial.city,
        state: initial.state,
        postal_code: initial.postal_code,
      });
    } else {
      setForm(emptyForm);
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    await onSave(form);
    setIsSaving(false);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 px-0 sm:px-16">
      <div className="bg-cream w-full sm:max-w-[440px] rounded-t-xl sm:rounded-xl p-24 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-16">
          <h2 className="font-display text-lg italic text-ink-primary">
            {initial ? "Edit address" : "Add new address"}
          </h2>
          <button onClick={onClose} aria-label="Close" className="text-ink-muted">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Label"
            placeholder="Home, Office..."
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            required
          />
          <Input
            label="Address line 1"
            placeholder="House no., street"
            value={form.line1}
            onChange={(e) => setForm({ ...form, line1: e.target.value })}
            required
          />
          <Input
            label="Address line 2 (optional)"
            placeholder="Apartment, floor"
            value={form.line2}
            onChange={(e) => setForm({ ...form, line2: e.target.value })}
          />
          <div className="grid grid-cols-2 gap-12">
            <Input
              label="City"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              required
            />
            <Input
              label="State"
              value={form.state}
              onChange={(e) => setForm({ ...form, state: e.target.value })}
              required
            />
          </div>
          <Input
            label="Postal code"
            value={form.postal_code}
            onChange={(e) => setForm({ ...form, postal_code: e.target.value })}
            required
          />

          <Button type="submit" isLoading={isSaving}>
            {initial ? "Save changes" : "Add address"}
          </Button>
        </form>
      </div>
    </div>
  );
}